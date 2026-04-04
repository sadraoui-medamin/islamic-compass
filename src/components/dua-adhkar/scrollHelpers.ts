const HIGHLIGHT_CLASSES = ["ring-2", "ring-primary/40"] as const;

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
  let current = element?.parentElement ?? null;

  while (current) {
    const styles = window.getComputedStyle(current);
    const isScrollable = ["auto", "scroll", "overlay"].includes(styles.overflowY);

    if (isScrollable && current.scrollHeight > current.clientHeight) {
      return current;
    }

    current = current.parentElement;
  }

  return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null;
};

export const revealItem = (element: HTMLDivElement | null) => {
  if (!element) return;

  const removeHighlight = () => element.classList.remove(...HIGHLIGHT_CLASSES);
  const scrollParent = getScrollParent(element);

  element.classList.add(...HIGHLIGHT_CLASSES);

  if (scrollParent && scrollParent !== document.body && scrollParent !== document.documentElement) {
    const parentRect = scrollParent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const top = elementRect.top - parentRect.top + scrollParent.scrollTop - scrollParent.clientHeight * 0.2;

    scrollParent.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  } else {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  window.setTimeout(removeHighlight, 1000);
};