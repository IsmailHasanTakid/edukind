"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* Constellation: ছোট ছোট আলোর বিন্দু ভেসে বেড়ায়, কাছাকাছি এলে জোড়া লাগে, */
/* mouse কাছে আনলে তারাও জোড়া লাগে                                       */
/* ------------------------------------------------------------------ */
const COLORS = ["103,232,249", "139,92,246", "96,165,250"]; // cyan, violet, blue

function Constellation() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let w = 0;
        let h = 0;
        let raf = 0;
        let particles = [];
        const mouse = { x: -9999, y: -9999 };

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(80, Math.floor((w * h) / 20000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.3 + 0.5,
                c: COLORS[Math.floor(Math.random() * COLORS.length)],
                tw: Math.random() * Math.PI * 2, // twinkle phase
            }));
        }

        function frame(t) {
            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                if (!reduce) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -10) p.x = w + 10;
                    if (p.x > w + 10) p.x = -10;
                    if (p.y < -10) p.y = h + 10;
                    if (p.y > h + 10) p.y = -10;

                    // mouse এর কাছে এলে হালকা সরে যায়
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 120 * 120 && d2 > 1) {
                        const f = (1 - Math.sqrt(d2) / 120) * 0.6;
                        p.x += (dx / Math.sqrt(d2)) * f;
                        p.y += (dy / Math.sqrt(d2)) * f;
                    }
                }

                const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + p.tw);
                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.c},${0.75 * twinkle})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // কাছাকাছি বিন্দুগুলোর মধ্যে সরু রেখা
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d = dx * dx + dy * dy;
                    if (d < 130 * 130) {
                        const alpha = (1 - Math.sqrt(d) / 130) * 0.16;
                        ctx.strokeStyle = `rgba(${a.c},${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }

                // mouse এর সাথে সংযোগ
                const mx = a.x - mouse.x;
                const my = a.y - mouse.y;
                const md = mx * mx + my * my;
                if (md < 170 * 170) {
                    const alpha = (1 - Math.sqrt(md) / 170) * 0.35;
                    ctx.strokeStyle = `rgba(103,232,249,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            if (!reduce) raf = requestAnimationFrame(frame);
        }

        function onMove(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        function onLeave() {
            mouse.x = -9999;
            mouse.y = -9999;
        }
        function onVisibility() {
            cancelAnimationFrame(raf);
            if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
        }

        resize();
        raf = requestAnimationFrame(frame);

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return <canvas ref={ref} className="absolute inset-0" />;
}

/* ------------------------------------------------------------------ */
/* Site background: aurora blobs + constellation + soft vignette        */
/* ------------------------------------------------------------------ */
export default function SiteBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050714]"
        >
            <style>{`
                @keyframes sb-drift-a {
                    0%   { transform: translate3d(-8%, -6%, 0) scale(1); }
                    50%  { transform: translate3d(10%, 8%, 0) scale(1.18); }
                    100% { transform: translate3d(-8%, -6%, 0) scale(1); }
                }
                @keyframes sb-drift-b {
                    0%   { transform: translate3d(6%, 10%, 0) scale(1.1); }
                    50%  { transform: translate3d(-12%, -4%, 0) scale(0.92); }
                    100% { transform: translate3d(6%, 10%, 0) scale(1.1); }
                }
                @keyframes sb-drift-c {
                    0%   { transform: translate3d(0, 0, 0) scale(1); }
                    50%  { transform: translate3d(-10%, 12%, 0) scale(1.22); }
                    100% { transform: translate3d(0, 0, 0) scale(1); }
                }
                @keyframes sb-sweep {
                    0%   { transform: translateX(-30%) rotate(-12deg); opacity: 0; }
                    20%  { opacity: 0.5; }
                    60%  { opacity: 0.5; }
                    100% { transform: translateX(30%) rotate(-12deg); opacity: 0; }
                }
                .sb-a { animation: sb-drift-a 32s ease-in-out infinite; }
                .sb-b { animation: sb-drift-b 38s ease-in-out infinite; }
                .sb-c { animation: sb-drift-c 44s ease-in-out infinite; }
                .sb-sweep { animation: sb-sweep 18s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .sb-a, .sb-b, .sb-c, .sb-sweep { animation: none; }
                }
            `}</style>

            {/* aurora blobs */}
            <div className="sb-a absolute -left-[12%] -top-[18%] h-[62vmax] w-[62vmax] rounded-full bg-cyan-400/12 blur-[130px]" />
            <div className="sb-b absolute -right-[16%] top-[12%] h-[58vmax] w-[58vmax] rounded-full bg-violet-500/12 blur-[140px]" />
            <div className="sb-c absolute -bottom-[26%] left-[14%] h-[56vmax] w-[56vmax] rounded-full bg-blue-500/12 blur-[140px]" />

            {/* ধীরে ধীরে সরে যাওয়া আলোর রেখা */}
            <div
                className="sb-sweep absolute left-1/2 top-[-20%] h-[140%] w-[28vmax] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent blur-3xl"
            />

            {/* হালকা grid, মাঝখানে স্পষ্ট, কিনারায় মিলিয়ে যায় */}
            <div
                className="absolute inset-0 opacity-[0.5]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 75%)",
                    maskImage:
                        "radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 75%)",
                }}
            />

            {/* ভাসমান বিন্দু ও সংযোগ */}
            <Constellation />

            {/* কিনারা হালকা অন্ধকার করে মাঝখানে focus */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(3,4,12,0.65) 100%)",
                }}
            />
        </div>
    );
}