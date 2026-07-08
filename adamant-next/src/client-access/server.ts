import "server-only";

import { cookies } from "next/headers";
import { getPayload } from "payload";

import config from "@payload-config";

import { CLIENT_ACCESS_COOKIE, readClientSessionValue } from "./session";

type ClientAccessDocument = {
  accessEnabled?: boolean | null;
  id: number | string;
  login?: string | null;
  name?: string | null;
};

let payloadPromise: ReturnType<typeof getPayload> | null = null;

async function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config });
  }

  return payloadPromise;
}

export async function getClientAccessFromCookies() {
  const cookieStore = await cookies();
  const session = readClientSessionValue(cookieStore.get(CLIENT_ACCESS_COOKIE)?.value);

  if (!session) {
    return null;
  }

  try {
    const payload = await getPayloadClient();
    const client = (await payload.findByID({
      collection: "client-access",
      depth: 0,
      id: session.id,
      overrideAccess: true,
    })) as ClientAccessDocument;

    if (!client?.accessEnabled || client.login !== session.login) {
      return null;
    }

    return {
      client,
      session,
    };
  } catch {
    return null;
  }
}
