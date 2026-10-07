import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
   VELMORA DESIGN SYSTEM

   Primary        #6C5CE7
   Lavender       #B8A1FF
   Soft Rose      #F2B8C6
   Champagne      #EADBC8
   Warm Ivory     #FAF9F7
   Surface        #FFFFFF
   Charcoal       #2F3136
   Secondary      #6B7280
   Success        #4F9D7A
========================================================= */

/* =========================================================
   STAR DISPLAY
========================================================= */

function Stars({
  rating = 0,
  size = "text-sm",
}) {
  const value =
    Number(rating) || 0;

  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(
        (star) =>
          star <=
          Math.round(value) ? (
            <FaStar
              key={star}
              className={`
                ${size}
                text-[#D4A84F]
              `}
            />
          ) : (
            <FaRegStar
              key={star}
              className={`
                ${size}
                text-[#DDD8E6]
              `}
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
  const [
    hoverRating,
    setHoverRating,
  ] = useState(0);

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2
      "
    >
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const active =
            star <=
            (hoverRating ||
              value);

          return (
            <button
              key={star}
              type="button"
              disabled={
                disabled
              }
              onMouseEnter={() =>
                !disabled &&
                setHoverRating(
                  star
                )
              }
              onMouseLeave={() =>
                setHoverRating(
                  0
                )
              }
              onClick={() =>
                !disabled &&
                onChange(star)
              }
              aria-label={`${star} star${
                star > 1
                  ? "s"
                  : ""
              }`}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-2xl
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#F7F3FF]
                hover:scale-105

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B8A1FF]

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {active ? (
                <FaStar className="text-[#D4A84F]" />
              ) : (
                <FaRegStar className="text-[#DDD8E6]" />
              )}
            </button>
          );
        }
      )}
    </div>
  );
}

/* =========================================================
   SMALL TRUST FEATURE
========================================================= */

function TrustFeature({
  icon,
  title,
  text,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-2xl
        border
        border-[#EEE8F8]
        bg-white/70
        p-4
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-[#D8CCFA]
        hover:shadow-[0_12px_30px_rgba(108,92,231,0.08)]
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
          bg-[#F2EDFF]
          text-[#6C5CE7]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-sm
            font-bold
            text-[#2F3136]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[#7A7481]
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW SECTION
========================================================= */

function ReviewSection({
  productId,
}) {
  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    reviewStatus,
    setReviewStatus,
  ] = useState("loading");

  const [
    rating,
    setRating,
  ] = useState(0);

  const [
    comment,
    setComment,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    sortBy,
    setSortBy,
  ] = useState("newest");

  async function fetchReviews() {
    try {
      setReviewStatus(
        "loading"
      );

      const response =
        await axios.get(
          `${
            import.meta.env
              .VITE_BACKEND_URL
          }/api/review/product/${productId}`
        );

      setReviews(
        response.data
          ?.reviews || []
      );

      setReviewStatus(
        "success"
      );
    } catch (error) {
      console.error(
        "GET PRODUCT REVIEWS ERROR:",
        error
      );

      setReviews([]);

      setReviewStatus(
        "error"
      );
    }
  }

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  /* ===============================
     AVERAGE RATING
  =============================== */

  const averageRating =
    useMemo(() => {
      if (
        reviews.length === 0
      ) {
        return 0;
      }

      const total =
        reviews.reduce(
          (
            sum,
            review
          ) =>
            sum +
            Number(
              review.rating ||
                0
            ),
          0
        );

      return (
        total /
        reviews.length
      );
    }, [reviews]);

  /* ===============================
     RATING DISTRIBUTION
  =============================== */

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
            result[value] +=
              1;
          }
        }
      );

      return result;
    }, [reviews]);

  /* ===============================
     SORT REVIEWS
  =============================== */

  const sortedReviews =
    useMemo(() => {
      const copy = [
        ...reviews,
      ];

      if (
        sortBy ===
        "highest"
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
        sortBy ===
        "lowest"
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
    }, [
      reviews,
      sortBy,
    ]);

  /* ===============================
     SUBMIT REVIEW
  =============================== */

  async function handleSubmitReview(
    event
  ) {
    event.preventDefault();

    if (!token) {
      toast.error(
        "Please login to write a review"
      );

      navigate(
        "/login"
      );

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

    if (
      !comment.trim()
    ) {
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
        "Thank you for sharing your Velmora experience"
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
        mx-auto
        w-full
        max-w-[1220px]
        px-3
        pb-20
        sm:px-5
        lg:px-8
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border
          border-[#EDE7F6]
          bg-white
          p-4
          shadow-[0_24px_70px_rgba(59,44,92,0.06)]

          sm:rounded-[32px]
          sm:p-7

          lg:p-9
        "
      >
        {/* Luxury decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#B8A1FF]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-20
            h-64
            w-64
            rounded-full
            bg-[#F2B8C6]/10
            blur-3xl
          "
        />

        {/* ================= HEADER ================= */}

        <div
          className="
            relative
            flex
            flex-col
            gap-5
            border-b
            border-[#F0EBF7]
            pb-6

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div
            className="
              max-w-2xl
            "
          >
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[#DED4FF]
                bg-[#F7F3FF]
                px-3
                py-1.5
                text-[11px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#6C5CE7]
              "
            >
              Velmora
              Community
            </span>

            <h2
              className="
                mt-4
                text-2xl
                font-extrabold
                tracking-[-0.03em]
                text-[#2F3136]

                sm:text-3xl
                lg:text-[34px]
              "
            >
              Real experiences.
              Refined beauty.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-[#74707A]
              "
            >
              Discover what
              verified customers
              think about this
              Velmora selection
              and share your own
              experience after
              purchase.
            </p>
          </div>

          {reviews.length >
            0 && (
            <div
              className="
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-[#E6DFFD]
                bg-gradient-to-br
                from-[#F8F5FF]
                to-[#FFF8FA]
                px-5
                py-4

                sm:w-auto
              "
            >
              <div>
                <p
                  className="
                    text-3xl
                    font-black
                    leading-none
                    text-[#2F3136]
                  "
                >
                  {averageRating.toFixed(
                    1
                  )}
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-[#8B8493]
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
                    text-[#6B7280]
                  "
                >
                  {
                    reviews.length
                  }{" "}
                  {reviews.length ===
                  1
                    ? "review"
                    : "reviews"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= REVIEW GRID ================= */}

        <div
          className="
            relative
            grid
            grid-cols-1
            gap-7
            pt-7

            lg:grid-cols-[0.82fr_1.18fr]
            lg:gap-10
          "
        >
          {/* =========================================
              LEFT
          ========================================= */}

          <div className="space-y-5">
            {/* RATING SUMMARY */}

            <div
              className="
                rounded-2xl
                border
                border-[#EEE8F8]
                bg-[#FCFAFF]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <h3
                  className="
                    font-bold
                    text-[#2F3136]
                  "
                >
                  Rating
                  overview
                </h3>

                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#9A79E8]
                  "
                >
                  Customer
                  sentiment
                </span>
              </div>

              {reviews.length ===
              0 ? (
                <p
                  className="
                    mt-4
                    text-sm
                    leading-6
                    text-[#74707A]
                  "
                >
                  No ratings
                  yet. Be the
                  first verified
                  customer to
                  share your
                  Velmora
                  experience.
                </p>
              ) : (
                <div
                  className="
                    mt-5
                    space-y-3
                  "
                >
                  {[5, 4, 3, 2, 1].map(
                    (star) => {
                      const count =
                        ratingDistribution[
                          star
                        ];

                      const percentage =
                        reviews.length >
                        0
                          ? Math.round(
                              (count /
                                reviews.length) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={
                            star
                          }
                          className="
                            grid
                            grid-cols-[38px_1fr_40px]
                            items-center
                            gap-2
                            sm:grid-cols-[42px_1fr_44px]
                            sm:gap-3
                          "
                        >
                          <span
                            className="
                              flex
                              items-center
                              gap-1
                              text-xs
                              font-semibold
                              text-[#5F5965]

                              sm:text-sm
                            "
                          >
                            {
                              star
                            }

                            <FaStar
                              className="
                                text-[10px]
                                text-[#D4A84F]
                              "
                            />
                          </span>

                          <div
                            className="
                              h-2
                              overflow-hidden
                              rounded-full
                              bg-[#EEEAF3]
                            "
                          >
                            <div
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-[#6C5CE7]
                                to-[#B8A1FF]
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
                              text-[11px]
                              text-[#9B96A0]

                              sm:text-xs
                            "
                          >
                            {
                              percentage
                            }
                            %
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* WRITE REVIEW */}

            <div
              className="
                rounded-2xl
                border
                border-[#EEE8F8]
                bg-white
                p-5
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#9A79E8]
                "
              >
                Your
                experience
              </p>

              <h3
                className="
                  mt-2
                  text-lg
                  font-extrabold
                  text-[#2F3136]
                "
              >
                Write a review
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[#77717C]
                "
              >
                Help the
                Velmora
                community make
                confident beauty
                choices.
              </p>

              {!token ? (
                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-[#E4DBFF]
                    bg-[#F8F5FF]
                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      leading-6
                      text-[#625C69]
                    "
                  >
                    Sign in to
                    share your
                    experience.
                    Reviews are
                    reserved for
                    eligible
                    customers.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/login"
                      )
                    }
                    className="
                      mt-4
                      min-h-[46px]
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#8E7AF0]
                      px-5
                      text-sm
                      font-bold
                      text-white
                      shadow-[0_8px_20px_rgba(108,92,231,0.18)]
                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_12px_26px_rgba(108,92,231,0.26)]

                      sm:w-auto
                    "
                  >
                    Sign in to
                    Review
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
                      text-[#48434D]
                    "
                  >
                    Your rating
                  </label>

                  <div className="mt-2">
                    <StarInput
                      value={
                        rating
                      }
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
                      text-[#48434D]
                    "
                  >
                    Your review
                  </label>

                  <textarea
                    id="review-comment"
                    value={
                      comment
                    }
                    onChange={(
                      event
                    ) =>
                      setComment(
                        event
                          .target
                          .value
                      )
                    }
                    rows={5}
                    maxLength={
                      700
                    }
                    disabled={
                      submitting
                    }
                    placeholder="Tell the Velmora community about your experience with this product..."
                    className="
                      mt-2
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-[#E4DFEA]
                      bg-[#FFFEFF]
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-[#2F3136]
                      outline-none
                      transition-all
                      duration-200

                      placeholder:text-[#AAA4AF]

                      focus:border-[#B8A1FF]
                      focus:ring-4
                      focus:ring-[#B8A1FF]/15

                      disabled:bg-[#F8F7F9]
                    "
                  />

                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-xs
                        text-[#A19BA6]
                      "
                    >
                      {
                        comment.length
                      }
                      /700
                    </span>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        text-xs
                        font-medium
                        text-[#7B7481]
                      "
                    >
                      <FaCheckCircle
                        className="
                          text-[#4F9D7A]
                        "
                      />

                      Verified
                      purchase
                      only
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      rating ===
                        0 ||
                      !comment.trim()
                    }
                    className="
                      mt-5
                      min-h-[50px]
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#8E7AF0]
                      px-5
                      font-bold
                      text-white
                      shadow-[0_10px_24px_rgba(108,92,231,0.18)]
                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_14px_30px_rgba(108,92,231,0.25)]

                      active:scale-[0.99]

                      disabled:cursor-not-allowed
                      disabled:bg-none
                      disabled:bg-[#DDD9E4]
                      disabled:text-[#9C97A2]
                      disabled:shadow-none
                    "
                  >
                    {submitting
                      ? "Sharing your review..."
                      : "Share Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* =========================================
              RIGHT
          ========================================= */}

          <div className="min-w-0">
            <div
              className="
                mb-4
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-extrabold
                    text-[#2F3136]
                  "
                >
                  Customer
                  stories
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#96909B]
                  "
                >
                  {
                    reviews.length
                  }{" "}
                  verified
                  conversation
                  {reviews.length ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              <select
                value={
                  sortBy
                }
                onChange={(
                  event
                ) =>
                  setSortBy(
                    event
                      .target
                      .value
                  )
                }
                className="
                  min-h-[46px]
                  w-full
                  rounded-xl
                  border
                  border-[#E4DFEA]
                  bg-white
                  px-3
                  text-sm
                  text-[#5F5965]
                  outline-none
                  transition

                  focus:border-[#B8A1FF]
                  focus:ring-4
                  focus:ring-[#B8A1FF]/15

                  sm:w-auto
                "
              >
                <option value="newest">
                  Newest
                </option>

                <option value="highest">
                  Highest
                  rating
                </option>

                <option value="lowest">
                  Lowest
                  rating
                </option>
              </select>
            </div>

            {/* LOADING */}

            {reviewStatus ===
              "loading" && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#EEE8F8]
                  bg-[#FCFAFF]
                  p-8
                  text-center
                  text-sm
                  text-[#918A97]
                "
              >
                Loading
                customer
                experiences...
              </div>
            )}

            {/* ERROR */}

            {reviewStatus ===
              "error" && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#F1DADA]
                  bg-[#FFF8F8]
                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#B85555]
                  "
                >
                  Reviews could
                  not be loaded.
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
                    text-[#6C5CE7]

                    hover:text-[#5949CC]
                  "
                >
                  Try again
                </button>
              </div>
            )}

            {/* EMPTY */}

            {reviewStatus ===
              "success" &&
              sortedReviews.length ===
                0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-[#DCD4E8]
                    bg-[#FCFAFF]
                    p-8
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F1ECFF]
                      text-xl
                      text-[#6C5CE7]
                    "
                  >
                    ☆
                  </div>

                  <h4
                    className="
                      mt-4
                      font-bold
                      text-[#2F3136]
                    "
                  >
                    Be the first
                    to share
                  </h4>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-[#77717C]
                    "
                  >
                    No customer
                    experiences
                    have been
                    shared for
                    this product
                    yet.
                  </p>
                </div>
              )}

            {/* REVIEWS */}

            {reviewStatus ===
              "success" &&
              sortedReviews.length >
                0 && (
                <div className="space-y-4">
                  {sortedReviews.map(
                    (
                      review
                    ) => (
                      <article
                        key={
                          review._id ||
                          review.reviewId
                        }
                        className="
                          rounded-2xl
                          border
                          border-[#EEE8F8]
                          bg-white
                          p-4
                          transition-all
                          duration-300

                          hover:-translate-y-0.5
                          hover:border-[#D8CCFA]
                          hover:shadow-[0_12px_30px_rgba(108,92,231,0.07)]

                          sm:p-5
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            gap-3
                          "
                        >
                          {/* AVATAR */}

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-gradient-to-br
                              from-[#EAE3FF]
                              to-[#FFF0F4]
                              font-black
                              text-[#6C5CE7]
                              ring-4
                              ring-[#FAF8FF]
                            "
                          >
                            {(
                              review.name ||
                              review.email ||
                              "C"
                            )
                              .charAt(
                                0
                              )
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
                                gap-2

                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                              "
                            >
                              <div className="min-w-0">
                                <p
                                  className="
                                    truncate
                                    font-bold
                                    text-[#2F3136]
                                  "
                                >
                                  {review.name ||
                                    review.email ||
                                    "Velmora Customer"}
                                </p>

                                <div
                                  className="
                                    mt-1.5
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
                                        rounded-full
                                        bg-[#EDF7F2]
                                        px-2
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-[#408465]
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
                                  shrink-0
                                  text-xs
                                  text-[#A19BA6]
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
                                break-words
                                text-sm
                                leading-7
                                text-[#625C69]

                                sm:text-[15px]
                              "
                            >
                              {
                                review.comment
                              }
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
  const params =
    useParams();

  const productId =
    params.id;

  const navigate =
    useNavigate();

  const [
    status,
    setStatus,
  ] = useState("loading");

  const [
    product,
    setProduct,
  ] = useState(null);

  /* =====================================================
     FETCH PRODUCT
  ===================================================== */

  useEffect(() => {
    axios
      .get(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/product/" +
          productId
      )
      .then((res) => {
        setProduct(
          res.data
        );

        setStatus(
          "success"
        );
      })
      .catch((err) => {
        console.error(
          "PRODUCT DETAILS ERROR:",
          err
        );

        setStatus(
          "error"
        );

        toast.error(
          "We couldn't load this Velmora product"
        );
      });
  }, [productId]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (
    status === "loading"
  ) {
    return <Loading />;
  }

  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (
    status === "error" ||
    !product
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FAF9F7]
          px-4
          pb-10
          pt-[100px]
        "
      >
        <div
          className="
            relative
            w-full
            max-w-[520px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#EDE7F6]
            bg-white
            px-6
            py-12
            text-center
            shadow-[0_25px_70px_rgba(76,59,105,0.08)]

            sm:px-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-[#B8A1FF]/15
              blur-3xl
            "
          />

          <div
            className="
              relative
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#F1ECFF]
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
              text-[11px]
              font-black
              uppercase
              tracking-[0.2em]
              text-[#9A79E8]
            "
          >
            Velmora
          </p>

          <h1
            className="
              relative
              mt-2
              text-2xl
              font-extrabold
              tracking-tight
              text-[#2F3136]
            "
          >
            Product
            unavailable
          </h1>

          <p
            className="
              relative
              mx-auto
              mt-3
              max-w-sm
              text-sm
              leading-6
              text-[#77717C]
            "
          >
            We couldn't
            retrieve this
            beauty selection.
            It may no longer
            be available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              relative
              mt-7
              min-h-[48px]
              rounded-xl
              bg-gradient-to-r
              from-[#6C5CE7]
              to-[#8E7AF0]
              px-7
              font-bold
              text-white
              shadow-[0_10px_24px_rgba(108,92,231,0.2)]
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_14px_32px_rgba(108,92,231,0.28)]
            "
          >
            Explore
            Collection
          </button>
        </div>
      </main>
    );
  }

  /* =====================================================
     PRICE
  ===================================================== */

  const hasDiscount =
    Number(
      product.labelPrice
    ) >
    Number(
      product.price
    );

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

  const available =
    Boolean(
      product.isAvailable
    ) &&
    Number(
      product.stock
    ) > 0;

  /* =====================================================
     ADD TO CART
  ===================================================== */

  function handleAddToCart() {
    if (!available) {
      toast.error(
        "This product is currently unavailable"
      );

      return;
    }

    addToCart(
      product,
      1
    );

    toast.success(
      `${product.productName} added to your Velmora bag`
    );

    console.log(
      "Updated cart:",
      getCart()
    );
  }

  /* =====================================================
     BUY NOW
  ===================================================== */

  function handleBuyNow() {
    if (!available) {
      toast.error(
        "This product is currently unavailable"
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
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#FAF9F7]
        pb-4
        pt-[72px]

        md:pt-[80px]
      "
    >
      {/* ===================================================
          PAGE AMBIENT BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-[200px]
          h-[340px]
          w-[340px]
          rounded-full
          bg-[#B8A1FF]/10
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[550px]
          h-[340px]
          w-[340px]
          rounded-full
          bg-[#F2B8C6]/10
          blur-[100px]
        "
      />

      {/* ===================================================
          BREADCRUMB
      =================================================== */}

      <section
        className="
          relative
          z-10
          w-full
          border-b
          border-[#EEE9F2]
          bg-white/80
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            max-w-[1220px]
            px-4
            py-3.5

            sm:px-6
            sm:py-4

            lg:px-8
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
                shrink-0
                text-[#8F8995]
                transition-colors

                hover:text-[#6C5CE7]
              "
            >
              Home
            </button>

            <span
              className="
                text-[#D0CBD4]
              "
            >
              /
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="
                shrink-0
                text-[#8F8995]
                transition-colors

                hover:text-[#6C5CE7]
              "
            >
              Collection
            </button>

            <span
              className="
                text-[#D0CBD4]
              "
            >
              /
            </span>

            <span
              className="
                max-w-[140px]
                truncate
                font-semibold
                text-[#3B3740]

                sm:max-w-[300px]
              "
              aria-current="page"
            >
              {
                product.productName
              }
            </span>
          </nav>
        </div>
      </section>

      {/* ===================================================
          PRODUCT HERO
      =================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1220px]
          px-3
          py-5

          sm:px-5
          sm:py-7

          lg:px-8
          lg:py-10
        "
      >
        {/* VELMORA BRAND INTRO */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            gap-3

            sm:mb-6
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-[#6C5CE7]
                to-[#B8A1FF]
                text-sm
                text-white
                shadow-[0_7px_18px_rgba(108,92,231,0.2)]
              "
            >
              ✦
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#6C5CE7]

                  sm:text-[11px]
                "
              >
                VELMORA
              </p>

              <p
                className="
                  text-[11px]
                  text-[#948E99]

                  sm:text-xs
                "
              >
                Beauty ·
                Skincare ·
                Confidence
              </p>
            </div>
          </div>

          {hasDiscount && (
            <div
              className="
                rounded-full
                border
                border-[#F2D8DF]
                bg-[#FFF3F6]
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.1em]
                text-[#B96882]

                sm:text-xs
              "
            >
              {discountPercentage}%
              saving
            </div>
          )}
        </div>

        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-5

            sm:gap-6

            lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]
            lg:gap-8

            xl:gap-10
          "
        >
          {/* ===============================================
              IMAGE GALLERY
          =============================================== */}

          <section
            aria-label="Product images"
            className="
              min-w-0
              w-full
            "
          >
            <div
              className="
                relative
                mx-auto
                w-full
                max-w-[580px]
                overflow-hidden
                rounded-[26px]
                border
                border-[#EDE7F6]
                bg-gradient-to-br
                from-white
                via-[#FCFAFF]
                to-[#FFF8FA]
                p-2.5
                shadow-[0_24px_70px_rgba(67,52,93,0.07)]

                sm:rounded-[32px]
                sm:p-4

                lg:max-w-none
                lg:p-5
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-44
                  w-44
                  rounded-full
                  bg-[#B8A1FF]/15
                  blur-3xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-16
                  -left-16
                  h-44
                  w-44
                  rounded-full
                  bg-[#F2B8C6]/15
                  blur-3xl
                "
              />

              <div className="relative z-10">
                <ImageSlider
                  images={
                    product.images ||
                    []
                  }
                />
              </div>
            </div>

            {/* IMAGE TRUST ROW */}

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2.5

                sm:grid-cols-3
                sm:gap-3
              "
            >
              <TrustFeature
                icon="✦"
                title="Curated"
                text="Selected with care"
              />

              <TrustFeature
                icon="♡"
                title="Authentic"
                text="Beauty you can trust"
              />

              <div
                className="
                  col-span-2

                  sm:col-span-1
                "
              >
                <TrustFeature
                  icon="◇"
                  title="Secure"
                  text="Protected shopping"
                />
              </div>
            </div>
          </section>

          {/* ===============================================
              PRODUCT DETAILS
          =============================================== */}

          <section
            aria-labelledby="product-title"
            className="
              min-w-0
              w-full
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-[#EDE7F6]
                bg-white
                p-5
                shadow-[0_24px_70px_rgba(67,52,93,0.07)]

                sm:rounded-[32px]
                sm:p-7

                lg:p-8
              "
            >
              {/* DETAIL GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-[#B8A1FF]/10
                  blur-3xl
                "
              />

              <div className="relative">
                {/* PRODUCT LABEL */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
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
                      tracking-[0.15em]
                      text-[#6C5CE7]

                      sm:text-[11px]
                    "
                  >
                    <span>
                      ✦
                    </span>

                    Velmora
                    Selection
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-[#AAA4AE]

                      sm:text-xs
                    "
                  >
                    Ref.{" "}
                    {
                      product.productId
                    }
                  </span>
                </div>

                {/* PRODUCT NAME */}

                <h1
                  id="product-title"
                  className="
                    mt-5
                    break-words
                    text-[28px]
                    font-extrabold
                    leading-[1.08]
                    tracking-[-0.035em]
                    text-[#2F3136]

                    sm:text-4xl

                    lg:text-[40px]
                  "
                >
                  {
                    product.productName
                  }
                </h1>

                {/* ALTERNATIVE NAMES */}

                {product.alternativeName
                  ?.length >
                  0 && (
                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {product.alternativeName.map(
                      (
                        name,
                        index
                      ) => (
                        <span
                          key={
                            index
                          }
                          className="
                            rounded-lg
                            border
                            border-[#ECE7F0]
                            bg-[#FAF8FC]
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-[#736D78]
                          "
                        >
                          {
                            name
                          }
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* REVIEW LINK */}

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(
                        "reviews"
                      )
                      ?.scrollIntoView(
                        {
                          behavior:
                            "smooth",
                          block:
                            "start",
                        }
                      )
                  }
                  className="
                    mt-4
                    inline-flex
                    min-h-[40px]
                    items-center
                    gap-2
                    rounded-lg
                    pr-2
                    text-sm
                    font-semibold
                    text-[#625C69]
                    transition-all

                    hover:text-[#6C5CE7]

                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#B8A1FF]
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-1
                      text-[#D4A84F]
                    "
                  >
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>

                  Read customer
                  experiences
                  ↓
                </button>

                {/* PRICE */}

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-[#EEE8F8]
                    bg-gradient-to-br
                    from-[#FBF9FF]
                    to-[#FFF9FA]
                    p-4

                    sm:mt-6
                    sm:p-5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#9A79E8]
                    "
                  >
                    Your price
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      items-end
                      gap-x-3
                      gap-y-2
                    "
                  >
                    <span
                      className="
                        text-3xl
                        font-extrabold
                        tracking-[-0.03em]
                        text-[#6C5CE7]

                        sm:text-[36px]
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
                          pb-1
                          text-sm
                          text-[#A8A1AD]
                          line-through

                          sm:text-base
                        "
                      >
                        Rs.{" "}
                        {Number(
                          product.labelPrice
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <div
                      className="
                        mt-3
                        inline-flex
                        items-center
                        rounded-full
                        bg-[#FFF0F4]
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-[#B86882]
                      "
                    >
                      Save{" "}
                      {
                        discountPercentage
                      }
                      % on this
                      selection
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}

                <section
                  className="
                    mt-6
                    border-t
                    border-[#F0EBF4]
                    pt-6
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-[#9A79E8]
                    "
                  >
                    The Velmora
                    edit
                  </p>

                  <h2
                    className="
                      mt-2
                      text-lg
                      font-extrabold
                      text-[#2F3136]
                    "
                  >
                    About this
                    beauty
                    essential
                  </h2>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-[#6B6570]

                      sm:text-[15px]
                    "
                  >
                    {product.description ||
                      "A thoughtfully selected Velmora beauty essential designed to complement your everyday ritual with effortless elegance."}
                  </p>
                </section>

                {/* STOCK */}

                <div className="mt-6">
                  {available ? (
                    <div
                      className="
                        inline-flex
                        flex-wrap
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[#D9ECE2]
                        bg-[#F1F8F4]
                        px-3
                        py-2
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-[#4F9D7A]
                          shadow-[0_0_0_4px_rgba(79,157,122,0.10)]
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-[#397A5D]
                        "
                      >
                        Ready to
                        order
                      </span>

                      <span
                        className="
                          text-xs
                          text-[#5A8B72]
                        "
                      >
                        (
                        {
                          product.stock
                        }{" "}
                        available)
                      </span>
                    </div>
                  ) : (
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[#F0D7D7]
                        bg-[#FFF6F6]
                        px-3
                        py-2
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-[#D95C5C]
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-[#C15151]
                        "
                      >
                        Currently
                        unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}

                <div
                  className="
                    mt-7
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleAddToCart
                    }
                    disabled={
                      !available
                    }
                    aria-label={`Add ${product.productName} to cart`}
                    className="
                      min-h-[52px]
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#8E7AF0]
                      px-5
                      text-sm
                      font-bold
                      text-white
                      shadow-[0_12px_28px_rgba(108,92,231,0.22)]
                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_16px_34px_rgba(108,92,231,0.30)]

                      active:scale-[0.99]

                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#B8A1FF]
                      focus-visible:ring-offset-2

                      disabled:cursor-not-allowed
                      disabled:bg-none
                      disabled:bg-[#DDD9E4]
                      disabled:text-[#9D98A3]
                      disabled:shadow-none
                      disabled:hover:translate-y-0

                      sm:text-base
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
                      <BsCart3 className="text-lg" />

                      Add to Bag
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleBuyNow
                    }
                    disabled={
                      !available
                    }
                    aria-label={`Buy ${product.productName} now`}
                    className="
                      min-h-[52px]
                      w-full
                      rounded-xl
                      border
                      border-[#DCD3EE]
                      bg-[#2F3136]
                      px-5
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:bg-[#24262B]
                      hover:shadow-lg

                      active:scale-[0.99]

                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#7F768A]
                      focus-visible:ring-offset-2

                      disabled:cursor-not-allowed
                      disabled:border-transparent
                      disabled:bg-[#DDD9E4]
                      disabled:text-[#9D98A3]
                      disabled:shadow-none
                      disabled:hover:translate-y-0

                      sm:text-base
                    "
                  >
                    Buy Now
                  </button>
                </div>

                {/* SMALL LUXURY MESSAGE */}

                <div
                  className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-[#F0EBF4]
                    bg-[#FCFAFD]
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#F3EEFF]
                      text-[#6C5CE7]
                    "
                  >
                    ✦
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#403B45]
                      "
                    >
                      The Velmora
                      experience
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-[#7C7581]
                      "
                    >
                      Thoughtfully
                      curated beauty,
                      effortless
                      discovery and a
                      secure shopping
                      journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* ===================================================
          BRAND DIVIDER
      =================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1220px]
          px-3
          pb-7

          sm:px-5
          sm:pb-9

          lg:px-8
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[24px]
            border
            border-[#EAE4F4]
            bg-gradient-to-r
            from-[#F3EEFF]
            via-white
            to-[#FFF1F5]
            px-5
            py-6

            sm:flex
            sm:items-center
            sm:justify-between
            sm:gap-6
            sm:px-7
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#6C5CE7]
              "
            >
              VELMORA
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-extrabold
                tracking-[-0.02em]
                text-[#2F3136]

                sm:text-2xl
              "
            >
              Beauty that feels
              personal.
            </h2>
          </div>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-[#746E79]

              sm:mt-0
              sm:text-right
            "
          >
            Every Velmora
            selection is part
            of a refined
            shopping
            experience
            designed around
            discovery,
            confidence and
            everyday beauty.
          </p>
        </div>
      </section>

      {/* ===================================================
          REVIEWS
      =================================================== */}

      <ReviewSection
        productId={
          product.productId
        }
      />
    </main>
  );
}