import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // ✅ Detect mobile / touch devices
    const isMobile =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      setEnabled(false);
      document.body.classList.remove("cursor-hidden");
      document.body.style.cursor = "default";
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let scale = 1;

    document.body.style.cursor = "none";
    document.body.classList.add("cursor-hidden");

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update both cursors instantly at same time - no delay
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener("mousemove", move);

    // 🎯 Hover grow + magnetic pull
    const handleHoverEnter = (e) => {
      scale = 1.8;
      const rect = e.target.getBoundingClientRect();
      mouseX = rect.left + rect.width / 2;
      mouseY = rect.top + rect.height / 2;
      
      // Update both cursors immediately when hovering
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const handleHoverLeave = () => {
      scale = 1;
    };

    const hoverTargets = document.querySelectorAll("a, button");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverEnter);
      el.addEventListener("mouseleave", handleHoverLeave);
    });

    // 🖱 Click pulse
    const handleClick = () => {
      ring.animate(
        [
          { transform: ring.style.transform + " scale(2.2)" },
          { transform: ring.style.transform + " scale(1)" },
        ],
        { duration: 160, easing: "ease-out" }
      );
    };

    window.addEventListener("mousedown", handleClick);

    // 🎨 Section color detection
    const updateColor = () => {
      const path = window.location.pathname;
      let color = "rgba(120,200,255,0.9)";

      if (path.includes("projects")) color = "rgba(100,255,180,0.9)";
      if (path.includes("research")) color = "rgba(180,140,255,0.9)";
      if (path.includes("resume")) color = "rgba(255,200,120,0.9)";
      if (path.includes("about")) color = "rgba(255,140,180,0.9)";

      ring.style.borderColor = color;
      ring.style.boxShadow = `0 0 12px ${color}`;
      dot.style.background = color;
      dot.style.boxShadow = `0 0 8px ${color}`;
    };

    updateColor();
    window.addEventListener("popstate", updateColor);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("popstate", updateColor);
      document.body.classList.remove("cursor-hidden");
      document.body.style.cursor = "default";

      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverEnter);
        el.removeEventListener("mouseleave", handleHoverLeave);
      });
    };
  }, []);

  // ✅ Do not render cursor on mobile
  if (!enabled) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "2px solid rgba(120,200,255,0.9)",
          boxShadow: "0 0 12px rgba(120,200,255,0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* Center Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#9ae6ff",
          boxShadow: "0 0 6px rgba(154,230,255,0.9)",
          pointerEvents: "none",
          zIndex: 10000,
        }}
      />
    </>
  );
}
