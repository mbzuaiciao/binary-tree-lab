## Make each decision useful

Suppose you’re looking for 30 in the tree from lesson 1. At 40, it feels sensible to go left. At 20, it feels sensible to go right. You arrive at 30 after inspecting three nodes. But what gives us permission to ignore the other branches?

We need a promise about the whole arrangement: every value in a node’s left subtree is smaller than the node’s value, and every value in its right subtree is larger. This is the **binary search tree invariant**. “Subtree” matters. Checking only immediate children can miss a misplaced grandchild.

For example, a root 40 with left child 20 and a right child 50 under that 20 is invalid. Each local edge might look plausible, but 50 is still inside 40’s left subtree. An invariant is a rule that must survive every operation, not a suggestion for drawing a diagram.

## Search by ruling things out

To look for 30, compare with 40. Because 30 is smaller, the entire right subtree is impossible. At 20, because 30 is larger, its left subtree is impossible. At 30, equality ends the search. To look for 25, follow the same route and then go left from 30. An empty link means the value isn’t present; there is nowhere else it could legally be.

```python
def contains(root, key):
    while root is not None:
        if key == root.key:
            return True
        root = root.left if key < root.key else root.right
    return False
```

This search uses constant extra space. The number of comparisons is bounded by the tree’s height. A tree of height h takes O(h) time to search, whether it is pleasantly broad or painfully thin.

```text
Find 30:  40 → left → 20 → right → 30 ✓
Find 25:  40 → left → 20 → right → 30 → left → empty
```

## Insert where the search would stop

To add 25, search for it. At the empty left link below 30, create a new node. This preserves the promise: 25 is greater than 20, smaller than 30, and smaller than 40. Every comparison along the path contributes a constraint on its position.

```python
def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    return root
```

Always use the returned root: `root = insert(root, key)`. At the start of an empty tree, insertion creates the root itself. Our trees behave like sets: inserting an existing key changes nothing. Other designs store counts, but choosing one policy and keeping it consistent makes the invariant precise.

## Sorted values don’t guarantee a good shape

Inorder visits all smaller values, then the current value, then all larger values. Applying that argument recursively explains why a valid BST produces sorted output. It also gives us a useful test: inorder should equal the sorted unique inserted keys.

But the invariant says nothing about shape. Insert 20, 10, 30 and you get a root with two children. Insert 10, 20, 30 and you get a chain leaning right. Both contain the same set, both have the same inorder traversal, and both are valid BSTs. One requires a longer worst-case search. Next, we’ll make that difference impossible to ignore.

<details><summary>Check your understanding: where does 25 go after inserting 40, 20, 30?</summary><p>It becomes 30’s left child. It belongs in 40’s left subtree, then 20’s right subtree, then below 30 on the left. A later 25 is ignored under our duplicate policy.</p></details>
