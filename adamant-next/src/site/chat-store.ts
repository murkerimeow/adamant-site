import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SiteChatMessage = {
  id: string;
  sessionId: string;
  from: "visitor" | "manager";
  text: string;
  createdAt: string;
  page?: string;
};

type ChatStore = {
  messages: SiteChatMessage[];
  telegramMessageMap: Record<string, string>;
  telegramUpdateOffset: number | null;
};

const storeDir = path.join(process.cwd(), ".data");
const storePath = path.join(storeDir, "site-chat.json");
const maxMessages = 1000;

let writeQueue = Promise.resolve();

function createEmptyStore(): ChatStore {
  return {
    messages: [],
    telegramMessageMap: {},
    telegramUpdateOffset: null,
  };
}

function normalizeStore(value: Partial<ChatStore> | null | undefined): ChatStore {
  return {
    messages: Array.isArray(value?.messages) ? value.messages : [],
    telegramMessageMap:
      value?.telegramMessageMap && typeof value.telegramMessageMap === "object"
        ? value.telegramMessageMap
        : {},
    telegramUpdateOffset:
      typeof value?.telegramUpdateOffset === "number" ? value.telegramUpdateOffset : null,
  };
}

async function readStore(): Promise<ChatStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<ChatStore>);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return createEmptyStore();
    }

    throw error;
  }
}

async function writeStore(store: ChatStore) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

async function updateStore<T>(updater: (store: ChatStore) => T | Promise<T>): Promise<T> {
  const next = writeQueue.then(async () => {
    const store = await readStore();
    const result = await updater(store);
    store.messages = store.messages.slice(-maxMessages);
    await writeStore(store);
    return result;
  });

  writeQueue = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

export function createChatMessage(input: Omit<SiteChatMessage, "id" | "createdAt">): SiteChatMessage {
  return {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export async function appendChatMessage(message: SiteChatMessage) {
  return updateStore((store) => {
    store.messages.push(message);
    return message;
  });
}

export async function getChatMessages(sessionId: string) {
  const store = await readStore();

  return store.messages
    .filter((message) => message.sessionId === sessionId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export async function rememberTelegramMessage(params: {
  chatId: string | number;
  messageId: string | number;
  sessionId: string;
}) {
  await updateStore((store) => {
    store.telegramMessageMap[`${params.chatId}:${params.messageId}`] = params.sessionId;
  });
}

export async function findSessionByTelegramReply(params: {
  chatId: string | number;
  replyToMessageId: string | number;
}) {
  const store = await readStore();
  return store.telegramMessageMap[`${params.chatId}:${params.replyToMessageId}`] ?? null;
}

export async function getTelegramUpdateOffset() {
  const store = await readStore();
  return store.telegramUpdateOffset;
}

export async function setTelegramUpdateOffset(offset: number) {
  await updateStore((store) => {
    store.telegramUpdateOffset = offset;
  });
}
