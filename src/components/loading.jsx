export default function Loading({
  message = "Loading...",
  fullScreen = true,
}) {
  return (
    <div
      className={`
        w-full
        ${fullScreen ? "min-h-screen" : "min-h-[300px]"}
        flex
        items-center
        justify-center
        bg-[#F8F9FA]
        px-4
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        {/* LOADING SPINNER */}
        <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px]">
          {/* Soft outer background */}
          <div
            className="
              absolute
              inset-0
              rounded-full
              border-[5px]
              border-red-100
            "
          />

          {/* Animated spinner */}
          <div
            className="
              absolute
              inset-0
              rounded-full
              border-[5px]
              border-transparent
              border-t-red-500
              border-r-red-400
              motion-safe:animate-spin
            "
          />

          {/* Center dot */}
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                w-3
                h-3
                rounded-full
                bg-red-500
                shadow-sm
                motion-safe:animate-pulse
              "
            />
          </div>
        </div>

        {/* TEXT */}
        <div className="mt-5">
          <p
            className="
              text-sm
              sm:text-base
              font-semibold
              text-[#393E46]
            "
          >
            {message}
          </p>

          <p
            className="
              mt-1
              text-xs
              sm:text-sm
              text-gray-400
            "
          >
            Please wait a moment
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