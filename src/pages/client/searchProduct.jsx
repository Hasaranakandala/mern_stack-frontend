import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard";

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const topRef = useRef(null);

  // ============================================
  // FETCH PRODUCTS
  // ============================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product`
        );

        console.log("Products:", response.data);

        setProducts(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ============================================
  // SCROLL TO TOP WHEN PAGE OPENS
  // ============================================

  useLayoutEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, []);

  // ============================================
  // SEARCH / FILTER PRODUCTS
  // ============================================
const filteredProducts = products.filter((product) => {
  const searchValue = query.trim().toLowerCase();

  // Search box empty නම් all products show
  if (!searchValue) {
    return true;
  }

  const productName =
    product?.productName?.toLowerCase() || "";

  const alternativeName = Array.isArray(product?.alternativeName)
    ? product.alternativeName.join(" ").toLowerCase()
    : product?.alternativeName?.toLowerCase() || "";

  return (
    productName.includes(searchValue) ||
    alternativeName.includes(searchValue)
  );
});

  // ============================================
  // CLEAR SEARCH
  // ============================================

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <main
      ref={topRef}
      className="
        w-full
        min-h-screen
        bg-[#F8F9FA]
        pt-[72px]
        md:pt-[80px]
      "
    >
      {/* ============================================
          HERO SECTION
      ============================================ */}

      <section
        className="
          w-full
          bg-gradient-to-b
          from-white
          via-white
          to-[#F8F9FA]
          border-b
          border-gray-100
        "
      >
        <div
          className="
            w-full
            max-w-[1400px]
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            sm:py-8
            lg:py-10
          "
        >
          <div
            className="
              w-full
              max-w-[700px]
            "
          >
            <p
              className="
                text-[11px]
                sm:text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-red-500
                mb-2
              "
            >
              Our Collection
            </p>

            <h1
              className="
                text-[28px]
                sm:text-4xl
                lg:text-5xl
                font-bold
                tracking-tight
                leading-[1.15]
                text-[#2F3542]
              "
            >
              Search Our Products
            </h1>

            <p
              className="
                mt-3
                max-w-[620px]
                text-sm
                sm:text-base
                leading-6
                sm:leading-7
                text-gray-500
              "
            >
              Search our latest collection and find the
              beauty products that suit your style and
              needs.
            </p>

            {/* ============================================
                SEARCH BAR
            ============================================ */}

            <div
              className="
                mt-6
                sm:mt-8
                w-full
                max-w-[650px]
              "
            >
              <div
                className="
                  relative
                  flex
                  items-center
                  w-full
                "
              >
                {/* SEARCH ICON */}

                <div
                  className="
                    absolute
                    left-4
                    flex
                    items-center
                    justify-center
                    pointer-events-none
                    text-gray-400
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                    />

                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>

                {/* SEARCH INPUT */}

                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="
                    w-full
                    h-[52px]
                    sm:h-[56px]
                    pl-12
                    pr-12
                    rounded-2xl
                    bg-white
                    border
                    border-gray-200
                    shadow-sm
                    text-sm
                    sm:text-base
                    text-[#2F3542]
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    duration-200
                    focus:border-red-400
                    focus:ring-4
                    focus:ring-red-100
                    hover:border-gray-300
                  "
                />

                {/* CLEAR BUTTON */}

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="
                      absolute
                      right-3
                      w-8
                      h-8
                      flex
                      items-center
                      justify-center
                      rounded-full
                      text-gray-400
                      hover:text-red-500
                      hover:bg-red-50
                      transition-all
                      duration-200
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* SEARCH TEXT */}

              {query.trim() && (
                <p
                  className="
                    mt-3
                    text-xs
                    sm:text-sm
                    text-gray-500
                  "
                >
                  Searching for{" "}
                  <span className="font-semibold text-[#2F3542]">
                    "{query}"
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCT SECTION
      ============================================ */}

      <section
        aria-labelledby="product-list-heading"
        className="
          w-full
          max-w-[1400px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-8
          lg:py-10
          xl:py-12
        "
      >
        {/* ============================================
            SECTION HEADER
        ============================================ */}

        <div
          className="
            mb-5
            sm:mb-7
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-3
          "
        >
          <div>
            <h2
              id="product-list-heading"
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-[#2F3542]
              "
            >
              {query.trim()
                ? "Search Results"
                : "All Products"}
            </h2>

            <p
              className="
                mt-1
                text-xs
                sm:text-sm
                text-gray-500
              "
            >
              {query.trim()
                ? `Products matching "${query}"`
                : "Browse all currently available products."}
            </p>
          </div>

          {/* PRODUCT COUNT */}

          {!isLoading && (
            <div
              aria-live="polite"
              className="
                inline-flex
                self-start
                sm:self-auto
                items-center
                justify-center
                min-h-[38px]
                px-4
                py-2
                rounded-full
                bg-white
                border
                border-gray-200
                shadow-sm
                text-xs
                sm:text-sm
                font-medium
                text-gray-600
              "
            >
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "Product"
                : "Products"}
            </div>
          )}
        </div>

        {/* ============================================
            LOADING
        ============================================ */}

        {isLoading ? (
          <div
            aria-label="Loading products"
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
              sm:gap-5
              lg:gap-6
              xl:gap-7
            "
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <article
                  key={item}
                  className="
                    w-full
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border
                    border-gray-100
                    shadow-sm
                    animate-pulse
                  "
                >
                  {/* IMAGE SKELETON */}

                  <div
                    className="
                      w-full
                      aspect-[4/3]
                      bg-gray-200
                    "
                  />

                  {/* CONTENT SKELETON */}

                  <div className="p-4 sm:p-5">
                    <div
                      className="
                        w-3/4
                        h-5
                        bg-gray-200
                        rounded-md
                        mb-3
                      "
                    />

                    <div
                      className="
                        w-full
                        h-4
                        bg-gray-200
                        rounded-md
                        mb-2
                      "
                    />

                    <div
                      className="
                        w-2/3
                        h-4
                        bg-gray-200
                        rounded-md
                        mb-5
                      "
                    />

                    <div
                      className="
                        w-full
                        h-11
                        bg-gray-200
                        rounded-xl
                      "
                    />
                  </div>
                </article>
              )
            )}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* ============================================
             PRODUCT GRID
          ============================================ */

          <div
            className="
              w-full
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
              sm:gap-5
              lg:gap-6
              xl:gap-7
              items-stretch
            "
          >
            {filteredProducts.map(
              (product, index) => (
                <div
                  key={
                    product?.productId ||
                    product?._id ||
                    index
                  }
                  className="
                    w-full
                    h-full
                    min-w-0
                  "
                >
                  <ProductCard
                    product={product}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          /* ============================================
             NO SEARCH RESULTS / EMPTY STATE
          ============================================ */

          <div
            className="
              w-full
              min-h-[280px]
              sm:min-h-[320px]
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
              px-5
              sm:px-8
              py-10
              sm:py-12
            "
          >
            <div
              aria-hidden="true"
              className="
                w-14
                h-14
                sm:w-16
                sm:h-16
                rounded-full
                bg-red-50
                flex
                items-center
                justify-center
                text-2xl
                sm:text-3xl
                mb-4
              "
            >
              {query.trim() ? "🔍" : "🛍️"}
            </div>

            <h2
              className="
                text-lg
                sm:text-xl
                font-bold
                text-[#2F3542]
              "
            >
              {query.trim()
                ? "No products found"
                : "No products available"}
            </h2>

            <p
              className="
                mt-2
                max-w-[430px]
                text-sm
                sm:text-base
                text-gray-500
                leading-relaxed
              "
            >
              {query.trim()
                ? `We couldn't find any products matching "${query}". Try another product name or keyword.`
                : "We currently don't have any products to display. Please check again later."}
            </p>

            {/* CLEAR SEARCH BUTTON */}

            {query.trim() && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  mt-5
                  px-5
                  py-2.5
                  rounded-xl
                  bg-red-500
                  text-white
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
                "
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}