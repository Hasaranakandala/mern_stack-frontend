export default function Loading({
  message = "Preparing your Velmora experience...",
  fullScreen = true,
}) {
  return (
    <div
      className={`
        relative
        w-full
        overflow-hidden

        ${
          fullScreen
            ? "min-h-screen"
            : "min-h-[280px] sm:min-h-[320px]"
        }

        flex
        items-center
        justify-center

        bg-[#FAF9F7]

        px-4
        py-10
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* ===================================================
          LUXURY BACKGROUND AMBIENCE
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-90px]
          top-[-90px]

          h-[240px]
          w-[240px]

          rounded-full

          bg-[#B8A1FF]/15

          blur-[80px]

          sm:h-[320px]
          sm:w-[320px]
        "
      />

      <div
        className="
          pointer-events-none
          bottom-[-100px]
          right-[-80px]

          absolute

          h-[260px]
          w-[260px]

          rounded-full

          bg-[#F2B8C6]/15

          blur-[90px]

          sm:h-[340px]
          sm:w-[340px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2

          h-[260px]
          w-[260px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-[#EADBC8]/10

          blur-[90px]

          sm:h-[360px]
          sm:w-[360px]
        "
      />

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div
        className="
          relative
          z-10

          flex
          w-full
          max-w-[420px]
          flex-col
          items-center
          justify-center

          text-center
        "
      >
        {/* =================================================
            LOADING VISUAL
        ================================================= */}

        <div
          className="
            relative

            flex
            h-[94px]
            w-[94px]
            items-center
            justify-center

            sm:h-[110px]
            sm:w-[110px]
          "
        >
          {/* Soft glow */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[10px]

              rounded-full

              bg-[#B8A1FF]/25

              blur-xl

              motion-safe:animate-pulse
            "
          />

          {/* OUTER RING */}

          <div
            className="
              absolute
              inset-0

              rounded-full

              border
              border-[#DCD3F4]
            "
          />

          {/* ROTATING VIOLET / CHAMPAGNE RING */}

          <div
            className="
              absolute
              inset-0

              rounded-full

              border-[2px]
              border-transparent

              border-t-[#6C5CE7]
              border-r-[#B8A1FF]
              border-b-[#EADBC8]

              motion-safe:animate-spin
            "
          />

          {/* SECOND INNER RING */}

          <div
            className="
              absolute
              inset-[10px]

              rounded-full

              border
              border-[#F2B8C6]/45

              motion-safe:animate-[spin_2.8s_linear_infinite_reverse]
            "
          />

          {/* =================================================
              VELMORA MONOGRAM
          ================================================= */}

          <div
            className="
              relative

              flex
              h-[58px]
              w-[58px]
              items-center
              justify-center

              overflow-hidden

              rounded-[20px]

              border
              border-white

              bg-gradient-to-br
              from-[#6C5CE7]
              via-[#917AE9]
              to-[#B8A1FF]

              text-white

              shadow-[0_14px_32px_rgba(108,92,231,0.25)]

              sm:h-[66px]
              sm:w-[66px]
              sm:rounded-[22px]
            "
          >
            {/* Highlight */}

            <div
              className="
                pointer-events-none
                absolute
                -right-3
                -top-3

                h-9
                w-9

                rounded-full

                bg-white/25

                blur-lg
              "
            />

            <span
              className="
                relative

                font-serif
                text-[26px]
                font-semibold
                leading-none

                sm:text-[30px]
              "
            >
              V
            </span>

            {/* Luxury star */}

            <span
              className="
                absolute
                bottom-[7px]
                right-[8px]

                text-[7px]

                text-[#F8E7C4]

                sm:bottom-[8px]
                sm:right-[9px]
                sm:text-[8px]
              "
            >
              ✦
            </span>
          </div>
        </div>

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mt-7">
          <div
            className="
              flex
              items-center
              justify-center
              gap-2.5
            "
          >
            <span
              className="
                h-px
                w-5

                bg-[#EADBC8]

                sm:w-7
              "
            />

            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]

                text-[#6C5CE7]

                sm:text-[11px]
              "
            >
              VELMORA
            </p>

            <span
              className="
                h-px
                w-5

                bg-[#EADBC8]

                sm:w-7
              "
            />
          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <p
            className="
              mt-4

              px-2

              text-sm
              font-extrabold
              leading-6

              text-[#2F3136]

              sm:text-base
            "
          >
            {message}
          </p>

          <p
            className="
              mx-auto
              mt-2

              max-w-[300px]

              text-[11px]
              leading-5

              text-[#8B8490]

              sm:text-xs
              sm:leading-6
            "
          >
            A little moment
            while we prepare
            something beautiful
            for you.
          </p>
        </div>

        {/* =================================================
            ANIMATED DOTS
        ================================================= */}

        <div
          className="
            mt-6

            flex
            items-center
            justify-center
            gap-1.5
          "
          aria-hidden="true"
        >
          <span
            className="
              h-1.5
              w-1.5

              rounded-full

              bg-[#6C5CE7]

              motion-safe:animate-bounce

              [animation-delay:-0.30s]
            "
          />

          <span
            className="
              h-1.5
              w-1.5

              rounded-full

              bg-[#B8A1FF]

              motion-safe:animate-bounce

              [animation-delay:-0.15s]
            "
          />

          <span
            className="
              h-1.5
              w-1.5

              rounded-full

              bg-[#F2B8C6]

              motion-safe:animate-bounce
            "
          />
        </div>

        {/* =================================================
            BRAND MICROCOPY
        ================================================= */}

        <div
          className="
            mt-7

            rounded-full

            border
            border-[#EAE4F0]

            bg-white/65

            px-4
            py-2

            shadow-sm

            backdrop-blur-xl
          "
        >
          <p
            className="
              text-[8px]
              font-bold
              uppercase
              tracking-[0.18em]

              text-[#9A929D]

              sm:text-[9px]
            "
          >
            Beauty · Skincare · Confidence
          </p>
        </div>

        {/* ACCESSIBILITY */}

        <span className="sr-only">
          {message}
        </span>
      </div>
    </div>
  );
}