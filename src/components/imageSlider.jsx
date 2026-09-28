import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function ImageSlider({ images = [] }) {

  const [currentIndex, setCurrentIndex] = useState(0);


  // If product changes, start from first image
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);


  // ================= NO IMAGES =================

  if (!images || images.length === 0) {

    return (
      <div
        className="
          w-full
          min-h-[300px]
          sm:min-h-[350px]

          rounded-2xl

          bg-gray-50

          flex
          flex-col
          items-center
          justify-center

          border
          border-gray-100

          text-gray-400
        "
      >
        <span
          aria-hidden="true"
          className="text-4xl mb-3"
        >
          🖼️
        </span>

        <p className="text-sm font-medium">
          No product images available
        </p>
      </div>
    );

  }


  // ================= PREVIOUS =================

  function previousImage() {

    setCurrentIndex((current) => {

      if (current === 0) {
        return images.length - 1;
      }

      return current - 1;

    });

  }


  // ================= NEXT =================

  function nextImage() {

    setCurrentIndex((current) => {

      if (current === images.length - 1) {
        return 0;
      }

      return current + 1;

    });

  }


  return (

    <div className="w-full">

      {/* ================= MAIN IMAGE ================= */}

      <div
        className="
          relative

          w-full

          aspect-[4/3]

          bg-[#FAFAFA]

          rounded-xl
          sm:rounded-2xl

          overflow-hidden

          flex
          items-center
          justify-center
        "
      >

        <img
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="
            w-full
            h-full

            object-contain
            object-center

            p-2
            sm:p-3
            md:p-4

            transition-all
            duration-300
          "
          onError={(e) => {

            e.currentTarget.onerror = null;

            e.currentTarget.src =
              "/placeholder-product.png";

          }}
        />


        {/* ================= PREVIOUS BUTTON ================= */}

        {images.length > 1 && (

          <button
            type="button"

            onClick={previousImage}

            aria-label="Show previous product image"

            className="
              absolute
              left-2
              sm:left-3

              top-1/2
              -translate-y-1/2

              w-9
              h-9

              sm:w-10
              sm:h-10

              rounded-full

              bg-white/90
              backdrop-blur-sm

              border
              border-gray-200

              shadow-md

              flex
              items-center
              justify-center

              text-gray-700

              transition-all
              duration-200

              hover:bg-white
              hover:text-red-500
              hover:scale-105

              active:scale-95

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >

            <FiChevronLeft
              aria-hidden="true"
              className="
                text-lg
                sm:text-xl
              "
            />

          </button>

        )}


        {/* ================= NEXT BUTTON ================= */}

        {images.length > 1 && (

          <button
            type="button"

            onClick={nextImage}

            aria-label="Show next product image"

            className="
              absolute
              right-2
              sm:right-3

              top-1/2
              -translate-y-1/2

              w-9
              h-9

              sm:w-10
              sm:h-10

              rounded-full

              bg-white/90
              backdrop-blur-sm

              border
              border-gray-200

              shadow-md

              flex
              items-center
              justify-center

              text-gray-700

              transition-all
              duration-200

              hover:bg-white
              hover:text-red-500
              hover:scale-105

              active:scale-95

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >

            <FiChevronRight
              aria-hidden="true"
              className="
                text-lg
                sm:text-xl
              "
            />

          </button>

        )}


        {/* ================= IMAGE NUMBER BADGE ================= */}

        {images.length > 1 && (

          <div
            className="
              absolute
              bottom-3
              right-3

              px-2.5
              py-1

              rounded-full

              bg-black/55
              backdrop-blur-sm

              text-white

              text-[11px]
              font-semibold
            "
            aria-live="polite"
          >
            {currentIndex + 1} / {images.length}
          </div>

        )}

      </div>


      {/* ================= THUMBNAILS ================= */}

      {images.length > 1 && (

        <div
          className="
            mt-4

            flex
            items-center

            gap-2
            sm:gap-3

            overflow-x-auto

            pb-2

            scroll-smooth
          "
          aria-label="Alternative product images"
        >

          {images.map((image, index) => {

            const isActive =
              currentIndex === index;

            return (

              <button
                type="button"

                key={index}

                onClick={() =>
                  setCurrentIndex(index)
                }

                aria-label={`Show product image ${index + 1}`}

                aria-current={
                  isActive
                    ? "true"
                    : undefined
                }

                className={`
                  shrink-0

                  w-[60px]
                  h-[60px]

                  sm:w-[68px]
                  sm:h-[68px]

                  md:w-[72px]
                  md:h-[72px]

                  rounded-xl

                  overflow-hidden

                  bg-[#FAFAFA]

                  border-2

                  transition-all
                  duration-200

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-red-400
                  focus-visible:ring-offset-2

                  ${
                    isActive
                      ? "border-red-500 shadow-md"
                      : "border-gray-200 hover:border-red-300"
                  }
                `}
              >

                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  loading="lazy"

                  className="
                    w-full
                    h-full

                    object-contain

                    p-1
                  "

                  onError={(e) => {

                    e.currentTarget.onerror = null;

                    e.currentTarget.src =
                      "/placeholder-product.png";

                  }}
                />

              </button>

            );

          })}

        </div>

      )}


      {/* ================= MOBILE IMAGE INDICATORS ================= */}

      {images.length > 1 && (

        <div
          className="
            mt-2

            flex
            items-center
            justify-center

            gap-1.5

            sm:hidden
          "
          aria-hidden="true"
        >

          {images.map((_, index) => (

            <span
              key={index}
              className={`
                h-1.5

                rounded-full

                transition-all
                duration-200

                ${
                  currentIndex === index
                    ? "w-5 bg-red-500"
                    : "w-1.5 bg-gray-300"
                }
              `}
            />

          ))}

        </div>

      )}

    </div>

  );

}