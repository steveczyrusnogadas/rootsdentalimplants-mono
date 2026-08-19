import "dotenv/config";
import { closeQueues } from "./jobs/queues";
import { closeWorkers, startWorkers } from "./jobs/worker";

const workers = startWorkers();

console.log(`Started ${workers.length} Baseplate worker queues.`);

async function shutdown() {
  console.log("Stopping Baseplate workers...");
  await closeWorkers(workers);
  await closeQueues();
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
