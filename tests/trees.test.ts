import { test } from "node:test";
import assert from "node:assert/strict";
import {
  inorder,
  height,
  balance,
  avlInsert,
  rebuildFrames,
  rotationFrames,
  comparisonFrames,
  type Node,
  type Case,
} from "../src/lib/trees";
function validate(
  n: Node | null,
  avl = false,
  lo = -Infinity,
  hi = Infinity,
): void {
  if (!n) return;
  assert.ok(n.key > lo && n.key < hi);
  if (avl) assert.ok(Math.abs(balance(n)) <= 1);
  validate(n.left, avl, lo, n.key);
  validate(n.right, avl, n.key, hi);
}
test("rebuild captures all inserts, inorder collection, and every midpoint attachment", () => {
  const frames = rebuildFrames();
  assert.equal(frames.length, 17);
  assert.equal(height(frames[7].root), 7);
  assert.deepEqual(frames[8].collected, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(height(frames.at(-1)!.root), 3);
  frames.forEach((f) => validate(f.root));
  assert.deepEqual(inorder(frames.at(-1)!.root), [1, 2, 3, 4, 5, 6, 7]);
});
for (const kind of ["LL", "RR", "LR", "RL"] as Case[])
  test(`${kind} preserves all values at each intermediate stage`, () => {
    const frames = rotationFrames(kind),
      keys = inorder(frames[0].root);
    for (const f of frames) {
      validate(f.root);
      assert.deepEqual(inorder(f.root), keys);
    }
    validate(frames.at(-1)!.root, true);
    assert.equal(frames.length, kind === "LR" || kind === "RL" ? 4 : 3);
  });
test("double rotations actually transfer the nonempty middle subtree", () => {
  const lr = rotationFrames("LR")[1].root!;
  assert.equal(lr.left!.left!.right!.key, 30);
  const rl = rotationFrames("RL")[1].root!;
  assert.equal(rl.right!.right!.left!.key, 50);
});
test("comparison snapshots are independent, valid and accurate", () => {
  const fs = comparisonFrames();
  assert.equal(fs.length, 8);
  fs.forEach((f, i) => {
    const values = Array.from({ length: i }, (_, j) => (j + 1) * 10);
    assert.deepEqual(inorder(f.root), values);
    assert.deepEqual(inorder(f.other ?? null), values);
    validate(f.root);
    validate(f.other ?? null, true);
  });
  assert.equal(height(fs[7].root), 7);
  assert.equal(height(fs[7].other!), 3);
  assert.match(fs[3].caption, /rotate left at 10/);
});
test("AVL ignores duplicates and balances descending and shuffled inputs", () => {
  for (const values of [
    [7, 6, 5, 4, 3, 2, 1],
    [4, 2, 6, 1, 3, 5, 7, 4],
  ]) {
    let root: Node | null = null;
    for (const k of values) {
      root = avlInsert(root, k);
      validate(root, true);
    }
    assert.deepEqual(inorder(root), [1, 2, 3, 4, 5, 6, 7]);
  }
});
