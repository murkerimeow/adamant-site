import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

export const CLIENT_ACCESS_COOKIE = "adamant_client_access";
export const CLIENT_ACCESS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

type ClientSessionPayload = {
  exp: number;
  id: string;
  login: string;
};

function getSecret() {
  return process.env.CLIENT_ACCESS_SECRET ?? process.env.PAYLOAD_SECRET ?? "adamant-dev-secret-change-me";
}

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function normalizeClientLogin(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function generateClientPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(14);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export async function hashClientPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString("base64url")}`;
}

export async function verifyClientPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [method, salt, hash] = storedHash.split(":");

  if (method !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return safeEqual(derivedKey.toString("base64url"), hash);
}

export function createClientSessionValue(input: { id: number | string; login: string }) {
  const payload: ClientSessionPayload = {
    exp: Math.floor(Date.now() / 1000) + CLIENT_ACCESS_SESSION_MAX_AGE_SECONDS,
    id: String(input.id),
    login: input.login,
  };
  const encoded = toBase64Url(JSON.stringify(payload));

  return `${encoded}.${sign(encoded)}`;
}

export function readClientSessionValue(value?: string | null) {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");

  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as Partial<ClientSessionPayload>;

    if (!payload.id || !payload.login || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      exp: payload.exp,
      id: String(payload.id),
      login: payload.login,
    };
  } catch {
    return null;
  }
}
