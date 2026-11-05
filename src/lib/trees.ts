/** Heights count nodes: empty = 0, leaf = 1. Duplicates are ignored. */
export interface Node {
  key: number;
  left: Node | null;
  right: Node | null;
}
export const node = (
  key: number,
  left: Node | null = null,
  right: Node | null = null,
): Node => ({ key, left, right });
export const clone = (root: Node | null): Node | null =>
  root ? node(root.key, clone(root.left), clone(root.right)) : null;
export const height = (root: Node | null): number =>
  root ? 1 + Math.max(height(root.left), height(root.right)) : 0;
export const balance = (root: Node): number =>
  height(root.left) - height(root.right);
export const inorder = (root: Node | null): number[] =>
  root ? [...inorder(root.left), root.key, ...inorder(root.right)] : [];
export function insert(root: Node | null, key: number): Node {
  if (!root) return node(key);
  if (key < root.key) root.left = insert(root.left, key);
  if (key > root.key) root.right = insert(root.right, key);
  return root;
}
export function rotateRight(root: Node): Node {
  const pivot = root.left!;
  root.left = pivot.right;
  pivot.right = root;
  return pivot;
}
export function rotateLeft(root: Node): Node {
  const pivot = root.right!;
  root.right = pivot.left;
  pivot.left = root;
  return pivot;
}
export interface Frame {
  root: Node | null;
  other?: Node | null;
  caption: string;
  active?: number[];
  collected?: number[];
}
export function avlInsert(
  root: Node | null,
  key: number,
  onRotate?: (text: string, keys: number[]) => void,
): Node {
  if (!root) return node(key);
  if (key < root.key) root.left = avlInsert(root.left, key, onRotate);
  else if (key > root.key) root.right = avlInsert(root.right, key, onRotate);
  else return root;
  const b = balance(root);
  if (b > 1) {
    if (balance(root.left!) < 0) {
      onRotate?.(`LR: rotate left at ${root.left!.key}`, [root.left!.key]);
      root.left = rotateLeft(root.left!);
    }
    onRotate?.(`rotate right at ${root.key}`, [root.key]);
    return rotateRight(root);
  }
  if (b < -1) {
    if (balance(root.right!) > 0) {
      onRotate?.(`RL: rotate right at ${root.right!.key}`, [root.right!.key]);
      root.right = rotateRight(root.right!);
    }
    onRotate?.(`rotate left at ${root.key}`, [root.key]);
    return rotateLeft(root);
  }
  return root;
}
export function rebuildFrames(): Frame[] {
  let root: Node | null = null;
  const frames: Frame[] = [
    {
      root: null,
      caption:
        "Start with an empty tree. Insert the sorted values 1 through 7.",
    },
  ];
  for (let k = 1; k <= 7; k++) {
    root = insert(root, k);
    frames.push({
      root: clone(root),
      active: [k],
      caption: `Insert ${k}. Each larger value goes right. Height: ${height(root)}.`,
    });
  }
  const values = inorder(root);
  frames.push({
    root: clone(root),
    collected: values,
    caption:
      "Walk left → node → right. Inorder collects 1, 2, 3, 4, 5, 6, 7 in O(n) time.",
  });
  let rebuilt: Node | null = null;
  function build(
    lo: number,
    hi: number,
    parent: Node | null,
    side: "left" | "right" = "left",
  ) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2),
      current = node(values[mid]);
    if (!parent) rebuilt = current;
    else parent[side] = current;
    frames.push({
      root: clone(rebuilt),
      collected: values,
      active: [current.key],
      caption: `Choose midpoint ${current.key} from [${values.slice(lo, hi).join(", ")}]. ${parent ? `Attach as ${parent.key}’s ${side} child.` : "This is the new root."}`,
    });
    build(lo, mid, current, "left");
    build(mid + 1, hi, current, "right");
  }
  build(0, values.length, null);
  frames.push({
    root: clone(rebuilt),
    collected: values,
    caption:
      "Same seven values. Three levels instead of seven. Each value was visited once during reconstruction: O(n).",
  });
  return frames;
}
export type Case = "LL" | "RR" | "LR" | "RL";
export function rotationFrames(kind: Case): Frame[] {
  // Valid BSTs with a real middle subtree to transfer, not isolated triples.
  let root =
    kind === "LL"
      ? node(50, node(30, node(20, node(10)), node(40)), node(70))
      : kind === "RR"
        ? node(30, node(10), node(50, node(40), node(60, null, node(70))))
        : kind === "LR"
          ? node(50, node(20, node(10), node(40, node(30))), node(70))
          : node(30, node(10), node(60, node(40, null, node(50)), node(70)));
  const frames: Frame[] = [
    {
      root: clone(root),
      caption: `${kind}: the first unbalanced ancestor is ${root.key} (balance ${balance(root)}). Follow the heavy child, then its heavy child.`,
      active: [root.key],
    },
  ];
  if (kind === "LR") {
    root.left = rotateLeft(root.left!);
    frames.push({
      root: clone(root),
      caption:
        "First rotate left at 20. Promote 40 and reattach its middle subtree 30 as 20’s right child. The shape is now LL.",
      active: [20, 30, 40],
    });
  }
  if (kind === "RL") {
    root.right = rotateRight(root.right!);
    frames.push({
      root: clone(root),
      caption:
        "First rotate right at 60. Promote 40 and reattach its middle subtree 50 as 60’s left child. The shape is now RR.",
      active: [40, 50, 60],
    });
  }
  const right = kind === "LL" || kind === "LR";
  const old = root.key,
    pivot = right ? root.left! : root.right!,
    transfer = right ? pivot.right : pivot.left;
  frames.push({
    root: clone(root),
    caption: `Save the middle subtree${transfer ? ` rooted at ${transfer.key}` : " (empty here)"}. It belongs between ${Math.min(old, pivot.key)} and ${Math.max(old, pivot.key)}, so it must move to ${old}’s ${right ? "left" : "right"} link.`,
    active: transfer ? [transfer.key, old, pivot.key] : [old, pivot.key],
  });
  root = right ? rotateRight(root) : rotateLeft(root);
  frames.push({
    root: clone(root),
    caption: `Rotate ${right ? "right" : "left"} at ${old}: promote ${pivot.key}, move ${old} below it, and reconnect the saved subtree. Inorder is unchanged: ${inorder(root).join(" → ")}.`,
    active: [old, pivot.key, ...(transfer ? [transfer.key] : [])],
  });
  return frames;
}
export function comparisonFrames(): Frame[] {
  let bst: Node | null = null,
    avl: Node | null = null;
  const frames: Frame[] = [
    {
      root: null,
      other: null,
      caption:
        "Both trees start empty. Insert the same values in the same order.",
    },
  ];
  for (const key of [10, 20, 30, 40, 50, 60, 70]) {
    bst = insert(bst, key);
    const rotations: string[] = [];
    const active = [key];
    avl = avlInsert(avl, key, (text, keys) => {
      rotations.push(text);
      active.push(...keys);
    });
    frames.push({
      root: clone(bst),
      other: clone(avl),
      active,
      caption: `Insert ${key}. ${rotations.length ? rotations.join("; ") + "." : "No rotation needed."} BST height ${height(bst)}; AVL height ${height(avl)}.`,
    });
  }
  return frames;
}
