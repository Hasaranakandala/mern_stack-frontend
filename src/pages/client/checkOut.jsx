import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckOut() {

  const location = useLocation();

  const [cart, setCart] = useState(
    location.state?.cart || []
  );

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);


  // ================= TOTAL =================

  function getTotal() {

    let total = 0;

    cart.forEach((item) => {

      total +=
        Number(item.price) *
        Number(item.quantity);

    });

    return total;

  }


  // ================= REMOVE =================

  function removeFromCart(index) {

    const newCart = cart.filter(
      (item, i) => i !== index
    );

    setCart(newCart);

  }


  // ================= QUANTITY =================

  function changeQuantity(index, quantity) {

    const newQuantity =
      cart[index].quantity + quantity;

    if (newQuantity <= 0) {

      removeFromCart(index);

      return;

    }

    const newCart = [...cart];

    newCart[index] = {
      ...newCart[index],
      quantity: newQuantity,
    };

    setCart(newCart);

  }


  // ================= PLACE ORDER =================

  async function placeOrder() {

    const token =
      localStorage.getItem("token");


    if (!token) {

      toast.error(
        "Please login to place order"
      );

      return;

    }


    if (cart.length === 0) {

      toast.error(
        "Your cart is empty"
      );

      return;

    }


    if (!phoneNumber.trim()) {

      toast.error(
        "Please enter your phone number"
      );

      return;

    }


    if (!address.trim()) {

      toast.error(
        "Please enter your delivery address"
      );

      return;

    }


    const orderInformation = {

      products: [],

      phone: phoneNumber,

      address: address,

    };


    for (
      let i = 0;
      i < cart.length;
      i++
    ) {

      const item = {

        productId:
          cart[i].productId,

        quantity:
          cart[i].quantity,

        productInfo: {

          name:
            cart[i].name,

        },

      };


      orderInformation.products[i] =
        item;

    }


    try {

      setIsPlacingOrder(true);


      await axios.post(

        import.meta.env.VITE_BACKEND_URL +
          "/api/order",

        orderInformation,

        {

          headers: {

            Authorization:
              "Bearer " + token,

          },

        }

      );


      toast.success(
        "Order placed successfully!"
      );


    } catch (err) {

      console.log(
        "BACKEND ERROR:",
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );


      toast.error(

        err.response?.data
          ?.errorMessage ||

        err.response?.data
          ?.message ||

        "Failed to place order"

      );

    } finally {

      setIsPlacingOrder(false);

    }

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
          "
        >

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
            Checkout
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
            Complete Your Order
          </h1>


          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-500
            "
          >
            Review your products and enter your
            delivery information.
          </p>

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

              flex
              flex-col
              items-center
              justify-center

              text-center

              px-6
              py-12
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
              Your checkout is empty
            </h2>


            <p
              className="
                mt-2

                max-w-[420px]

                text-sm
                sm:text-base

                text-gray-500
              "
            >
              Add some products before
              continuing to checkout.
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

                flex
                items-center
                justify-center

                font-semibold

                transition-all
                duration-200

                hover:bg-red-600
                hover:shadow-md

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

          /* ================= MAIN CHECKOUT GRID ================= */

          <div
            className="
              grid

              grid-cols-1

              lg:grid-cols-[minmax(0,1fr)_360px]

              xl:grid-cols-[minmax(0,1fr)_380px]

              gap-6
              lg:gap-8

              items-start
            "
          >

            {/* ================= LEFT PRODUCTS ================= */}

            <section
              aria-labelledby="checkout-products"
              className="
                w-full
                min-w-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between

                  gap-4

                  mb-4
                "
              >

                <h2
                  id="checkout-products"

                  className="
                    text-xl
                    sm:text-2xl

                    font-bold

                    text-[#2F3542]
                  "
                >
                  Your Products
                </h2>


                <span
                  className="
                    px-3
                    py-1.5

                    rounded-full

                    bg-white

                    border
                    border-gray-200

                    text-xs
                    sm:text-sm

                    text-gray-500
                  "
                >
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "Product"
                    : "Products"}
                </span>

              </div>


              <div
                className="
                  flex
                  flex-col

                  gap-4
                "
              >

                {cart.map(
                  (item, index) => (

                    <article
                      key={`${item.productId}-${index}`}

                      className="
                        relative

                        w-full

                        bg-white

                        rounded-2xl

                        border
                        border-gray-100

                        shadow-sm

                        p-3
                        sm:p-4

                        transition-all
                        duration-200

                        hover:shadow-md
                      "
                    >

                      <div
                        className="
                          grid

                          grid-cols-[90px_minmax(0,1fr)]

                          sm:grid-cols-[120px_minmax(0,1fr)]

                          md:grid-cols-[135px_minmax(0,1fr)]

                          gap-3
                          sm:gap-4
                        "
                      >

                        {/* PRODUCT IMAGE */}

                        <div
                          className="
                            w-full

                            aspect-square

                            rounded-xl

                            bg-[#FAFAFA]

                            overflow-hidden

                            flex
                            items-center
                            justify-center
                          "
                        >

                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }

                            className="
                              w-full
                              h-full

                              object-contain

                              p-2
                            "
                          />

                        </div>


                        {/* PRODUCT CONTENT */}

                        <div
                          className="
                            min-w-0

                            flex
                            flex-col

                            pr-8
                            sm:pr-10
                          "
                        >

                          <h3
                            className="
                              text-base
                              sm:text-lg

                              font-bold

                              text-[#2F3542]

                              line-clamp-2
                            "
                          >
                            {item.name}
                          </h3>


                          <p
                            className="
                              mt-1

                              text-[11px]
                              sm:text-xs

                              text-gray-400
                            "
                          >
                            PID: {item.productId}
                          </p>


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
                                text-base
                                sm:text-lg

                                font-bold

                                text-red-500
                              "
                            >
                              Rs.{" "}
                              {Number(
                                item.price
                              ).toFixed(2)}
                            </span>


                            {Number(
                              item.labelPrice
                            ) >
                              Number(
                                item.price
                              ) && (

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


                          {/* QUANTITY + ITEM TOTAL */}

                          <div
                            className="
                              mt-4

                              flex
                              flex-col

                              sm:flex-row
                              sm:items-end
                              sm:justify-between

                              gap-3
                            "
                          >

                            {/* QUANTITY */}

                            <div>

                              <p
                                className="
                                  text-[11px]

                                  text-gray-400

                                  mb-1.5
                                "
                              >
                                Quantity
                              </p>


                              <div
                                className="
                                  inline-flex

                                  items-center

                                  rounded-xl

                                  overflow-hidden

                                  border
                                  border-gray-200

                                  bg-[#FAFAFA]
                                "
                              >

                                <button
                                  type="button"

                                  onClick={() =>
                                    changeQuantity(
                                      index,
                                      -1
                                    )
                                  }

                                  aria-label={`Decrease quantity of ${item.name}`}

                                  className="
                                    w-9
                                    h-9

                                    flex
                                    items-center
                                    justify-center

                                    text-lg
                                    font-bold

                                    text-gray-600

                                    transition-colors

                                    hover:bg-red-50
                                    hover:text-red-500

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
                                    min-w-[42px]
                                    h-9

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
                                >
                                  {item.quantity}
                                </span>


                                <button
                                  type="button"

                                  onClick={() =>
                                    changeQuantity(
                                      index,
                                      1
                                    )
                                  }

                                  aria-label={`Increase quantity of ${item.name}`}

                                  className="
                                    w-9
                                    h-9

                                    flex
                                    items-center
                                    justify-center

                                    text-lg
                                    font-bold

                                    text-gray-600

                                    transition-colors

                                    hover:bg-red-50
                                    hover:text-red-500

                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-inset
                                    focus-visible:ring-red-400
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
                                sm:flex-col

                                items-center
                                sm:items-end

                                justify-between

                                gap-2
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
                                  Number(
                                    item.price
                                  ) *
                                  Number(
                                    item.quantity
                                  )
                                ).toFixed(2)}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* DELETE BUTTON INSIDE CARD */}

                      <button
                        type="button"

                        onClick={() =>
                          removeFromCart(index)
                        }

                        aria-label={`Remove ${item.name} from checkout`}

                        className="
                          absolute

                          top-3
                          right-3

                          w-9
                          h-9

                          sm:w-10
                          sm:h-10

                          rounded-xl

                          flex
                          items-center
                          justify-center

                          bg-red-50

                          border
                          border-red-100

                          text-red-500

                          transition-all
                          duration-200

                          hover:bg-red-100
                          hover:text-red-600

                          active:scale-95

                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-red-400
                        "
                      >

                        <FaTrash size={14} />

                      </button>

                    </article>

                  )
                )}

              </div>

            </section>



            {/* ================= ORDER SUMMARY ================= */}

            <aside
              aria-labelledby="order-summary-heading"

              className="
                w-full

                lg:sticky
                lg:top-[100px]

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
                id="order-summary-heading"

                className="
                  text-xl
                  sm:text-2xl

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
                Confirm your delivery details
                and place your order.
              </p>


              {/* TOTAL */}

              <div
                className="
                  mt-5

                  flex
                  items-center
                  justify-between

                  gap-4

                  bg-[#F8F9FA]

                  rounded-xl

                  px-4
                  py-4
                "
              >

                <span
                  className="
                    text-sm

                    font-medium

                    text-gray-500
                  "
                >
                  Total
                </span>


                <span
                  className="
                    text-xl

                    font-bold

                    text-red-500

                    whitespace-nowrap
                  "
                >
                  Rs.{" "}
                  {getTotal().toFixed(2)}
                </span>

              </div>



              {/* FORM */}

              <div
                className="
                  mt-6

                  space-y-5
                "
              >

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="checkout-phone"

                    className="
                      block

                      text-sm

                      font-semibold

                      text-[#2F3542]

                      mb-2
                    "
                  >
                    Phone Number
                  </label>


                  <input
                    id="checkout-phone"

                    type="tel"

                    inputMode="tel"

                    autoComplete="tel"

                    placeholder="Enter phone number"

                    value={phoneNumber}

                    onChange={(e) => {
                      setPhoneNumber(
                        e.target.value
                      );
                    }}

                    className="
                      w-full
                      min-h-[50px]

                      px-4

                      rounded-xl

                      bg-white

                      border
                      border-gray-200

                      text-sm
                      text-gray-800

                      placeholder:text-gray-400

                      outline-none

                      transition-all
                      duration-200

                      hover:border-gray-300

                      focus:border-red-400
                      focus:ring-4
                      focus:ring-red-100
                    "
                  />

                </div>


                {/* ADDRESS */}

                <div>

                  <label
                    htmlFor="checkout-address"

                    className="
                      block

                      text-sm

                      font-semibold

                      text-[#2F3542]

                      mb-2
                    "
                  >
                    Delivery Address
                  </label>


                  <textarea
                    id="checkout-address"

                    autoComplete="street-address"

                    placeholder="Enter your delivery address"

                    value={address}

                    onChange={(e) => {
                      setAddress(
                        e.target.value
                      );
                    }}

                    rows={4}

                    className="
                      w-full

                      min-h-[110px]

                      px-4
                      py-3

                      rounded-xl

                      bg-white

                      border
                      border-gray-200

                      text-sm
                      text-gray-800

                      placeholder:text-gray-400

                      resize-none

                      outline-none

                      transition-all
                      duration-200

                      hover:border-gray-300

                      focus:border-red-400
                      focus:ring-4
                      focus:ring-red-100
                    "
                  />

                </div>

              </div>



              {/* PLACE ORDER */}

              <button
                type="button"

                onClick={placeOrder}

                disabled={
                  isPlacingOrder ||
                  cart.length === 0
                }

                className="
                  mt-6

                  w-full
                  min-h-[52px]

                  px-4

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

                  disabled:bg-gray-300
                  disabled:text-gray-500
                  disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                "
              >

                {isPlacingOrder
                  ? "Placing Order..."
                  : "Place Order"}

              </button>


              <Link
                to="/products"

                className="
                  mt-3

                  w-full
                  min-h-[46px]

                  rounded-xl

                  border
                  border-gray-200

                  flex
                  items-center
                  justify-center

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