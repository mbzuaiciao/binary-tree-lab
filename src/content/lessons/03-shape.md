## When every choice has the same answer

Insert 1, then 2, then 3. Each new number is larger than everything already in the tree, so every comparison says “go right.” Continue through 7 and you get seven levels, each containing one node. The tree still obeys the search invariant perfectly. It simply offers no useful branching.

Imagine searching for 7. You inspect 1, 2, 3, 4, 5, 6, and 7. An unsuccessful search for 8 walks the same entire chain before reaching an empty link. This is a **degenerate tree**: a tree shaped like a linked list.

```text
1
 \
  2
   \
    3
     \
      4  →  5  →  6  →  7
```

The last arrows abbreviate more right-child links. In the live lab below, every link is drawn explicitly. Step through the first seven insertions and watch the displayed heights rise. Reset restarts the experiment; Back lets you compare neighboring states without relying on an animation.

## The real cost is the path

We often hear that BST search is O(log n). The missing condition is that the tree must have suitably short paths. The unconditional bound is O(h), where h is height. With n nodes in a chain, h = n, so worst-case lookup and insertion are O(n).

There is a second cost hiding in repeated insertion. Building a sorted chain requires roughly 0 + 1 + 2 + … + (n − 1) comparisons. That sum grows quadratically, so building this ordinary BST takes O(n²) time. A single slow insertion and a whole slow construction are related but different claims.

Now picture the same seven values with 4 at the root, 2 and 6 below it, and 1, 3, 5, 7 at the bottom. The longest search sees three nodes instead of seven. A tree with h levels can hold at most 2^h − 1 nodes. Turning that around gives a lower bound on height: h must be at least ceil(log₂(n + 1)). Seven values can fit into three levels; no binary tree can fit seven into two.

## Balance is about preserving useful choices

Balanced doesn’t mean every node must have two children, or that both sides contain exactly the same number of values. The useful goal is to prevent long paths from developing. AVL trees enforce a local height rule that will imply a logarithmic height bound. We haven’t earned that rule yet; first we’ll try the most direct repair.

If we could gather every value in sorted order and start over, we could choose the middle value as the root. Half the remaining values would go left and half right. Repeating that choice would create short paths throughout the tree. The rest of this lab previews that rebuild; lesson 4 explains its implementation and its cost.

```python
# Comparing shape, not changing the search algorithm:
# chain of 7 nodes: height = 7
# midpoint-built tree of 7 nodes: height = 3
# lookup time is O(height) in both cases
```

<details><summary>Check your understanding: is the seven-node chain an invalid BST?</summary><p>No. Ordering and balance are separate properties. The chain is a valid BST with poor worst-case performance. A balanced shape adds a performance guarantee to the ordering promise.</p></details>
