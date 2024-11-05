import { equal } from "node:assert";
import { describe, it } from "node:test";

describe('"Hello World!"', () => {
  it("should be equal to itself", () => {
    equal("Hello World!", "Hello World!");
  });
});
