export type MotionVars = Record<string, string | number>;

export type MotionPreset = {
  name: string;
  from: MotionVars;
  to: MotionVars;
  duration: number;
  ease: string;
};

const FULL_INSET = "inset(0% 0% 0% 0% round 0px)";
const FULL_ROUNDED = "inset(0% 0% 0% 0% round 14px)";
const FULL_RECT = "polygon(0% 0%,100% 0%,100% 100%,0% 100%)";
const EMPTY_RECT = "polygon(50% 50%,50% 50%,50% 50%,50% 50%)";

const preset = (
  name: string,
  from: MotionVars,
  to: MotionVars,
  duration = 0.9,
  ease = "power3.out",
): MotionPreset => ({ name, from, to, duration, ease });

/**
 * A varied but reusable collection of scroll-triggered motion primitives.
 * Presets animate existing content; they never replace real copy or UI.
 * Assign them to data-motion elements or use getMotionPreset(index).
 */
export const MOTION_PRESETS: MotionPreset[] = [
  preset("fade-rise", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0 }),
  preset("fade-drop", { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0 }),
  preset("slide-in-left", { autoAlpha: 0, x: -58 }, { autoAlpha: 1, x: 0 }),
  preset("slide-in-right", { autoAlpha: 0, x: 58 }, { autoAlpha: 1, x: 0 }),
  preset("slide-in-up", { autoAlpha: 0, y: 56 }, { autoAlpha: 1, y: 0 }),
  preset("slide-in-down", { autoAlpha: 0, y: -56 }, { autoAlpha: 1, y: 0 }),
  preset("scale-pop", { autoAlpha: 0, scale: 0.78 }, { autoAlpha: 1, scale: 1 }, 0.86, "back.out(1.5)"),
  preset("scale-settle", { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1 }),
  preset("blur-focus", { autoAlpha: 0, filter: "blur(14px)" }, { autoAlpha: 1, filter: "blur(0px)" }, 1.05),
  preset("blur-rise", { autoAlpha: 0, y: 25, filter: "blur(9px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)" }, 0.98),
  preset("rotate-in-left", { autoAlpha: 0, rotation: -8, y: 20 }, { autoAlpha: 1, rotation: 0, y: 0 }),
  preset("rotate-in-right", { autoAlpha: 0, rotation: 8, y: 20 }, { autoAlpha: 1, rotation: 0, y: 0 }),
  preset("flip-x", { autoAlpha: 0, rotationX: -62, y: 20 }, { autoAlpha: 1, rotationX: 0, y: 0 }, 1, "power3.out"),
  preset("flip-y", { autoAlpha: 0, rotationY: 62, x: 20 }, { autoAlpha: 1, rotationY: 0, x: 0 }, 1, "power3.out"),
  preset("tilt-in-left", { autoAlpha: 0, rotation: -5, x: -18, y: 18 }, { autoAlpha: 1, rotation: 0, x: 0, y: 0 }),
  preset("tilt-in-right", { autoAlpha: 0, rotation: 5, x: 18, y: 18 }, { autoAlpha: 1, rotation: 0, x: 0, y: 0 }),
  preset("iris-center", { clipPath: "circle(0% at 50% 50%)", scale: 0.96 }, { clipPath: "circle(155% at 50% 50%)", scale: 1 }, 1.08, "power3.inOut"),
  preset("iris-upper-left", { clipPath: "circle(0% at 0% 0%)" }, { clipPath: "circle(155% at 0% 0%)" }, 1.08, "power3.inOut"),
  preset("iris-right", { clipPath: "circle(0% at 100% 50%)" }, { clipPath: "circle(155% at 100% 50%)" }, 1.08, "power3.inOut"),
  preset("curtain-left", { clipPath: "inset(0% 100% 0% 0% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.02, "power3.inOut"),
  preset("curtain-right", { clipPath: "inset(0% 0% 0% 100% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.02, "power3.inOut"),
  preset("curtain-top", { clipPath: "inset(0% 0% 100% 0% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.02, "power3.inOut"),
  preset("curtain-bottom", { clipPath: "inset(100% 0% 0% 0% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.02, "power3.inOut"),
  preset("split-center", { clipPath: "inset(0% 50% 0% 50% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.08, "power3.inOut"),
  preset("split-horizontal", { clipPath: "inset(50% 0% 50% 0% round 14px)" }, { clipPath: FULL_ROUNDED }, 1.08, "power3.inOut"),
  preset("diamond-open", { clipPath: EMPTY_RECT }, { clipPath: FULL_RECT }, 1.12, "power3.inOut"),
  preset("diagonal-wipe", { clipPath: "polygon(0% 0%,0% 0%,0% 100%,0% 100%)" }, { clipPath: FULL_RECT }, 1.06, "power3.inOut"),
  preset("diagonal-wipe-reverse", { clipPath: "polygon(100% 0%,100% 0%,100% 100%,100% 100%)" }, { clipPath: FULL_RECT }, 1.06, "power3.inOut"),
  preset("corner-reveal", { clipPath: "circle(0% at 0% 100%)" }, { clipPath: "circle(155% at 0% 100%)" }, 1.1, "power3.inOut"),
  preset("perspective-rise", { autoAlpha: 0, y: 48, rotationX: 16, transformPerspective: 900 }, { autoAlpha: 1, y: 0, rotationX: 0 }, 1.0),
  preset("perspective-left", { autoAlpha: 0, x: -35, rotationY: -20, transformPerspective: 900 }, { autoAlpha: 1, x: 0, rotationY: 0 }),
  preset("perspective-right", { autoAlpha: 0, x: 35, rotationY: 20, transformPerspective: 900 }, { autoAlpha: 1, x: 0, rotationY: 0 }),
  preset("spring-rise", { autoAlpha: 0, y: 64, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1 }, 1.08, "back.out(1.7)"),
  preset("spring-left", { autoAlpha: 0, x: -66, scale: 0.94 }, { autoAlpha: 1, x: 0, scale: 1 }, 1.0, "back.out(1.55)"),
  preset("soft-bounce", { autoAlpha: 0, y: 42, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1 }, 1.0, "bounce.out"),
  preset("float-up", { autoAlpha: 0, y: 48, rotation: 2 }, { autoAlpha: 1, y: 0, rotation: 0 }, 1.05, "power2.out"),
  preset("float-left", { autoAlpha: 0, x: 42, y: 12, rotation: 1 }, { autoAlpha: 1, x: 0, y: 0, rotation: 0 }),
  preset("zoom-through", { autoAlpha: 0, scale: 0.66, filter: "blur(7px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)" }, 1.08, "power3.out"),
  preset("zoom-out-reveal", { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1 }, 1.08, "power3.out"),
  preset("tracking-in", { autoAlpha: 0, x: 12, letterSpacing: "0.18em" }, { autoAlpha: 1, x: 0, letterSpacing: "normal" }, 0.95),
  preset("glow-focus", { autoAlpha: 0, y: 18, filter: "blur(7px) drop-shadow(0 0 22px rgba(86,178,214,.5))" }, { autoAlpha: 1, y: 0, filter: "blur(0px) drop-shadow(0 0 0px rgba(86,178,214,0))" }, 1.0),
  preset("line-reveal", { clipPath: "inset(48% 0% 48% 0%)", autoAlpha: 0.4 }, { clipPath: FULL_INSET, autoAlpha: 1 }, 0.96, "power3.inOut"),
  preset("mask-diamond", { clipPath: "polygon(50% 50%,50% 50%,50% 50%,50% 50%)" }, { clipPath: FULL_RECT }, 1.1, "power3.inOut"),
  preset("sweep-diagonal", { clipPath: "polygon(0% 0%,0% 0%,0% 100%,0% 100%)", x: -8 }, { clipPath: FULL_RECT, x: 0 }, 1.05, "power3.inOut"),
  preset("vertical-blinds", { clipPath: "inset(0% 0% 0% 50%)" }, { clipPath: FULL_INSET }, 1.05, "power3.inOut"),
  preset("star-collapse-open", { clipPath: "polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)" }, { clipPath: "polygon(0% 0%,50% 0%,100% 0%,100% 100%,50% 100%,0% 100%,0% 50%,0% 0%)" }, 1.12, "power3.inOut"),
  preset("fold-horizontal", { autoAlpha: 0, rotationX: -72, transformOrigin: "50% 0%", transformPerspective: 900 }, { autoAlpha: 1, rotationX: 0 }, 1.0),
  preset("fold-vertical", { autoAlpha: 0, rotationY: 72, transformOrigin: "0% 50%", transformPerspective: 900 }, { autoAlpha: 1, rotationY: 0 }, 1.0),
  preset("arc-in", { autoAlpha: 0, x: -22, y: 22, rotation: -12 }, { autoAlpha: 1, x: 0, y: 0, rotation: 0 }, 0.98),
  preset("rise-settle", { autoAlpha: 0, y: 28, scaleY: 0.9, transformOrigin: "50% 100%" }, { autoAlpha: 1, y: 0, scaleY: 1 }, 0.98),
  preset("focus-zoom", { autoAlpha: 0, scale: 1.14, filter: "blur(10px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)" }, 1.08),
  preset("snap-left", { autoAlpha: 0, x: -72, rotation: -4, scale: 0.97 }, { autoAlpha: 1, x: 0, rotation: 0, scale: 1 }, 0.86, "power3.out"),
  preset("snap-right", { autoAlpha: 0, x: 72, rotation: 4, scale: 0.97 }, { autoAlpha: 1, x: 0, rotation: 0, scale: 1 }, 0.86, "power3.out"),
  preset("mask-wave", { clipPath: "polygon(0% 0%,0% 0%,0% 45%,0% 55%,0% 100%,0% 100%,0% 55%,0% 45%)" }, { clipPath: "polygon(0% 0%,100% 0%,100% 45%,100% 55%,100% 100%,0% 100%,0% 55%,0% 45%)" }, 1.14, "power3.inOut"),
  preset("stretch-horizontal", { autoAlpha: 0, scaleX: 0.12, transformOrigin: "0% 50%" }, { autoAlpha: 1, scaleX: 1 }, 1.0, "power3.out"),
  preset("stretch-vertical", { autoAlpha: 0, scaleY: 0.08, transformOrigin: "50% 0%" }, { autoAlpha: 1, scaleY: 1 }, 1.0, "power3.out"),
  preset("slide-tilt", { autoAlpha: 0, x: -44, rotationY: -12, scale: 0.94, transformPerspective: 900 }, { autoAlpha: 1, x: 0, rotationY: 0, scale: 1 }, 1.02, "power3.out"),
  preset("curved-entrance", { autoAlpha: 0, y: 36, x: 22, rotation: 6, scale: 0.94 }, { autoAlpha: 1, y: 0, x: 0, rotation: 0, scale: 1 }, 1.0, "back.out(1.25)"),
  preset("curtain-cross", { clipPath: "inset(0% 50% 0% 0%)", x: -12 }, { clipPath: FULL_INSET, x: 0 }, 1.08, "power3.inOut"),
];

export function getMotionPreset(index: number): MotionPreset {
  const safeIndex = ((index % MOTION_PRESETS.length) + MOTION_PRESETS.length) % MOTION_PRESETS.length;
  return MOTION_PRESETS[safeIndex];
}
