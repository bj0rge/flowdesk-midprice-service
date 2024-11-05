import { spec } from "node:test/reporters";
import process from "node:process";
import { run } from "node:test";
import { error } from "node:console";
import { PassThrough } from "node:stream";
import { buffer } from "node:stream/consumers";
import { glob } from "glob";
import { parseArgs } from "node:util";

// This file resolves the file paths from given globs and runs the test
// runner on file paths
async function main() {
  const {
    values: { path, concurrency, timeout, watch },
  } = parseArgs({
    args: process.argv.slice(2),
    options: {
      path: { type: "string", default: "./src/**/*.test.ts" },
      watch: { type: "boolean", default: false },
      concurrency: { type: "boolean", default: true },
      timeout: { type: "string" },
    },
  });

  if (!path) {
    error("You must provide test paths");
    process.exit(1);
  }

  const files = path.includes("*") ? await glob(path) : [path];
  const nodeTestRunner = run({
    files,
    concurrency,
    timeout: Number.parseInt(timeout || "20000"),
    watch,
  });

  // TODO: optimisation, figure out how to avoid relying on the passthrough
  // to detect if tests failed
  const passthrough = new PassThrough();
  // Because of a bug, we have to do `new` – this should be fixed soon
  // eslint-disable-next-line new-cap
  nodeTestRunner.compose(new spec()).pipe(passthrough).pipe(process.stdout);

  const testOutput = await buffer(passthrough);

  if (testOutput.includes("✖ failing tests:")) {
    process.exit(1);
  }
}

main();
