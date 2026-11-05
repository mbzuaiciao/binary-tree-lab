import random

import pytest

from tree_lab.trees import (
    Node, avl_insert, bst_insert, contains, from_sorted, height, inorder,
    rotate_left, rotate_right,
)


def validate(root, lo=float('-inf'), hi=float('inf'), avl=True):
    if root is None:
        return 0
    assert lo < root.key < hi
    left = validate(root.left, lo, root.key, avl)
    right = validate(root.right, root.key, hi, avl)
    assert root.height == 1 + max(left, right)
    if avl:
        assert abs(left - right) <= 1
    return root.height


@pytest.mark.parametrize('keys', [[30, 20, 10], [10, 20, 30], [30, 10, 20], [10, 30, 20]])
def test_four_cases(keys):
    root = None
    for key in keys:
        root = avl_insert(root, key)
        validate(root)
    assert root.key == 20
    assert inorder(root) == [10, 20, 30]


@pytest.mark.parametrize('keys', [list(range(150)), list(range(149, -1, -1)), random.Random(42).sample(range(150), 150), [4, 4, 2, 6, 2, 5]])
def test_every_insertion(keys):
    root, seen = None, set()
    for key in keys:
        root = avl_insert(root, key)
        seen.add(key)
        validate(root)
        assert inorder(root) == sorted(seen)
        assert contains(root, key)
    assert not contains(root, 999)


@pytest.mark.parametrize('rotate, root_key', [(rotate_right, 30), (rotate_left, 50)])
def test_middle_subtree_transfer(rotate, root_key):
    root = None
    keys = [50, 30, 70, 20, 40] if rotate is rotate_right else [30, 10, 50, 40, 60]
    for key in keys:
        root = bst_insert(root, key)
    root = rotate(root)
    assert root.key == root_key
    assert inorder(root) == sorted(keys)
    validate(root, avl=False)
    assert (root.right.left if rotate is rotate_right else root.left.right).key == 40


def test_empty_duplicates_and_ordinary_bst():
    assert inorder(None) == []
    assert height(None) == 0
    assert not contains(None, 1)
    root = None
    for key in [1, 2, 3, 4, 5, 6, 7, 7]:
        root = bst_insert(root, key)
    assert height(root) == 7
    assert inorder(root) == list(range(1, 8))
    validate(root, avl=False)


@pytest.mark.parametrize('size', [0, 1, 2, 4, 7, 100])
def test_rebuilding(size):
    values = list(range(size))
    root = from_sorted(values)
    validate(root)
    assert inorder(root) == values
    assert height(root) == size.bit_length()
