import { getPayload } from "payload";

import config from "../payload.config.ts";

async function main() {
  const payload = await getPayload({
    config,
  });

  payload.logger.info("SQLite schema initialized.");
  await payload.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
