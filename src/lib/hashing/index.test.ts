import { expect, test } from "vitest";

import { createHash } from ".";

test("createHash collision", () => {
  const history = new Map<number, string[]>();

  let collisionCount = 0;

  for (let i = 1; i < 500_000; i++) {
    const input = String(Math.random()).slice(2, 10);
    const hash = createHash(input);

    // console.log(input, hash);

    const inputs = history.get(hash) ?? [];

    if (history.get(hash) === inputs) {
      collisionCount += 1;
    }

    if (inputs.includes(input)) {
      i -= 1;
      continue;
    } else {
      inputs.push(input);
    }

    history.set(hash, inputs);
  }

  expect(collisionCount / history.size).toBeLessThanOrEqual(0.01);
});
