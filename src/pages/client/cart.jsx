import { useState } from "react";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../../utils/cart";

import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";

export default function CartPage() {

  const [cart, setCart] = useState(getCart());

  // Cart total based on current React state
  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );


  function decreaseQuantity(item) {

    addToCart(item, -1);

    setCart(getCart());

  }


  function increaseQuantity(item) {

    addToCart(item, 1);

    setCart(getCart());

  }


  function handleRemove(productId) {

    removeFromCart(productId);

    setCart(getCart());

  }


  return (

    <main
      className="
        w-full
        min-h-screen

        bg-[#F8F9FA]

        pt-[88px]
        md:pt-[96px]

        pb-10
        sm:pb-14
      "
    >

      {/* ================= PAGE CONTAINER ================= */}

      <div
        className="
          w-full
          max-w-[1200px]

          mx-auto

          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ================= PAGE HEADER ================= */}

        <div
          className="
            mb-6
            sm:mb-8

            flex
            flex-col

            sm:flex-row
            sm:items-end
            sm:justify-between

            gap-3
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold

                uppercase
                tracking-[0.18em]

                text-red-500

                mb-2
              "
            >
              Shopping Cart
            </p>


            <h1
              className="
                text-3xl
                sm:text-4xl

                font-bold

                tracking-tight

                text-[#2F3542]
              "
            >
              Your Cart
            </h1>


            <p
              className="
                mt-2

                text-sm
                sm:text-base

                text-gray-500
              "
            >
              Review your products before checkout.
            </p>

          </div>


          {cart.length > 0 && (

            <div
              className="
                inline-flex
                self-start
                sm:self-auto

                items-center

                gap-2

                px-4
                py-2

                rounded-full

                bg-white

                border
                border-gray-200

                shadow-sm

                text-sm
                text-gray-600
              "
            >

              <BsCart3
                aria-hidden="true"
                className="text-red-500"
              />

              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}

            </div>

          )}

        </div>



        {/* ================= EMPTY CART ================= */}

        {cart.length === 0 ? (

          <section
            className="
              min-h-[420px]

              bg-white

              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-100

              shadow-sm

              px-6
              py-12

              flex
              flex-col
              items-center
              justify-center

              text-center
            "
          >

            <div
              className="
                w-20
                h-20

                rounded-full

                bg-red-50

                flex
                items-center
                justify-center

                mb-5
              "
            >

              <BsCart3
                aria-hidden="true"
                className="
                  text-3xl
                  text-red-500
                "
              />

            </div>


            <h2
              className="
                text-2xl

                font-bold

                text-[#2F3542]
              "
            >
              Your cart is empty
            </h2>


            <p
              className="
                mt-2

                max-w-[420px]

                text-sm
                sm:text-base

                text-gray-500

                leading-relaxed
              "
            >
              Looks like you haven't added any products
              to your cart yet.
            </p>


            <Link
              to="/products"

              className="
                mt-6

                min-h-[48px]

                px-6

                rounded-xl

                bg-red-500
                text-white

                font-semibold

                flex
                items-center
                justify-center

                shadow-sm

                transition-all
                duration-200

                hover:bg-red-600
                hover:shadow-md
                hover:-translate-y-[1px]

                active:scale-[0.98]

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-red-400
                focus-visible:ring-offset-2
              "
            >
              Browse Products
            </Link>

          </section>

        ) : (

          /* ================= CART LAYOUT ================= */

          <div
            className="
              grid

              grid-cols-1

              lg:grid-cols-[minmax(0,1fr)_320px]

              xl:grid-cols-[minmax(0,1fr)_350px]

              gap-6
              lg:gap-8

              items-start
            "
          >

            {/* ================= CART PRODUCTS ================= */}

            <section
              aria-label="Shopping cart products"

              className="
                flex
                flex-col

                gap-4
              "
            >

              {cart.map((item) => (

                <article
                  key={item.productId}

                  className="
                    w-full

                    bg-white

                    rounded-2xl

                    border
                    border-gray-100

                    shadow-sm

                    overflow-hidden

                    transition-all
                    duration-200

                    hover:shadow-md
                    hover:border-gray-200
                  "
                >

                  <div
                    className="
                      grid

                      grid-cols-[100px_minmax(0,1fr)]

                      sm:grid-cols-[130px_minmax(0,1fr)]

                      md:grid-cols-[150px_minmax(0,1fr)]

                      gap-3
                      sm:gap-5

                      p-3
                      sm:p-4
                    "
                  >

                    {/* ================= IMAGE ================= */}

                    <Link
                      to={`/overview/${item.productId}`}

                      aria-label={`View ${item.name}`}
                      className="
                        w-full

                        aspect-square

                        rounded-xl

                        bg-[#FAFAFA]

                        overflow-hidden

                        flex
                        items-center
                        justify-center

                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-400
                      "
                    >

                      <img
                        src={item.image}
                        alt={item.name}

                        loading="lazy"

                        className="
                          w-full
                          h-full

                          object-contain

                          p-2

                          transition-transform
                          duration-300

                          hover:scale-105
                        "
                      />

                    </Link>



                    {/* ================= DETAILS ================= */}

                    <div
                      className="
                        min-w-0

                        flex
                        flex-col
                      "
                    >

                      {/* Name + Remove */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between

                          gap-2
                        "
                      >

                        <div className="min-w-0">

                          <Link
                            to={`/overview/${item.productId}`}

                            className="
                              rounded

                              focus:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-red-400
                            "
                          >

                            <h2
                              className="
                                text-base
                                sm:text-lg

                                font-bold

                                text-[#2F3542]

                                line-clamp-2

                                hover:text-red-500

                                transition-colors
                              "
                            >
                              {item.name}
                            </h2>

                          </Link>


                          <p
                            className="
                              mt-1

                              text-[11px]
                              sm:text-xs

                              text-gray-400
                            "
                          >
                            Product ID: {item.productId}
                          </p>

                        </div>


                        {/* MOBILE DELETE */}

                        <button
                          type="button"

                          onClick={() =>
                            handleRemove(item.productId)
                          }

                          aria-label={`Remove ${item.name} from cart`}

                          className="
                            md:hidden

                            shrink-0

                            w-9
                            h-9

                            rounded-lg

                            flex
                            items-center
                            justify-center

                            bg-red-50
                            text-red-500

                            transition-all

                            hover:bg-red-100

                            active:scale-95

                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-400
                          "
                        >

                          <FaTrash size={14} />

                        </button>

                      </div>



                      {/* ================= PRICE ================= */}

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
                            sm:text-xl

                            font-bold

                            text-red-500
                          "
                        >
                          Rs.{" "}
                          {Number(item.price).toFixed(2)}
                        </span>


                        {Number(item.labelPrice) >
                          Number(item.price) && (

                          <span
                            className="
                              text-xs
                              sm:text-sm

                              text-gray-400

                              line-through
                            "
                          >
                            Rs.{" "}
                            {Number(
                              item.labelPrice
                            ).toFixed(2)}
                          </span>

                        )}

                      </div>



                      {/* ================= BOTTOM CONTROLS ================= */}

                      <div
                        className="
                          mt-auto
                          pt-4

                          flex
                          flex-col

                          sm:flex-row
                          sm:items-center
                          sm:justify-between

                          gap-3
                        "
                      >

                        {/* Quantity */}

                        <div
                          className="
                            inline-flex
                            self-start

                            items-center

                            rounded-xl

                            border
                            border-gray-200

                            overflow-hidden

                            bg-[#FAFAFA]
                          "
                        >

                          <button
                            type="button"

                            onClick={() =>
                              decreaseQuantity(item)
                            }

                            aria-label={`Decrease quantity of ${item.name}`}

                            className="
                              w-10
                              h-10

                              flex
                              items-center
                              justify-center

                              text-lg
                              font-bold

                              text-gray-600

                              transition-colors

                              hover:bg-red-50
                              hover:text-red-500

                              active:bg-red-100

                              focus:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-inset
                              focus-visible:ring-red-400
                            "
                          >
                            −
                          </button>


                          <span
                            className="
                              min-w-[44px]
                              h-10

                              px-2

                              flex
                              items-center
                              justify-center

                              bg-white

                              border-x
                              border-gray-200

                              text-sm
                              font-bold

                              text-[#2F3542]
                            "
                            aria-label={`Quantity ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>


                          <button
                            type="button"

                            onClick={() =>
                              increaseQuantity(item)
                            }

                            aria-label={`Increase quantity of ${item.name}`}

                            className="
                              w-10
                              h-10

                              flex
                              items-center
                              justify-center

                              text-lg
                              font-bold

                              text-gray-600

                              transition-colors

                              hover:bg-red-50
                              hover:text-red-500

                              active:bg-red-100

                              focus:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-inset
                              focus-visible:ring-red-400
                            "
                          >
                            +
                          </button>

                        </div>



                        {/* Item Total */}

                        <div
                          className="
                            flex
                            sm:flex-col

                            items-center
                            sm:items-end

                            justify-between
                            sm:justify-center

                            gap-2
                            sm:gap-0

                            min-w-[120px]
                          "
                        >

                          <span
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Item Total
                          </span>


                          <span
                            className="
                              text-base
                              sm:text-lg

                              font-bold

                              text-[#2F3542]

                              whitespace-nowrap
                            "
                          >
                            Rs.{" "}
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </span>

                        </div>



                        {/* DESKTOP DELETE */}

                        <button
                          type="button"

                          onClick={() =>
                            handleRemove(item.productId)
                          }

                          aria-label={`Remove ${item.name} from cart`}

                          className="
                            hidden
                            md:flex

                            shrink-0

                            w-10
                            h-10

                            items-center
                            justify-center

                            rounded-xl

                            bg-white

                            border
                            border-gray-200

                            text-red-500

                            transition-all
                            duration-200

                            hover:bg-red-50
                            hover:border-red-200
                            hover:text-red-600

                            active:scale-95

                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-400
                            focus-visible:ring-offset-2
                          "
                        >

                          <FaTrash size={15} />

                        </button>

                      </div>

                    </div>

                  </div>

                </article>

              ))}

            </section>



            {/* ================= ORDER SUMMARY ================= */}

            <aside
              aria-label="Order summary"

              className="
                w-full

                lg:sticky
                lg:top-[104px]

                bg-white

                rounded-2xl

                border
                border-gray-100

                shadow-sm

                p-5
                sm:p-6
              "
            >

              <h2
                className="
                  text-xl

                  font-bold

                  text-[#2F3542]
                "
              >
                Order Summary
              </h2>


              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500
                "
              >
                Review your cart total before checkout.
              </p>


              <div
                className="
                  w-full
                  h-px

                  bg-gray-100

                  my-5
                "
              />


              {/* Items */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  gap-4

                  text-sm

                  mb-3
                "
              >

                <span className="text-gray-500">
                  Items
                </span>

                <span
                  className="
                    font-semibold
                    text-[#2F3542]
                  "
                >
                  {totalItems}
                </span>

              </div>


              {/* Subtotal */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  gap-4

                  text-sm
                "
              >

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span
                  className="
                    font-semibold
                    text-[#2F3542]

                    whitespace-nowrap
                  "
                >
                  Rs. {cartTotal.toFixed(2)}
                </span>

              </div>


              <div
                className="
                  w-full
                  h-px

                  bg-gray-100

                  my-5
                "
              />


              {/* Final Total */}

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
                      text-gray-500
                    "
                  >
                    Total
                  </p>

                  <p
                    className="
                      mt-1

                      text-[11px]

                      text-gray-400
                    "
                  >
                    Final amount before payment
                  </p>

                </div>


                <span
                  className="
                    text-2xl

                    font-bold

                    text-red-500

                    whitespace-nowrap
                  "
                >
                  Rs. {cartTotal.toFixed(2)}
                </span>

              </div>


              {/* Checkout */}

              <Link
                to="/checkout"

                state={{
                  cart: cart,
                }}

                className="
                  mt-6

                  w-full
                  min-h-[52px]

                  rounded-xl

                  bg-red-500
                  text-white

                  flex
                  items-center
                  justify-center

                  font-bold

                  shadow-sm

                  transition-all
                  duration-200

                  hover:bg-red-600
                  hover:shadow-md
                  hover:-translate-y-[1px]

                  active:scale-[0.98]

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-red-400
                  focus-visible:ring-offset-2
                "
              >
                Proceed to Checkout
              </Link>


              {/* Continue Shopping */}

              <Link
                to="/products"

                className="
                  mt-3

                  w-full
                  min-h-[46px]

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  border
                  border-gray-200

                  bg-white

                  text-sm
                  font-semibold

                  text-gray-600

                  transition-all

                  hover:bg-gray-50
                  hover:text-[#2F3542]

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-gray-400
                "
              >
                Continue Shopping
              </Link>

            </aside>

          </div>

        )}

      </div>

    </main>

  );

}