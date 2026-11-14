import React, { useEffect, useRef } from 'react';

export const SmoothScrollAndCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Silky Inertial Momentum Scroll ("độ trôi nhẹ 1 xíu để có cảm giác mượt mà")
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isMoving = false;
    let scrollRafId = 0;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const tickScroll = () => {
      // Enhanced inertia interpolation factor (0.068) creates a velvety, longer gliding drift ("độ trượt thêm xíu")
      const diff = targetScrollY - currentScrollY;
      if (Math.abs(diff) < 0.4) {
        currentScrollY = targetScrollY;
        window.scrollTo({ top: currentScrollY, behavior: 'instant' as ScrollBehavior });
        isMoving = false;
        scrollRafId = 0;
        return;
      }

      currentScrollY += diff * 0.068;
      window.scrollTo({ top: currentScrollY, behavior: 'instant' as ScrollBehavior });
      scrollRafId = window.requestAnimationFrame(tickScroll);
    };

    const onWheel = (e: WheelEvent) => {
      // If modal/dialog is open (Lightbox, AssetDrawer) allow native scroll
      if (
        document.body.style.overflow === 'hidden' ||
        document.querySelector('[role="dialog"]')
      ) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
        return;
      }

      // Check if target is inside an input, textarea, or scrollable sub-element
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('textarea, input, select, [data-scrollable="true"]')) {
        return;
      }

      // Preserve native horizontal gestures (touchpad swipes)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Filter out tiny micro deltas to preserve native fluid trackpad momentum
      if (Math.abs(e.deltaY) < 3) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
        return;
      }

      e.preventDefault();

      const delta = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;
      const maxScroll = getMaxScroll();

      if (!isMoving) {
        currentScrollY = window.scrollY;
        targetScrollY = window.scrollY;
      }

      targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY + delta * 1.15));

      if (!isMoving) {
        isMoving = true;
        scrollRafId = window.requestAnimationFrame(tickScroll);
      }
    };

    const onExternalScroll = () => {
      if (!isMoving) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    const cancelInertia = () => {
      if (isMoving) {
        if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
        isMoving = false;
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onExternalScroll, { passive: true });
    window.addEventListener('keydown', cancelInertia, { passive: true });
    window.addEventListener('touchstart', cancelInertia, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onExternalScroll);
      window.removeEventListener('keydown', cancelInertia);
      window.removeEventListener('touchstart', cancelInertia);
      if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
    };
  }, []);

  // Custom Cursor Interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let visible = false;
    let hoveringInteractive = false;
    let pressing = false;
    let cursorRafId = 0;
    let lastTargetCheckTime = 0;

    const updateCursorVisuals = () => {
      const opacity = visible ? '1' : '0';
      ring.style.opacity = opacity;
      dot.style.opacity = opacity;

      const scale = pressing ? 0.75 : hoveringInteractive ? 1.5 : 1;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor = hoveringInteractive
        ? 'rgba(96, 165, 250, 0.9)'
        : 'rgba(255, 255, 255, 0.45)';
      ring.style.backgroundColor = hoveringInteractive
        ? 'rgba(37, 99, 235, 0.16)'
        : 'transparent';

      const dotScale = pressing ? 0.6 : hoveringInteractive ? 0.6 : 1;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
    };

    const tickCursor = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      dotX += (mouseX - dotX) * 0.78;
      dotY += (mouseY - dotY) * 0.78;
      updateCursorVisuals();

      if (
        Math.abs(mouseX - ringX) > 0.1 ||
        Math.abs(mouseY - ringY) > 0.1 ||
        Math.abs(mouseX - dotX) > 0.1 ||
        Math.abs(mouseY - dotY) > 0.1
      ) {
        cursorRafId = window.requestAnimationFrame(tickCursor);
      } else {
        cursorRafId = 0;
      }
    };

    const scheduleCursorTick = () => {
      if (!cursorRafId) {
        cursorRafId = window.requestAnimationFrame(tickCursor);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        ringX = e.clientX;
        ringY = e.clientY;
        dotX = e.clientX;
        dotY = e.clientY;
        visible = true;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Throttle DOM hit-testing to at most once every 60ms to prevent main-thread layout thrashing
      const now = performance.now();
      if (now - lastTargetCheckTime > 60) {
        lastTargetCheckTime = now;
        const target = e.target as HTMLElement | null;
        hoveringInteractive = Boolean(
          target && (
            target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.getAttribute('role') === 'tab' ||
            target.closest('button, a, [role="tab"], input, select')
          )
        );
      }

      scheduleCursorTick();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pressing = true;
      scheduleCursorTick();
    };

    const onPointerUp = () => {
      pressing = false;
      scheduleCursorTick();
    };

    const onMouseLeave = () => {
      visible = false;
      updateCursorVisuals();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (cursorRafId) window.cancelAnimationFrame(cursorRafId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 h-7 w-7 rounded-full border border-white/40 transition-[border-color,background-color,opacity] duration-150 ease-out will-change-transform pointer-events-none"
      />
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[#3B82F6] transition-opacity duration-150 will-change-transform pointer-events-none"
      />
    </div>
  );
};
