## Move the root, keep the order

Rebuilding a tree changes everything at once. A rotation changes only a few links. Imagine 50 with left child 30. Under 30 sit 20 and 40; 50 has right child 70. The left side is heavier. We can promote 30 and make 50 its right child. But 30 already has a right child: 40. Where does that subtree go?

This is the part that three-node cartoons often hide. Every value in 40’s subtree is larger than 30 and smaller than 50. After promotion, those values must still live between them. They become 50’s **left** subtree.

```text
        50                  30
       /  \                /  \
      30   70     →       20   50
     /  \                    /  \
    20   40                 40   70
```

This is a **right rotation at 50**. The direction names the movement of the old root, not the child being promoted. A left rotation is the mirror image.

## Read the invariant before the pointer code

Call the old root z, its left child y, and y’s right subtree B. Before the move, inorder reads: y’s left subtree, y, B, z, z’s right subtree. After the move, it reads exactly the same sequence. In symbols, A < y < B < z < C, where the inequalities describe every key in each subtree. B may contain many nodes, or none at all. The argument still holds.

```python
def rotate_right(z):
    y = z.left
    middle = y.right
    z.left = middle
    y.right = z
    update(z)
    update(y)
    return y
```

Save the middle link before overwriting it. Reattach it under the old root. Then make the old root a child of the promoted node. Update the lower node’s height first because the promoted node now depends on it. The returned node is the new root of this local subtree: its parent must use that returned reference.

```python
def rotate_left(z):
    y = z.right
    middle = y.left
    z.right = middle
    y.left = z
    update(z)
    update(y)
    return y
```

These functions require the child being promoted to exist. A caller decides whether a rotation is appropriate. A rotation preserves BST ordering, but an arbitrary rotation is not guaranteed to improve balance.

## Explore the transfer

In the lab, LL starts with a deeper version of our example. Select Step to identify the middle subtree before performing the move. Watch 40 change parents, while the inorder sequence stays fixed. Try RR to see the mirrored transfer. LR and RL need two moves; lesson 6 explains why.

Each rotation touches a constant number of links, regardless of how many nodes live inside the transferred subtree. With stored heights, a rotation takes O(1) time. We move a reference to B; we don’t walk through B or rebuild its contents.

<details><summary>Check your understanding: after a right rotation, why can’t B stay as y’s right child?</summary><p>That link is now occupied by z. B belongs between y and z in sorted order, so it fits as z’s left subtree. Leaving it elsewhere would lose nodes, overwrite a link, or break the BST invariant.</p></details>
