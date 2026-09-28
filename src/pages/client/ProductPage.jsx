import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard";

import {  useLayoutEffect, useRef } from "react";
export default function ProductPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
        "/api/product"
      )
      .then((res) => {

        setProducts(res.data);
        setIsLoading(false);

      })
      .catch((err) => {

        console.error(
          "Error fetching products:",
          err
        );

        setIsLoading(false);

      });

  }, []);
  const topRef = useRef(null);

useLayoutEffect(() => {
  topRef.current?.scrollIntoView({
    behavior: "auto",
    block: "start"
  });
}, []);


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

      {/* ================= HERO SECTION ================= */}

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
              Explore Our Products
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
              Discover our latest collection and find products
              that suit your style and needs.
            </p>

          </div>

        </div>

      </section>



      {/* ================= PRODUCT SECTION ================= */}

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

        {/* SECTION HEADER */}

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
              All Products
            </h2>


            <p
              className="
                mt-1

                text-xs
                sm:text-sm

                text-gray-500
              "
            >
              Browse all currently available products.
            </p>

          </div>


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
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </div>

          )}

        </div>



        {/* ================= LOADING ================= */}

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

                  {/* Image Skeleton */}

                  <div
                    className="
                      w-full

                      aspect-[4/3]

                      bg-gray-200
                    "
                  />


                  {/* Content Skeleton */}

                  <div
                    className="
                      p-4
                      sm:p-5
                    "
                  >

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

        ) : products.length > 0 ? (

          /* ================= PRODUCT GRID ================= */

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

            {products.map((product) => (

              <div
                key={product.productId}

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

            ))}

          </div>

        ) : (

          /* ================= EMPTY STATE ================= */

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
              🛍️
            </div>


            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-[#2F3542]
              "
            >
              No products available
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
              We currently don't have any products to display.
              Please check again later.
            </p>

          </div>

        )}

      </section>

    </main>

  );

}