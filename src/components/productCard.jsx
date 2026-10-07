import {
  Link,
  useNavigate,
} from "react-router-dom";

import { BsCart3 } from "react-icons/bs";

/*
=========================================================
VELMORA PRODUCT CARD

Brand Palette
---------------------------------------------------------
Primary Violet    #6C5CE7
Soft Lavender     #B8A1FF
Soft Rose         #F2B8C6
Champagne         #EADBC8
Warm Ivory        #FAF9F7
Charcoal          #2F3136
Secondary Text    #6B7280
Success           #4F9D7A
=========================================================
*/

export default function ProductCard({
  product,
}) {
  const navigate =
    useNavigate();

  /* =====================================================
     PRODUCT STATE
  ===================================================== */

  const hasDiscount =
    Number(
      product.labelPrice
    ) >
    Number(
      product.price
    );

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((Number(
            product.labelPrice
          ) -
            Number(
              product.price
            )) /
            Number(
              product.labelPrice
            )) *
            100
        )
      : 0;

  const imageUrl =
    product.images &&
    product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.png";

  const isAvailable =
    Boolean(
      product.isAvailable
    ) &&
    Number(
      product.stock
    ) > 0;

  /* =====================================================
     ADD TO CART
  ===================================================== */

  function handleAddToCart() {
    if (!isAvailable) {
      return;
    }

    console.log(
      "Add to cart:",
      product
    );

    /*
      Add your existing cart logic here.

      Example:

      addToCart(product, 1);
      toast.success(
        `${product.productName} added to your Velmora bag`
      );
    */
  }

  /* =====================================================
     BUY NOW
  ===================================================== */

  function handleBuyNow() {
    navigate(
      "/overview/" +
        product.productId
    );
  }

  return (
    <article
      className="
        group
        relative

        flex
        h-full
        w-full
        min-w-0
        flex-col

        overflow-hidden

        rounded-[22px]
        border
        border-[#ECE6F3]

        bg-white

        shadow-[0_8px_28px_rgba(57,46,76,0.055)]

        transition-all
        duration-500

        hover:-translate-y-1.5
        hover:border-[#D9CEFA]
        hover:shadow-[0_22px_55px_rgba(108,92,231,0.12)]

        focus-within:ring-2
        focus-within:ring-[#B8A1FF]
        focus-within:ring-offset-2

        sm:rounded-[26px]

        lg:rounded-[28px]
      "
    >
      {/* ===================================================
          TOP LUXURY ACCENT
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          z-20
          h-[2px]

          bg-gradient-to-r
          from-transparent
          via-[#B8A1FF]
          to-transparent

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* ===================================================
          IMAGE SECTION
      =================================================== */}

      <div
        className="
          relative

          flex
          h-[205px]
          w-full
          items-center
          justify-center

          overflow-hidden

          bg-gradient-to-br
          from-[#FBFAFD]
          via-[#F8F5FF]
          to-[#FFF7FA]

          sm:h-[230px]

          lg:h-[245px]
      "
      >
        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2

            h-[160px]
            w-[160px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-[#B8A1FF]/15

            blur-[50px]

            transition-all
            duration-700

            group-hover:scale-125
            group-hover:bg-[#B8A1FF]/20

            sm:h-[200px]
            sm:w-[200px]
          "
        />

        {/* Rose glow */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -right-14

            h-36
            w-36

            rounded-full

            bg-[#F2B8C6]/15

            blur-3xl
          "
        />

        {/* ================= PRODUCT IMAGE ================= */}

        <Link
          to={
            "/overview/" +
            product.productId
          }
          aria-label={`View ${product.productName}`}
          className="
            relative
            z-10

            flex
            h-full
            w-full
            items-center
            justify-center

            focus:outline-none
          "
        >
          <img
            src={imageUrl}
            alt={
              product.productName ||
              "Velmora beauty product"
            }
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror =
                null;

              e.currentTarget.src =
                "/placeholder-product.png";
            }}
            className="
              h-full
              w-full

              object-contain

              p-4

              transition-all
              duration-700
              ease-out

              group-hover:scale-[1.06]

              sm:p-5

              lg:p-6
            "
          />
        </Link>

        {/* =================================================
            VELMORA BADGE
        ================================================= */}

        <span
          className="
            absolute
            bottom-3
            left-3
            z-20

            inline-flex
            items-center
            gap-1.5

            rounded-full

            border
            border-white/80

            bg-white/75

            px-2.5
            py-1.5

            text-[9px]
            font-black
            uppercase
            tracking-[0.15em]

            text-[#6C5CE7]

            shadow-sm

            backdrop-blur-xl

            sm:text-[10px]
          "
        >
          <span
            className="
              text-[#B9955B]
            "
          >
            ✦
          </span>

          Velmora Edit
        </span>

        {/* =================================================
            DISCOUNT BADGE
        ================================================= */}

        {hasDiscount &&
          isAvailable && (
            <span
              className="
                absolute
                left-3
                top-3
                z-30

                rounded-full

                border
                border-[#F3D6DE]

                bg-[#FFF1F5]/95

                px-2.5
                py-1.5

                text-[10px]
                font-black

                text-[#B85F7B]

                shadow-sm

                backdrop-blur-md

                sm:text-[11px]
              "
            >
              Save{" "}
              {
                discountPercentage
              }
              %
            </span>
          )}

        {/* =================================================
            IN STOCK
        ================================================= */}

        {isAvailable && (
          <span
            className="
              absolute
              right-3
              top-3
              z-30

              flex
              items-center
              gap-1.5

              rounded-full

              border
              border-[#DCEDE4]

              bg-white/90

              px-2.5
              py-1.5

              text-[9px]
              font-bold

              text-[#3E7D60]

              shadow-sm

              backdrop-blur-xl

              sm:text-[10px]
            "
          >
            <span
              className="
                h-1.5
                w-1.5

                rounded-full

                bg-[#4F9D7A]

                shadow-[0_0_0_3px_rgba(79,157,122,0.12)]
              "
            />

            Available
          </span>
        )}

        {/* =================================================
            OUT OF STOCK OVERLAY
        ================================================= */}

        {!isAvailable && (
          <div
            className="
              absolute
              inset-0
              z-40

              flex
              items-center
              justify-center

              bg-[#FAF9F7]/75

              backdrop-blur-[3px]
            "
          >
            <div
              className="
                rounded-2xl

                border
                border-white

                bg-[#2F3136]/95

                px-5
                py-3

                text-center

                text-xs
                font-bold

                text-white

                shadow-xl

                sm:text-sm
              "
            >
              <p>
                Currently
                Unavailable
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  text-white/60

                  sm:text-[10px]
                "
              >
                Explore other
                Velmora
                selections
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          PRODUCT INFORMATION
      =================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col

          p-4

          sm:p-5

          lg:p-[22px]
        "
      >
        {/* ================= BRAND EYEBROW ================= */}

        <div
          className="
            mb-2
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]

              text-[#9A79E8]

              sm:text-[10px]
            "
          >
            Velmora
            Beauty
          </p>

          {product.stock != null &&
            isAvailable && (
              <span
                className="
                  text-[9px]
                  font-medium
                  text-[#AAA4AE]

                  sm:text-[10px]
                "
              >
                {
                  product.stock
                }{" "}
                left
              </span>
            )}
        </div>

        {/* =================================================
            PRODUCT NAME
        ================================================= */}

        <Link
          to={
            "/overview/" +
            product.productId
          }
          className="
            rounded-lg

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#B8A1FF]
          "
        >
          <h2
            className="
              min-h-[42px]

              line-clamp-2

              text-[15px]
              font-extrabold

              leading-[1.35]
              tracking-[-0.015em]

              text-[#2F3136]

              transition-colors
              duration-300

              group-hover:text-[#6C5CE7]

              sm:min-h-[48px]
              sm:text-lg
            "
          >
            {
              product.productName
            }
          </h2>
        </Link>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div
          className="
            mt-2
            min-h-[44px]

            sm:min-h-[48px]
          "
        >
          {product.description ? (
            <p
              className="
                line-clamp-2

                text-[11px]
                leading-[1.7]

                text-[#79727E]

                sm:text-[13px]
              "
            >
              {
                product.description
              }
            </p>
          ) : (
            <p
              className="
                line-clamp-2

                text-[11px]
                leading-[1.7]

                text-[#9D96A1]

                sm:text-[13px]
              "
            >
              A thoughtfully
              selected Velmora
              beauty essential
              for your everyday
              ritual.
            </p>
          )}
        </div>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div
          className="
            my-4
            h-px
            w-full

            bg-gradient-to-r
            from-transparent
            via-[#E9E3EF]
            to-transparent
          "
        />

        {/* =================================================
            PRICE
        ================================================= */}

        <div
          className="
            flex
            min-h-[40px]
            flex-wrap
            items-end
            gap-x-2.5
            gap-y-1
          "
        >
          <span
            className="
              text-xl
              font-extrabold

              tracking-[-0.025em]

              text-[#6C5CE7]

              sm:text-[22px]
            "
          >
            Rs.{" "}
            {Number(
              product.price
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits:
                  2,
                maximumFractionDigits:
                  2,
              }
            )}
          </span>

          {hasDiscount && (
            <span
              className="
                pb-[2px]

                text-[11px]

                text-[#A9A2AE]

                line-through

                sm:text-xs
              "
            >
              Rs.{" "}
              {Number(
                product.labelPrice
              ).toLocaleString(
                undefined,
                {
                  minimumFractionDigits:
                    2,
                  maximumFractionDigits:
                    2,
                }
              )}
            </span>
          )}
        </div>

        {/* Discount message */}

        {hasDiscount &&
          isAvailable && (
            <p
              className="
                mt-1.5

                text-[10px]
                font-semibold

                text-[#B86882]
              "
            >
              A little luxury
              for less.
            </p>
          )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            mt-auto
            grid
            grid-cols-1
            gap-2.5
            pt-5

            min-[430px]:grid-cols-2
          "
        >
          {/* ADD TO CART */}

          <button
            type="button"
            disabled={
              !isAvailable
            }
            onClick={
              handleAddToCart
            }
            aria-label={`Add ${product.productName} to cart`}
            className="
              flex
              min-h-[48px]
              w-full
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-gradient-to-r
              from-[#6C5CE7]
              to-[#8E7AF0]

              px-3

              text-xs
              font-bold

              text-white

              shadow-[0_9px_22px_rgba(108,92,231,0.20)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_13px_28px_rgba(108,92,231,0.28)]

              active:scale-[0.98]

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B8A1FF]
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:bg-none
              disabled:bg-[#DDD9E4]
              disabled:text-[#9C97A2]
              disabled:shadow-none
              disabled:hover:translate-y-0

              sm:text-sm
            "
          >
            <BsCart3
              className="
                text-base
              "
              aria-hidden="true"
            />

            {isAvailable
              ? "Add to Bag"
              : "Unavailable"}
          </button>

          {/* BUY NOW */}

          {isAvailable && (
            <button
              type="button"
              onClick={
                handleBuyNow
              }
              aria-label={`View ${product.productName}`}
              className="
                min-h-[48px]
                w-full

                rounded-xl

                border
                border-[#DCD5E6]

                bg-[#2F3136]

                px-3

                text-xs
                font-bold

                text-white

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#24262B]
                hover:shadow-lg

                active:scale-[0.98]

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#716B76]
                focus-visible:ring-offset-2

                sm:text-sm
              "
            >
              View Product
            </button>
          )}
        </div>

        {/* =================================================
            LUXURY MICROCOPY
        ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <span
            className="
              h-px
              w-5

              bg-[#EADBC8]
            "
          />

          <p
            className="
              text-center

              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]

              text-[#A49CA7]

              sm:text-[9px]
            "
          >
            Selected by
            Velmora
          </p>

          <span
            className="
              h-px
              w-5

              bg-[#EADBC8]
            "
          />
        </div>
      </div>
    </article>
  );
}