import { useState } from "react";

import {
  getCart,
  removeFromCart,
  addToCart,
} from "../../utils/cart";

import {
  Link,
} from "react-router-dom";

import {
  FaTrash,
} from "react-icons/fa";

import {
  BsCart3,
} from "react-icons/bs";

import {
  FiArrowRight,
  FiCheck,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

/*
=========================================================
VELMORA CART PAGE
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
White            #FFFFFF
Charcoal         #2F3136
Slate            #6B7280
Success          #4F9D7A
Error            #D95C5C
=========================================================
*/

export default function CartPage() {
  const [
    cart,
    setCart,
  ] = useState(
    getCart()
  );

  /* =====================================================
     TOTAL
  ===================================================== */

  const cartTotal =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),

      0
    );

  /* =====================================================
     TOTAL ITEMS
  ===================================================== */

  const totalItems =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity || 0
        ),

      0
    );

  /* =====================================================
     ORIGINAL TOTAL
  ===================================================== */

  const originalTotal =
    cart.reduce(
      (
        total,
        item
      ) => {
        const labelPrice =
          Number(
            item.labelPrice ||
              item.price ||
              0
          );

        return (
          total +
          labelPrice *
            Number(
              item.quantity ||
                0
            )
        );
      },

      0
    );

  /* =====================================================
     SAVINGS
  ===================================================== */

  const totalSavings =
    Math.max(
      0,
      originalTotal -
        cartTotal
    );

  /* =====================================================
     DECREASE
  ===================================================== */

  function decreaseQuantity(
    item
  ) {
    addToCart(
      item,
      -1
    );

    setCart(
      getCart()
    );
  }

  /* =====================================================
     INCREASE
  ===================================================== */

  function increaseQuantity(
    item
  ) {
    addToCart(
      item,
      1
    );

    setCart(
      getCart()
    );
  }

  /* =====================================================
     REMOVE
  ===================================================== */

  function handleRemove(
    productId
  ) {
    removeFromCart(
      productId
    );

    setCart(
      getCart()
    );
  }

  /* =====================================================
     PRICE FORMAT
  ===================================================== */

  function formatPrice(
    value
  ) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      }
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main
      className="
        relative

        min-h-screen
        w-full

        overflow-hidden

        bg-[#FAF9F7]

        pb-16
        pt-[92px]

        sm:pb-20

        md:pt-[104px]
      "
    >
      {/* =================================================
          BACKGROUND AMBIENCE
      ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          -left-36
          top-16

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#B8A1FF]/[0.12]

          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -right-40
          top-[500px]

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#F2B8C6]/[0.11]

          blur-[120px]
        "
      />

      {/* =================================================
          CONTAINER
      ================================================= */}

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1220px]

          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section
          className="
            flex
            flex-col
            gap-5

            border-b
            border-[#ECE6F0]

            pb-7

            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:pb-9
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-[#DED4FF]

                bg-[#F7F3FF]

                px-3
                py-1.5

                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]

                text-[#6C5CE7]
              "
            >
              <span
                className="
                  text-[#B9955B]
                "
              >
                ✦
              </span>

              Velmora Bag
            </div>

            <h1
              className="
                mt-4

                text-3xl
                font-extrabold
                tracking-[-0.045em]

                text-[#2F3136]

                sm:text-4xl

                lg:text-[48px]
              "
            >
              Your beauty
              selection.
            </h1>

            <p
              className="
                mt-3

                max-w-[620px]

                text-sm
                leading-7

                text-[#77717C]

                sm:text-base
              "
            >
              Review the
              Velmora
              essentials
              you've selected,
              adjust quantities
              and continue when
              your ritual feels
              complete.
            </p>
          </div>

          {/* ITEM COUNT */}

          {cart.length >
            0 && (
            <div
              className="
                inline-flex
                self-start
                items-center
                gap-2.5

                rounded-2xl

                border
                border-[#E4DDF0]

                bg-white/80

                px-4
                py-3

                text-sm
                font-semibold

                text-[#625C69]

                shadow-sm

                backdrop-blur-xl

                sm:self-auto
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F1ECFF]

                  text-[#6C5CE7]
                "
              >
                <BsCart3 />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    text-[#9C95A0]
                  "
                >
                  Your Bag
                </p>

                <p
                  className="
                    mt-0.5

                    text-sm
                    font-bold

                    text-[#413B46]
                  "
                >
                  {
                    totalItems
                  }{" "}
                  {totalItems ===
                  1
                    ? "item"
                    : "items"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cart.length ===
        0 ? (
          <section
            className="
              relative

              mt-8

              flex
              min-h-[500px]
              flex-col
              items-center
              justify-center

              overflow-hidden

              rounded-[30px]

              border
              border-[#EAE3F2]

              bg-white

              px-5
              py-14

              text-center

              shadow-[0_22px_70px_rgba(59,44,80,0.055)]

              sm:px-8
            "
          >
            {/* GLOW */}

            <div
              className="
                pointer-events-none

                absolute
                -right-24
                -top-24

                h-64
                w-64

                rounded-full

                bg-[#B8A1FF]/[0.14]

                blur-[80px]
              "
            />

            <div
              className="
                pointer-events-none

                absolute
                -bottom-28
                -left-20

                h-64
                w-64

                rounded-full

                bg-[#F2B8C6]/[0.12]

                blur-[80px]
              "
            />

            {/* ICON */}

            <div
              className="
                relative

                flex
                h-20
                w-20
                items-center
                justify-center

                rounded-[24px]

                bg-gradient-to-br
                from-[#F0EBFF]
                to-[#FFF0F4]

                text-3xl
                text-[#6C5CE7]

                shadow-[0_14px_32px_rgba(108,92,231,0.13)]
              "
            >
              <BsCart3 />
            </div>

            <p
              className="
                relative

                mt-6

                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]

                text-[#9A79E8]
              "
            >
              Velmora
              Collection
            </p>

            <h2
              className="
                relative

                mt-2

                text-2xl
                font-extrabold
                tracking-[-0.03em]

                text-[#302B34]

                sm:text-3xl
              "
            >
              Your bag is
              waiting.
            </h2>

            <p
              className="
                relative

                mx-auto
                mt-3

                max-w-[480px]

                text-sm
                leading-7

                text-[#7D7681]

                sm:text-base
              "
            >
              Explore our
              curated beauty
              collection and
              add something
              special to your
              everyday ritual.
            </p>

            <Link
              to="/products"
              className="
                group
                relative

                mt-7

                inline-flex
                min-h-[52px]
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-gradient-to-r
                from-[#6C5CE7]
                to-[#8873E7]

                px-7

                text-sm
                font-bold
                text-white

                shadow-[0_12px_28px_rgba(108,92,231,0.22)]

                transition-all
                duration-300

                hover:-translate-y-1
                hover:shadow-[0_18px_36px_rgba(108,92,231,0.30)]

                active:scale-[0.98]
              "
            >
              Explore
              Collection

              <FiArrowRight
                className="
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              />
            </Link>
          </section>
        ) : (
          /* ===============================================
             CART LAYOUT
          =============================================== */

          <div
            className="
              mt-7

              grid
              grid-cols-1
              items-start
              gap-6

              lg:grid-cols-[minmax(0,1fr)_340px]

              xl:grid-cols-[minmax(0,1fr)_370px]
              xl:gap-8
            "
          >
            {/* =============================================
                CART PRODUCTS
            ============================================= */}

            <section
              aria-label="Velmora shopping bag products"
              className="
                flex
                min-w-0
                flex-col
                gap-4
              "
            >
              {cart.map(
                (item) => {
                  const image =
                    item.image ||
                    item.images?.[0];

                  const itemName =
                    item.name ||
                    item.productName ||
                    "Velmora Product";

                  const hasDiscount =
                    Number(
                      item.labelPrice
                    ) >
                    Number(
                      item.price
                    );

                  const itemTotal =
                    Number(
                      item.price ||
                        0
                    ) *
                    Number(
                      item.quantity ||
                        0
                    );

                  const discountPercentage =
                    hasDiscount &&
                    Number(
                      item.labelPrice
                    ) > 0
                      ? Math.round(
                          ((Number(
                            item.labelPrice
                          ) -
                            Number(
                              item.price
                            )) /
                            Number(
                              item.labelPrice
                            )) *
                            100
                        )
                      : 0;

                  return (
                    <article
                      key={
                        item.productId
                      }
                      className="
                        group

                        relative

                        overflow-hidden

                        rounded-[24px]

                        border
                        border-[#EAE4EF]

                        bg-white

                        p-4

                        shadow-[0_10px_35px_rgba(58,44,77,0.045)]

                        transition-all
                        duration-300

                        hover:border-[#D8CDF4]
                        hover:shadow-[0_18px_48px_rgba(70,52,98,0.075)]

                        sm:p-5
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-[96px_minmax(0,1fr)]
                          gap-4

                          sm:grid-cols-[135px_minmax(0,1fr)]
                          sm:gap-5

                          md:grid-cols-[155px_minmax(0,1fr)]
                        "
                      >
                        {/* =================================
                            IMAGE
                        ================================= */}

                        <Link
                          to={`/overview/${item.productId}`}
                          aria-label={`View ${itemName}`}
                          className="
                            relative

                            aspect-square
                            w-full

                            overflow-hidden

                            rounded-[18px]

                            border
                            border-[#EEE9F4]

                            bg-gradient-to-br
                            from-[#FBF9FF]
                            to-[#FFF5F8]

                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#B8A1FF]
                          "
                        >
                          {image ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                itemName
                              }
                              loading="lazy"
                              className="
                                h-full
                                w-full

                                object-contain

                                p-2

                                transition-transform
                                duration-500

                                group-hover:scale-[1.04]
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center

                                text-2xl
                                text-[#9A83E4]
                              "
                            >
                              <FiPackage />
                            </div>
                          )}

                          {/* BRAND */}

                          <span
                            className="
                              absolute
                              bottom-2
                              left-2

                              rounded-full

                              bg-white/90

                              px-2
                              py-1

                              text-[8px]
                              font-black
                              uppercase
                              tracking-[0.1em]

                              text-[#6C5CE7]

                              shadow-sm

                              backdrop-blur-md
                            "
                          >
                            Velmora
                          </span>

                          {/* DISCOUNT */}

                          {hasDiscount && (
                            <span
                              className="
                                absolute
                                right-2
                                top-2

                                rounded-full

                                bg-[#FFF0F4]

                                px-2
                                py-1

                                text-[8px]
                                font-black

                                text-[#B66178]
                              "
                            >
                              -
                              {
                                discountPercentage
                              }
                              %
                            </span>
                          )}
                        </Link>

                        {/* =================================
                            DETAILS
                        ================================= */}

                        <div
                          className="
                            min-w-0
                          "
                        >
                          {/* NAME + MOBILE REMOVE */}

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            "
                          >
                            <div className="min-w-0">
                              <p
                                className="
                                  text-[8px]
                                  font-black
                                  uppercase
                                  tracking-[0.14em]

                                  text-[#A49DA8]
                                "
                              >
                                Ref.{" "}
                                {
                                  item.productId
                                }
                              </p>

                              <Link
                                to={`/overview/${item.productId}`}
                                className="
                                  block

                                  focus:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-[#B8A1FF]
                                "
                              >
                                <h2
                                  className="
                                    mt-1

                                    break-words

                                    text-base
                                    font-extrabold
                                    leading-6

                                    text-[#38323C]

                                    transition-colors

                                    hover:text-[#6C5CE7]

                                    sm:text-lg
                                  "
                                >
                                  {
                                    itemName
                                  }
                                </h2>
                              </Link>
                            </div>

                            {/* MOBILE DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(
                                  item.productId
                                )
                              }
                              aria-label={`Remove ${itemName} from cart`}
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                border
                                border-[#F0D7DC]

                                bg-[#FFF5F7]

                                text-[#B45462]

                                transition-all

                                hover:bg-[#FCECEF]

                                active:scale-90

                                md:hidden
                              "
                            >
                              <FaTrash
                                size={
                                  13
                                }
                              />
                            </button>
                          </div>

                          {/* PRICE */}

                          <div
                            className="
                              mt-3

                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                text-lg
                                font-extrabold
                                tracking-[-0.02em]

                                text-[#6C5CE7]

                                sm:text-xl
                              "
                            >
                              Rs.{" "}
                              {formatPrice(
                                item.price
                              )}
                            </span>

                            {hasDiscount && (
                              <span
                                className="
                                  text-xs
                                  text-[#A8A1AD]
                                  line-through

                                  sm:text-sm
                                "
                              >
                                Rs.{" "}
                                {formatPrice(
                                  item.labelPrice
                                )}
                              </span>
                            )}
                          </div>

                          {/* =================================
                              BOTTOM CONTROLS
                          ================================= */}

                          <div
                            className="
                              mt-5

                              flex
                              flex-col
                              gap-4

                              sm:flex-row
                              sm:items-end
                              sm:justify-between
                            "
                          >
                            {/* QUANTITY */}

                            <div>
                              <p
                                className="
                                  mb-1.5

                                  text-[10px]
                                  font-semibold

                                  text-[#97909B]
                                "
                              >
                                Quantity
                              </p>

                              <div
                                className="
                                  inline-flex
                                  items-center

                                  overflow-hidden

                                  rounded-xl

                                  border
                                  border-[#E2DCE8]

                                  bg-[#FBFAFC]
                                "
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item
                                    )
                                  }
                                  aria-label={`Decrease quantity of ${itemName}`}
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    text-lg
                                    font-bold
                                    text-[#5D5661]

                                    transition-colors

                                    hover:bg-[#F0EBFF]
                                    hover:text-[#6C5CE7]

                                    active:bg-[#E9E1FF]
                                  "
                                >
                                  −
                                </button>

                                <span
                                  aria-label={`Quantity ${item.quantity}`}
                                  className="
                                    flex
                                    h-10
                                    min-w-[44px]
                                    items-center
                                    justify-center

                                    border-x
                                    border-[#E2DCE8]

                                    bg-white

                                    px-2

                                    text-sm
                                    font-bold
                                    text-[#39343D]
                                  "
                                >
                                  {
                                    item.quantity
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(
                                      item
                                    )
                                  }
                                  aria-label={`Increase quantity of ${itemName}`}
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    text-lg
                                    font-bold
                                    text-[#5D5661]

                                    transition-colors

                                    hover:bg-[#F0EBFF]
                                    hover:text-[#6C5CE7]

                                    active:bg-[#E9E1FF]
                                  "
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* ITEM TOTAL */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-3

                                sm:block
                                sm:text-right
                              "
                            >
                              <span
                                className="
                                  text-[10px]
                                  font-semibold

                                  text-[#9E97A2]
                                "
                              >
                                Item Total
                              </span>

                              <p
                                className="
                                  mt-1

                                  whitespace-nowrap

                                  text-base
                                  font-extrabold

                                  text-[#37323B]

                                  sm:text-lg
                                "
                              >
                                Rs.{" "}
                                {formatPrice(
                                  itemTotal
                                )}
                              </p>
                            </div>

                            {/* DESKTOP REMOVE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(
                                  item.productId
                                )
                              }
                              aria-label={`Remove ${itemName} from cart`}
                              className="
                                hidden
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                border
                                border-[#F0D7DC]

                                bg-white

                                text-[#B45462]

                                transition-all
                                duration-200

                                hover:border-[#E4BBC4]
                                hover:bg-[#FFF2F5]

                                active:scale-90

                                md:flex
                              "
                            >
                              <FaTrash
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}

              {/* =========================================
                  BENEFITS
              ========================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-3
                "
              >
                <BenefitCard
                  icon={
                    <FiStar />
                  }
                  title="Curated"
                  text="Selected beauty essentials."
                />

                <BenefitCard
                  icon={
                    <FiShield />
                  }
                  title="Your Account"
                  text="Continue through signed-in checkout."
                />

                <BenefitCard
                  icon={
                    <FiCheck />
                  }
                  title="Flexible"
                  text="Adjust your bag before ordering."
                />
              </div>
            </section>

            {/* =============================================
                ORDER SUMMARY
            ============================================= */}

            <aside
              aria-label="Order summary"
              className="
                relative

                overflow-hidden

                rounded-[26px]

                border
                border-[#E8E1F0]

                bg-white

                p-5

                shadow-[0_18px_55px_rgba(61,45,84,0.07)]

                sm:p-6

                lg:sticky
                lg:top-[104px]
              "
            >
              {/* GLOW */}

              <div
                className="
                  pointer-events-none

                  absolute
                  -right-20
                  -top-20

                  h-52
                  w-52

                  rounded-full

                  bg-[#B8A1FF]/[0.14]

                  blur-[70px]
                "
              />

              <div className="relative">
                {/* TITLE */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]

                        text-[#9A79E8]
                      "
                    >
                      Your Selection
                    </p>

                    <h2
                      className="
                        mt-1

                        text-xl
                        font-extrabold
                        text-[#302B34]

                        sm:text-2xl
                      "
                    >
                      Bag Summary
                    </h2>
                  </div>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      bg-[#F1ECFF]

                      text-[#6C5CE7]
                    "
                  >
                    <FiShoppingBag />
                  </div>
                </div>

                <p
                  className="
                    mt-2

                    text-sm
                    leading-6
                    text-[#807985]
                  "
                >
                  Review your
                  Velmora bag
                  before
                  continuing to
                  delivery.
                </p>

                {/* DIVIDER */}

                <div
                  className="
                    my-5
                    h-px
                    bg-[#EEE9F2]
                  "
                />

                {/* ITEMS */}

                <SummaryRow
                  label="Items"
                  value={
                    totalItems
                  }
                />

                {/* ORIGINAL TOTAL */}

                {totalSavings >
                  0 && (
                  <div className="mt-3">
                    <SummaryRow
                      label="Original value"
                      value={`Rs. ${formatPrice(
                        originalTotal
                      )}`}
                      muted
                    />
                  </div>
                )}

                {/* SUBTOTAL */}

                <div className="mt-3">
                  <SummaryRow
                    label="Subtotal"
                    value={`Rs. ${formatPrice(
                      cartTotal
                    )}`}
                  />
                </div>

                {/* SAVINGS */}

                {totalSavings >
                  0 && (
                  <div
                    className="
                      mt-5

                      flex
                      items-center
                      justify-between
                      gap-4

                      rounded-2xl

                      border
                      border-[#DDEEE5]

                      bg-[#F1F8F4]

                      px-4
                      py-3
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#438164]
                      "
                    >
                      Your savings
                    </span>

                    <span
                      className="
                        text-sm
                        font-extrabold
                        text-[#438164]
                      "
                    >
                      Rs.{" "}
                      {formatPrice(
                        totalSavings
                      )}
                    </span>
                  </div>
                )}

                {/* TOTAL */}

                <div
                  className="
                    my-5
                    h-px
                    bg-[#EEE9F2]
                  "
                />

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#4B454F]
                      "
                    >
                      Total
                    </p>

                    <p
                      className="
                        mt-1

                        text-[10px]
                        text-[#9A939F]
                      "
                    >
                      Before
                      placing your
                      order
                    </p>
                  </div>

                  <span
                    className="
                      whitespace-nowrap

                      text-2xl
                      font-extrabold
                      tracking-[-0.03em]

                      text-[#6C5CE7]
                    "
                  >
                    Rs.{" "}
                    {formatPrice(
                      cartTotal
                    )}
                  </span>
                </div>

                {/* =========================================
                    CHECKOUT CTA
                ========================================= */}

                <Link
                  to="/checkout"
                  state={{
                    cart:
                      cart,
                  }}
                  className="
                    group

                    mt-6

                    flex
                    min-h-[54px]
                    w-full
                    items-center
                    justify-center
                    gap-2

                    rounded-2xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#8873E7]

                    px-4

                    text-sm
                    font-bold
                    text-white

                    shadow-[0_12px_28px_rgba(108,92,231,0.22)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-[0_18px_36px_rgba(108,92,231,0.30)]

                    active:scale-[0.98]
                  "
                >
                  Continue to
                  Checkout

                  <FiArrowRight
                    className="
                      transition-transform
                      duration-300

                      group-hover:translate-x-1
                    "
                  />
                </Link>

                {/* CONTINUE SHOPPING */}

                <Link
                  to="/products"
                  className="
                    mt-3

                    flex
                    min-h-[48px]
                    w-full
                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-[#E1DAE8]

                    bg-white

                    text-sm
                    font-bold
                    text-[#68616D]

                    transition-all
                    duration-200

                    hover:border-[#CABDF1]
                    hover:bg-[#F8F4FF]
                    hover:text-[#6C5CE7]
                  "
                >
                  Continue
                  Exploring
                </Link>

                {/* =========================================
                    VELMORA NOTE
                ========================================= */}

                <div
                  className="
                    mt-5

                    overflow-hidden

                    rounded-2xl

                    bg-[#302C3C]

                    p-4

                    text-white
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-white/[0.08]

                        text-[#D0C2FF]
                      "
                    >
                      ✦
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                        "
                      >
                        The Velmora
                        Ritual
                      </p>

                      <p
                        className="
                          mt-1

                          text-[11px]
                          leading-5

                          text-white/60
                        "
                      >
                        Review,
                        refine and
                        continue
                        when your
                        beauty
                        selection
                        feels right.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  muted = false,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-sm
          text-[#827B86]
        "
      >
        {label}
      </span>

      <span
        className={`
          whitespace-nowrap

          text-sm
          font-bold

          ${
            muted
              ? "text-[#AAA3AE] line-through"
              : "text-[#403A44]"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   BENEFIT CARD
========================================================= */

function BenefitCard({
  icon,
  title,
  text,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3

        rounded-2xl

        border
        border-[#EAE4F0]

        bg-white/75

        p-4
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-xl

          bg-[#F1ECFF]

          text-[#6C5CE7]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-xs
            font-bold
            text-[#47414B]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1

            text-[11px]
            leading-5

            text-[#918A96]
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}