# Binary Tree Lab

An intuition-first, eight-lesson course about binary search trees and AVL balancing. Astro generates static pages from Markdown; small TypeScript modules render SVG illustrations from real tree structures. There is no backend, account, remote font, analytics, or runtime API dependency.

## Run locally

Use Node.js 22.23.4+ (or a newer supported LTS), npm, Python 3.11+, and [uv](https://docs.astral.sh/uv/).

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro (normally http://127.0.0.1:4321). Read lessons in order from the course overview. Each lesson has previous/next navigation and a check-for-understanding with an expandable answer. The theme button switches light/dark appearance and remembers your choice locally.

```sh
npm run build    # Astro/TypeScript diagnostics, then static output in dist/
npm run preview  # preview the production build
npm test         # algorithm and demonstration-frame tests
uv sync --locked
uv run pytest    # Python reference tests
```

Dependencies require network access on initial installation. After installation, the site runs locally without external services. Astro telemetry is disabled in project scripts. `dist/` can also be served by any local static HTTP server; the site assumes the domain root, rather than a subdirectory.

## Explore the laboratories

- **Rebuild (lessons 3–4):** insert 1 through 7; collect inorder values; attach each recursive midpoint; compare seven levels with three.
- **Rotations (lessons 5–6):** select LL, RR, LR, or RL. Step through the preparation and middle-subtree transfer. Double rotations include their intermediate tree.
- **BST versus AVL (lesson 7 and homepage):** insert 10 through 70 in both trees. Each step completes one insertion; the caption names rotations and the SVG shows every node’s height and balance factor. For rotation internals, use the rotation lab.

All labs offer Step, Back, Play/Pause, and Reset. Playback advances every 1.6 seconds, stops at the end or when the page is hidden, and can be interrupted with any manual control. They can be used entirely with keyboard buttons and without animation. Captions announce the current operation; SVGs include descriptive tree summaries. Green marks the current operation and an amber outline identifies an unbalanced node. Mobile stacks the comparison panels vertically so trees stay legible.

## Architecture and conventions

- `src/content/lessons/`: eight narrative Markdown lessons; Astro highlights fenced code at build time.
- `src/pages/`, `src/layouts/`, `src/styles/`: static routes, reading layout, responsive light/dark design using system typography.
- `src/lib/trees.ts`: actual BST/AVL operations and immutable demonstration snapshots. The teaching renderer calculates heights from each snapshot for transparent verification.
- `src/lib/demo.ts`, `src/components/Demo.astro`: lightweight SVG renderer and playback controls; no client UI framework.
- `python/tree_lab/trees.py`: reference BST insertion, lookup, iterative inorder traversal, midpoint rebuild, rotations, and cached-height AVL insertion.
- `tests/`: independent invariant checks for the Python implementation and TypeScript demonstration structures.

Empty trees have height 0; leaves have height 1. Balance = left height − right height. Duplicate keys are ignored. Python `from_sorted` expects strictly increasing input. Capture returned roots when inserting or rotating. Python BST insertion is intentionally recursive and can reach Python’s recursion limit on very long degenerate chains; AVL insertion and midpoint rebuilding keep their recursion logarithmic. The iterative inorder traversal handles chains without recursive traversal depth.

## Verification

- `npm run build`: zero Astro/TypeScript errors; nine static pages generated.
- `npm test`: eight tests covering rebuild phases, all four rotation cases, nonempty subtree transfer, snapshot independence, comparison heights, duplicate policy, and AVL invariants.
- `uv run pytest`: 17 tests, including bounds-based BST validation, independently calculated heights, balance after every insertion, all four cases, subtree transfer, empty trees, duplicates, ascending/descending/shuffled sequences, and midpoint rebuilding.
- Browser checks cover desktop and narrow mobile layouts, theme switching, navigation, and lab controls. See the pull request for the observed verification details.

Deletion, red-black trees, richer quizzes, and deployment are deliberately left for later. No deployment workflow is included.
