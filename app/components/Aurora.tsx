"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Aurora background (reactbits-inspired, ogl/WebGL). Flowing ribbons of color
 * in our garden-green palette. Falls back to a CSS gradient if WebGL is
 * unavailable, and pauses under prefers-reduced-motion.
 */
const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;

// cheap value noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float t = uTime * 0.06;
  // stacked flowing bands
  float n = noise(vec2(uv.x*3.0, uv.y*2.0 + t));
  float band = sin((uv.x*3.1416) + n*2.5 + t*2.0)*0.5+0.5;
  float curtain = smoothstep(0.15, 0.95, uv.y + (n-0.5)*0.6);
  vec3 col = mix(uColor0, uColor1, band);
  col = mix(col, uColor2, noise(vec2(uv.x*2.0 - t, uv.y*3.0)));
  float alpha = (1.0 - curtain) * (0.55 + 0.35*band);
  gl_FragColor = vec4(col, alpha);
}
`;

function hex(c: string): [number, number, number] {
  const n = parseInt(c.replace("#", ""), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function Aurora({
  className = "",
  colors = ["#86efac", "#15803d", "#34d399"],
}: {
  className?: string;
  colors?: [string, string, string] | string[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer;
    try {
      // Cap DPR at 1.5 — the aurora is a soft blur, so full retina is wasted GPU.
      renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(1.5, devicePixelRatio) });
    } catch {
      return; // no WebGL → CSS fallback stays
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    el.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uColor0: { value: hex(colors[0]) },
        uColor1: { value: hex(colors[1]) },
        uColor2: { value: hex(colors[2]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      const { clientWidth: w, clientHeight: h } = el!;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w * renderer.dpr, h * renderer.dpr];
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let running = false;
    let visible = true;
    let onScreen = true;
    const start = performance.now();

    function loop(now: number) {
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (running || !visible || !onScreen) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // Pause when scrolled off-screen or the tab is hidden (saves GPU/battery).
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? play() : pause();
      },
      { threshold: 0 }
    );
    io.observe(el);
    const onVis = () => {
      visible = document.visibilityState === "visible";
      visible ? play() : pause();
    };
    document.addEventListener("visibilitychange", onVis);
    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.canvas.remove();
    };
  }, [colors]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      // CSS fallback (also shown under reduced-motion / no-WebGL)
      style={{
        background:
          "radial-gradient(60% 50% at 20% 0%, rgba(134,239,172,0.4), transparent 70%), radial-gradient(50% 50% at 90% 10%, rgba(52,211,153,0.3), transparent 65%)",
      }}
      aria-hidden
    />
  );
}
