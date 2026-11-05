## Take the values out; put them back thoughtfully

A crooked shelf can sometimes be fixed most easily by emptying it and starting again. A degenerate search tree offers the same possibility. We care about the stored values and their searchable order, not the identity of the old root.

Start with the chain 1 through 7. An inorder traversal gives the array [1, 2, 3, 4, 5, 6, 7]. Pick 4 as the new root. Values [1, 2, 3] must go left; [5, 6, 7] must go right. Inside the left half, pick 2; inside the right half, pick 6. The remaining single values become leaves.

Notice what we didn’t do: insert the array in sorted order into an ordinary BST. That would recreate the chain. We directly connect nodes using midpoint choices.

## Let each call own one interval

Use a half-open interval [lo, hi): include lo, exclude hi. An empty interval has lo >= hi. Its midpoint is `(lo + hi) // 2`. The left recursive call owns [lo, mid), and the right owns [mid + 1, hi). The midpoint belongs only to the current node, so no value is duplicated.

```python
def from_sorted(values):
    def build(lo, hi):
        if lo >= hi:
            return None
        mid = (lo + hi) // 2
        root = Node(values[mid])
        root.left = build(lo, mid)
        root.right = build(mid + 1, hi)
        root.height = 1 + max(height(root.left), height(root.right))
        return root
    return build(0, len(values))
```

This function expects strictly increasing values. An inorder traversal of our set-style BST provides exactly that. It isn’t a general unsorted-input constructor: sorting arbitrary input first would add O(n log n) time.

## Why the rebuild is linear

Each array position becomes exactly one node. Connecting that node and reading its children’s stored heights takes constant work. Across all n positions, construction is O(n). Passing interval boundaries rather than sliced arrays avoids allocating and copying a new list at every recursive call.

Collecting values can also be O(n), provided we append to one output list rather than repeatedly concatenate partial lists:

```python
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
```

The explicit stack also handles long chains without hitting Python’s recursion limit during collection. The output array needs O(n) space. This traversal’s stack can use O(h) space; rebuilding uses O(log n) call-stack space because the interval halves each time. The new nodes themselves require O(n) space.

## A great repair, an expensive habit

The lab below makes both phases visible: first the inorder collection, then each recursive midpoint attachment. At the end, seven levels become three without changing the sorted values.

Rebuilding is useful when a structure can be repaired occasionally or created from sorted data. Doing an O(n) rebuild after every insertion would be expensive. Could we repair only the small neighborhood that became unbalanced? A rotation is that smaller move.

<details><summary>Check your understanding: which root does this code choose for [1, 2, 3, 4]?</summary><p>It chooses 3, at index 2. Its left interval is [1, 2], its right interval is [4]. Choosing the other middle value would also yield a balanced BST if the interval rules were consistent.</p></details>
