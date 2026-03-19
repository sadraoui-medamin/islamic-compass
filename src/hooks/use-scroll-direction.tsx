import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const onScroll = () => {
      const currentY = main.scrollTop;
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        // scrolling down → show
        setVisible(true);
      } else if (currentY < lastScrollY.current - 5) {
        // scrolling up → hide
        setVisible(false);
      }
      lastScrollY.current = currentY;
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
