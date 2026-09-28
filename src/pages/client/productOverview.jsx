import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCart,
  addToCart,
} from "../../utils/cart.js";

import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";

import { BsCart3 } from "react-icons/bs";

export default function ProductOverview() {

  const params = useParams();
  const productId = params.id;

  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  const [product, setProduct] = useState(null);


  useEffect(() => {

    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
          "/api/product/" +
          productId
      )

      .then((res) => {

        setProduct(res.data);

        setStatus("success");

      })

      .catch((err) => {

        console.log(err);

        setStatus("error");

        toast.error(
          "Error fetching product details"
        );

      });

  }, [productId]);


  if (status === "loading") {
    return <Loading />;
  }


  if (status === "error") {

    return (

      <main
        className="
          min-h-screen
          bg-[#F8F9FA]

          flex
          items-center
          justify-center

          px-4

          pt-[90px]
        "
      >

        <div
          className="
            w-full
            max-w-[500px]

            bg-white

            border
            border-gray-100

            rounded-3xl

            shadow-sm

            px-6
            py-12

            text-center
          "
        >

          <div
            className="
              w-16
              h-16

              mx-auto
              mb-5

              rounded-full

              bg-red-50

              flex
              items-center
              justify-center

              text-3xl
            "
          >
            ⚠️
          </div>


          <h1
            className="
              text-2xl
              font-bold
              text-[#2F3542]
            "
          >
            Product unavailable
          </h1>


          <p
            className="
              mt-2

              text-sm
              text-gray-500
            "
          >
            We couldn't load this product.
          </p>


          <button
            type="button"

            onClick={() =>
              navigate("/products")
            }

            className="
              mt-6

              min-h-[44px]

              px-6

              rounded-xl

              bg-red-500
              text-white

              font-semibold

              transition-all
              duration-200

              hover:bg-red-600
              hover:shadow-md

              active:scale-[0.98]
            "
          >
            Back to Products
          </button>

        </div>

      </main>

    );

  }


  const hasDiscount =
    Number(product.labelPrice) >
    Number(product.price);


  const discountPercentage =
    hasDiscount
      ? Math.round(
          (
            (
              Number(product.labelPrice) -
              Number(product.price)
            ) /
            Number(product.labelPrice)
          ) *
            100
        )
      : 0;


  function handleAddToCart() {

    if (
      !product.isAvailable ||
      product.stock <= 0
    ) {

      toast.error(
        "This product is unavailable"
      );

      return;

    }


    addToCart(product, 1);


    toast.success(
      `${product.productName} added to cart!`
    );


    console.log(
      "Updated cart:",
      getCart()
    );

  }


  function handleBuyNow() {

    if (
      !product.isAvailable ||
      product.stock <= 0
    ) {

      toast.error(
        "This product is unavailable"
      );

      return;

    }


    navigate(
      "/checkout",
      {
        state: {
          cart: [
            {
              productId:
                product.productId,

              name:
                product.productName,

              image:
                product.images?.[0],

              price:
                product.price,

              labelPrice:
                product.labelPrice,

              quantity: 1,
            },
          ],
        },
      }
    );

  }


  return (

    <main
      className="
        w-full
        min-h-screen

        bg-[#F8F9FA]

        pt-[72px]
        md:pt-[80px]
      "
    >

      {/* ================= BREADCRUMB ================= */}

      <section
        className="
          w-full

          bg-white

          border-b
          border-gray-100
        "
      >

        <div
          className="
            max-w-[1200px]
            mx-auto

            px-4
            sm:px-6
            lg:px-8

            py-4
          "
        >

          <nav
            aria-label="Breadcrumb"

            className="
              flex
              items-center

              gap-2

              overflow-hidden

              text-xs
              sm:text-sm
            "
          >

            <button
              type="button"

              onClick={() =>
                navigate("/")
              }

              className="
                text-gray-400

                transition-colors

                hover:text-red-500
              "
            >
              Home
            </button>


            <span
              className="
                text-gray-300
              "
            >
              /
            </span>


            <button
              type="button"

              onClick={() =>
                navigate("/products")
              }

              className="
                text-gray-400

                transition-colors

                hover:text-red-500
              "
            >
              Products
            </button>


            <span
              className="
                text-gray-300
              "
            >
              /
            </span>


            <span
              className="
                truncate

                max-w-[160px]
                sm:max-w-[280px]

                text-[#2F3542]

                font-medium
              "
              aria-current="page"
            >
              {product.productName}
            </span>

          </nav>

        </div>

      </section>



      {/* ================= MAIN PRODUCT AREA ================= */}

    {/* ================= MAIN PRODUCT AREA ================= */}

<section
  className="
    w-full
    max-w-[1180px]
    mx-auto

    px-4
    sm:px-6
    lg:px-8

    py-5
    sm:py-7
    lg:py-8
    xl:py-10
  "
>
  <div
    className="
      grid
      grid-cols-1

      lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]

      gap-5
      sm:gap-6
      lg:gap-7
      xl:gap-8

      items-start
    "
  >

    {/* ================= IMAGE SIDE ================= */}

    <section
      aria-label="Product images"
      className="
        w-full
        min-w-0
      "
    >
      <div
        className="
          w-full
          max-w-[520px]
          lg:max-w-none
          mx-auto

          bg-white

          rounded-2xl

          border
          border-gray-100

          shadow-[0_4px_20px_rgba(0,0,0,0.05)]

          p-3
          sm:p-4
          lg:p-5
        "
      >
        {/* IMPORTANT:
            no fixed height
            no overflow-hidden here
            because thumbnails need space
        */}

        <ImageSlider images={product.images || []} />

      </div>
    </section>


    {/* ================= DETAILS SIDE ================= */}

    <section
      aria-labelledby="product-title"
      className="
        w-full
        min-w-0
      "
    >
      <div
        className="
          w-full

          bg-white

          rounded-2xl

          border
          border-gray-100

          shadow-[0_4px_20px_rgba(0,0,0,0.05)]

          p-5
          sm:p-6
          lg:p-7
        "
      >

        {/* Product Label + ID */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between

            gap-3

            mb-4
          "
        >
          <span
            className="
              inline-flex
              items-center

              px-3
              py-1.5

              rounded-full

              bg-red-50
              text-red-500

              text-xs
              font-semibold
            "
          >
            Product
          </span>

          <span
            className="
              text-xs
              text-gray-400
            "
          >
            ID: {product.productId}
          </span>
        </div>


        {/* Product Name */}

        <h1
          id="product-title"
          className="
            text-2xl
            sm:text-3xl
            lg:text-[34px]
            xl:text-4xl

            font-bold

            text-[#2F3542]

            leading-tight
            tracking-tight

            break-words
          "
        >
          {product.productName}
        </h1>


        {/* Alternative Names */}

        {product.alternativeName?.length > 0 && (
          <div
            className="
              flex
              flex-wrap

              gap-2

              mt-4
            "
          >
            {product.alternativeName.map((name, index) => (
              <span
                key={index}
                className="
                  px-3
                  py-1.5

                  rounded-lg

                  bg-[#F8F9FA]

                  border
                  border-gray-200

                  text-xs
                  sm:text-sm

                  text-gray-500
                "
              >
                {name}
              </span>
            ))}
          </div>
        )}


        {/* ================= PRICE ================= */}

        <div
          className="
            mt-5
            sm:mt-6

            flex
            flex-wrap
            items-center

            gap-x-3
            gap-y-2
          "
        >
          <span
            className="
              text-2xl
              sm:text-3xl
              lg:text-[32px]

              font-bold

              text-red-500
            "
          >
            Rs. {Number(product.price).toLocaleString()}
          </span>


          {product.labelPrice > product.price && (
            <span
              className="
                text-sm
                sm:text-base

                text-gray-400

                line-through
              "
            >
              Rs. {Number(product.labelPrice).toLocaleString()}
            </span>
          )}


          {product.labelPrice > product.price && (
            <span
              className="
                px-2.5
                py-1

                rounded-md

                bg-red-50
                text-red-500

                text-xs
                font-bold
              "
            >
              {Math.round(
                ((product.labelPrice - product.price) /
                  product.labelPrice) *
                  100
              )}
              % OFF
            </span>
          )}
        </div>


        {/* Divider */}

        <div
          className="
            w-full
            h-px

            bg-gray-100

            my-5
            sm:my-6
          "
        />


        {/* ================= DESCRIPTION ================= */}

        <section>
          <h2
            className="
              text-base
              sm:text-lg

              font-bold

              text-[#2F3542]

              mb-2
            "
          >
            Description
          </h2>

          <p
            className="
              text-sm
              sm:text-[15px]

              text-gray-500

              leading-6
              sm:leading-7
            "
          >
            {product.description || "No description available."}
          </p>
        </section>


        {/* ================= STOCK ================= */}

        <div className="mt-5">

          {product.isAvailable && product.stock > 0 ? (

            <div
              className="
                inline-flex
                flex-wrap
                items-center

                gap-2

                px-3
                py-2

                rounded-xl

                bg-green-50

                border
                border-green-100
              "
            >
              <span
                aria-hidden="true"
                className="
                  w-2
                  h-2

                  rounded-full

                  bg-green-500
                "
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-green-700
                "
              >
                In Stock
              </span>

              <span
                className="
                  text-xs
                  text-green-700/70
                "
              >
                ({product.stock} available)
              </span>
            </div>

          ) : (

            <div
              className="
                inline-flex
                items-center

                gap-2

                px-3
                py-2

                rounded-xl

                bg-red-50

                border
                border-red-100
              "
            >
              <span
                aria-hidden="true"
                className="
                  w-2
                  h-2

                  rounded-full

                  bg-red-500
                "
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-red-500
                "
              >
                Out of Stock
              </span>
            </div>

          )}

        </div>


        {/* ================= ACTION BUTTONS ================= */}

        <div
          className="
            mt-6
            sm:mt-7

            grid
            grid-cols-1
            sm:grid-cols-2

            gap-3
          "
        >

          <button
            type="button"

            onClick={handleAddToCart}

            disabled={
              !product.isAvailable ||
              product.stock <= 0
            }

            aria-label={`Add ${product.productName} to cart`}

            className="
              w-full
              min-h-[48px]

              px-4

              rounded-xl

              bg-red-500
              text-white

              font-bold
              text-sm
              sm:text-base

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
            🛒 Add to Cart
          </button>


          <button
            type="button"

            onClick={handleBuyNow}

            disabled={
              !product.isAvailable ||
              product.stock <= 0
            }

            aria-label={`Buy ${product.productName} now`}

            className="
              w-full
              min-h-[48px]

              px-4

              rounded-xl

              bg-[#2F3542]
              text-white

              font-bold
              text-sm
              sm:text-base

              shadow-sm

              transition-all
              duration-200

              hover:bg-[#1F2530]
              hover:shadow-md
              hover:-translate-y-[1px]

              active:scale-[0.98]

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-gray-500
              focus-visible:ring-offset-2

              disabled:bg-gray-300
              disabled:text-gray-500
              disabled:cursor-not-allowed
              disabled:hover:translate-y-0
            "
          >
            Buy Now
          </button>

        </div>

      </div>
    </section>

  </div>
</section>

    </main>

  );

}