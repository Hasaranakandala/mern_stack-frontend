import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCart,
  addToCart,
} from "../../utils/cart.js";

import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";

import { BsCart3 } from "react-icons/bs";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
} from "react-icons/fa";

/* =========================================================
   STAR DISPLAY
========================================================= */

function Stars({ rating = 0 }) {
  const value = Number(rating) || 0;

  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        star <= Math.round(value) ? (
          <FaStar
            key={star}
            className="text-amber-400"
          />
        ) : (
          <FaRegStar
            key={star}
            className="text-gray-300"
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   STAR INPUT
========================================================= */

function StarInput({
  value,
  onChange,
  disabled = false,
}) {
  const [hoverRating, setHoverRating] =
    useState(0);

  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active =
          star <= (hoverRating || value);

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onMouseEnter={() =>
              !disabled &&
              setHoverRating(star)
            }
            onMouseLeave={() =>
              setHoverRating(0)
            }
            onClick={() =>
              !disabled &&
              onChange(star)
            }
            aria-label={`${star} star${
              star > 1 ? "s" : ""
            }`}
            className="
              text-2xl
              transition-transform
              duration-150

              hover:scale-110

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {active ? (
              <FaStar className="text-amber-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   REVIEW SECTION
========================================================= */

function ReviewSection({ productId }) {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [reviews, setReviews] =
    useState([]);

  const [reviewStatus, setReviewStatus] =
    useState("loading");

  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [sortBy, setSortBy] =
    useState("newest");

  async function fetchReviews() {
    try {
      setReviewStatus("loading");

      const response =
        await axios.get(
          `${
            import.meta.env
              .VITE_BACKEND_URL
          }/api/review/product/${productId}`
        );

      setReviews(
        response.data?.reviews || []
      );

      setReviewStatus("success");
    } catch (error) {
      console.error(
        "GET PRODUCT REVIEWS ERROR:",
        error
      );

      setReviews([]);
      setReviewStatus("error");
    }
  }

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const averageRating =
    useMemo(() => {
      if (reviews.length === 0) {
        return 0;
      }

      const total =
        reviews.reduce(
          (sum, review) =>
            sum +
            Number(
              review.rating || 0
            ),
          0
        );

      return total / reviews.length;
    }, [reviews]);

  const ratingDistribution =
    useMemo(() => {
      const result = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      reviews.forEach(
        (review) => {
          const value =
            Math.round(
              Number(
                review.rating
              )
            );

          if (
            result[value] !==
            undefined
          ) {
            result[value] += 1;
          }
        }
      );

      return result;
    }, [reviews]);

  const sortedReviews =
    useMemo(() => {
      const copy = [...reviews];

      if (
        sortBy === "highest"
      ) {
        return copy.sort(
          (a, b) =>
            Number(
              b.rating
            ) -
            Number(
              a.rating
            )
        );
      }

      if (
        sortBy === "lowest"
      ) {
        return copy.sort(
          (a, b) =>
            Number(
              a.rating
            ) -
            Number(
              b.rating
            )
        );
      }

      return copy.sort(
        (a, b) =>
          new Date(
            b.date
          ) -
          new Date(
            a.date
          )
      );
    }, [reviews, sortBy]);

  async function handleSubmitReview(
    event
  ) {
    event.preventDefault();

    if (!token) {
      toast.error(
        "Please login to write a review"
      );

      navigate("/login");

      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      toast.error(
        "Please select a rating"
      );
      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please enter your review"
      );
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${
          import.meta.env
            .VITE_BACKEND_URL
        }/api/review`,
        {
          productId,
          rating,
          comment:
            comment.trim(),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Review submitted successfully"
      );

      setRating(0);
      setComment("");

      await fetchReviews();
    } catch (error) {
      console.error(
        "CREATE REVIEW ERROR:",
        error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="reviews"
      className="
        w-full
        max-w-[1180px]
        mx-auto

        px-4
        sm:px-6
        lg:px-8

        pb-14
        sm:pb-16
      "
    >
      <div
        className="
          bg-white

          rounded-3xl

          border
          border-gray-100

          shadow-[0_4px_24px_rgba(0,0,0,0.05)]

          p-5
          sm:p-7
          lg:p-8
        "
      >
        {/* ================= HEADER ================= */}

        <div
          className="
            flex
            flex-col

            lg:flex-row
            lg:items-end
            lg:justify-between

            gap-5

            pb-6

            border-b
            border-gray-100
          "
        >
          <div>
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
                font-bold
              "
            >
              Customer Reviews
            </span>

            <h2
              className="
                mt-3

                text-2xl
                sm:text-3xl

                font-bold

                text-[#2F3542]
              "
            >
              What customers are saying
            </h2>

            <p
              className="
                mt-2

                text-sm
                leading-6
                text-gray-500
              "
            >
              You must be logged in to
              submit a review. Your
              backend also checks that
              you purchased and received
              this product.
            </p>
          </div>

          {reviews.length > 0 && (
            <div
              className="
                flex
                items-center

                gap-4

                px-5
                py-4

                rounded-2xl

                bg-red-50/60

                border
                border-red-100
              "
            >
              <div>
                <p
                  className="
                    text-3xl
                    font-black

                    leading-none

                    text-[#2F3542]
                  "
                >
                  {averageRating.toFixed(
                    1
                  )}
                </p>

                <p
                  className="
                    mt-1

                    text-xs
                    text-gray-400
                  "
                >
                  out of 5
                </p>
              </div>

              <div>
                <Stars
                  rating={
                    averageRating
                  }
                />

                <p
                  className="
                    mt-1

                    text-xs
                    text-gray-500
                  "
                >
                  {reviews.length}{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="
            grid
            grid-cols-1

            lg:grid-cols-[0.82fr_1.18fr]

            gap-6
            lg:gap-8

            pt-7
          "
        >
          {/* ================= LEFT SIDE ================= */}

          <div className="space-y-5">
            {/* RATING SUMMARY */}

            <div
              className="
                rounded-2xl

                bg-[#fffafa]

                border
                border-red-100

                p-5
              "
            >
              <h3
                className="
                  font-bold
                  text-[#2F3542]
                "
              >
                Rating summary
              </h3>

              {reviews.length ===
              0 ? (
                <p
                  className="
                    mt-3

                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  No ratings yet. Be the
                  first verified customer
                  to review this product.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {[5, 4, 3, 2, 1].map(
                    (star) => {
                      const count =
                        ratingDistribution[
                          star
                        ];

                      const percentage =
                        reviews.length > 0
                          ? Math.round(
                              (count /
                                reviews.length) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={star}
                          className="
                            grid
                            grid-cols-[42px_1fr_44px]
                            items-center

                            gap-3
                          "
                        >
                          <span
                            className="
                              flex
                              items-center

                              gap-1

                              text-sm
                              font-semibold
                              text-gray-600
                            "
                          >
                            {star}

                            <FaStar
                              className="
                                text-xs
                                text-amber-400
                              "
                            />
                          </span>

                          <div
                            className="
                              h-2.5

                              rounded-full

                              bg-gray-100

                              overflow-hidden
                            "
                          >
                            <div
                              className="
                                h-full

                                rounded-full

                                bg-amber-400

                                transition-all
                                duration-500
                              "
                              style={{
                                width:
                                  `${percentage}%`,
                              }}
                            />
                          </div>

                          <span
                            className="
                              text-right
                              text-xs
                              text-gray-400
                            "
                          >
                            {percentage}%
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ================= WRITE REVIEW ================= */}

            <div
              className="
                rounded-2xl

                border
                border-gray-100

                p-5
              "
            >
              <h3
                className="
                  text-lg
                  font-bold

                  text-[#2F3542]
                "
              >
                Write a review
              </h3>

              {!token ? (
                <div
                  className="
                    mt-4

                    rounded-2xl

                    bg-red-50

                    border
                    border-red-100

                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >
                    Please login before
                    writing a product
                    review.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login")
                    }
                    className="
                      mt-4

                      min-h-[44px]

                      px-5

                      rounded-xl

                      bg-red-500
                      text-white

                      text-sm
                      font-bold

                      transition

                      hover:bg-red-600
                    "
                  >
                    Login to Review
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={
                    handleSubmitReview
                  }
                  className="mt-5"
                >
                  <label
                    className="
                      block

                      text-sm
                      font-semibold

                      text-gray-700
                    "
                  >
                    Your rating
                  </label>

                  <div className="mt-2">
                    <StarInput
                      value={rating}
                      onChange={
                        setRating
                      }
                      disabled={
                        submitting
                      }
                    />
                  </div>

                  <label
                    htmlFor="review-comment"
                    className="
                      mt-5
                      block

                      text-sm
                      font-semibold

                      text-gray-700
                    "
                  >
                    Your review
                  </label>

                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(
                      event
                    ) =>
                      setComment(
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    maxLength={700}
                    disabled={
                      submitting
                    }
                    placeholder="Tell other customers what you think about this product..."
                    className="
                      mt-2

                      w-full

                      resize-none

                      rounded-2xl

                      border
                      border-gray-200

                      bg-white

                      px-4
                      py-3

                      text-sm
                      leading-6

                      text-[#2F3542]

                      outline-none

                      transition

                      placeholder:text-gray-400

                      focus:border-red-300
                      focus:ring-4
                      focus:ring-red-50

                      disabled:bg-gray-50
                    "
                  />

                  <div
                    className="
                      mt-2

                      flex
                      items-center
                      justify-between

                      gap-3
                    "
                  >
                    <span
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      {comment.length}/700
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Verified purchase
                      only
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      rating === 0 ||
                      !comment.trim()
                    }
                    className="
                      mt-4

                      w-full
                      min-h-[48px]

                      rounded-xl

                      bg-red-500
                      text-white

                      font-bold

                      transition-all
                      duration-200

                      hover:bg-red-600
                      hover:shadow-md

                      disabled:bg-gray-300
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div>
            <div
              className="
                flex
                flex-col

                sm:flex-row
                sm:items-center
                sm:justify-between

                gap-3

                mb-4
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-bold

                    text-[#2F3542]
                  "
                >
                  Customer feedback
                </h3>

                <p
                  className="
                    mt-1

                    text-xs
                    text-gray-400
                  "
                >
                  {reviews.length} total
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(
                  event
                ) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="
                  min-h-[44px]

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  px-3

                  text-sm
                  text-gray-600

                  outline-none

                  focus:border-red-300
                  focus:ring-4
                  focus:ring-red-50
                "
              >
                <option value="newest">
                  Newest
                </option>

                <option value="highest">
                  Highest rating
                </option>

                <option value="lowest">
                  Lowest rating
                </option>
              </select>
            </div>

            {reviewStatus ===
              "loading" && (
              <div
                className="
                  rounded-2xl

                  border
                  border-gray-100

                  p-8

                  text-center

                  text-sm
                  text-gray-400
                "
              >
                Loading reviews...
              </div>
            )}

            {reviewStatus ===
              "error" && (
              <div
                className="
                  rounded-2xl

                  border
                  border-red-100

                  bg-red-50

                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold

                    text-red-600
                  "
                >
                  Reviews could not be
                  loaded.
                </p>

                <button
                  type="button"
                  onClick={
                    fetchReviews
                  }
                  className="
                    mt-3

                    text-sm
                    font-bold

                    text-red-500

                    hover:text-red-600
                  "
                >
                  Try again
                </button>
              </div>
            )}

            {reviewStatus ===
              "success" &&
              sortedReviews.length ===
                0 && (
                <div
                  className="
                    rounded-2xl

                    border
                    border-dashed
                    border-gray-200

                    p-8

                    text-center
                  "
                >
                  <div className="text-3xl">
                    ☆
                  </div>

                  <h4
                    className="
                      mt-3

                      font-bold

                      text-[#2F3542]
                    "
                  >
                    No reviews yet
                  </h4>

                  <p
                    className="
                      mt-2

                      text-sm
                      leading-6

                      text-gray-500
                    "
                  >
                    Be the first verified
                    customer to review this
                    product.
                  </p>
                </div>
              )}

            {reviewStatus ===
              "success" &&
              sortedReviews.length >
                0 && (
                <div className="space-y-4">
                  {sortedReviews.map(
                    (review) => (
                      <article
                        key={
                          review._id
                        }
                        className="
                          rounded-2xl

                          border
                          border-gray-100

                          bg-white

                          p-5

                          transition

                          hover:border-red-100
                          hover:shadow-sm
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
                              w-11
                              h-11

                              shrink-0

                              rounded-full

                              bg-red-50
                              text-red-500

                              flex
                              items-center
                              justify-center

                              font-black
                            "
                          >
                            {(
                              review.name ||
                              review.email ||
                              "C"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <div
                              className="
                                flex
                                flex-col

                                sm:flex-row
                                sm:items-start
                                sm:justify-between

                                gap-2
                              "
                            >
                              <div>
                                <p
                                  className="
                                    font-bold

                                    text-[#2F3542]
                                  "
                                >
                                  {review.name ||
                                    review.email ||
                                    "Customer"}
                                </p>

                                <div
                                  className="
                                    mt-1

                                    flex
                                    flex-wrap
                                    items-center

                                    gap-2
                                  "
                                >
                                  <Stars
                                    rating={
                                      review.rating
                                    }
                                  />

                                  {review.verifiedPurchase && (
                                    <span
                                      className="
                                        inline-flex
                                        items-center

                                        gap-1

                                        text-[11px]
                                        font-bold

                                        text-green-600
                                      "
                                    >
                                      <FaCheckCircle />

                                      Verified
                                      Purchase
                                    </span>
                                  )}
                                </div>
                              </div>

                              <time
                                className="
                                  text-xs
                                  text-gray-400
                                "
                              >
                                {review.date
                                  ? new Date(
                                      review.date
                                    ).toLocaleDateString()
                                  : ""}
                              </time>
                            </div>

                            <p
                              className="
                                mt-4

                                whitespace-pre-wrap

                                text-sm
                                sm:text-[15px]

                                leading-7

                                text-gray-600
                              "
                            >
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PRODUCT OVERVIEW
========================================================= */

export default function ProductOverview() {
  const params = useParams();
  const productId = params.id;

  const navigate = useNavigate();

  const [status, setStatus] =
    useState("loading");

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    axios
      .get(
        import.meta.env
          .VITE_BACKEND_URL +
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
            We couldn't load this
            product.
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
          ((Number(
            product.labelPrice
          ) -
            Number(
              product.price
            )) /
            Number(
              product.labelPrice
            )) *
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

            <span className="text-gray-300">
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

            <span className="text-gray-300">
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
              <ImageSlider
                images={
                  product.images || []
                }
              />
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

              {/* Review jump */}

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(
                      "reviews"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                      block:
                        "start",
                    })
                }
                className="
                  mt-3

                  inline-flex
                  items-center

                  gap-2

                  text-sm
                  font-semibold

                  text-gray-500

                  transition

                  hover:text-red-500
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-1
                  "
                >
                  <FaStar className="text-amber-400" />
                  <FaStar className="text-amber-400" />
                  <FaStar className="text-amber-400" />
                  <FaStar className="text-amber-400" />
                  <FaStar className="text-amber-400" />
                </span>

                View customer reviews ↓
              </button>

              {/* Alternative Names */}

              {product.alternativeName
                ?.length > 0 && (
                <div
                  className="
                    flex
                    flex-wrap

                    gap-2

                    mt-4
                  "
                >
                  {product.alternativeName.map(
                    (
                      name,
                      index
                    ) => (
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
                    )
                  )}
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
                  Rs.{" "}
                  {Number(
                    product.price
                  ).toLocaleString()}
                </span>

                {hasDiscount && (
                  <span
                    className="
                      text-sm
                      sm:text-base

                      text-gray-400

                      line-through
                    "
                  >
                    Rs.{" "}
                    {Number(
                      product.labelPrice
                    ).toLocaleString()}
                  </span>
                )}

                {hasDiscount && (
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
                    {discountPercentage}% OFF
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
                  {product.description ||
                    "No description available."}
                </p>
              </section>

              {/* ================= STOCK ================= */}

              <div className="mt-5">
                {product.isAvailable &&
                product.stock > 0 ? (
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
                  onClick={
                    handleAddToCart
                  }
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
                  <span
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <BsCart3 />
                    Add to Cart
                  </span>
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

      {/* ================= REVIEWS ================= */}

      <ReviewSection
        productId={
          product.productId
        }
      />
    </main>
  );
}
