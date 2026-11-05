## Start with a set of choices

Imagine a folder containing two more folders. Open one, and you find another pair. You don’t need a flat list of every possible location: you follow relationships, one choice at a time. A tree is a way of recording those relationships. Unlike a folder system, the trees we’ll build store numbers, but the idea of following a path is the same.

Draw a circle around 40. Under it, put 20 and 60. Under 20, put 10 and 30; under 60, put 50 and 70. The circles are **nodes**. The lines connecting them are **edges**. This is already a tree, before we say anything about the numbers’ order.

```text
           40
         /    \
       20      60
      /  \    /  \
     10  30  50  70
```

## Give the relationships names

The top node, 40, is the **root**. It has no parent. Nodes 20 and 60 are its **children**; 40 is their **parent**. A node without children is a **leaf**, so 10, 30, 50, and 70 are leaves. A node and everything reachable below it form a **subtree**. The subtree rooted at 20 contains 20, 10, and 30, not just the immediate children.

In a rooted tree, every node except the root has exactly one parent, and there are no cycles. That means there is exactly one downward path from the root to any node. A **binary tree** adds a limit: each node has at most two children, called left and right. It does not require two children, and it does not require sorted numbers. Those are separate ideas.

## How far down? How much is below?

From 40 to 30, we cross two edges. We call that node’s **depth**: the root has depth 0, its children depth 1, and its grandchildren depth 2. Depth looks upward toward the root.

Height looks downward. Throughout this course, an empty tree has height 0 and a leaf has height 1. The subtree at 20 has height 2, and the whole tree has height 3. Some books count edges instead and give a leaf height 0. Both conventions work; mixing them does not.

For a node, height is one plus the larger child height. You can read that rule directly as Python:

```python
def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))
```

This version visits every node below its argument. Later, we’ll store heights so that checking them doesn’t require a fresh walk.

## Walk the tree in a deliberate order

A **traversal** is a recipe for visiting every node. In preorder, visit the node before its children: 40, 20, 10, 30, 60, 50, 70. That is useful when the parent must be processed first. In postorder, visit children before their parent: 10, 30, 20, 50, 70, 60, 40. That is useful for calculating a parent from completed children.

Inorder means left subtree, node, right subtree. For our example it produces 10, 20, 30, 40, 50, 60, 70. That sorted result is a clue about this particular tree, not a promise made by every binary tree.

```python
def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.key] + inorder(node.right)
```

The recursion describes the walk naturally. This list-concatenating version is convenient for small examples; a single output list, used later, avoids repeatedly copying partial results.

<details><summary>Check your understanding: is 20 a leaf? What is 30’s height?</summary><p>20 is not a leaf because it has children. Node 30 has height 1 and depth 2. Height and depth answer different questions.</p></details>
