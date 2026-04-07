import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { createApp } from "./bootstrap";
import { getApiHealth } from "./health";

export { getApiHealth };

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const port = Number(process.env["API_PORT"] ?? 3001);
  await app.listen(port);
  new Logger("Bootstrap").log(`API listening on http://localhost:${port}/v1`);
}

if (require.main === module) {
  bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to bootstrap API", err);
    process.exit(1);
  });
}
