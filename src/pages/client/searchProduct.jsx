import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

import ProductCard from "../../components/productCard";

/*
=========================================================
VELMORA SEARCH EXPERIENCE
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280
Success          #4F9D7A

Direction:
Quiet Luxury
Modern Beauty
Editorial Ecommerce
Soft Sophistication
=========================================================
*/

/* =========================================================
   SEARCH ICON
========================================================= */

function SearchIcon({
  className = "",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

/* =========================================================
   CLOSE ICON
========================================================= */

function CloseIcon({
  className = "",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* =========================================================
   LUXURY SEARCH VISUAL
========================================================= */

function SearchLuxuryVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-square
        w-full
        max-w-[390px]

        sm:max-w-[430px]
      "
    >
      {/* Outer glass surface */}

      <div
        className="
          absolute
          inset-[4%]

          rounded-[34%]

          border
          border-white

          bg-gradient-to-br
          from-white/75
          via-[#F8F4FF]/75
          to-[#FFF2F6]/80

          shadow-[0_35px_90px_rgba(69,52,96,0.12)]

          backdrop-blur-xl
        "
      />

      {/* Atmospheric glows */}

      <div
        className="
          pointer-events-none
          absolute
          left-[2%]
          top-[5%]

          h-[38%]
          w-[38%]

          rounded-full

          bg-[#B8A1FF]/25

          blur-[45px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[2%]
          right-[1%]

          h-[40%]
          w-[40%]

          rounded-full

          bg-[#F2B8C6]/28

          blur-[50px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[20%]
          top-[5%]

          h-[25%]
          w-[25%]

          rounded-full

          bg-[#EADBC8]/45

          blur-[38px]
        "
      />

      {/* Decorative rings */}

      <div
        className="
          absolute
          inset-[13%]

          rounded-full

          border
          border-[#DCCFFF]/60
        "
      />

      <div
        className="
          absolute
          inset-[23%]

          rounded-full

          border
          border-[#EADBC8]/55
        "
      />

      {/* Center search emblem */}

      <div
        className="
          absolute
          inset-[27%]

          flex
          items-center
          justify-center

          rounded-[34%]

          border
          border-white

          bg-white/85

          shadow-[0_24px_65px_rgba(68,52,96,0.13)]

          backdrop-blur-xl
        "
      >
        <div
          className="
            text-center
          "
        >
          <div
            className="
              mx-auto

              flex
              h-16
              w-16
              items-center
              justify-center

              rounded-[22px]

              bg-gradient-to-br
              from-[#6C5CE7]
              to-[#B8A1FF]

              text-white

              shadow-[0_14px_32px_rgba(108,92,231,0.28)]

              sm:h-20
              sm:w-20
              sm:rounded-[26px]
            "
          >
            <SearchIcon
              className="
                h-7
                w-7

                sm:h-9
                sm:w-9
              "
            />
          </div>

          <p
            className="
              mt-4

              text-[9px]
              font-black
              uppercase
              tracking-[0.23em]

              text-[#6C5CE7]

              sm:mt-5
              sm:text-[11px]
            "
          >
            VELMORA
          </p>

          <p
            className="
              mt-1

              text-sm
              font-extrabold

              text-[#2F3136]

              sm:text-lg
            "
          >
            Find Your Ritual
          </p>
        </div>
      </div>

      {/* Floating card 1 */}

      <div
        className="
          absolute
          left-[0%]
          top-[24%]

          rounded-xl

          border
          border-white

          bg-white/85

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.13em]

            text-[#6C5CE7]

            sm:text-[10px]
          "
        >
          ✦ Discover
        </p>

        <p
          className="
            mt-1

            text-[8px]
            font-semibold

            text-[#716B76]

            sm:text-[11px]
          "
        >
          Beauty essentials
        </p>
      </div>

      {/* Floating card 2 */}

      <div
        className="
          absolute
          right-[0%]
          top-[17%]

          rounded-xl

          border
          border-white

          bg-white/85

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.13em]

            text-[#B36D85]

            sm:text-[10px]
          "
        >
          ♡ Personal
        </p>

        <p
          className="
            mt-1

            text-[8px]
            font-semibold

            text-[#716B76]

            sm:text-[11px]
          "
        >
          Made for you
        </p>
      </div>

      {/* Floating card 3 */}

      <div
        className="
          absolute
          bottom-[3%]
          left-[30%]

          rounded-xl

          border
          border-white

          bg-white/85

          px-3
          py-2

          shadow-lg

          backdrop-blur-xl

          sm:rounded-2xl
          sm:px-4
          sm:py-3
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.13em]

            text-[#A17A43]

            sm:text-[10px]
          "
        >
          ◇ Refined
        </p>

        <p
          className="
            mt-1

            text-[8px]
            font-semibold

            text-[#716B76]

            sm:text-[11px]
          "
        >
          Curated selection
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT SKELETON
========================================================= */

function ProductSkeleton() {
  return (
    <article
      className="
        w-full

        overflow-hidden

        rounded-[22px]

        border
        border-[#ECE6F3]

        bg-white

        shadow-[0_10px_35px_rgba(67,52,91,0.04)]

        sm:rounded-[26px]
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative

          h-[205px]
          w-full

          overflow-hidden

          bg-gradient-to-br
          from-[#F7F4FA]
          via-[#F1EDF6]
          to-[#FFF4F7]

          sm:h-[230px]

          lg:h-[245px]
        "
      >
        <div
          className="
            absolute
            inset-0

            animate-pulse

            bg-gradient-to-r
            from-transparent
            via-white/45
            to-transparent
          "
        />
      </div>

      {/* CONTENT */}

      <div
        className="
          p-4

          sm:p-5
        "
      >
        <div
          className="
            h-3
            w-20

            animate-pulse

            rounded-full

            bg-[#EEE9F2]
          "
        />

        <div
          className="
            mt-4

            h-5
            w-3/4

            animate-pulse

            rounded-lg

            bg-[#E6E1EB]
          "
        />

        <div
          className="
            mt-3

            h-3.5
            w-full

            animate-pulse

            rounded-md

            bg-[#F0ECF3]
          "
        />

        <div
          className="
            mt-2

            h-3.5
            w-2/3

            animate-pulse

            rounded-md

            bg-[#F0ECF3]
          "
        />

        <div
          className="
            my-5

            h-px
            w-full

            bg-[#F0ECF3]
          "
        />

        <div
          className="
            h-6
            w-28

            animate-pulse

            rounded-lg

            bg-[#DED5F4]
          "
        />

        <div
          className="
            mt-5

            grid
            grid-cols-1
            gap-2.5

            min-[430px]:grid-cols-2
          "
        >
          <div
            className="
              h-12

              animate-pulse

              rounded-xl

              bg-[#DCD2F8]
            "
          />

          <div
            className="
              h-12

              animate-pulse

              rounded-xl

              bg-[#E4E0E7]
            "
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SEARCH PRODUCT PAGE
========================================================= */

export default function SearchProductPage() {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    fetchError,
    setFetchError,
  ] = useState(false);

  const topRef =
    useRef(null);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts =
    async () => {
      try {
        setIsLoading(
          true
        );

        setFetchError(
          false
        );

        const response =
          await axios.get(
            `${
              import.meta.env
                .VITE_BACKEND_URL
            }/api/product`
          );

        setProducts(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setProducts([]);

        setFetchError(
          true
        );
      } finally {
        setIsLoading(
          false
        );
      }
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================================================
     SCROLL TO TOP
  ===================================================== */

  useLayoutEffect(() => {
    topRef.current?.scrollIntoView(
      {
        behavior:
          "auto",

        block:
          "start",
      }
    );
  }, []);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        query
          .trim()
          .toLowerCase();

      if (!searchValue) {
        return products;
      }

      return products.filter(
        (product) => {
          const productName =
            product
              ?.productName
              ?.toLowerCase() ||
            "";

          const alternativeName =
            Array.isArray(
              product
                ?.alternativeName
            )
              ? product.alternativeName
                  .join(" ")
                  .toLowerCase()
              : product
                  ?.alternativeName
                  ?.toLowerCase() ||
                "";

          return (
            productName.includes(
              searchValue
            ) ||
            alternativeName.includes(
              searchValue
            )
          );
        }
      );
    }, [
      products,
      query,
    ]);

  /* =====================================================
     AVAILABLE RESULT COUNT
  ===================================================== */

  const availableResults =
    useMemo(
      () =>
        filteredProducts.filter(
          (product) =>
            Boolean(
              product.isAvailable
            ) &&
            Number(
              product.stock
            ) > 0
        ).length,
      [filteredProducts]
    );

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  const clearSearch =
    () => {
      setQuery("");
    };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main
      ref={topRef}
      className="
        relative

        min-h-screen
        w-full

        overflow-x-hidden

        bg-[#FAF9F7]

        pb-14

        pt-[72px]

        md:pt-[80px]
      "
    >
      {/* ===================================================
          PAGE ATMOSPHERE
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-36
          top-[560px]

          h-[380px]
          w-[380px]

          rounded-full

          bg-[#B8A1FF]/8

          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-36
          top-[1050px]

          h-[400px]
          w-[400px]

          rounded-full

          bg-[#F2B8C6]/10

          blur-[120px]
        "
      />

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          relative
          z-10

          px-3
          pb-8
          pt-5

          sm:px-6
          sm:pb-12
          sm:pt-7

          lg:px-8
          lg:pb-16
          lg:pt-9
        "
      >
        <div
          className="
            relative

            mx-auto
            max-w-[1400px]

            overflow-hidden

            rounded-[28px]

            border
            border-[#ECE5F4]

            bg-gradient-to-br
            from-[#FBF9FF]
            via-[#FFF9FB]
            to-[#F8F1E9]

            shadow-[0_30px_100px_rgba(66,50,91,0.08)]

            sm:rounded-[38px]

            lg:rounded-[44px]
          "
        >
          {/* Hero glows */}

          <div
            className="
              pointer-events-none
              absolute
              -left-28
              -top-28

              h-80
              w-80

              rounded-full

              bg-[#B8A1FF]/18

              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-[-80px]

              h-80
              w-80

              rounded-full

              bg-[#F2B8C6]/22

              blur-[90px]
            "
          />

          <div
            className="
              relative

              grid
              grid-cols-1
              items-center

              gap-8

              px-5
              py-9

              sm:px-9
              sm:py-12

              lg:min-h-[570px]
              lg:grid-cols-[1.05fr_0.95fr]
              lg:gap-8
              lg:px-14
              lg:py-14
            "
          >
            {/* =========================================
                HERO CONTENT
            ========================================= */}

            <div
              className="
                max-w-2xl
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

                  bg-white/75

                  px-3.5
                  py-2

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]

                  text-[#6C5CE7]

                  shadow-sm

                  backdrop-blur-xl

                  sm:px-4
                  sm:text-[11px]
                "
              >
                <span
                  className="
                    text-[#B9955B]
                  "
                >
                  ✦
                </span>

                Velmora
                Discovery
              </div>

              <h1
                className="
                  mt-6

                  text-[38px]
                  font-extrabold
                  leading-[1.01]
                  tracking-[-0.05em]

                  text-[#2F3136]

                  sm:text-5xl

                  lg:text-[58px]
                "
              >
                Find the beauty
                that belongs in
                your{" "}

                <span
                  className="
                    font-serif
                    font-medium
                    italic

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    via-[#937CE7]
                    to-[#C57692]

                    bg-clip-text
                    text-transparent
                  "
                >
                  ritual.
                </span>
              </h1>

              <p
                className="
                  mt-6

                  max-w-xl

                  text-sm
                  leading-7

                  text-[#6D6772]

                  sm:text-base
                  sm:leading-8
                "
              >
                Search the
                Velmora
                collection by
                product name or
                alternative name
                and discover
                skincare,
                makeup,
                haircare and
                beauty
                essentials made
                for your
                everyday
                routine.
              </p>

              {/* =========================================
                  SEARCH BAR
              ========================================= */}

              <div
                className="
                  mt-8
                  w-full
                  max-w-[680px]
                "
              >
                <div
                  className="
                    relative

                    flex
                    w-full
                    items-center
                  "
                >
                  {/* Search icon */}

                  <div
                    className="
                      pointer-events-none

                      absolute
                      left-4
                      z-10

                      flex
                      h-9
                      w-9
                      items-center
                      justify-center

                      rounded-xl

                      bg-[#F2EDFF]

                      text-[#6C5CE7]
                    "
                  >
                    <SearchIcon
                      className="
                        h-[18px]
                        w-[18px]
                      "
                    />
                  </div>

                  {/* Input */}

                  <input
                    type="search"
                    value={
                      query
                    }
                    onChange={(
                      event
                    ) =>
                      setQuery(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Search the Velmora collection..."
                    aria-label="Search Velmora products"
                    autoComplete="off"
                    className="
                      min-h-[58px]
                      w-full

                      rounded-2xl

                      border
                      border-[#DED7E6]

                      bg-white/90

                      pl-[62px]
                      pr-14

                      text-[15px]
                      text-[#2F3136]

                      shadow-[0_12px_30px_rgba(63,48,88,0.06)]

                      outline-none

                      backdrop-blur-xl

                      transition-all
                      duration-300

                      placeholder:text-[#A29BA7]

                      hover:border-[#CFC5DC]

                      focus:border-[#B8A1FF]
                      focus:ring-4
                      focus:ring-[#B8A1FF]/15

                      sm:min-h-[62px]
                      sm:text-base
                    "
                  />

                  {/* Clear */}

                  {query && (
                    <button
                      type="button"
                      onClick={
                        clearSearch
                      }
                      aria-label="Clear search"
                      className="
                        absolute
                        right-3

                        flex
                        h-9
                        w-9
                        items-center
                        justify-center

                        rounded-xl

                        bg-[#FAF8FC]

                        text-[#918995]

                        transition-all
                        duration-200

                        hover:bg-[#F1ECFF]
                        hover:text-[#6C5CE7]

                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#B8A1FF]
                      "
                    >
                      <CloseIcon
                        className="
                          h-[18px]
                          w-[18px]
                        "
                      />
                    </button>
                  )}
                </div>

                {/* Search helper */}

                <div
                  className="
                    mt-3

                    flex
                    min-h-[20px]
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1

                    text-[10px]
                    font-medium

                    text-[#938C98]

                    sm:text-xs
                  "
                >
                  {query.trim() ? (
                    <>
                      <span>
                        Searching
                        Velmora for
                      </span>

                      <span
                        className="
                          max-w-full
                          break-words
                          font-bold
                          text-[#6C5CE7]
                        "
                      >
                        “
                        {
                          query
                        }
                        ”
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="
                          text-[#B9955B]
                        "
                      >
                        ✦
                      </span>

                      Search by
                      product name
                      or alternative
                      name
                    </>
                  )}
                </div>
              </div>

              {/* Hero micro trust */}

              <div
                className="
                  mt-7

                  flex
                  flex-wrap
                  gap-2
                "
              >
                {[
                  "Thoughtfully curated",
                  "Easy discovery",
                  "Velmora beauty",
                ].map(
                  (item) => (
                    <span
                      key={
                        item
                      }
                      className="
                        rounded-full

                        border
                        border-white

                        bg-white/60

                        px-3
                        py-1.5

                        text-[9px]
                        font-semibold

                        text-[#766F7A]

                        backdrop-blur-xl

                        sm:text-[10px]
                      "
                    >
                      {
                        item
                      }
                    </span>
                  )
                )}
              </div>
            </div>

            {/* =========================================
                HERO VISUAL
            ========================================= */}

            <SearchLuxuryVisual />
          </div>
        </div>
      </section>

      {/* ===================================================
          SEARCH RESULTS HEADER
      =================================================== */}

      <section
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1400px]

          px-3

          sm:px-6

          lg:px-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            border-b
            border-[#EAE4EF]

            pb-6

            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:gap-6

            lg:pb-8
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.22em]

                text-[#6C5CE7]

                sm:text-[11px]
              "
            >
              {query.trim()
                ? "Your Search"
                : "Velmora Beauty"}
            </p>

            <h2
              id="product-list-heading"
              className="
                mt-2

                text-2xl
                font-extrabold
                tracking-[-0.03em]

                text-[#2F3136]

                sm:text-3xl
              "
            >
              {query.trim()
                ? "Beauty matches"
                : "Discover the collection"}
            </h2>

            <p
              className="
                mt-2

                max-w-xl

                text-xs
                leading-6

                text-[#77717C]

                sm:text-sm
              "
            >
              {query.trim()
                ? `Showing Velmora selections matching “${query}”.`
                : "Explore thoughtfully presented beauty essentials and find something that feels right for your routine."}
            </p>
          </div>

          {/* Result badge */}

          {!isLoading &&
            !fetchError && (
              <div
                aria-live="polite"
                className="
                  inline-flex
                  min-h-[42px]
                  self-start
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-[#E4DDEA]

                  bg-white

                  px-4
                  py-2

                  text-xs
                  font-semibold

                  text-[#645D69]

                  shadow-sm

                  sm:self-auto
                  sm:text-sm
                "
              >
                <span
                  className="
                    h-2
                    w-2

                    rounded-full

                    bg-[#B8A1FF]

                    shadow-[0_0_0_4px_rgba(184,161,255,0.14)]
                  "
                />

                {
                  filteredProducts.length
                }{" "}
                {filteredProducts.length ===
                1
                  ? "match"
                  : "matches"}
              </div>
            )}
        </div>

        {/* Secondary metrics */}

        {!isLoading &&
          !fetchError &&
          filteredProducts.length >
            0 && (
            <div
              className="
                mt-4

                flex
                flex-wrap
                items-center
                gap-2

                text-[10px]

                sm:text-xs
              "
            >
              <span
                className="
                  rounded-full

                  bg-[#EDF7F2]

                  px-3
                  py-1.5

                  font-semibold

                  text-[#408465]
                "
              >
                {
                  availableResults
                }{" "}
                available now
              </span>

              {query.trim() && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="
                    rounded-full

                    border
                    border-[#E4DDEA]

                    bg-white

                    px-3
                    py-1.5

                    font-semibold

                    text-[#6C5CE7]

                    transition-all

                    hover:border-[#CFC1FA]
                    hover:bg-[#F8F5FF]
                  "
                >
                  View all
                  Velmora
                  products
                </button>
              )}
            </div>
          )}
      </section>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <section
        aria-labelledby="product-list-heading"
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1400px]

          px-3
          py-6

          sm:px-6
          sm:py-8

          lg:px-8
          lg:py-10

          xl:py-12
        "
      >
        {/* =================================================
            FETCH ERROR
        ================================================= */}

        {!isLoading &&
        fetchError ? (
          <div
            className="
              relative

              flex
              min-h-[330px]
              w-full
              flex-col
              items-center
              justify-center

              overflow-hidden

              rounded-[28px]

              border
              border-[#EAE3F1]

              bg-gradient-to-br
              from-[#FBF9FF]
              via-white
              to-[#FFF4F7]

              px-5
              py-12

              text-center

              shadow-[0_22px_60px_rgba(64,48,87,0.05)]

              sm:min-h-[370px]
              sm:rounded-[34px]
              sm:px-8
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-20

                h-56
                w-56

                rounded-full

                bg-[#B8A1FF]/15

                blur-3xl
              "
            />

            <div
              className="
                relative

                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-[#F2EDFF]

                text-2xl
                text-[#6C5CE7]
              "
            >
              ✦
            </div>

            <p
              className="
                relative

                mt-5

                text-[9px]
                font-black
                uppercase
                tracking-[0.22em]

                text-[#9A79E8]

                sm:text-[11px]
              "
            >
              Velmora
            </p>

            <h2
              className="
                relative

                mt-2

                text-xl
                font-extrabold

                text-[#2F3136]

                sm:text-2xl
              "
            >
              We couldn't load
              the collection.
            </h2>

            <p
              className="
                relative

                mt-3

                max-w-[430px]

                text-sm
                leading-7

                text-[#77717C]
              "
            >
              Something
              interrupted the
              connection to the
              Velmora
              collection.
              Please try again.
            </p>

            <button
              type="button"
              onClick={
                fetchProducts
              }
              className="
                relative

                mt-6

                min-h-[48px]

                rounded-xl

                bg-gradient-to-r
                from-[#6C5CE7]
                to-[#927EF1]

                px-6

                text-sm
                font-bold

                text-white

                shadow-[0_10px_24px_rgba(108,92,231,0.22)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_14px_30px_rgba(108,92,231,0.28)]
              "
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          /* ===============================================
             LOADING
          =============================================== */

          <div
            aria-label="Loading Velmora products"
            className="
              grid
              grid-cols-1

              gap-4

              min-[520px]:grid-cols-2

              sm:gap-5

              lg:grid-cols-3
              lg:gap-6

              xl:grid-cols-4
              xl:gap-7
            "
          >
            {[
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
            ].map(
              (
                item
              ) => (
                <ProductSkeleton
                  key={
                    item
                  }
                />
              )
            )}
          </div>
        ) : filteredProducts.length >
          0 ? (
          /* ===============================================
             PRODUCT GRID
          =============================================== */

          <div
            className="
              grid
              w-full
              grid-cols-1
              items-stretch

              gap-4

              min-[520px]:grid-cols-2

              sm:gap-5

              lg:grid-cols-3
              lg:gap-6

              xl:grid-cols-4
              xl:gap-7
            "
          >
            {filteredProducts.map(
              (
                product,
                index
              ) => (
                <div
                  key={
                    product
                      ?.productId ||
                    product?._id ||
                    index
                  }
                  className="
                    h-full
                    min-w-0
                    w-full
                  "
                >
                  <ProductCard
                    product={
                      product
                    }
                  />
                </div>
              )
            )}
          </div>
        ) : (
          /* ===============================================
             NO RESULTS
          =============================================== */

          <div
            className="
              relative

              flex
              min-h-[360px]
              w-full
              flex-col
              items-center
              justify-center

              overflow-hidden

              rounded-[28px]

              border
              border-[#EAE3F1]

              bg-gradient-to-br
              from-[#FBF9FF]
              via-white
              to-[#FFF4F7]

              px-5
              py-12

              text-center

              shadow-[0_22px_60px_rgba(64,48,87,0.05)]

              sm:min-h-[400px]
              sm:rounded-[34px]
              sm:px-8
            "
          >
            {/* Atmosphere */}

            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-20

                h-56
                w-56

                rounded-full

                bg-[#B8A1FF]/15

                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -right-20

                h-56
                w-56

                rounded-full

                bg-[#F2B8C6]/15

                blur-3xl
              "
            />

            {/* Icon */}

            <div
              aria-hidden="true"
              className="
                relative

                flex
                h-[68px]
                w-[68px]
                items-center
                justify-center

                rounded-[22px]

                border
                border-[#E1D7F3]

                bg-white

                text-[#6C5CE7]

                shadow-[0_12px_30px_rgba(83,62,113,0.10)]

                sm:h-[76px]
                sm:w-[76px]
              "
            >
              <SearchIcon
                className="
                  h-7
                  w-7

                  sm:h-8
                  sm:w-8
                "
              />
            </div>

            <p
              className="
                relative

                mt-5

                text-[9px]
                font-black
                uppercase
                tracking-[0.22em]

                text-[#9A79E8]

                sm:text-[11px]
              "
            >
              Velmora
              Discovery
            </p>

            <h2
              className="
                relative

                mt-2

                text-xl
                font-extrabold
                tracking-[-0.025em]

                text-[#2F3136]

                sm:text-2xl
              "
            >
              {query.trim()
                ? "No beauty match found."
                : "Our collection is being refreshed."}
            </h2>

            <p
              className="
                relative

                mt-3

                max-w-[480px]

                text-sm
                leading-7

                text-[#77717C]

                sm:text-base
              "
            >
              {query.trim()
                ? `We couldn't find a Velmora product matching “${query}”. Try another product name or explore the complete collection.`
                : "New Velmora beauty selections will appear here when they become available."}
            </p>

            {query.trim() && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="
                  relative

                  mt-6

                  min-h-[50px]

                  rounded-xl

                  bg-gradient-to-r
                  from-[#6C5CE7]
                  to-[#927EF1]

                  px-6

                  text-sm
                  font-bold

                  text-white

                  shadow-[0_10px_24px_rgba(108,92,231,0.22)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_rgba(108,92,231,0.29)]

                  active:scale-[0.98]

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B8A1FF]
                  focus-visible:ring-offset-2
                "
              >
                Explore All
                Velmora
                Products
              </button>
            )}

            <div
              className="
                relative

                mt-7

                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-8

                  bg-[#EADBC8]
                "
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#99919D]
                "
              >
                Beauty ·
                Skincare ·
                Confidence
              </span>

              <span
                className="
                  h-px
                  w-8

                  bg-[#EADBC8]
                "
              />
            </div>
          </div>
        )}
      </section>

      {/* ===================================================
          SEARCH FOOTER
      =================================================== */}

      {!isLoading &&
        !fetchError &&
        filteredProducts.length >
          0 && (
          <section
            className="
              relative
              z-10

              px-3
              pb-10
              pt-2

              sm:px-6
              sm:pb-14

              lg:px-8
            "
          >
            <div
              className="
                mx-auto
                max-w-[1050px]

                rounded-[26px]

                border
                border-[#E8E1F1]

                bg-gradient-to-r
                from-[#F5F1FF]
                via-white
                to-[#FFF2F6]

                px-5
                py-8

                text-center

                sm:rounded-[32px]
                sm:px-8
                sm:py-10
              "
            >
              <div
                className="
                  mx-auto

                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-br
                  from-[#6C5CE7]
                  to-[#B8A1FF]

                  text-white

                  shadow-[0_10px_24px_rgba(108,92,231,0.20)]
                "
              >
                ✦
              </div>

              <p
                className="
                  mt-5

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]

                  text-[#6C5CE7]

                  sm:text-[11px]
                "
              >
                Velmora
                Discovery
              </p>

              <h3
                className="
                  mt-2

                  text-xl
                  font-extrabold
                  tracking-[-0.025em]

                  text-[#2F3136]

                  sm:text-2xl
                "
              >
                Finding beauty
                should feel
                effortless.
              </h3>

              <p
                className="
                  mx-auto
                  mt-3

                  max-w-xl

                  text-sm
                  leading-7

                  text-[#77717C]
                "
              >
                Velmora is
                designed to help
                you move from
                inspiration to
                discovery with
                less noise and
                more confidence.
              </p>
            </div>
          </section>
        )}
    </main>
  );
}