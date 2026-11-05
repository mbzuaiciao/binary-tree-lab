## Bring the whole idea together

An AVL implementation can look like a collection of mysterious cases until you recognize its three jobs: insert using the BST promise, update the height on the way back, and repair a local imbalance. Each helper should do just one of those jobs. The reference module in this repository follows that structure.

Start with a node that stores a key, two optional child links, and a cached height. New nodes are leaves, so their initial height is 1. We use integer keys and ignore duplicates to keep the example focused. There is no parent pointer; recursion carries the route back upward.

```python
from dataclasses import dataclass

@dataclass
class Node:
    key: int
    left: "Node | None" = None
    right: "Node | None" = None
    height: int = 1
```

The functions `height`, `update`, and `balance` are exactly the helpers from lesson 7. The two rotations are exactly the pointer rewiring from lesson 5, including middle-subtree transfer and bottom-up height updates. With those pieces understood, the entire insertion reads as one continuous argument:

```python
def avl_insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = avl_insert(root.left, key)
    elif key > root.key:
        root.right = avl_insert(root.right, key)
    else:
        return root

    update(root)
    if balance(root) > 1:
        if balance(root.left) < 0:
            root.left = rotate_left(root.left)
        return rotate_right(root)
    if balance(root) < -1:
        if balance(root.right) > 0:
            root.right = rotate_right(root.right)
        return rotate_left(root)
    return root
```

Trace insertion of 30, 10, 20 by hand. The empty-link call creates 20. Returning to 10 updates its height to 2, with balance −1, so it returns unchanged. Returning to 30 finds balance +2 and a left child of balance −1: LR. The first rotation returns 20 to `root.left`; the second returns 20 as the new subtree root. At the caller, always capture that result.

```text
Insert 20 into [30, 10]:

    30          30           20
   /           /           /  \
  10    →     20    →     10   30
    \        /
     20     10
         left at 10    right at 30
```

## Run the actual reference

From the repository root, install the locked development environment and run the focused tests:

```bash
uv sync --locked
uv run pytest
```

The reference lives in `python/tree_lab/trees.py`. Open a Python session with `uv run python`, then try:

```python
from tree_lab.trees import avl_insert, inorder, height, contains

root = None
for key in [10, 20, 30, 40, 50, 60, 70]:
    root = avl_insert(root, key)

assert inorder(root) == [10, 20, 30, 40, 50, 60, 70]
assert height(root) == 3
assert contains(root, 50)
assert not contains(root, 55)
```

The ordinary `bst_insert` has the same insertion decisions and updates heights but omits rotations. `from_sorted` performs the interval-based rebuild from lesson 4. Comparing these functions makes the extra responsibility of an AVL tree explicit.

## Test promises, not one pretty picture

A root of 20 after inserting three values is encouraging but insufficient. A broken rotation might lose a middle subtree and still leave a plausible root. Good tests check that every expected key remains, every node respects ancestor bounds, cached heights match independently calculated heights, and every AVL balance factor lies between −1 and 1.

The tests exercise LL, RR, LR, RL, both middle-subtree transfers, empty trees, duplicates, sorted and reverse sequences, and deterministic shuffled inputs. They validate the tree after every insertion, because a later operation can accidentally hide an earlier failure. Frontend tests separately check generated demonstration frames so the teaching illustrations remain accountable to the same invariants.

> Try it: change the order of the seven insertions. The final shape can change, but sorted output and the AVL height rule must survive.

<details><summary>Check your understanding: why isn’t checking sorted inorder alone enough?</summary><p>A long ordinary BST chain also has sorted inorder. Inorder checks retained values and ordering; AVL correctness additionally requires valid cached heights and a balance factor within −1 to 1 at every node.</p></details>

## Where to go from here

You can now explain why shape matters, rebuild a tree from ordered values, preserve order through rotations, and connect local height repairs to logarithmic search paths. Keep those explanations beside the code. Deletion, red-black trees, richer exercises, and deployment are future extensions, rather than hidden prerequisites for understanding this implementation.
