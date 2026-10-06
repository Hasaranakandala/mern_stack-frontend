import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   SMALL REUSABLE UI
========================================================= */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {text && (
        <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

function BrandOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      <div className="absolute inset-[10%] rounded-full border border-red-200/60" />
      <div className="absolute inset-[18%] rounded-full border border-amber-200/70" />
      <div className="absolute inset-[26%] rounded-full border border-rose-200/70" />

      <div className="absolute left-[8%] top-[14%] h-20 w-20 rounded-full bg-amber-100/80 blur-xl" />
      <div className="absolute bottom-[10%] right-[2%] h-28 w-28 rounded-full bg-rose-200/70 blur-2xl" />

      <div className="absolute inset-[24%] grid place-items-center rounded-full bg-gradient-to-br from-white via-rose-50 to-amber-50 shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-red-500 to-rose-400 text-3xl font-black text-white shadow-xl shadow-red-200/60">
            ✦
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-red-500">
            Beauty Store
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Beauty & Care
          </p>
        </div>
      </div>

      <div className="absolute left-[5%] top-[45%] rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-lg backdrop-blur-xl">
        <p className="text-xl">♡</p>
        <p className="mt-1 text-xs font-bold text-slate-600">Care first</p>
      </div>

      <div className="absolute right-[4%] top-[23%] rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-lg backdrop-blur-xl">
        <p className="text-xl">✦</p>
        <p className="mt-1 text-xs font-bold text-slate-600">Modern beauty</p>
      </div>

      <div className="absolute bottom-[6%] left-[30%] rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-lg backdrop-blur-xl">
        <p className="text-xl">◌</p>
        <p className="mt-1 text-xs font-bold text-slate-600">Simple choices</p>
      </div>
    </div>
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = -((y / rect.height) - 0.5) * 7;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`transition-transform duration-200 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;

        started = true;
        const duration = 1100;
        const startedAt = performance.now();

        const animate = (time) => {
          const progress = Math.min((time - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setDisplay(Math.round(value * eased));

          if (progress < 1) {
            frame = requestAnimationFrame(animate);
          }
        };

        frame = requestAnimationFrame(animate);
        observer.unobserve(el);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* =========================================================
   DATA
========================================================= */

const values = [
  {
    id: "care",
    icon: "♡",
    title: "Care before complexity",
    text: "We make beauty discovery feel simple, calm and useful. Every interaction should help customers make a confident choice without unnecessary friction.",
    points: ["Clear product information", "Friendly shopping flow", "Comfortable visual hierarchy"],
  },
  {
    id: "quality",
    icon: "✦",
    title: "Quality in every detail",
    text: "From product presentation to responsive behavior, we believe small details create trust and make an online beauty experience feel premium.",
    points: ["Consistent presentation", "Responsive interfaces", "Thoughtful micro-interactions"],
  },
  {
    id: "inclusive",
    icon: "◌",
    title: "Beauty for real people",
    text: "Our experience is designed around different routines, preferences and devices so more people can explore products comfortably.",
    points: ["Mobile-friendly design", "Accessible motion choices", "Simple navigation"],
  },
];

const milestones = [
  {
    year: "01",
    title: "Discover",
    text: "We begin with the customer: what they need, how they shop and what creates confidence.",
  },
  {
    year: "02",
    title: "Curate",
    text: "Products and categories are organized to reduce overload and make comparison easier.",
  },
  {
    year: "03",
    title: "Experience",
    text: "Interactive visuals and refined UI turn browsing into a more engaging beauty journey.",
  },
  {
    year: "04",
    title: "Care",
    text: "The experience continues through clear communication, support and thoughtful after-purchase touchpoints.",
  },
];

const promises = [
  {
    icon: "01",
    title: "Simple discovery",
    text: "Find products through clear categories, focused content and familiar shopping patterns.",
  },
  {
    icon: "02",
    title: "Interactive product experience",
    text: "Visual interaction helps products feel more tangible while keeping the interface easy to use.",
  },
  {
    icon: "03",
    title: "Consistent design",
    text: "A calm rose, cream and red visual system creates recognition across the shopping journey.",
  },
];

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function About() {
  const [activeValue, setActiveValue] = useState("care");
  const [openMilestone, setOpenMilestone] = useState(0);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const selectedValue = useMemo(
    () => values.find((item) => item.id === activeValue) ?? values[0],
    [activeValue]
  );

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMouse({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffafa] text-slate-900">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-10 lg:pb-20">
        <div
          onMouseMove={handleHeroMove}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white bg-gradient-to-br from-white via-rose-50/70 to-amber-50/60 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:rounded-[42px]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(251,113,133,0.17), transparent 28%)`,
            }}
          />

          <div className="relative grid min-h-[620px] grid-cols-1 items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-6 lg:px-14 lg:py-16">
            <Reveal>
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-500 backdrop-blur-xl">
                  <span className="text-base">✦</span>
                  About Beauty Store
                </div>

                <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Beauty shopping,
                  <span className="block bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                    made more human.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-slate-500">
                  Beauty Store is designed around a simple idea: discovering
                  skincare, hair care, makeup and body care should feel
                  inspiring without feeling complicated.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/products"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-red-500 px-7 font-bold text-white shadow-lg shadow-red-200/60 transition duration-300 hover:-translate-y-1 hover:bg-red-600"
                  >
                    Explore Products
                  </Link>

                  <a
                    href="#our-story"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-7 font-bold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50"
                  >
                    Our Story ↓
                  </a>
                </div>

                <div className="mt-9 grid grid-cols-3 gap-3">
                  {[
                    ["4", "Beauty categories"],
                    ["360°", "Interactive feel"],
                    ["100%", "Responsive UI"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white bg-white/70 p-4 backdrop-blur-xl"
                    >
                      <p className="text-xl font-black text-red-500 sm:text-2xl">
                        {value}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500 sm:text-xs">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <BrandOrb />
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORY
      ===================================================== */}

      <section id="our-story" className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <SectionTitle
                eyebrow="Our Story"
                title="A cleaner way to discover everyday beauty."
                text="We focus on clarity, trust and interaction. Instead of overwhelming customers with too much information at once, the experience guides them through products in a visual and easy-to-understand way."
              />

              <div className="mt-8 rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 via-white to-amber-50 p-6 sm:p-8">
                <p className="text-lg font-black leading-7 text-slate-900">
                  “Good beauty UX should help the product stand out — not make
                  the customer fight the interface.”
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  That principle shapes how we present products, structure
                  categories and design interactions throughout the store.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {promises.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className={index === 2 ? "sm:col-span-2" : ""}
              >
                <TiltCard
                  className={`
                    h-full rounded-[26px] border border-white bg-white p-6
                    shadow-[0_20px_60px_rgba(15,23,42,0.07)]
                    ${
                      index === 2
                        ? "sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6"
                        : ""
                    }
                  `}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-sm font-black text-red-500">
                    {item.icon}
                  </div>

                  <div>
                    <h3
                      className={`text-xl font-black text-slate-950 ${
                        index === 2 ? "mt-5 sm:mt-0" : "mt-5"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES - INTERACTIVE TABS
      ===================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-white bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.07)] sm:rounded-[40px] sm:p-10 lg:p-12">
          <Reveal>
            <SectionTitle
              center
              eyebrow="What We Value"
              title="Designed around confidence and care."
              text="Choose a value below to see how it influences the experience."
            />
          </Reveal>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {values.map((item) => {
              const active = activeValue === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveValue(item.id)}
                  className={`
                    min-h-[48px] rounded-2xl px-5 text-sm font-bold transition duration-300
                    ${
                      active
                        ? "bg-red-500 text-white shadow-lg shadow-red-200/60"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50"
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50/80 via-white to-amber-50/80">
            <div
              key={selectedValue.id}
              className="grid animate-[fadeIn_.35s_ease-out] grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-10"
            >
              <div>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-red-500 shadow-sm">
                  {selectedValue.icon}
                </div>

                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {selectedValue.title}
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  {selectedValue.text}
                </p>
              </div>

              <div className="grid gap-3">
                {selectedValue.points.map((point, index) => (
                  <div
                    key={point}
                    className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-xs font-black text-red-500">
                      0{index + 1}
                    </span>

                    <p className="font-bold text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="The Experience"
              title="Simple on the surface. Thoughtful underneath."
              text="These numbers describe the structure of the current Beauty Store experience."
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [4, "", "Main beauty categories"],
              [3, "D", "Interactive product presentation"],
              [360, "°", "Product exploration feel"],
              [100, "%", "Responsive-first layout"],
            ].map(([value, suffix, label], index) => (
              <Reveal key={label} delay={index * 80}>
                <div className="rounded-[26px] border border-white bg-white p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
                  <p className="text-3xl font-black tracking-tight text-red-500 sm:text-4xl">
                    <AnimatedNumber value={Number(value)} suffix={suffix} />
                  </p>

                  <p className="mt-3 text-xs font-semibold leading-5 text-slate-500 sm:text-sm">
                    {label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE TIMELINE / ACCORDION
      ===================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionTitle
                eyebrow="How We Think"
                title="A beauty journey with less friction."
                text="The experience is built as a simple progression from discovery to care."
              />

              <Link
                to="/products"
                className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-slate-950 px-6 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-red-500"
              >
                Start Exploring →
              </Link>
            </div>
          </Reveal>

          <div className="space-y-3">
            {milestones.map((item, index) => {
              const open = openMilestone === index;

              return (
                <Reveal key={item.title} delay={index * 80}>
                  <button
                    type="button"
                    onClick={() => setOpenMilestone(open ? -1 : index)}
                    className={`
                      w-full rounded-[24px] border p-5 text-left transition duration-300 sm:p-6
                      ${
                        open
                          ? "border-red-100 bg-red-50/70"
                          : "border-slate-100 bg-white hover:border-red-100 hover:bg-red-50/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xs font-black
                          ${
                            open
                              ? "bg-red-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        {item.year}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black text-slate-950 sm:text-xl">
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`
                          text-xl font-light text-slate-400 transition duration-300
                          ${open ? "rotate-45 text-red-500" : ""}
                        `}
                      >
                        +
                      </span>
                    </div>

                    <div
                      className={`
                        grid transition-all duration-300
                        ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <p className="pl-16 pt-4 text-sm leading-7 text-slate-500 sm:text-base">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-4 pb-20 pt-12 sm:px-6 lg:px-10">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-950 px-6 py-14 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl backdrop-blur-xl">
                ✦
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-red-300">
                Discover your routine
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Find products that feel right for you.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore skincare, hair care, makeup and body care through a
                cleaner and more interactive shopping experience.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-red-500 px-7 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-red-600"
                >
                  Shop Collection
                </Link>

                <Link
                  to="/contacts"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
