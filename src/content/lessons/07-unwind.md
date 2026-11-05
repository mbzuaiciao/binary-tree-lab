## The return journey is where balance happens

Searching downward finds the empty link where a new value belongs. But its consequences travel upward. A leaf appears, its parent may grow taller, that parent’s parent may grow taller, and so on. Recursive insertion already has a return path through exactly these ancestors. We can repair the tree on that journey.

Keep our height convention: empty = 0, leaf = 1. Define a node’s **balance factor** as left height minus right height. Positive means left-heavy; negative means right-heavy. Factors −1, 0, and +1 are legal in an AVL tree. A factor +2 or −2 after insertion requires repair.

For 10, 20, 30, start with 10. Its height is 1, balance 0. Adding 20 makes 10’s height 2 and balance −1, still legal. Adding 30 first makes 20’s height 2 and balance −1; then makes 10’s height 3 and balance −2. The right child is right-heavy, so this is RR. Rotate left at 10, producing root 20, height 2, balance 0.

## Store what a parent needs

Calculating height recursively during every balance check would repeatedly walk subtrees. Instead, each node stores its current height. A parent reads its two child heights in constant time. Whenever links change, update the affected nodes from bottom to top.

```python
def height(node):
    return node.height if node else 0

def update(node):
    node.height = 1 + max(height(node.left), height(node.right))

def balance(node):
    return height(node.left) - height(node.right)
```

After an insertion, first reconnect the returned child root, then update the current root, then decide whether to rotate. If the current root is left-heavy and its left child is right-heavy, perform the LR preparation. Otherwise the left-heavy case needs only a right rotation. Mirror the logic for a right-heavy root.

```python
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

A correct child subtree is returned to its caller at every step. This is why `root = avl_insert(root, key)` matters even when the tree is already nonempty: a rotation can replace the whole tree’s root.

## Why the local rule gives a global bound

Could a tree satisfy the local rule and still become a long chain? No. Let N(h) be the fewest nodes an AVL tree of height h can contain. To reach height h with as few nodes as possible, one child has height h − 1 and the other at least h − 2. Therefore N(h) = 1 + N(h − 1) + N(h − 2), with N(0) = 0 and N(1) = 1.

This Fibonacci-like growth is exponential in height. Reversing the relationship makes height O(log n). Lookup and insertion therefore have O(log n) worst-case time. Insertion follows one path and does constant work at each ancestor, including at most one single or double rotation repair. AVL deletion also supports O(log n), but can require repairs at multiple ancestors; its algorithm is outside this course.

## Watch the two policies diverge

Step through the comparison below. Both trees receive 10 through 70. At 30, the AVL tree performs its first left rotation. At 50 and 60, further repairs keep paths short. The ordinary BST keeps its original insertion shape. Each snapshot displays actual subtree heights and balance factors, including the ordinary tree’s illegal-for-AVL factors. The caption names rotations completed by that insertion; lessons 5–6 show their internal stages.

<details><summary>Check your understanding: when should a parent’s cached height be updated?</summary><p>After its child insertion returns and reconnects the child root. In a rotation, update the demoted root before the promoted root, because the latter now depends on the former.</p></details>
