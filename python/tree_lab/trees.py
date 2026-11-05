"""Set-style integer trees. Height: empty = 0, leaf = 1."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Node:
    key: int
    left: Node | None = None
    right: Node | None = None
    height: int = 1


def height(node):
    return node.height if node else 0


def update(node):
    node.height = 1 + max(height(node.left), height(node.right))


def balance(node):
    return height(node.left) - height(node.right)


def contains(root, key):
    while root is not None:
        if key == root.key:
            return True
        root = root.left if key < root.key else root.right
    return False


def inorder(root):
    result, stack = [], []
    while root is not None or stack:
        while root is not None:
            stack.append(root)
            root = root.left
        root = stack.pop()
        result.append(root.key)
        root = root.right
    return result


def bst_insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = bst_insert(root.left, key)
    elif key > root.key:
        root.right = bst_insert(root.right, key)
    update(root)
    return root


def rotate_right(z):
    y = z.left
    middle = y.right
    z.left = middle
    y.right = z
    update(z)
    update(y)
    return y


def rotate_left(z):
    y = z.right
    middle = y.left
    z.right = middle
    y.left = z
    update(z)
    update(y)
    return y


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


def from_sorted(values):
    """Build in O(n); values must be strictly increasing."""
    def build(lo, hi):
        if lo >= hi:
            return None
        mid = (lo + hi) // 2
        root = Node(values[mid])
        root.left = build(lo, mid)
        root.right = build(mid + 1, hi)
        update(root)
        return root
    return build(0, len(values))
