import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import {
  loadStripe,
} from "@stripe/stripe-js";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  FaTrash,
} from "react-icons/fa";

import {
  BsCart3,
} from "react-icons/bs";

import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShield,
  FiTruck,
} from "react-icons/fi";

import {
  clearCart,
} from "../../utils/cart.js";

/*
=========================================================
VELMORA CHECKOUT

Primary Violet   #6C5CE7
Lavender         #B8A1FF
Rose             #F2B8C6
Champagne        #EADBC8
Ivory            #FAF9F7
Charcoal         #2F3136
=========================================================
*/

const stripeKey =
  import.meta.env
    .VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise =
  stripeKey
    ? loadStripe(
        stripeKey
      )
    : null;

export default function CheckOut() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    cart,
    setCart,
  ] = useState(
    Array.isArray(
      location.state?.cart
    )
      ? location.state.cart
      : []
  );

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    "cash_on_delivery"
  );

  const [
    clientSecret,
    setClientSecret,
  ] = useState("");

  const [
    loadingCard,
    setLoadingCard,
  ] = useState(false);

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] = useState(false);

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    useMemo(() => {
      return cart.reduce(
        (
          sum,
          item
        ) =>
          sum +
          Number(
            item.price ||
              0
          ) *
            Number(
              item.quantity ||
                0
            ),
        0
      );
    }, [cart]);

  /* =====================================================
     CART SIGNATURE
  ===================================================== */

  const cartSignature =
    useMemo(
      () =>
        JSON.stringify(
          cart.map(
            (item) => ({
              productId:
                item.productId,

              quantity:
                item.quantity,
            })
          )
        ),
      [cart]
    );

  /* =====================================================
     CREATE CARD PAYMENT INTENT
  ===================================================== */

  useEffect(() => {
    if (
      paymentMethod !==
        "card" ||
      cart.length === 0
    ) {
      return;
    }

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      return;
    }

    if (!stripeKey) {
      return;
    }

    let active = true;

    async function createIntent() {
      try {
        setLoadingCard(
          true
        );

        setClientSecret(
          ""
        );

        const response =
          await axios.post(
            `${
              import.meta.env
                .VITE_BACKEND_URL
            }/api/payment/create-intent`,

            {
              products:
                cart.map(
                  (
                    item
                  ) => ({
                    productId:
                      item.productId,

                    quantity:
                      Number(
                        item.quantity
                      ),
                  })
                ),
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          active &&
          response.data
            ?.clientSecret
        ) {
          setClientSecret(
            response.data
              .clientSecret
          );
        }
      } catch (error) {
        console.error(
          "CREATE PAYMENT INTENT ERROR:",
          error
        );

        if (active) {
          toast.error(
            error.response
              ?.data
              ?.message ||
              "Unable to prepare card payment"
          );
        }
      } finally {
        if (active) {
          setLoadingCard(
            false
          );
        }
      }
    }

    createIntent();

    return () => {
      active = false;
    };
  }, [
    paymentMethod,
    cartSignature,
  ]);

  /* =====================================================
     FORMAT PRICE
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
     REMOVE
  ===================================================== */

  function removeProduct(
    index
  ) {
    if (
      isPlacingOrder
    ) {
      return;
    }

    setCart(
      (previous) =>
        previous.filter(
          (
            _,
            itemIndex
          ) =>
            itemIndex !==
            index
        )
    );
  }

  /* =====================================================
     QUANTITY
  ===================================================== */

  function changeQuantity(
    index,
    change
  ) {
    if (
      isPlacingOrder
    ) {
      return;
    }

    const quantity =
      Number(
        cart[index]
          ?.quantity ||
          0
      ) + change;

    if (
      quantity <= 0
    ) {
      removeProduct(
        index
      );

      return;
    }

    setCart(
      (previous) =>
        previous.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex ===
            index
              ? {
                  ...item,
                  quantity,
                }
              : item
        )
    );
  }

  /* =====================================================
     VALIDATE DELIVERY
  ===================================================== */

  function validateOrder() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in to continue"
      );

      navigate(
        "/login"
      );

      return false;
    }

    if (
      cart.length === 0
    ) {
      toast.error(
        "Your Velmora bag is empty"
      );

      return false;
    }

    if (
      !phoneNumber.trim()
    ) {
      toast.error(
        "Please enter your phone number"
      );

      return false;
    }

    if (
      !address.trim()
    ) {
      toast.error(
        "Please enter your delivery address"
      );

      return false;
    }

    return true;
  }

  /* =====================================================
     CREATE ORDER
  ===================================================== */

  async function submitOrder({
    method,
    paymentReference = "",
  }) {
    if (
      !validateOrder()
    ) {
      return false;
    }

    const token =
      localStorage.getItem(
        "token"
      );

    const orderInformation =
      {
        products:
          cart.map(
            (item) => ({
              productId:
                item.productId,

              quantity:
                Number(
                  item.quantity
                ),

              productInfo: {
                name:
                  item.name ||
                  item.productName ||
                  "Velmora Product",
              },
            })
          ),

        phone:
          phoneNumber.trim(),

        address:
          address.trim(),

        paymentMethod:
          method,

        paymentReference:
          paymentReference,
      };

    try {
      setIsPlacingOrder(
        true
      );

      await axios.post(
        `${
          import.meta.env
            .VITE_BACKEND_URL
        }/api/order`,

        orderInformation,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      clearCart();

      setCart([]);

      toast.success(
        method ===
          "card"
          ? "Payment successful. Your Velmora order has been placed."
          : "Your Velmora order has been placed."
      );

      navigate(
        "/orders",
        {
          replace: true,
        }
      );

      return true;
    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          error.response
            ?.data
            ?.errorMessage ||
          "Unable to place your order"
      );

      return false;
    } finally {
      setIsPlacingOrder(
        false
      );
    }
  }

  /* =====================================================
     CASH ON DELIVERY
  ===================================================== */

  async function placeCashOrder() {
    await submitOrder({
      method:
        "cash_on_delivery",
    });
  }

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    cart.length === 0
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FAF9F7]

          px-4
          pb-16
          pt-[100px]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[520px]
            max-w-[900px]
            flex-col
            items-center
            justify-center

            rounded-[32px]

            border
            border-[#E9E2F0]

            bg-white

            px-6

            text-center

            shadow-[0_24px_70px_rgba(61,45,84,0.06)]
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center

              rounded-[24px]

              bg-[#F1ECFF]

              text-3xl
              text-[#6C5CE7]
            "
          >
            <BsCart3 />
          </div>

          <p
            className="
              mt-6

              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]

              text-[#9A79E8]
            "
          >
            Velmora Bag
          </p>

          <h1
            className="
              mt-2

              text-3xl
              font-extrabold
              text-[#2F3136]
            "
          >
            Your bag is empty.
          </h1>

          <p
            className="
              mt-3

              max-w-md

              text-sm
              leading-7
              text-[#7B7580]
            "
          >
            Discover
            something special
            for your next
            Velmora beauty
            ritual.
          </p>

          <Link
            to="/products"
            className="
              mt-7

              rounded-2xl

              bg-[#6C5CE7]

              px-7
              py-4

              text-sm
              font-bold
              text-white
            "
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative

        min-h-screen

        overflow-hidden

        bg-[#FAF9F7]

        pb-16
        pt-[92px]

        sm:pb-20

        md:pt-[104px]
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          pointer-events-none

          absolute
          -left-40
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

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-[1250px]

          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* BACK */}

        <Link
          to="/cart"
          className="
            inline-flex
            min-h-[42px]
            items-center
            gap-2

            text-sm
            font-semibold
            text-[#77717C]

            hover:text-[#6C5CE7]
          "
        >
          <FiArrowLeft />

          Back to bag
        </Link>

        {/* HEADER */}

        <section
          className="
            mt-3

            border-b
            border-[#ECE6F0]

            pb-8
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
            ✦ Velmora
            Checkout
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
            Complete your
            beauty ritual.
          </h1>

          <p
            className="
              mt-3

              max-w-[680px]

              text-sm
              leading-7

              text-[#77717C]

              sm:text-base
            "
          >
            Review your
            selections, enter
            your delivery
            information and
            choose how you'd
            like to pay.
          </p>
        </section>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="
            mt-7

            grid
            grid-cols-1
            gap-6

            lg:grid-cols-[minmax(0,1fr)_400px]

            xl:gap-8
          "
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <section>
            {/* PRODUCTS */}

            <div
              className="
                rounded-[28px]

                border
                border-[#EAE3F2]

                bg-white

                p-4

                shadow-[0_18px_55px_rgba(61,45,84,0.05)]

                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-center
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
                    Step 01
                  </p>

                  <h2
                    className="
                      mt-1

                      text-xl
                      font-extrabold

                      text-[#302B34]
                    "
                  >
                    Review Products
                  </h2>
                </div>

                <span
                  className="
                    rounded-full

                    bg-[#F3EEFF]

                    px-3
                    py-1.5

                    text-xs
                    font-bold
                    text-[#6C5CE7]
                  "
                >
                  {
                    cart.length
                  }{" "}
                  products
                </span>
              </div>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >
                {cart.map(
                  (
                    item,
                    index
                  ) => {
                    const image =
                      item.image ||
                      item.images?.[0];

                    const name =
                      item.name ||
                      item.productName ||
                      "Velmora Product";

                    return (
                      <article
                        key={`${item.productId}-${index}`}
                        className="
                          relative

                          grid
                          grid-cols-[90px_minmax(0,1fr)]
                          gap-4

                          rounded-[20px]

                          border
                          border-[#EEE8F3]

                          bg-[#FCFBFD]

                          p-3

                          sm:grid-cols-[120px_minmax(0,1fr)]
                          sm:p-4
                        "
                      >
                        <div
                          className="
                            aspect-square

                            overflow-hidden

                            rounded-[16px]

                            bg-white
                          "
                        >
                          {image ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                name
                              }
                              className="
                                h-full
                                w-full

                                object-contain

                                p-2
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center

                                text-2xl
                                text-[#9A83E4]
                              "
                            >
                              <FiPackage />
                            </div>
                          )}
                        </div>

                        <div
                          className="
                            min-w-0
                            pr-8
                          "
                        >
                          <p
                            className="
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[0.12em]

                              text-[#A39CA7]
                            "
                          >
                            {
                              item.productId
                            }
                          </p>

                          <h3
                            className="
                              mt-1

                              text-base
                              font-extrabold

                              text-[#3B3540]

                              sm:text-lg
                            "
                          >
                            {
                              name
                            }
                          </h3>

                          <p
                            className="
                              mt-2

                              font-extrabold
                              text-[#6C5CE7]
                            "
                          >
                            Rs.{" "}
                            {formatPrice(
                              item.price
                            )}
                          </p>

                          <div
                            className="
                              mt-3

                              flex
                              flex-wrap
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <div
                              className="
                                inline-flex

                                overflow-hidden

                                rounded-xl

                                border
                                border-[#DED7E6]

                                bg-white
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
                                className="
                                  h-10
                                  w-10

                                  font-bold

                                  hover:bg-[#F1ECFF]
                                  hover:text-[#6C5CE7]
                                "
                              >
                                −
                              </button>

                              <span
                                className="
                                  flex
                                  h-10
                                  min-w-[42px]
                                  items-center
                                  justify-center

                                  border-x
                                  border-[#DED7E6]

                                  text-sm
                                  font-bold
                                "
                              >
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(
                                    index,
                                    1
                                  )
                                }
                                className="
                                  h-10
                                  w-10

                                  font-bold

                                  hover:bg-[#F1ECFF]
                                  hover:text-[#6C5CE7]
                                "
                              >
                                +
                              </button>
                            </div>

                            <p
                              className="
                                text-sm
                                font-extrabold

                                text-[#403A44]
                              "
                            >
                              Rs.{" "}
                              {formatPrice(
                                Number(
                                  item.price
                                ) *
                                  Number(
                                    item.quantity
                                  )
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeProduct(
                              index
                            )
                          }
                          className="
                            absolute
                            right-3
                            top-3

                            flex
                            h-9
                            w-9
                            items-center
                            justify-center

                            rounded-xl

                            bg-[#FFF3F5]

                            text-[#B45462]

                            hover:bg-[#FBE7EB]
                          "
                        >
                          <FaTrash
                            size={
                              13
                            }
                          />
                        </button>
                      </article>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                DELIVERY
            ================================================= */}

            <section
              className="
                mt-5

                rounded-[28px]

                border
                border-[#EAE3F2]

                bg-white

                p-5

                shadow-[0_18px_55px_rgba(61,45,84,0.05)]

                sm:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#9A79E8]
                "
              >
                Step 02
              </p>

              <h2
                className="
                  mt-1

                  text-xl
                  font-extrabold

                  text-[#302B34]
                "
              >
                Delivery Details
              </h2>

              <div
                className="
                  mt-5

                  grid
                  grid-cols-1
                  gap-5

                  md:grid-cols-2
                "
              >
                <div>
                  <label
                    className="
                      mb-2

                      flex
                      items-center
                      gap-2

                      text-sm
                      font-bold
                      text-[#453F49]
                    "
                  >
                    <FiPhone
                      className="
                        text-[#6C5CE7]
                      "
                    />

                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={
                      phoneNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setPhoneNumber(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="+94 7X XXX XXXX"
                    className="
                      min-h-[52px]
                      w-full

                      rounded-2xl

                      border
                      border-[#E1DBE8]

                      px-4

                      text-sm

                      outline-none

                      transition

                      focus:border-[#B8A1FF]
                      focus:ring-4
                      focus:ring-[#B8A1FF]/[0.14]
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-2

                      flex
                      items-center
                      gap-2

                      text-sm
                      font-bold
                      text-[#453F49]
                    "
                  >
                    <FiMapPin
                      className="
                        text-[#6C5CE7]
                      "
                    />

                    Delivery Address
                  </label>

                  <textarea
                    rows={3}
                    value={
                      address
                    }
                    onChange={(
                      event
                    ) =>
                      setAddress(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Enter your delivery address"
                    className="
                      min-h-[110px]
                      w-full

                      resize-none

                      rounded-2xl

                      border
                      border-[#E1DBE8]

                      px-4
                      py-3

                      text-sm

                      outline-none

                      transition

                      focus:border-[#B8A1FF]
                      focus:ring-4
                      focus:ring-[#B8A1FF]/[0.14]
                    "
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                PAYMENT METHOD
            ================================================= */}

            <section
              className="
                mt-5

                rounded-[28px]

                border
                border-[#EAE3F2]

                bg-white

                p-5

                shadow-[0_18px_55px_rgba(61,45,84,0.05)]

                sm:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#9A79E8]
                "
              >
                Step 03
              </p>

              <h2
                className="
                  mt-1

                  text-xl
                  font-extrabold

                  text-[#302B34]
                "
              >
                Choose Payment
              </h2>

              <p
                className="
                  mt-2

                  text-sm
                  leading-6

                  text-[#817A86]
                "
              >
                Select the
                payment option
                that works best
                for you.
              </p>

              {/* PAYMENT OPTIONS */}

              <div
                className="
                  mt-5

                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-2
                "
              >
                <PaymentOption
                  active={
                    paymentMethod ===
                    "cash_on_delivery"
                  }
                  icon={
                    <FiTruck />
                  }
                  title="Cash on Delivery"
                  text="Pay when your Velmora order arrives."
                  onClick={() => {
                    setPaymentMethod(
                      "cash_on_delivery"
                    );

                    setClientSecret(
                      ""
                    );
                  }}
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "card"
                  }
                  icon={
                    <FiCreditCard />
                  }
                  title="Card Payment"
                  text="Pay securely using your debit or credit card."
                  onClick={() =>
                    setPaymentMethod(
                      "card"
                    )
                  }
                />
              </div>

              {/* COD PANEL */}

              {paymentMethod ===
                "cash_on_delivery" && (
                <div
                  className="
                    mt-5

                    rounded-[20px]

                    border
                    border-[#E2EDE6]

                    bg-[#F3F8F5]

                    p-4
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
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-[#E3F0E8]

                        text-[#4F9D7A]
                      "
                    >
                      <FiTruck />
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold

                          text-[#3F6653]
                        "
                      >
                        Cash on
                        Delivery
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs
                          leading-5

                          text-[#668071]
                        "
                      >
                        Your order
                        will be
                        placed now.
                        Payment is
                        collected
                        when the
                        order is
                        delivered.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD PANEL */}

              {paymentMethod ===
                "card" && (
                <div className="mt-5">
                  {!stripeKey ? (
                    <PaymentError
                      message="VITE_STRIPE_PUBLISHABLE_KEY is missing."
                    />
                  ) : loadingCard ? (
                    <div
                      className="
                        flex
                        min-h-[180px]
                        items-center
                        justify-center

                        rounded-[20px]

                        border
                        border-[#E6DFF0]

                        bg-[#FCFAFF]
                      "
                    >
                      <div className="text-center">
                        <div
                          className="
                            mx-auto
                            h-8
                            w-8

                            animate-spin

                            rounded-full

                            border-2
                            border-[#DED6F4]
                            border-t-[#6C5CE7]
                          "
                        />

                        <p
                          className="
                            mt-3

                            text-xs
                            font-semibold

                            text-[#817A86]
                          "
                        >
                          Preparing
                          secure
                          card
                          payment...
                        </p>
                      </div>
                    </div>
                  ) : clientSecret ? (
                    <Elements
                      stripe={
                        stripePromise
                      }
                      options={{
                        clientSecret,

                        appearance:
                          {
                            theme:
                              "stripe",

                            variables:
                              {
                                colorPrimary:
                                  "#6C5CE7",

                                colorBackground:
                                  "#FFFFFF",

                                colorText:
                                  "#2F3136",

                                colorDanger:
                                  "#D95C5C",

                                borderRadius:
                                  "14px",

                                fontFamily:
                                  "Inter, system-ui, sans-serif",
                              },

                            rules:
                              {
                                ".Input":
                                  {
                                    border:
                                      "1px solid #E2DCE8",

                                    boxShadow:
                                      "none",
                                  },

                                ".Input:focus":
                                  {
                                    border:
                                      "1px solid #B8A1FF",

                                    boxShadow:
                                      "0 0 0 4px rgba(184,161,255,0.14)",
                                  },
                              },
                          },
                      }}
                    >
                      <CardPaymentForm
                        total={
                          total
                        }
                        disabled={
                          isPlacingOrder
                        }
                        validateOrder={
                          validateOrder
                        }
                        onPaymentSuccess={async (
                          paymentIntentId
                        ) => {
                          await submitOrder(
                            {
                              method:
                                "card",

                              paymentReference:
                                paymentIntentId,
                            }
                          );
                        }}
                      />
                    </Elements>
                  ) : (
                    <PaymentError
                      message="Card payment could not be initialized."
                    />
                  )}
                </div>
              )}
            </section>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside
            className="
              overflow-hidden

              rounded-[28px]

              border
              border-[#E7E0EF]

              bg-white

              shadow-[0_22px_65px_rgba(61,45,84,0.07)]

              lg:sticky
              lg:top-[104px]
            "
          >
            <div
              className="
                bg-gradient-to-br
                from-[#F7F3FF]
                to-[#FFF8FA]

                p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#9A79E8]
                "
              >
                Velmora Order
              </p>

              <h2
                className="
                  mt-1

                  text-2xl
                  font-extrabold

                  text-[#302B34]
                "
              >
                Order Summary
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <SummaryRow
                label="Products"
                value={
                  cart.length
                }
              />

              <SummaryRow
                label="Items"
                value={cart.reduce(
                  (
                    totalItems,
                    item
                  ) =>
                    totalItems +
                    Number(
                      item.quantity
                    ),
                  0
                )}
              />

              <div
                className="
                  my-5
                  h-px

                  bg-[#EEE8F2]
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
                    Order Total
                  </p>

                  <p
                    className="
                      mt-1

                      text-[10px]

                      text-[#9A939F]
                    "
                  >
                    Final order
                    value
                  </p>
                </div>

                <p
                  className="
                    text-2xl
                    font-extrabold
                    tracking-[-0.03em]

                    text-[#6C5CE7]
                  "
                >
                  Rs.{" "}
                  {formatPrice(
                    total
                  )}
                </p>
              </div>

              {/* METHOD */}

              <div
                className="
                  mt-5

                  rounded-2xl

                  bg-[#F8F5FF]

                  p-4
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    text-[#9A79E8]
                  "
                >
                  Payment
                  Method
                </p>

                <p
                  className="
                    mt-1

                    text-sm
                    font-bold

                    text-[#48414C]
                  "
                >
                  {paymentMethod ===
                  "card"
                    ? "Debit / Credit Card"
                    : "Cash on Delivery"}
                </p>
              </div>

              {/* COD BUTTON */}

              {paymentMethod ===
                "cash_on_delivery" && (
                <button
                  type="button"
                  onClick={
                    placeCashOrder
                  }
                  disabled={
                    isPlacingOrder
                  }
                  className="
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

                    hover:-translate-y-0.5

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isPlacingOrder
                    ? "Placing Order..."
                    : "Place COD Order"}
                </button>
              )}

              {paymentMethod ===
                "card" && (
                <p
                  className="
                    mt-6

                    rounded-2xl

                    bg-[#F7F5F9]

                    p-3

                    text-center
                    text-[11px]
                    leading-5

                    text-[#89828D]
                  "
                >
                  Complete the
                  secure card
                  form in the
                  payment section
                  to pay and
                  place your
                  order.
                </p>
              )}

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

                  text-sm
                  font-bold

                  text-[#68616D]

                  hover:bg-[#F8F4FF]
                  hover:text-[#6C5CE7]
                "
              >
                Continue
                Exploring
              </Link>

              <div
                className="
                  mt-5

                  flex
                  items-start
                  gap-3

                  rounded-2xl

                  bg-[#302C3C]

                  p-4

                  text-white
                "
              >
                <FiShield
                  className="
                    mt-0.5
                    shrink-0

                    text-[#D1C4FF]
                  "
                />

                <p
                  className="
                    text-[11px]
                    leading-5

                    text-white/65
                  "
                >
                  Card details
                  are handled by
                  the payment
                  provider and
                  are not stored
                  by Velmora.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   CARD FORM
========================================================= */

function CardPaymentForm({
  total,
  onPaymentSuccess,
  validateOrder,
  disabled,
}) {
  const stripe =
    useStripe();

  const elements =
    useElements();

  const [
    paying,
    setPaying,
  ] = useState(false);

  async function payByCard() {
    if (
      !validateOrder()
    ) {
      return;
    }

    if (
      !stripe ||
      !elements ||
      paying
    ) {
      return;
    }

    setPaying(true);

    const loadingToast =
      toast.loading(
        "Processing your card payment..."
      );

    try {
      const {
        error,
        paymentIntent,
      } =
        await stripe.confirmPayment(
          {
            elements,

            redirect:
              "if_required",
          }
        );

      if (error) {
        toast.error(
          error.message ||
            "Card payment failed",
          {
            id:
              loadingToast,
          }
        );

        return;
      }

      if (
        paymentIntent
          ?.status !==
        "succeeded"
      ) {
        toast.error(
          "Payment has not completed yet.",
          {
            id:
              loadingToast,
          }
        );

        return;
      }

      toast.success(
        "Card payment successful",
        {
          id:
            loadingToast,
        }
      );

      await onPaymentSuccess(
        paymentIntent.id
      );
    } catch (error) {
      console.error(
        "CARD PAYMENT ERROR:",
        error
      );

      toast.error(
        "Unable to process card payment",
        {
          id:
            loadingToast,
        }
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <div
      className="
        rounded-[22px]

        border
        border-[#E4DDEE]

        bg-[#FCFAFF]

        p-4

        sm:p-5
      "
    >
      <div
        className="
          mb-5

          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            bg-[#EEE8FF]

            text-[#6C5CE7]
          "
        >
          <FiCreditCard />
        </div>

        <div>
          <p
            className="
              text-sm
              font-bold

              text-[#423C47]
            "
          >
            Card Details
          </p>

          <p
            className="
              mt-0.5

              text-[11px]

              text-[#8D8692]
            "
          >
            Debit or credit
            card
          </p>
        </div>
      </div>

      <PaymentElement />

      <button
        type="button"
        onClick={
          payByCard
        }
        disabled={
          !stripe ||
          paying ||
          disabled
        }
        className="
          mt-5

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

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {paying
          ? "Processing Payment..."
          : `Pay Rs. ${Number(
              total
            ).toLocaleString(
              "en-LK",
              {
                minimumFractionDigits:
                  2,
              }
            )}`}
      </button>
    </div>
  );
}

/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
  active,
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        min-h-[130px]
        w-full

        rounded-[20px]

        border

        p-4

        text-left

        transition-all

        ${
          active
            ? `
              border-[#B8A1FF]
              bg-[#F7F3FF]
              shadow-[0_10px_28px_rgba(108,92,231,0.10)]
            `
            : `
              border-[#E7E1EB]
              bg-white

              hover:border-[#D4C8F4]
            `
        }
      `}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            ${
              active
                ? "bg-[#6C5CE7] text-white"
                : "bg-[#F2EEFA] text-[#766B8A]"
            }
          `}
        >
          {icon}
        </div>

        <div
          className={`
            mt-1
            h-4
            w-4

            rounded-full

            border-4

            ${
              active
                ? "border-[#6C5CE7] bg-white"
                : "border-[#D8D1DE] bg-white"
            }
          `}
        />
      </div>

      <p
        className="
          mt-4

          text-sm
          font-extrabold

          text-[#403A44]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1

          text-[11px]
          leading-5

          text-[#8B8490]
        "
      >
        {text}
      </p>
    </button>
  );
}

function SummaryRow({
  label,
  value,
}) {
  return (
    <div
      className="
        mb-3

        flex
        items-center
        justify-between
        gap-3
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
        className="
          text-sm
          font-bold
          text-[#403A44]
        "
      >
        {value}
      </span>
    </div>
  );
}

function PaymentError({
  message,
}) {
  return (
    <div
      className="
        rounded-2xl

        border
        border-[#F0D7DC]

        bg-[#FFF5F7]

        p-4

        text-sm
        text-[#B45462]
      "
    >
      {message}
    </div>
  );
}