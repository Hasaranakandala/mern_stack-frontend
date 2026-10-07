import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

/*
=========================================================
VELMORA ABOUT PAGE
=========================================================

COLOR SYSTEM

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
White            #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280

Brand direction:
Modern Luxury Beauty
Soft Sophistication
Calm Confidence
Premium Digital Experience
=========================================================
*/

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref =
    useRef(null);

  const [
    visible,
    setVisible,
  ] = useState(false);

  useEffect(() => {
    const el =
      ref.current;

    if (!el) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setVisible(
              true
            );

            observer.unobserve(
              el
            );
          }
        },
        {
          threshold:
            0.12,
        }
      );

    observer.observe(
      el
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-700
        ease-out

        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-7 opacity-0"
        }

        ${className}
      `}
      style={{
        transitionDelay:
          `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}) {
  return (
    <div
      className={
        center
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.24em]
          text-[#6C5CE7]

          sm:text-xs
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-3
          text-3xl
          font-extrabold
          leading-[1.08]
          tracking-[-0.04em]
          text-[#2F3136]

          sm:mt-4
          sm:text-4xl

          lg:text-5xl
        "
      >
        {title}
      </h2>

      {text && (
        <p
          className="
            mt-4
            text-sm
            leading-7
            text-[#706A75]

            sm:mt-5
            sm:text-base
          "
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   LUXURY EDITORIAL PRODUCT VISUAL
========================================================= */

function LuxuryProductVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-[0.92/1]
        w-full
        max-w-[430px]

        sm:aspect-square
        sm:max-w-[500px]
      "
    >
      {/* =============================================
          BACKGROUND ATMOSPHERE
      ============================================= */}

      <div
        className="
          absolute
          inset-[4%]

          rounded-[42%]

          border
          border-[#DED4FF]/70

          bg-gradient-to-br
          from-white/80
          via-[#F8F4FF]/75
          to-[#FFF3F7]/75

          shadow-[0_40px_110px_rgba(63,48,92,0.12)]

          backdrop-blur-xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[4%]
          top-[8%]

          h-[34%]
          w-[34%]

          rounded-full

          bg-[#B8A1FF]/24

          blur-[45px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[4%]
          right-[1%]

          h-[36%]
          w-[36%]

          rounded-full

          bg-[#F2B8C6]/28

          blur-[50px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[20%]
          top-[4%]

          h-[22%]
          w-[22%]

          rounded-full

          bg-[#EADBC8]/45

          blur-[35px]
        "
      />

      {/* =============================================
          DECORATIVE RINGS
      ============================================= */}

      <div
        className="
          absolute
          inset-[11%]

          rounded-full

          border
          border-[#B8A1FF]/20
        "
      />

      <div
        className="
          absolute
          inset-[20%]

          rounded-full

          border
          border-[#EADBC8]/50
        "
      />

      {/* =============================================
          PRODUCT PLATFORM
      ============================================= */}

      <div
        className="
          absolute
          bottom-[13%]
          left-1/2

          h-[16%]
          w-[62%]

          -translate-x-1/2

          rounded-[50%]

          bg-gradient-to-b
          from-white
          to-[#EEE8F3]

          shadow-[0_28px_35px_rgba(66,51,87,0.16)]
        "
      />

      <div
        className="
          absolute
          bottom-[15.5%]
          left-1/2

          h-[5%]
          w-[55%]

          -translate-x-1/2

          rounded-full

          bg-[#DDD3E6]/35

          blur-md
        "
      />

      {/* =============================================
          SERUM BOTTLE
      ============================================= */}

      <div
        className="
          absolute
          bottom-[23%]
          left-[22%]

          h-[44%]
          w-[22%]

          transition-transform
          duration-700

          hover:-translate-y-2
          hover:rotate-[-2deg]
        "
      >
        {/* cap */}

        <div
          className="
            absolute
            left-1/2
            top-0

            h-[16%]
            w-[42%]

            -translate-x-1/2

            rounded-t-xl
            rounded-b-md

            bg-gradient-to-b
            from-[#D7BB85]
            via-[#B9955B]
            to-[#9A7544]

            shadow-md
          "
        />

        {/* neck */}

        <div
          className="
            absolute
            left-1/2
            top-[13%]

            h-[9%]
            w-[34%]

            -translate-x-1/2

            bg-[#EADBC8]
          "
        />

        {/* glass */}

        <div
          className="
            absolute
            bottom-0
            left-1/2

            h-[80%]
            w-full

            -translate-x-1/2

            overflow-hidden

            rounded-t-[28%]
            rounded-b-[22%]

            border
            border-white/80

            bg-gradient-to-br
            from-white/85
            via-[#EDE7FF]/55
            to-[#C8B7F7]/70

            shadow-[0_18px_30px_rgba(89,70,120,0.20)]

            backdrop-blur-md
          "
        >
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0

              h-[58%]

              bg-gradient-to-t
              from-[#A891ED]/70
              to-[#D9CFFF]/40
            "
          />

          <div
            className="
              absolute
              left-[14%]
              top-[8%]

              h-[70%]
              w-[12%]

              rounded-full

              bg-white/40

              blur-[2px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[37%]

              w-[72%]

              -translate-x-1/2

              rounded-md

              bg-white/88

              px-1
              py-2

              text-center

              shadow-sm
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.18em]
                text-[#6C5CE7]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1
                text-[5px]
                uppercase
                tracking-[0.12em]
                text-[#948B9C]

                sm:text-[6px]
              "
            >
              radiance serum
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          CREAM JAR
      ============================================= */}

      <div
        className="
          absolute
          bottom-[21%]
          left-[43%]

          h-[26%]
          w-[28%]

          transition-transform
          duration-700

          hover:-translate-y-2
          hover:rotate-[2deg]
        "
      >
        {/* jar body */}

        <div
          className="
            absolute
            bottom-0

            h-[68%]
            w-full

            overflow-hidden

            rounded-[32%]

            border
            border-white

            bg-gradient-to-br
            from-white
            via-[#FFF1F5]
            to-[#EEC9D4]

            shadow-[0_18px_32px_rgba(89,70,120,0.15)]
          "
        >
          <div
            className="
              absolute
              left-1/2
              top-[35%]

              w-[70%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.15em]
                text-[#6C5CE7]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1
                text-[5px]
                uppercase
                tracking-[0.1em]
                text-[#9A8F99]

                sm:text-[6px]
              "
            >
              velvet cream
            </p>
          </div>
        </div>

        {/* jar lid */}

        <div
          className="
            absolute
            left-[3%]
            top-[15%]

            h-[28%]
            w-[94%]

            rounded-[40%]

            bg-gradient-to-br
            from-[#D4C5FF]
            via-[#B8A1FF]
            to-[#8A72D9]

            shadow-lg
          "
        />

        <div
          className="
            absolute
            left-[10%]
            top-[19%]

            h-[6%]
            w-[75%]

            rounded-full

            bg-white/25
          "
        />
      </div>

      {/* =============================================
          PERFUME
      ============================================= */}

      <div
        className="
          absolute
          bottom-[24%]
          right-[15%]

          h-[39%]
          w-[21%]

          transition-transform
          duration-700

          hover:-translate-y-2
          hover:rotate-[2deg]
        "
      >
        {/* cap */}

        <div
          className="
            absolute
            left-1/2
            top-0

            h-[18%]
            w-[48%]

            -translate-x-1/2

            rounded-md

            bg-[#2F3136]

            shadow-lg
          "
        />

        {/* gold neck */}

        <div
          className="
            absolute
            left-1/2
            top-[15%]

            h-[9%]
            w-[31%]

            -translate-x-1/2

            bg-gradient-to-r
            from-[#C39A5B]
            via-[#E0C28B]
            to-[#B48A4E]
          "
        />

        {/* perfume bottle */}

        <div
          className="
            absolute
            bottom-0

            h-[78%]
            w-full

            overflow-hidden

            rounded-[18%]

            border
            border-white

            bg-gradient-to-br
            from-white/85
            via-[#F2DAE2]/65
            to-[#D99BB0]/70

            shadow-[0_20px_34px_rgba(77,59,98,0.18)]
          "
        >
          <div
            className="
              absolute
              left-[10%]
              top-[7%]

              h-[65%]
              w-[12%]

              rounded-full

              bg-white/35

              blur-[1px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[39%]

              w-[72%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.17em]
                text-[#513D6D]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1
                text-[5px]
                uppercase
                tracking-[0.1em]
                text-[#806F7A]

                sm:text-[6px]
              "
            >
              signature
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          FLOATING BRAND TAGS
      ============================================= */}

      <div
        className="
          absolute
          left-[2%]
          top-[29%]

          rounded-xl

          border
          border-white

          bg-white/80

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.14em]
            text-[#6C5CE7]

            sm:text-[10px]
          "
        >
          ✦ Curated
        </p>

        <p
          className="
            mt-1
            text-[8px]
            font-semibold
            text-[#736C79]

            sm:text-[11px]
          "
        >
          Beauty essentials
        </p>
      </div>

      <div
        className="
          absolute
          right-[1%]
          top-[18%]

          rounded-xl

          border
          border-white

          bg-white/80

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.14em]
            text-[#B36D85]

            sm:text-[10px]
          "
        >
          ♡ Personal
        </p>

        <p
          className="
            mt-1
            text-[8px]
            font-semibold
            text-[#736C79]

            sm:text-[11px]
          "
        >
          Made for rituals
        </p>
      </div>

      <div
        className="
          absolute
          bottom-[3%]
          left-[30%]

          rounded-xl

          border
          border-white

          bg-white/80

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.14em]
            text-[#A17A43]

            sm:text-[10px]
          "
        >
          ◇ Refined
        </p>

        <p
          className="
            mt-1
            text-[8px]
            font-semibold
            text-[#736C79]

            sm:text-[11px]
          "
        >
          Elevated experience
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TILT CARD
========================================================= */

function TiltCard({
  children,
  className = "",
}) {
  const ref =
    useRef(null);

  const handleMove = (
    event
  ) => {
    const card =
      ref.current;

    if (!card) {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    const rotateY =
      (x /
        rect.width -
        0.5) *
      5;

    const rotateX =
      -(
        y /
          rect.height -
        0.5
      ) * 5;

    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const reset = () => {
    if (
      !ref.current
    ) {
      return;
    }

    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={
        handleMove
      }
      onMouseLeave={
        reset
      }
      className={`
        transition-transform
        duration-200
        will-change-transform

        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* =========================================================
   ANIMATED NUMBER
========================================================= */

function AnimatedNumber({
  value,
  suffix = "",
}) {
  const ref =
    useRef(null);

  const [
    display,
    setDisplay,
  ] = useState(0);

  useEffect(() => {
    const el =
      ref.current;

    if (!el) {
      return;
    }

    let frame;
    let started =
      false;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry.isIntersecting ||
            started
          ) {
            return;
          }

          started = true;

          const duration =
            1100;

          const startedAt =
            performance.now();

          const animate =
            (time) => {
              const progress =
                Math.min(
                  (time -
                    startedAt) /
                    duration,
                  1
                );

              const eased =
                1 -
                Math.pow(
                  1 -
                    progress,
                  3
                );

              setDisplay(
                Math.round(
                  value *
                    eased
                )
              );

              if (
                progress <
                1
              ) {
                frame =
                  requestAnimationFrame(
                    animate
                  );
              }
            };

          frame =
            requestAnimationFrame(
              animate
            );

          observer.unobserve(
            el
          );
        },
        {
          threshold:
            0.5,
        }
      );

    observer.observe(
      el
    );

    return () => {
      observer.disconnect();

      cancelAnimationFrame(
        frame
      );
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
   BRAND DATA
========================================================= */

const values = [
  {
    id:
      "personal",
    icon:
      "♡",
    title:
      "Beauty feels personal",
    text:
      "Velmora believes beauty should support individuality rather than overwhelm it. Every part of the experience is designed to help customers explore confidently at their own pace.",
    points: [
      "Thoughtful product discovery",
      "Clear beauty information",
      "Customer-first experience",
    ],
  },

  {
    id:
      "quality",
    icon:
      "✦",
    title:
      "Elegance in every detail",
    text:
      "Luxury is not only about appearance. It is the feeling created by thoughtful details, refined presentation, smooth interactions and consistent care throughout the shopping journey.",
    points: [
      "Refined visual language",
      "Consistent presentation",
      "Meaningful interactions",
    ],
  },

  {
    id:
      "inclusive",
    icon:
      "◌",
    title:
      "Designed for real routines",
    text:
      "Velmora is built for different beauty routines, preferences, lifestyles and devices, making modern beauty easier and more comfortable to explore.",
    points: [
      "Mobile-first comfort",
      "Accessible interaction",
      "Simple navigation",
    ],
  },
];

const milestones = [
  {
    year:
      "01",
    title:
      "Discover",
    text:
      "Your journey begins with thoughtful exploration, making it easier to move through skincare, makeup, haircare and body essentials without unnecessary complexity.",
  },

  {
    year:
      "02",
    title:
      "Curate",
    text:
      "Velmora brings products into focused collections so each beauty choice feels intentional rather than overwhelming.",
  },

  {
    year:
      "03",
    title:
      "Experience",
    text:
      "Immersive visuals, refined interfaces and responsive interactions make digital beauty discovery feel more expressive and tangible.",
  },

  {
    year:
      "04",
    title:
      "Care",
    text:
      "The Velmora experience continues beyond discovery through clear communication, customer support and a thoughtful shopping journey.",
  },
];

const promises = [
  {
    icon:
      "01",
    title:
      "Curated discovery",
    text:
      "Focused collections and thoughtful product presentation help customers find beauty essentials without unnecessary visual noise.",
  },

  {
    icon:
      "02",
    title:
      "Immersive beauty",
    text:
      "Interactive presentation brings products closer and makes the digital shopping experience feel more engaging.",
  },

  {
    icon:
      "03",
    title:
      "Velmora harmony",
    text:
      "Lavender, soft rose, champagne and warm ivory work together to create a calm, luxurious and recognisable visual identity.",
  },
];

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function About() {
  const [
    activeValue,
    setActiveValue,
  ] = useState(
    "personal"
  );

  const [
    openMilestone,
    setOpenMilestone,
  ] = useState(0);

  const [
    mouse,
    setMouse,
  ] = useState({
    x: 50,
    y: 50,
  });

  const selectedValue =
    useMemo(
      () =>
        values.find(
          (
            item
          ) =>
            item.id ===
            activeValue
        ) ??
        values[0],
      [activeValue]
    );

  const handleHeroMove = (
    event
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    setMouse({
      x:
        ((event.clientX -
          rect.left) /
          rect.width) *
        100,

      y:
        ((event.clientY -
          rect.top) /
          rect.height) *
        100,
    });
  };

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#FAF9F7]
        text-[#2F3136]
      "
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          px-3
          pb-10
          pt-5

          sm:px-6
          sm:pb-14
          sm:pt-8

          lg:px-10
          lg:pb-20
        "
      >
        <div
          onMouseMove={
            handleHeroMove
          }
          className="
            relative
            mx-auto
            max-w-7xl
            overflow-hidden

            rounded-[28px]

            border
            border-[#ECE6F4]

            bg-gradient-to-br
            from-[#FBF9FF]
            via-[#FFFAFC]
            to-[#F8F1E8]

            shadow-[0_30px_100px_rgba(68,52,95,0.08)]

            sm:rounded-[38px]

            lg:rounded-[44px]
          "
        >
          {/* Mouse glow */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-80
              transition-all
              duration-300
            "
            style={{
              background:
                `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(184,161,255,0.24), transparent 30%)`,
            }}
          />

          {/* Rose atmosphere */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-20

              h-72
              w-72

              rounded-full

              bg-[#F2B8C6]/20

              blur-[90px]
            "
          />

          {/* Champagne atmosphere */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20

              h-64
              w-64

              rounded-full

              bg-[#EADBC8]/30

              blur-[90px]
            "
          />

          <div
            className="
              relative

              grid
              min-h-[610px]
              grid-cols-1
              items-center
              gap-8

              px-5
              py-10

              sm:px-9
              sm:py-14

              lg:grid-cols-[0.94fr_1.06fr]
              lg:gap-8
              lg:px-14
              lg:py-16
            "
          >
            {/* =============================================
                LEFT CONTENT
            ============================================= */}

            <Reveal>
              <div
                className="
                  max-w-xl
                "
              >
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-[#DED4FF]

                    bg-white/70

                    px-3.5
                    py-2

                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.22em]

                    text-[#6C5CE7]

                    shadow-sm

                    backdrop-blur-xl

                    sm:px-4
                    sm:text-[11px]
                  "
                >
                  <span
                    className="
                      text-[#B9955B]
                    "
                  >
                    ✦
                  </span>

                  The Velmora
                  Story
                </div>

                <h1
                  className="
                    mt-6

                    text-[39px]
                    font-extrabold
                    leading-[1.01]
                    tracking-[-0.05em]

                    text-[#2F3136]

                    sm:text-5xl

                    lg:text-[60px]
                  "
                >
                  Beauty,
                  thoughtfully{" "}

                  <span
                    className="
                      font-serif
                      font-medium
                      italic

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      via-[#9279E8]
                      to-[#C87895]

                      bg-clip-text
                      text-transparent
                    "
                  >
                    elevated.
                  </span>
                </h1>

                <p
                  className="
                    mt-6
                    max-w-lg

                    text-sm
                    leading-7

                    text-[#6D6772]

                    sm:text-base
                    sm:leading-8
                  "
                >
                  Velmora is a
                  modern beauty
                  destination
                  created around
                  softness,
                  elegance and
                  confidence.
                  We make
                  skincare,
                  makeup,
                  haircare and
                  body essentials
                  easier to
                  explore through
                  an experience
                  that feels
                  refined,
                  personal and
                  inspiring.
                </p>

                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                  "
                >
                  <Link
                    to="/products"
                    className="
                      inline-flex
                      min-h-[52px]
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#927EF1]

                      px-7

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_12px_30px_rgba(108,92,231,0.23)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:shadow-[0_18px_38px_rgba(108,92,231,0.31)]

                      active:scale-[0.98]

                      sm:text-base
                    "
                  >
                    Discover
                    Velmora
                  </Link>

                  <a
                    href="#our-story"
                    className="
                      inline-flex
                      min-h-[52px]
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-[#DDD4EB]

                      bg-white/75

                      px-7

                      text-sm
                      font-bold

                      text-[#514B57]

                      backdrop-blur-xl

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-[#B8A1FF]
                      hover:bg-[#F8F5FF]
                      hover:text-[#6C5CE7]

                      sm:text-base
                    "
                  >
                    Our
                    Philosophy ↓
                  </a>
                </div>

                {/* HERO VALUES */}

                <div
                  className="
                    mt-9
                    grid
                    grid-cols-3
                    gap-2

                    sm:gap-3
                  "
                >
                  {[
                    [
                      "4",
                      "Beauty worlds",
                    ],

                    [
                      "3D",
                      "Immersive discovery",
                    ],

                    [
                      "360°",
                      "Product experience",
                    ],
                  ].map(
                    ([
                      value,
                      label,
                    ]) => (
                      <div
                        key={
                          label
                        }
                        className="
                          rounded-2xl

                          border
                          border-white

                          bg-white/60

                          px-2
                          py-3

                          backdrop-blur-xl

                          sm:p-4
                        "
                      >
                        <p
                          className="
                            text-lg
                            font-extrabold
                            text-[#6C5CE7]

                            sm:text-2xl
                          "
                        >
                          {
                            value
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            font-semibold
                            leading-4
                            text-[#7A7480]

                            sm:text-xs
                          "
                        >
                          {
                            label
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Reveal>

            {/* =============================================
                LUXURY PRODUCT VISUAL
            ============================================= */}

            <Reveal
              delay={120}
            >
              <LuxuryProductVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================================================
          STORY
      =================================================== */}

      <section
        id="our-story"
        className="
          scroll-mt-24

          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-10

            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-16
          "
        >
          <Reveal>
            <div>
              <SectionTitle
                eyebrow="Our Philosophy"
                title="Luxury should feel effortless."
                text="Velmora brings clarity and beauty together. Instead of making discovery feel complicated, we create a calmer experience where products, content and interactions have room to breathe."
              />

              <div
                className="
                  relative
                  mt-8
                  overflow-hidden

                  rounded-[26px]

                  border
                  border-[#E6DEF3]

                  bg-gradient-to-br
                  from-[#F5F1FF]
                  via-white
                  to-[#FFF2F6]

                  p-6

                  sm:rounded-[30px]
                  sm:p-8
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16

                    h-40
                    w-40

                    rounded-full

                    bg-[#B8A1FF]/15

                    blur-3xl
                  "
                />

                <p
                  className="
                    relative

                    font-serif
                    text-xl
                    font-medium
                    italic
                    leading-8

                    text-[#3B3440]

                    sm:text-2xl
                    sm:leading-9
                  "
                >
                  “Beauty should
                  feel like
                  discovery,
                  not
                  complexity.”
                </p>

                <p
                  className="
                    relative
                    mt-5

                    text-sm
                    leading-7

                    text-[#716B76]
                  "
                >
                  This idea
                  shapes how
                  Velmora
                  presents
                  products,
                  organises
                  collections
                  and creates
                  every digital
                  interaction.
                </p>

                <div
                  className="
                    relative
                    mt-6

                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      h-px
                      w-10

                      bg-[#B9955B]
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.2em]

                      text-[#9A79E8]
                    "
                  >
                    The Velmora
                    Philosophy
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* PROMISE CARDS */}

          <div
            className="
              grid
              grid-cols-1
              gap-4

              sm:grid-cols-2
            "
          >
            {promises.map(
              (
                item,
                index
              ) => (
                <Reveal
                  key={
                    item.title
                  }
                  delay={
                    index *
                    90
                  }
                  className={
                    index ===
                    2
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <TiltCard
                    className={`
                      h-full

                      rounded-[24px]

                      border
                      border-[#ECE6F3]

                      bg-white

                      p-6

                      shadow-[0_18px_55px_rgba(63,48,85,0.055)]

                      ${
                        index ===
                        2
                          ? "sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6"
                          : ""
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center

                        rounded-2xl

                        bg-[#F2EDFF]

                        text-sm
                        font-black

                        text-[#6C5CE7]
                      "
                    >
                      {
                        item.icon
                      }
                    </div>

                    <div>
                      <h3
                        className={`
                          text-xl
                          font-extrabold

                          text-[#2F3136]

                          ${
                            index ===
                            2
                              ? "mt-5 sm:mt-0"
                              : "mt-5"
                          }
                        `}
                      >
                        {
                          item.title
                        }
                      </h3>

                      <p
                        className="
                          mt-3

                          text-sm
                          leading-6

                          text-[#746E79]
                        "
                      >
                        {
                          item.text
                        }
                      </p>
                    </div>
                  </TiltCard>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          VALUES
      =================================================== */}

      <section
        className="
          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl

            rounded-[28px]

            border
            border-[#ECE6F3]

            bg-white

            p-5

            shadow-[0_28px_90px_rgba(63,48,86,0.06)]

            sm:rounded-[40px]
            sm:p-10

            lg:p-12
          "
        >
          <Reveal>
            <SectionTitle
              center
              eyebrow="What Defines Us"
              title="Confidence, care and quiet luxury."
              text="Explore the principles that shape Velmora and the experience we want every customer to feel."
            />
          </Reveal>

          {/* VALUE BUTTONS */}

          <div
            className="
              mt-9
              grid
              grid-cols-1
              gap-2

              sm:flex
              sm:flex-wrap
              sm:justify-center
              sm:gap-3
            "
          >
            {values.map(
              (item) => {
                const active =
                  activeValue ===
                  item.id;

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveValue(
                        item.id
                      )
                    }
                    className={`
                      min-h-[50px]

                      rounded-2xl

                      px-5

                      text-sm
                      font-bold

                      transition-all
                      duration-300

                      ${
                        active
                          ? "bg-gradient-to-r from-[#6C5CE7] to-[#927EF1] text-white shadow-[0_10px_25px_rgba(108,92,231,0.22)]"
                          : "border border-[#E5DFEC] bg-white text-[#625C68] hover:border-[#CFC1FA] hover:bg-[#F8F5FF] hover:text-[#6C5CE7]"
                      }
                    `}
                  >
                    <span
                      className="
                        mr-2
                      "
                    >
                      {
                        item.icon
                      }
                    </span>

                    {
                      item.title
                    }
                  </button>
                );
              }
            )}
          </div>

          {/* SELECTED VALUE */}

          <div
            className="
              mt-8
              overflow-hidden

              rounded-[26px]

              border
              border-[#E4DBF5]

              bg-gradient-to-br
              from-[#F4F0FF]
              via-white
              to-[#FFF2F6]
            "
          >
            <div
              key={
                selectedValue.id
              }
              className="
                grid
                animate-[fadeIn_.35s_ease-out]
                grid-cols-1
                gap-8

                p-5

                sm:p-8

                lg:grid-cols-[1fr_0.9fr]
                lg:items-center
                lg:p-10
              "
            >
              <div>
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    bg-white

                    text-2xl
                    text-[#6C5CE7]

                    shadow-sm
                  "
                >
                  {
                    selectedValue.icon
                  }
                </div>

                <h3
                  className="
                    mt-5

                    text-2xl
                    font-extrabold
                    tracking-[-0.03em]

                    text-[#2F3136]

                    sm:text-3xl
                  "
                >
                  {
                    selectedValue.title
                  }
                </h3>

                <p
                  className="
                    mt-4
                    max-w-2xl

                    text-sm
                    leading-7

                    text-[#706A75]

                    sm:text-base
                  "
                >
                  {
                    selectedValue.text
                  }
                </p>
              </div>

              <div
                className="
                  grid
                  gap-3
                "
              >
                {selectedValue.points.map(
                  (
                    point,
                    index
                  ) => (
                    <div
                      key={
                        point
                      }
                      className="
                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        border
                        border-white

                        bg-white/75

                        p-4

                        shadow-sm

                        backdrop-blur-xl

                        sm:gap-4
                      "
                    >
                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center

                          rounded-xl

                          bg-[#F2EDFF]

                          text-[10px]
                          font-black
                          text-[#6C5CE7]
                        "
                      >
                        0
                        {index +
                          1}
                      </span>

                      <p
                        className="
                          text-sm
                          font-bold
                          text-[#514B57]

                          sm:text-base
                        "
                      >
                        {
                          point
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          EXPERIENCE
      =================================================== */}

      <section
        className="
          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <Reveal>
            <SectionTitle
              center
              eyebrow="The Velmora Experience"
              title="Modern beauty, thoughtfully presented."
              text="Every layer of the experience is designed to make beauty discovery feel easier, richer and more engaging."
            />
          </Reveal>

          <div
            className="
              mt-10

              grid
              grid-cols-2
              gap-3

              sm:gap-4

              lg:grid-cols-4
            "
          >
            {[
              [
                4,
                "",
                "Beauty worlds",
              ],

              [
                3,
                "D",
                "Immersive presentation",
              ],

              [
                360,
                "°",
                "Product exploration",
              ],

              [
                100,
                "%",
                "Responsive experience",
              ],
            ].map(
              (
                [
                  value,
                  suffix,
                  label,
                ],
                index
              ) => (
                <Reveal
                  key={
                    label
                  }
                  delay={
                    index *
                    80
                  }
                >
                  <div
                    className="
                      h-full

                      rounded-[22px]

                      border
                      border-[#ECE6F3]

                      bg-white

                      p-4

                      text-center

                      shadow-[0_16px_50px_rgba(63,48,86,0.05)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-[#D8CCFA]
                      hover:shadow-[0_22px_55px_rgba(108,92,231,0.09)]

                      sm:rounded-[26px]
                      sm:p-7
                    "
                  >
                    <p
                      className="
                        text-2xl
                        font-extrabold
                        tracking-[-0.04em]

                        text-[#6C5CE7]

                        sm:text-4xl
                      "
                    >
                      <AnimatedNumber
                        value={
                          Number(
                            value
                          )
                        }
                        suffix={
                          suffix
                        }
                      />
                    </p>

                    <p
                      className="
                        mt-3

                        text-[10px]
                        font-semibold
                        leading-5

                        text-[#746E79]

                        sm:text-sm
                      "
                    >
                      {
                        label
                      }
                    </p>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          JOURNEY
      =================================================== */}

      <section
        className="
          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto

            grid
            max-w-7xl
            grid-cols-1
            gap-10

            lg:grid-cols-[0.75fr_1.25fr]
            lg:gap-16
          "
        >
          <Reveal>
            <div
              className="
                lg:sticky
                lg:top-28
              "
            >
              <SectionTitle
                eyebrow="The Journey"
                title="From discovery to confidence."
                text="Velmora is designed as a natural progression that helps customers move from inspiration to confident beauty choices."
              />

              <Link
                to="/products"
                className="
                  mt-7
                  inline-flex
                  min-h-[50px]
                  w-full
                  items-center
                  justify-center

                  rounded-2xl

                  bg-[#2F3136]

                  px-6

                  text-sm
                  font-bold
                  text-white

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-[#6C5CE7]
                  hover:shadow-[0_13px_28px_rgba(108,92,231,0.22)]

                  sm:w-auto
                  sm:text-base
                "
              >
                Explore Velmora
                →
              </Link>
            </div>
          </Reveal>

          <div
            className="
              space-y-3
            "
          >
            {milestones.map(
              (
                item,
                index
              ) => {
                const open =
                  openMilestone ===
                  index;

                return (
                  <Reveal
                    key={
                      item.title
                    }
                    delay={
                      index *
                      80
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMilestone(
                          open
                            ? -1
                            : index
                        )
                      }
                      aria-expanded={
                        open
                      }
                      className={`
                        w-full

                        rounded-[22px]

                        border

                        p-4

                        text-left

                        transition-all
                        duration-300

                        sm:rounded-[26px]
                        sm:p-6

                        ${
                          open
                            ? "border-[#D8CCFA] bg-[#F7F3FF] shadow-[0_12px_35px_rgba(108,92,231,0.07)]"
                            : "border-[#ECE7F1] bg-white hover:border-[#D8CCFA] hover:bg-[#FDFCFF]"
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3

                          sm:gap-4
                        "
                      >
                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            text-[10px]
                            font-black

                            transition-all
                            duration-300

                            sm:h-12
                            sm:w-12
                            sm:rounded-2xl
                            sm:text-xs

                            ${
                              open
                                ? "bg-gradient-to-br from-[#6C5CE7] to-[#9B82F2] text-white shadow-lg"
                                : "bg-[#F2EDFF] text-[#6C5CE7]"
                            }
                          `}
                        >
                          {
                            item.year
                          }
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <h3
                            className="
                              text-base
                              font-extrabold
                              text-[#342F38]

                              sm:text-xl
                            "
                          >
                            {
                              item.title
                            }
                          </h3>
                        </div>

                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            rounded-full

                            text-xl
                            font-light

                            transition-all
                            duration-300

                            ${
                              open
                                ? "rotate-45 bg-white text-[#6C5CE7]"
                                : "bg-[#FAF8FC] text-[#9D97A1]"
                            }
                          `}
                        >
                          +
                        </span>
                      </div>

                      <div
                        className={`
                          grid

                          transition-all
                          duration-300

                          ${
                            open
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }
                        `}
                      >
                        <div
                          className="
                            overflow-hidden
                          "
                        >
                          <p
                            className="
                              pl-14
                              pt-4

                              text-sm
                              leading-7

                              text-[#706A75]

                              sm:pl-16
                              sm:text-base
                            "
                          >
                            {
                              item.text
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section
        className="
          px-3
          pb-20
          pt-10

          sm:px-6

          lg:px-10
        "
      >
        <Reveal>
          <div
            className="
              relative
              mx-auto
              max-w-6xl
              overflow-hidden

              rounded-[28px]

              bg-[#2F3136]

              px-5
              py-12

              text-center
              text-white

              shadow-[0_30px_80px_rgba(47,49,54,0.20)]

              sm:rounded-[40px]
              sm:px-10
              sm:py-16
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-20
                top-0

                h-56
                w-56

                rounded-full

                bg-[#6C5CE7]/25

                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                bottom-0

                h-56
                w-56

                rounded-full

                bg-[#F2B8C6]/15

                blur-3xl
              "
            />

            <div
              className="
                relative
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/10

                  text-xl
                  text-[#EADBC8]

                  backdrop-blur-xl
                "
              >
                ✦
              </div>

              <p
                className="
                  mt-6

                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.25em]

                  text-[#CDBFFF]

                  sm:text-xs
                "
              >
                Your Velmora
                Ritual
              </p>

              <h2
                className="
                  mx-auto
                  mt-4
                  max-w-3xl

                  text-3xl
                  font-extrabold
                  leading-tight
                  tracking-[-0.04em]

                  sm:text-4xl

                  lg:text-5xl
                "
              >
                Discover beauty
                that feels like
                you.
              </h2>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-2xl

                  text-sm
                  leading-7

                  text-white/65

                  sm:text-base
                "
              >
                Explore
                thoughtfully
                curated
                skincare,
                makeup,
                haircare and
                body essentials
                through a
                modern beauty
                experience
                designed around
                confidence.
              </p>

              <div
                className="
                  mt-8

                  flex
                  flex-col
                  justify-center
                  gap-3

                  sm:flex-row
                "
              >
                <Link
                  to="/products"
                  className="
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center

                    rounded-2xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#9B82F2]

                    px-7

                    font-bold
                    text-white

                    shadow-[0_12px_28px_rgba(108,92,231,0.25)]

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:shadow-[0_18px_38px_rgba(108,92,231,0.34)]

                    active:scale-[0.98]
                  "
                >
                  Shop Velmora
                </Link>

                <Link
                  to="/contacts"
                  className="
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-white/15

                    bg-white/10

                    px-7

                    font-bold
                    text-white

                    backdrop-blur-xl

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:bg-white/15
                  "
                >
                  Talk to
                  Velmora
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================================================
          LOCAL ANIMATION
      =================================================== */}

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
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}