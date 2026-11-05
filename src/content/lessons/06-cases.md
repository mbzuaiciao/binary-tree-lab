## Read the bend in the path

One rotation fixes an outside lean, but an inside bend needs an extra move. Start with the smallest useful example: insert 30, 10, 20. The root 30 leans left, yet its left child 10 leans right. Rotating right at 30 immediately would promote 10 while leaving 20 between 10 and 30. The result is still a three-level chain. We need to straighten the bend first.

An **AVL tree** is a BST where, at every node, the left and right subtree heights differ by at most one. After insertion, walk back toward the root. The first ancestor whose height difference reaches two tells us where to repair. The heavy side of that ancestor, followed by the heavy side of its child, names one of four cases.

## Outside leans: LL and RR

Insert 30, 20, 10. From the unbalanced 30, follow left to 20, then left to 10. This is **LL**. Rotate right at 30 and 20 becomes the local root, with 10 and 30 as children.

Insert 10, 20, 30 instead. Follow right, then right: **RR**. Rotate left at 10, promoting 20. The labels describe the path of excess growth; they do not name the rotation direction. LL needs a right rotation, and RR needs a left rotation.

The lab uses larger trees so the transfer isn’t invisible. In LL, subtree 40 moves from 30’s right link to 50’s left link. In RR, subtree 40 moves from 50’s left link to 30’s right link. The sorted order constrains both moves.

## Inside bends: LR and RL

Return to 30, 10, 20. This is **LR**: left from 30, then right from 10. First rotate left at the child 10. The subtree now has an LL shape: 30 above 20 above 10. Then rotate right at 30. The middle value 20 becomes the root, with 10 and 30 below it.

**RL** mirrors this process. Insert 10, 30, 20. Rotate right at the child 30 to turn the inside bend into RR, then rotate left at the old root 10. Again, 20 ends up between the other values, above them.

| Case | First move           | Final move        |
| ---- | -------------------- | ----------------- |
| LL   | None                 | Right at ancestor |
| RR   | None                 | Left at ancestor  |
| LR   | Left at left child   | Right at ancestor |
| RL   | Right at right child | Left at ancestor  |

## Return every new subtree root

The first move in a double rotation must be reattached to the ancestor before the second begins. The assignment below is part of the algorithm, not bookkeeping you can omit:

```python
# LR repair at root:
root.left = rotate_left(root.left)
return rotate_right(root)

# RL repair at root:
root.right = rotate_right(root.right)
return rotate_left(root)
```

In the lab’s larger LR example, the first rotation transfers subtree 30 under 20. In RL, the first transfers subtree 50 under 60. Step through that intermediate state before continuing. Heights can still be unbalanced between the two rotations: the pair is one repair, and the first move deliberately prepares the second.

How do we recognize these cases without remembering an insertion picture? Compare stored child heights. The next lesson turns “left-heavy” and “right-heavy” into one small number and connects the repair to recursive insertion.

<details><summary>Check your understanding: which rotations fix insertion order 50, 20, 40?</summary><p>LR: rotate left at 20 and reattach the result as 50’s left child, then rotate right at 50. The final root is 40. A single right rotation would leave a chain.</p></details>
