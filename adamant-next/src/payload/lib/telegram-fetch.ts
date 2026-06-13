import {
  Agent,
  type Dispatcher,
} from "undici";

const DEFAULT_TELEGRAM_API_IPS = ["149.154.167.220"];
const TELEGRAM_HOSTNAME = "api.telegram.org";
const TELEGRAM_REQUEST_TIMEOUT_MS = 15_000;

const agents = new Map<string, Agent>();

function getTelegramApiIps() {
  const configuredIps = process.env.TELEGRAM_API_IPS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return configuredIps?.length ? configuredIps : DEFAULT_TELEGRAM_API_IPS;
}

function getAgent(ip: string) {
  const existingAgent = agents.get(ip);

  if (existingAgent) {
    return existingAgent;
  }

  const agent = new Agent({
    connect: {
      lookup(hostname, options, callback) {
        if (hostname !== TELEGRAM_HOSTNAME) {
          callback(new Error(`Unexpected Telegram API hostname: ${hostname}`), "", 4);
          return;
        }

        if (typeof options === "object" && options.all) {
          callback(null, [{ address: ip, family: 4 }]);
          return;
        }

        callback(null, ip, 4);
      },
    },
  });

  agents.set(ip, agent);
  return agent;
}

function createTimeoutSignal(parentSignal?: AbortSignal | null) {
  const timeoutController = new AbortController();
  const timeout = setTimeout(
    () => timeoutController.abort(new Error("Telegram API request timed out")),
    TELEGRAM_REQUEST_TIMEOUT_MS,
  );

  const abortFromParent = () => {
    timeoutController.abort(parentSignal?.reason);
  };

  if (parentSignal) {
    if (parentSignal.aborted) {
      abortFromParent();
    } else {
      parentSignal.addEventListener("abort", abortFromParent, { once: true });
    }
  }

  return {
    signal: timeoutController.signal,
    dispose() {
      clearTimeout(timeout);
      parentSignal?.removeEventListener("abort", abortFromParent);
    },
  };
}

async function fetchWithDispatcher(
  input: string | URL,
  init: globalThis.RequestInit,
  dispatcher?: Dispatcher,
) {
  const timeout = createTimeoutSignal(init.signal);

  try {
    return await globalThis.fetch(
      input,
      {
        ...init,
        dispatcher,
        signal: timeout.signal,
      } as globalThis.RequestInit & { dispatcher?: Dispatcher },
    );
  } finally {
    timeout.dispose();
  }
}

export async function telegramFetch(input: string | URL, init: globalThis.RequestInit = {}) {
  const errors: unknown[] = [];

  for (const ip of getTelegramApiIps()) {
    try {
      return await fetchWithDispatcher(input, init, getAgent(ip));
    } catch (error) {
      errors.push(error);
    }
  }

  try {
    return await fetchWithDispatcher(input, init);
  } catch (error) {
    errors.push(error);
  }

  throw new AggregateError(errors, "Telegram API is unavailable");
}
