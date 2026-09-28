import { Link, useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";

export default function ProductCard({ product }) {

  const navigate = useNavigate();

  const hasDiscount =
    Number(product.labelPrice) > Number(product.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.labelPrice) - Number(product.price)) /
          Number(product.labelPrice)) *
          100
      )
    : 0;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.png";


  function handleAddToCart() {

    console.log("Add to cart:", product);

    // Add your existing cart logic here

  }


  function handleBuyNow() {

    navigate("/overview/" + product.productId);

  }


  return (

    <article
      className="
        group
        relative

        w-full
        h-full
        min-w-0

        bg-white

        rounded-2xl
        sm:rounded-3xl

        border
        border-gray-100

        shadow-sm

        overflow-hidden

        flex
        flex-col

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-xl
        hover:border-gray-200

        focus-within:ring-2
        focus-within:ring-red-300
        focus-within:ring-offset-2
      "
    >

      {/* ================= IMAGE SECTION ================= */}

      <div
        className="
          relative

          w-full

          h-[220px]
          sm:h-[230px]
          lg:h-[240px]

          bg-[#F7F7F8]

          overflow-hidden

          flex
          items-center
          justify-center
        "
      >

        <Link
          to={"/overview/" + product.productId}
          aria-label={`View ${product.productName}`}
          className="
            w-full
            h-full

            flex
            items-center
            justify-center

            focus:outline-none
          "
        >

          <img
            src={imageUrl}
            alt={product.productName || "Product image"}
            loading="lazy"

            onError={(e) => {

              e.currentTarget.onerror = null;

              e.currentTarget.src =
                "/placeholder-product.png";

            }}

            className="
              w-full
              h-full

              object-contain

              p-4
              sm:p-5

              transition-transform
              duration-500

              group-hover:scale-105
            "
          />

        </Link>


        {/* Discount Badge */}

        {hasDiscount && product.isAvailable && (

          <span
            className="
              absolute
              top-3
              left-3
              z-20

              px-2.5
              py-1.5

              rounded-full

              bg-red-500
              text-white

              text-[11px]
              font-bold

              shadow-sm
            "
          >
            -{discountPercentage}%
          </span>

        )}


        {/* In Stock */}

        {product.isAvailable && (

          <span
            className="
              absolute
              top-3
              right-3
              z-20

              flex
              items-center
              gap-1.5

              px-2.5
              py-1.5

              rounded-full

              bg-white/95

              border
              border-green-100

              text-green-700

              text-[10px]
              sm:text-[11px]

              font-bold

              shadow-sm
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-green-500
              "
            />

            In Stock

          </span>

        )}


        {/* Out of Stock */}

        {!product.isAvailable && (

          <div
            className="
              absolute
              inset-0
              z-30

              bg-white/75
              backdrop-blur-[2px]

              flex
              items-center
              justify-center
            "
          >

            <span
              className="
                px-4
                py-2

                rounded-full

                bg-gray-900
                text-white

                text-xs
                sm:text-sm

                font-bold

                shadow-lg
              "
            >
              Out of Stock
            </span>

          </div>

        )}

      </div>


      {/* ================= PRODUCT DETAILS ================= */}

      <div
        className="
          p-4
          sm:p-5

          flex
          flex-col
          flex-1
        "
      >

        {/* Product Name */}

        <Link
          to={"/overview/" + product.productId}
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

              text-gray-800

              leading-snug

              line-clamp-2

              min-h-[44px]

              transition-colors
              duration-200

              hover:text-red-500
            "
          >
            {product.productName}
          </h2>

        </Link>


        {/* Description */}

        <div className="min-h-[48px] mt-2">

          {product.description && (

            <p
              className="
                text-xs
                sm:text-sm

                text-gray-500

                leading-relaxed

                line-clamp-2
              "
            >
              {product.description}
            </p>

          )}

        </div>


        {/* Price */}

        <div
          className="
            mt-4

            min-h-[32px]

            flex
            items-center
            gap-2
            flex-wrap
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
            Rs. {Number(product.price).toFixed(2)}
          </span>


          {hasDiscount && (

            <span
              className="
                text-xs
                sm:text-sm

                text-gray-400

                line-through
              "
            >
              Rs. {Number(product.labelPrice).toFixed(2)}
            </span>

          )}

        </div>


        {/* ================= BUTTON SECTION ================= */}

        <div
          className="
            mt-auto
            pt-5

            flex
            flex-col

            sm:grid
            sm:grid-cols-2

            gap-2.5
          "
        >

          <button
            type="button"
            disabled={!product.isAvailable}
            onClick={handleAddToCart}
            aria-label={`Add ${product.productName} to cart`}

            className="
              w-full
              min-h-[44px]

              px-3

              rounded-xl

              bg-red-500
              text-white

              flex
              items-center
              justify-center
              gap-2

              text-sm
              font-semibold

              shadow-sm

              transition-all
              duration-200

              hover:bg-red-600
              hover:shadow-md

              active:scale-[0.98]

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2

              disabled:bg-gray-300
              disabled:text-gray-500
              disabled:cursor-not-allowed
              disabled:shadow-none
            "
          >

            <BsCart3
              className="text-[17px]"
              aria-hidden="true"
            />

            {product.isAvailable
              ? "Add to Cart"
              : "Unavailable"}

          </button>


          {product.isAvailable && (

            <button
              type="button"
              onClick={handleBuyNow}
              aria-label={`Buy ${product.productName} now`}

              className="
                w-full
                min-h-[44px]

                px-3

                rounded-xl

                bg-gray-900
                text-white

                text-sm
                font-semibold

                shadow-sm

                transition-all
                duration-200

                hover:bg-black
                hover:shadow-md

                active:scale-[0.98]

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-gray-500
                focus-visible:ring-offset-2
              "
            >
              Buy Now
            </button>

          )}

        </div>

      </div>

    </article>

  );
}