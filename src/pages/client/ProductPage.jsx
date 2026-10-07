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
VELMORA COLLECTION PAGE
=========================================================

Brand Palette

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Charcoal         #2F3136
Muted Text       #6B7280

Direction:
Quiet Luxury
Modern Beauty
Editorial Ecommerce
Soft Sophistication
=========================================================
*/

/* =========================================================
   SMALL DECORATIVE HERO VISUAL
========================================================= */

function CollectionVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-[1/0.88]
        w-full
        max-w-[430px]

        sm:aspect-square

        lg:max-w-[470px]
      "
    >
      {/* Main glass surface */}

      <div
        className="
          absolute
          inset-[3%]

          overflow-hidden

          rounded-[34px]

          border
          border-white/80

          bg-gradient-to-br
          from-white/80
          via-[#F8F4FF]/85
          to-[#FFF1F5]/80

          shadow-[0_35px_90px_rgba(70,53,100,0.13)]

          backdrop-blur-xl

          sm:rounded-[42px]
        "
      >
        {/* Lavender glow */}

        <div
          className="
            absolute
            -left-16
            top-3

            h-52
            w-52

            rounded-full

            bg-[#B8A1FF]/30

            blur-[65px]
          "
        />

        {/* Rose glow */}

        <div
          className="
            absolute
            -bottom-20
            -right-10

            h-56
            w-56

            rounded-full

            bg-[#F2B8C6]/30

            blur-[70px]
          "
        />

        {/* Champagne glow */}

        <div
          className="
            absolute
            right-[18%]
            top-[12%]

            h-28
            w-28

            rounded-full

            bg-[#EADBC8]/45

            blur-[40px]
          "
        />
      </div>

      {/* =============================================
          SERUM
      ============================================= */}

      <div
        className="
          absolute
          bottom-[18%]
          left-[13%]

          h-[49%]
          w-[22%]

          transition-all
          duration-700

          hover:-translate-y-2
          hover:rotate-[-2deg]
        "
      >
        {/* Gold top */}

        <div
          className="
            absolute
            left-1/2
            top-0

            h-[15%]
            w-[42%]

            -translate-x-1/2

            rounded-t-xl
            rounded-b-md

            bg-gradient-to-b
            from-[#D8BE8B]
            via-[#B9955B]
            to-[#98713E]

            shadow-md
          "
        />

        {/* Neck */}

        <div
          className="
            absolute
            left-1/2
            top-[13%]

            h-[10%]
            w-[31%]

            -translate-x-1/2

            bg-[#EADBC8]
          "
        />

        {/* Bottle */}

        <div
          className="
            absolute
            bottom-0

            h-[79%]
            w-full

            overflow-hidden

            rounded-t-[28%]
            rounded-b-[21%]

            border
            border-white

            bg-gradient-to-br
            from-white/85
            via-[#DCD2FF]/70
            to-[#A891ED]/75

            shadow-[0_20px_35px_rgba(72,53,105,0.20)]
          "
        >
          <div
            className="
              absolute
              left-[13%]
              top-[8%]

              h-[70%]
              w-[11%]

              rounded-full

              bg-white/40

              blur-[1px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[39%]

              w-[72%]

              -translate-x-1/2

              rounded-md

              bg-white/88

              px-1
              py-2

              text-center
            "
          >
            <p
              className="
                text-[6px]
                font-black
                tracking-[0.16em]

                text-[#6C5CE7]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[4px]
                uppercase
                tracking-[0.12em]

                text-[#958B9D]

                sm:text-[5px]
              "
            >
              serum
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          CREAM JAR
      ============================================= */}

      <div
        className="
          absolute
          bottom-[16%]
          left-[38%]

          h-[28%]
          w-[29%]

          transition-all
          duration-700

          hover:-translate-y-2
        "
      >
        {/* Body */}

        <div
          className="
            absolute
            bottom-0

            h-[68%]
            w-full

            overflow-hidden

            rounded-[34%]

            border
            border-white

            bg-gradient-to-br
            from-white
            via-[#FFF0F4]
            to-[#ECC6D1]

            shadow-[0_18px_32px_rgba(74,58,94,0.15)]
          "
        >
          <div
            className="
              absolute
              left-1/2
              top-[36%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[6px]
                font-black
                tracking-[0.15em]

                text-[#6C5CE7]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[4px]
                uppercase
                tracking-[0.1em]

                text-[#978D97]

                sm:text-[5px]
              "
            >
              cream
            </p>
          </div>
        </div>

        {/* Lid */}

        <div
          className="
            absolute
            left-[3%]
            top-[14%]

            h-[29%]
            w-[94%]

            rounded-[40%]

            bg-gradient-to-br
            from-[#D4C7FF]
            via-[#B8A1FF]
            to-[#8B73D8]

            shadow-lg
          "
        />
      </div>

      {/* =============================================
          PERFUME
      ============================================= */}

      <div
        className="
          absolute
          bottom-[20%]
          right-[12%]

          h-[43%]
          w-[22%]

          transition-all
          duration-700

          hover:-translate-y-2
          hover:rotate-[2deg]
        "
      >
        {/* Cap */}

        <div
          className="
            absolute
            left-1/2
            top-0

            h-[17%]
            w-[48%]

            -translate-x-1/2

            rounded-md

            bg-[#2F3136]

            shadow-lg
          "
        />

        {/* Gold neck */}

        <div
          className="
            absolute
            left-1/2
            top-[15%]

            h-[9%]
            w-[30%]

            -translate-x-1/2

            bg-gradient-to-r
            from-[#B58A4D]
            via-[#E1C38D]
            to-[#A97B3E]
          "
        />

        {/* Bottle */}

        <div
          className="
            absolute
            bottom-0

            h-[79%]
            w-full

            overflow-hidden

            rounded-[18%]

            border
            border-white

            bg-gradient-to-br
            from-white/85
            via-[#F5DCE4]/75
            to-[#DCA5B7]/78

            shadow-[0_20px_34px_rgba(77,59,98,0.18)]
          "
        >
          <div
            className="
              absolute
              left-[12%]
              top-[8%]

              h-[65%]
              w-[10%]

              rounded-full

              bg-white/40
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[40%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[6px]
                font-black
                tracking-[0.15em]

                text-[#5B456B]

                sm:text-[8px]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[4px]
                uppercase
                tracking-[0.1em]

                text-[#806F79]

                sm:text-[5px]
              "
            >
              essence
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          PLATFORM
      ============================================= */}

      <div
        className="
          absolute
          bottom-[10%]
          left-1/2

          h-[13%]
          w-[68%]

          -translate-x-1/2

          rounded-[50%]

          bg-gradient-to-b
          from-white
          to-[#E6DDEA]

          shadow-[0_25px_32px_rgba(65,48,87,0.15)]
        "
      />

      {/* Floating label 1 */}

      <div
        className="
          absolute
          left-[1%]
          top-[15%]

          rounded-xl

          border
          border-white

          bg-white/80

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
            tracking-[0.14em]

            text-[#6C5CE7]

            sm:text-[10px]
          "
        >
          ✦ Curated
        </p>

        <p
          className="
            mt-1

            text-[8px]
            font-semibold

            text-[#756E79]

            sm:text-[11px]
          "
        >
          Beauty essentials
        </p>
      </div>

      {/* Floating label 2 */}

      <div
        className="
          absolute
          right-[0%]
          top-[24%]

          rounded-xl

          border
          border-white

          bg-white/80

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
            tracking-[0.14em]

            text-[#B26B83]

            sm:text-[10px]
          "
        >
          ♡ Refined
        </p>

        <p
          className="
            mt-1

            text-[8px]
            font-semibold

            text-[#756E79]

            sm:text-[11px]
          "
        >
          Made for rituals
        </p>
      </div>

      {/* Bottom brand mark */}

      <div
        className="
          absolute
          bottom-[1%]
          left-1/2

          -translate-x-1/2

          whitespace-nowrap

          rounded-full

          border
          border-white

          bg-white/75

          px-4
          py-2

          text-[8px]
          font-black
          uppercase
          tracking-[0.18em]

          text-[#8C7B9A]

          shadow-sm

          backdrop-blur-xl

          sm:text-[10px]
        "
      >
        The Velmora Edit
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON CARD
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
      {/* Image */}

      <div
        className="
          relative

          h-[205px]
          w-full

          overflow-hidden

          bg-gradient-to-br
          from-[#F6F3FA]
          via-[#F0ECF5]
          to-[#F8F1F4]

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
            via-white/40
            to-transparent
          "
        />
      </div>

      {/* Content */}

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

            bg-[#ECE7F1]
          "
        />

        <div
          className="
            mt-4
            h-5
            w-3/4

            animate-pulse

            rounded-lg

            bg-[#E8E3ED]
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

              bg-[#E2DEE5]
            "
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PRODUCT PAGE
========================================================= */

export default function ProductPage() {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const topRef =
    useRef(null);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    axios
      .get(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/product"
      )
      .then((res) => {
        setProducts(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );

        setIsLoading(
          false
        );
      })
      .catch((err) => {
        console.error(
          "Error fetching products:",
          err
        );

        setProducts([]);

        setIsLoading(
          false
        );
      });
  }, []);

  /* =====================================================
     START AT TOP
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
     COLLECTION METRICS
  ===================================================== */

  const availableCount =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Boolean(
              product.isAvailable
            ) &&
            Number(
              product.stock
            ) > 0
        ).length,
      [products]
    );

  const offerCount =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Number(
              product.labelPrice
            ) >
            Number(
              product.price
            )
        ).length,
      [products]
    );

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

        pb-12

        pt-[72px]

        md:pt-[80px]
      "
    >
      {/* Background ambience */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-[500px]

          h-[360px]
          w-[360px]

          rounded-full

          bg-[#B8A1FF]/8

          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-36
          top-[900px]

          h-[400px]
          w-[400px]

          rounded-full

          bg-[#F2B8C6]/10

          blur-[120px]
        "
      />

      {/* ===================================================
          LUXURY HERO
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
          {/* Background decoration */}

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

              gap-7

              px-5
              py-9

              sm:px-9
              sm:py-12

              lg:min-h-[530px]
              lg:grid-cols-[0.94fr_1.06fr]
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

                The Velmora
                Collection
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
                Find beauty
                that feels{" "}

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
                  unmistakably
                  yours.
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
                Explore
                Velmora's
                thoughtfully
                curated
                collection of
                skincare,
                makeup,
                haircare and
                body essentials
                designed to
                bring elegance
                and confidence
                into your
                everyday
                ritual.
              </p>

              {/* Collection stats */}

              <div
                className="
                  mt-8

                  grid
                  grid-cols-3
                  gap-2

                  sm:max-w-[500px]
                  sm:gap-3
                "
              >
                <div
                  className="
                    rounded-2xl

                    border
                    border-white

                    bg-white/60

                    p-3

                    backdrop-blur-xl

                    sm:p-4
                  "
                >
                  <p
                    className="
                      text-lg
                      font-extrabold
                      text-[#6C5CE7]

                      sm:text-2xl
                    "
                  >
                    {
                      products.length
                    }
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      font-semibold

                      text-[#7B7480]

                      sm:text-xs
                    "
                  >
                    Curated
                    pieces
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl

                    border
                    border-white

                    bg-white/60

                    p-3

                    backdrop-blur-xl

                    sm:p-4
                  "
                >
                  <p
                    className="
                      text-lg
                      font-extrabold
                      text-[#4F9D7A]

                      sm:text-2xl
                    "
                  >
                    {
                      availableCount
                    }
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      font-semibold

                      text-[#7B7480]

                      sm:text-xs
                    "
                  >
                    Available
                    now
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl

                    border
                    border-white

                    bg-white/60

                    p-3

                    backdrop-blur-xl

                    sm:p-4
                  "
                >
                  <p
                    className="
                      text-lg
                      font-extrabold
                      text-[#B86882]

                      sm:text-2xl
                    "
                  >
                    {
                      offerCount
                    }
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      font-semibold

                      text-[#7B7480]

                      sm:text-xs
                    "
                  >
                    Beauty
                    offers
                  </p>
                </div>
              </div>

              {/* Luxury microcopy */}

              <div
                className="
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

                    bg-[#B9955B]
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]

                    text-[#94879C]

                    sm:text-[10px]
                  "
                >
                  Beauty ·
                  Skincare ·
                  Confidence
                </p>
              </div>
            </div>

            {/* =========================================
                HERO VISUAL
            ========================================= */}

            <CollectionVisual />
          </div>
        </div>
      </section>

      {/* ===================================================
          COLLECTION INTRO
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
              Shop the Edit
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
              The Velmora
              Edit
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
              Thoughtfully
              selected beauty
              essentials for
              rituals that feel
              personal,
              effortless and
              refined.
            </p>
          </div>

          {!isLoading && (
            <div
              aria-live="polite"
              className="
                inline-flex
                min-h-[40px]
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
                products.length
              }{" "}
              {products.length ===
              1
                ? "selection"
                : "selections"}
            </div>
          )}
        </div>
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
            LOADING
        ================================================= */}

        {isLoading ? (
          <div
            aria-label="Loading Velmora products"
            className="
              grid
              grid-cols-1

              gap-4

              sm:grid-cols-2
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
        ) : products.length >
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
            {products.map(
              (
                product
              ) => (
                <div
                  key={
                    product.productId
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
             EMPTY STATE
          =============================================== */

          <div
            className="
              relative

              flex
              min-h-[340px]
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

              sm:min-h-[380px]
              sm:rounded-[34px]
              sm:px-8
            "
          >
            {/* glows */}

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

            <div
              aria-hidden="true"
              className="
                relative

                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                border
                border-[#E1D7F3]

                bg-white

                text-2xl
                text-[#6C5CE7]

                shadow-md

                sm:h-[72px]
                sm:w-[72px]
                sm:text-3xl
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
              Collection
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
              New beauty is
              on the way.
            </h2>

            <p
              className="
                relative

                mt-3

                max-w-[450px]

                text-sm
                leading-7

                text-[#77717C]

                sm:text-base
              "
            >
              Our collection
              is currently
              being refreshed.
              Check back soon
              to discover new
              Velmora
              selections for
              your beauty
              ritual.
            </p>

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

                  text-[#9A929D]
                "
              >
                Beauty · Care ·
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
          COLLECTION FOOTER MESSAGE
      =================================================== */}

      {!isLoading &&
        products.length >
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
                flex
                max-w-[1100px]
                flex-col
                items-center

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
                The Velmora
                Promise
              </p>

              <h3
                className="
                  mt-2

                  max-w-2xl

                  text-xl
                  font-extrabold
                  tracking-[-0.025em]

                  text-[#2F3136]

                  sm:text-2xl
                "
              >
                Thoughtful
                beauty,
                beautifully
                presented.
              </h3>

              <p
                className="
                  mt-3

                  max-w-xl

                  text-sm
                  leading-7

                  text-[#77717C]
                "
              >
                Each Velmora
                selection is
                presented to
                make discovery
                feel clear,
                elegant and
                personal from
                first glance to
                checkout.
              </p>
            </div>
          </section>
        )}
    </main>
  );
}