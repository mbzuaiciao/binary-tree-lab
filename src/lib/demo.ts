import {
  balance,
  height,
  inorder,
  rebuildFrames,
  rotationFrames,
  comparisonFrames,
  type Node,
  type Frame,
  type Case,
} from "./trees";
function svg(root: Node | null, active: number[] = [], label: string): string {
  if (!root)
    return `<svg viewBox="0 0 440 180" role="img" aria-label="${label}: empty tree"><text x="220" y="90" text-anchor="middle" class="empty">An empty beginning.</text></svg>`;
  const keys = inorder(root),
    positions = new Map<number, { x: number; y: number }>();
  const depth = height(root),
    width = 440,
    row = 66,
    h = Math.max(180, depth * row + 32);
  function layout(n: Node | null, d: number) {
    if (!n) return;
    positions.set(n.key, {
      x: 36 + ((keys.indexOf(n.key) + 0.5) * (width - 72)) / keys.length,
      y: 34 + d * row,
    });
    layout(n.left, d + 1);
    layout(n.right, d + 1);
  }
  layout(root, 0);
  let edges = "",
    nodes = "";
  function draw(n: Node | null) {
    if (!n) return;
    const p = positions.get(n.key)!;
    for (const child of [n.left, n.right])
      if (child) {
        const q = positions.get(child.key)!;
        edges += `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" />`;
      }
    nodes += `<g class="${active.includes(n.key) ? "active" : ""} ${Math.abs(balance(n)) > 1 ? "unbalanced" : ""}"><circle cx="${p.x}" cy="${p.y}" r="19"/><text class="key" x="${p.x}" y="${p.y + 5}" text-anchor="middle">${n.key}</text><text class="metric" x="${p.x}" y="${p.y + 34}" text-anchor="middle">h${height(n)} b${balance(n)}</text></g>`;
    draw(n.left);
    draw(n.right);
  }
  draw(root);
  return `<svg viewBox="0 0 ${width} ${h}" role="img" aria-label="${label}. Inorder ${keys.join(", ")}. Height ${depth}. Root ${root.key}, balance ${balance(root)}."><title>${label}</title>${edges}${nodes}</svg>`;
}
export function initDemos() {
  document.querySelectorAll<HTMLElement>("[data-demo]").forEach((el) => {
    const kind = el.dataset.demo;
    let frames: Frame[] =
      kind === "rebuild"
        ? rebuildFrames()
        : kind === "rotations"
          ? rotationFrames("LL")
          : comparisonFrames();
    let index = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const button = (a: string) =>
      el.querySelector<HTMLButtonElement>(`[data-action="${a}"]`)!;
    function stop() {
      clearInterval(timer);
      timer = undefined;
      button("play").textContent = "Play";
    }
    function render() {
      const f = frames[index];
      el.querySelector(".step-count")!.textContent =
        `${index + 1} / ${frames.length}`;
      el.querySelector(".graphs")!.innerHTML =
        kind === "compare"
          ? `<div><h3>Ordinary BST <small>h = ${height(f.root)}</small></h3>${svg(f.root, f.active, "Ordinary BST")}</div><div><h3>AVL <small>h = ${height(f.other ?? null)}</small></h3>${svg(f.other ?? null, f.active, "AVL")}</div>`
          : svg(f.root, f.active, "Tree");
      el.querySelector(".caption")!.textContent = f.caption;
      el.querySelector(".collected")!.textContent = f.collected
        ? `Inorder [ ${f.collected.join(" · ")} ]`
        : "";
      button("back").disabled = index === 0;
      button("step").disabled = index === frames.length - 1;
      button("play").disabled = index === frames.length - 1;
      if (index === frames.length - 1) stop();
    }
    button("step").onclick = () => {
      stop();
      index = Math.min(index + 1, frames.length - 1);
      render();
    };
    button("back").onclick = () => {
      stop();
      index = Math.max(0, index - 1);
      render();
    };
    button("reset").onclick = () => {
      stop();
      index = 0;
      render();
    };
    button("play").onclick = () => {
      if (timer) {
        stop();
        return;
      }
      button("play").textContent = "Pause";
      timer = setInterval(() => {
        index = Math.min(index + 1, frames.length - 1);
        render();
      }, 1600);
    };
    el.querySelectorAll<HTMLButtonElement>("[data-case]").forEach(
      (b) =>
        (b.onclick = () => {
          stop();
          frames = rotationFrames(b.dataset.case as Case);
          index = 0;
          el.querySelectorAll("[data-case]").forEach((c) =>
            c.setAttribute("aria-pressed", String(c === b)),
          );
          render();
        }),
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
    });
    render();
  });
}
