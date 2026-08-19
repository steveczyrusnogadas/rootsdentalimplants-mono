type DevProcess = {
  name: string;
  process: Bun.Subprocess;
};

let isShuttingDown = false;

function startProcess(name: string, command: string[]) {
  return {
    name,
    process: Bun.spawn(command, {
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    }),
  };
}

const processes: DevProcess[] = [
  startProcess("api", ["bun", "run", "--hot", "src/index.ts"]),
  startProcess("worker", ["bun", "run", "--hot", "src/worker.ts"]),
];

async function stopProcesses(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of processes) {
    child.process.kill();
  }

  await Promise.allSettled(processes.map((child) => child.process.exited));
  process.exit(exitCode);
}

for (const child of processes) {
  void child.process.exited.then((exitCode) => {
    if (!isShuttingDown) {
      console.error(`${child.name} dev process exited with code ${exitCode}.`);
      void stopProcesses(exitCode ?? 1);
    }
  });
}

process.on("SIGINT", () => {
  void stopProcesses(0);
});

process.on("SIGTERM", () => {
  void stopProcesses(0);
});
