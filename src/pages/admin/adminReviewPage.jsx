import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

export default function AdminReviewPage() {
  // =====================================================
  // STATES
  // =====================================================

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedReview, setSelectedReview] = useState(null);

  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // =====================================================
  // HELPERS
  // =====================================================

  function getReviewId(review) {
    return review.reviewId || review._id || "";
  }

  function getReviewerName(review) {
    if (review.user?.name) {
      return review.user.name;
    }

    if (
      review.user?.firstName ||
      review.user?.lastName
    ) {
      return `${review.user.firstName || ""} ${
        review.user.lastName || ""
      }`.trim();
    }

    if (
      review.firstName ||
      review.lastName
    ) {
      return `${review.firstName || ""} ${
        review.lastName || ""
      }`.trim();
    }

    return (
      review.userName ||
      review.name ||
      review.email ||
      "Anonymous User"
    );
  }

  function getReviewerEmail(review) {
    return (
      review.user?.email ||
      review.email ||
      "-"
    );
  }

  function getRating(review) {
    return Number(review.rating || 0);
  }

  function getComment(review) {
    return (
      review.comment ||
      review.review ||
      "No comment provided"
    );
  }

  function getProductName(review) {
    // Populated product
    if (review.product?.productName) {
      return review.product.productName;
    }

    if (review.product?.name) {
      return review.product.name;
    }

    // Populated productId
    if (review.productId?.productName) {
      return review.productId.productName;
    }

    if (review.productId?.name) {
      return review.productId.name;
    }

    // productInfo
    if (review.productInfo?.productName) {
      return review.productInfo.productName;
    }

    if (review.productInfo?.name) {
      return review.productInfo.name;
    }

    // Product ID as string
    if (typeof review.productId === "string") {
      return review.productId;
    }

    return "Product";
  }

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // =====================================================
  // GET ALL REVIEWS
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    axios
      .get(
        import.meta.env.VITE_BACKEND_URL + "/api/review",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log("REVIEWS:", res.data);

        const reviewList = Array.isArray(res.data)
          ? res.data
          : res.data.reviews ||
            res.data.data ||
            [];

        setReviews(reviewList);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "GET REVIEWS ERROR:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
            error.response?.data?.errorMessage ||
            "Failed to load reviews"
        );

        setIsLoading(false);
      });
  }, []);

  // =====================================================
  // REFRESH REVIEWS
  // =====================================================

  async function refreshReviews() {
    if (isRefreshing) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    setIsRefreshing(true);

    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/review",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const reviewList = Array.isArray(res.data)
        ? res.data
        : res.data.reviews ||
          res.data.data ||
          [];

      setReviews(reviewList);

      toast.success("Reviews refreshed");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to refresh reviews"
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  async function deleteReview() {
    if (!reviewToDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const reviewId = getReviewId(reviewToDelete);

    if (!reviewId) {
      toast.error("Review ID not found");
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL +
          "/api/review/" +
          reviewId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Remove from UI immediately
      setReviews((previousReviews) =>
        previousReviews.filter(
          (review) =>
            getReviewId(review) !== reviewId
        )
      );

      // Close details modal if same review is open
      if (
        selectedReview &&
        getReviewId(selectedReview) === reviewId
      ) {
        setSelectedReview(null);
      }

      setReviewToDelete(null);

      toast.success("Review deleted successfully");
    } catch (error) {
      console.error(
        "DELETE REVIEW ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // =====================================================
  // SEARCH + FILTER + SORT
  // =====================================================

  const filteredReviews = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    let result = reviews.filter((review) => {
      const reviewer =
        getReviewerName(review).toLowerCase();

      const email =
        getReviewerEmail(review).toLowerCase();

      const product =
        getProductName(review).toLowerCase();

      const comment =
        getComment(review).toLowerCase();

      const reviewId = String(
        getReviewId(review)
      ).toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        reviewer.includes(searchValue) ||
        email.includes(searchValue) ||
        product.includes(searchValue) ||
        comment.includes(searchValue) ||
        reviewId.includes(searchValue);

      const matchesRating =
        ratingFilter === "all" ||
        getRating(review) ===
          Number(ratingFilter);

      return matchesSearch && matchesRating;
    });

    result = [...result].sort((a, b) => {
      // Highest rating
      if (sortBy === "highest") {
        return getRating(b) - getRating(a);
      }

      // Lowest rating
      if (sortBy === "lowest") {
        return getRating(a) - getRating(b);
      }

      // Oldest
      if (sortBy === "oldest") {
        return (
          new Date(
            a.createdAt || a.date || 0
          ) -
          new Date(
            b.createdAt || b.date || 0
          )
        );
      }

      // Newest
      return (
        new Date(
          b.createdAt || b.date || 0
        ) -
        new Date(
          a.createdAt || a.date || 0
        )
      );
    });

    return result;
  }, [
    reviews,
    search,
    ratingFilter,
    sortBy,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (total, review) =>
            total + getRating(review),
          0
        ) / reviews.length;

  const fiveStarCount = reviews.filter(
    (review) => getRating(review) === 5
  ).length;

  const lowRatingCount = reviews.filter(
    (review) => getRating(review) <= 2
  ).length;

  // =====================================================
  // MODAL SCROLL CONTROL
  // =====================================================

  useEffect(() => {
    if (
      selectedReview ||
      reviewToDelete
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    selectedReview,
    reviewToDelete,
  ]);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        if (!isDeleting) {
          setSelectedReview(null);
          setReviewToDelete(null);
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isDeleting]);

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <Loading />;
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        w-full
        min-h-screen

        bg-[#F8F9FA]

        p-3
        sm:p-5
        md:p-8

        overflow-x-hidden

        animate-[reviewPageEnter_0.4s_ease-out]
      "
    >

      {/* =================================================
          REVIEW DETAILS MODAL
      ================================================= */}

      {selectedReview && (
        <div
          onClick={() =>
            setSelectedReview(null)
          }
          className="
            fixed
            inset-0
            z-[9999]

            bg-black/50
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-3
            sm:p-5
          "
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              max-w-xl

              max-h-[90vh]
              overflow-y-auto

              bg-white

              rounded-2xl
              sm:rounded-3xl

              shadow-2xl

              animate-[reviewModalEnter_0.25s_ease-out]
            "
          >

            {/* Header */}

            <div
              className="
                sticky
                top-0
                z-10

                bg-white/95
                backdrop-blur-md

                p-4
                sm:p-6

                border-b
                border-gray-100

                flex
                items-start
                justify-between

                gap-4
              "
            >
              <div>

                <h2
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold
                    text-[#393E46]
                  "
                >
                  Review Details
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400

                    mt-1
                  "
                >
                  Customer feedback information
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(null)
                }
                className="
                  w-10
                  h-10

                  shrink-0

                  rounded-full

                  bg-gray-100

                  text-gray-500

                  flex
                  items-center
                  justify-center

                  hover:bg-red-50
                  hover:text-red-500

                  hover:rotate-90

                  active:scale-90

                  transition-all
                  duration-300
                "
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            {/* Content */}

            <div
              className="
                p-4
                sm:p-6

                space-y-4
              "
            >

              {/* Reviewer */}

              <ReviewDetail
                title="Customer"
                value={getReviewerName(
                  selectedReview
                )}
              />

              {/* Email */}

              <ReviewDetail
                title="Email"
                value={getReviewerEmail(
                  selectedReview
                )}
              />

              {/* Product */}

              <ReviewDetail
                title="Product"
                value={getProductName(
                  selectedReview
                )}
              />

              {/* Rating */}

              <div
                className="
                  p-4

                  bg-gray-50

                  rounded-xl

                  border
                  border-gray-100
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-400

                    mb-2
                  "
                >
                  Rating
                </p>

                <RatingStars
                  rating={getRating(
                    selectedReview
                  )}
                />

              </div>

              {/* Comment */}

              <div
                className="
                  p-4

                  bg-gray-50

                  rounded-xl

                  border
                  border-gray-100
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-400

                    mb-2
                  "
                >
                  Customer Comment
                </p>

                <p
                  className="
                    text-sm
                    text-gray-700

                    leading-7

                    whitespace-pre-wrap
                    break-words
                  "
                >
                  {getComment(
                    selectedReview
                  )}
                </p>

              </div>

              {/* Date */}

              {(selectedReview.createdAt ||
                selectedReview.date) && (
                <ReviewDetail
                  title="Submitted"
                  value={formatDate(
                    selectedReview.createdAt ||
                      selectedReview.date
                  )}
                />
              )}

              {/* Review ID - only in modal */}

              <ReviewDetail
                title="Review ID"
                value={
                  getReviewId(
                    selectedReview
                  ) || "-"
                }
              />

            </div>

            {/* Footer */}

            <div
              className="
                p-4
                sm:px-6
                sm:pb-6

                flex
                flex-col-reverse
                sm:flex-row

                sm:justify-end

                gap-3
              "
            >

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(null)
                }
                className="
                  w-full
                  sm:w-auto

                  px-5
                  py-2.5

                  rounded-xl

                  bg-white

                  border
                  border-gray-300

                  text-sm
                  font-semibold
                  text-gray-600

                  hover:bg-gray-100

                  active:scale-[0.97]

                  transition-all
                "
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  setReviewToDelete(
                    selectedReview
                  )
                }
                className="
                  w-full
                  sm:w-auto

                  px-5
                  py-2.5

                  rounded-xl

                  bg-red-600
                  text-white

                  text-sm
                  font-semibold

                  shadow-sm

                  hover:bg-red-700
                  hover:shadow-md
                  hover:-translate-y-0.5

                  active:scale-[0.97]

                  transition-all
                "
              >
                Delete Review
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {reviewToDelete && (
        <div
          onClick={() => {
            if (!isDeleting) {
              setReviewToDelete(null);
            }
          }}
          className="
            fixed
            inset-0
            z-[10000]

            bg-black/55
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-4
          "
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              max-w-md

              bg-white

              rounded-2xl

              shadow-2xl

              p-5
              sm:p-6

              animate-[reviewModalEnter_0.2s_ease-out]
            "
          >

            {/* Warning icon */}

            <div
              className="
                w-14
                h-14

                mx-auto

                rounded-full

                bg-red-100
                text-red-600

                flex
                items-center
                justify-center

                mb-4
              "
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </div>

            <h3
              className="
                text-xl
                font-bold
                text-[#393E46]

                text-center
              "
            >
              Delete Review?
            </h3>

            <p
              className="
                text-sm
                text-gray-500

                text-center

                mt-2

                leading-6
              "
            >
              This will permanently delete the review from{" "}
              <span className="font-semibold text-[#393E46]">
                {getReviewerName(
                  reviewToDelete
                )}
              </span>
              . This action cannot be undone.
            </p>

            <div
              className="
                flex
                flex-col-reverse
                sm:flex-row

                gap-3

                mt-6
              "
            >

              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  setReviewToDelete(null)
                }
                className="
                  flex-1

                  px-4
                  py-3

                  rounded-xl

                  border
                  border-gray-300

                  font-semibold
                  text-sm
                  text-gray-700

                  hover:bg-gray-100

                  disabled:opacity-50

                  transition-all
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={deleteReview}
                className="
                  flex-1

                  px-4
                  py-3

                  rounded-xl

                  bg-red-600
                  text-white

                  font-semibold
                  text-sm

                  flex
                  items-center
                  justify-center
                  gap-2

                  hover:bg-red-700

                  active:scale-[0.97]

                  disabled:bg-red-400
                  disabled:cursor-not-allowed

                  transition-all
                "
              >

                {isDeleting ? (
                  <>
                    <svg
                      className="
                        w-4
                        h-4

                        animate-spin
                      "
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Deleting...
                  </>
                ) : (
                  "Delete Review"
                )}

              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-4

          mb-6
        "
      >

        <div>

          <p
            className="
              text-xs

              uppercase
              tracking-[0.15em]

              font-bold

              text-gray-400
            "
          >
            Feedback Management
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold
              text-[#393E46]

              mt-1
            "
          >
            Reviews
          </h1>

          <p
            className="
              text-sm
              text-gray-500

              mt-1
            "
          >
            View and manage customer feedback.
          </p>

        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={refreshReviews}
          disabled={isRefreshing}
          className="
            group

            w-full
            sm:w-auto

            px-4
            py-2.5

            rounded-xl

            bg-white

            border
            border-gray-200

            shadow-sm

            flex
            items-center
            justify-center
            gap-2

            text-sm
            font-semibold
            text-gray-600

            hover:border-purple-300
            hover:text-purple-600
            hover:shadow-md

            active:scale-[0.97]

            disabled:opacity-50

            transition-all
            duration-300
          "
        >
          <svg
            className={`
              w-4 h-4

              ${
                isRefreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v6h6M20 20v-6h-6M5.64 15A7 7 0 0018 18.36M18.36 9A7 7 0 006 5.64"
            />
          </svg>

          {isRefreshing
            ? "Refreshing..."
            : "Refresh Reviews"}

        </button>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4

          gap-3
          sm:gap-4

          mb-5
        "
      >

        <StatCard
          title="Total Reviews"
          value={reviews.length}
        />

        <StatCard
          title="Average Rating"
          value={`${averageRating.toFixed(1)} / 5`}
        />

        <StatCard
          title="5 Star Reviews"
          value={fiveStarCount}
        />

        <StatCard
          title="Low Ratings"
          value={lowRatingCount}
        />

      </div>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div
        className="
          bg-white

          border
          border-gray-100

          rounded-2xl

          shadow-sm

          p-4
          sm:p-5

          mb-5
        "
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[1fr_180px_190px]

            gap-3
          "
        >

          {/* Search */}

          <div className="relative">

            <svg
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                w-5
                h-5

                text-gray-400
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer, product, email or comment..."
              className="
                w-full

                pl-12
                pr-10
                py-3

                rounded-xl

                border
                border-gray-300

                text-sm

                outline-none

                focus:ring-2
                focus:ring-purple-100
                focus:border-purple-400

                transition-all
              "
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2

                  w-7
                  h-7

                  rounded-full

                  text-gray-400

                  flex
                  items-center
                  justify-center

                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                ✕
              </button>
            )}

          </div>

          {/* Rating filter */}

          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(
                e.target.value
              )
            }
            className="
              w-full

              px-4
              py-3

              rounded-xl

              border
              border-gray-300

              bg-white

              text-sm
              font-semibold
              text-gray-600

              outline-none

              focus:ring-2
              focus:ring-purple-100
              focus:border-purple-400

              cursor-pointer
            "
          >
            <option value="all">
              All Ratings
            </option>

            <option value="5">
              5 Stars
            </option>

            <option value="4">
              4 Stars
            </option>

            <option value="3">
              3 Stars
            </option>

            <option value="2">
              2 Stars
            </option>

            <option value="1">
              1 Star
            </option>
          </select>

          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="
              w-full

              px-4
              py-3

              rounded-xl

              border
              border-gray-300

              bg-white

              text-sm
              font-semibold
              text-gray-600

              outline-none

              focus:ring-2
              focus:ring-purple-100
              focus:border-purple-400

              cursor-pointer
            "
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest">
              Highest Rating
            </option>

            <option value="lowest">
              Lowest Rating
            </option>
          </select>

        </div>

        {/* Results */}

        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-2

            mt-3
          "
        >

          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {filteredReviews.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">
              {reviews.length}
            </span>{" "}
            reviews
          </p>

          {(search ||
            ratingFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRatingFilter("all");
                setSortBy("newest");
              }}
              className="
                self-start
                sm:self-auto

                text-xs
                font-semibold

                text-purple-600

                hover:text-purple-800
              "
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          REVIEWS LIST
      ================================================= */}

      <div
        className="
          bg-white

          rounded-2xl

          border
          border-gray-100

          shadow-sm

          overflow-hidden
        "
      >

        {/* Header */}

        <div
          className="
            px-4
            sm:px-6

            py-4
            sm:py-5

            border-b
            border-gray-100

            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                font-bold
                text-[#393E46]
              "
            >
              Customer Reviews
            </h2>

            <p
              className="
                text-xs
                text-gray-400

                mt-1
              "
            >
              Click a review to see complete details.
            </p>

          </div>

          <div
            className="
              min-w-[36px]
              h-9

              px-3

              rounded-full

              bg-purple-50
              text-purple-600

              flex
              items-center
              justify-center

              text-xs
              font-bold
            "
          >
            {filteredReviews.length}
          </div>

        </div>

        {/* =================================================
            DESKTOP TABLE HEADER
        ================================================= */}

        <div
          className="
            hidden
            xl:grid

            grid-cols-[1.1fr_1.2fr_130px_2fr_140px]

            gap-4

            px-6
            py-4

            bg-[#F7F7F8]

            border-b
            border-gray-200

            text-xs
            font-bold
            uppercase
            tracking-wider
            text-gray-500
          "
        >
          <div>Customer</div>

          <div>Product</div>

          <div>Rating</div>

          <div>Review</div>

          <div>Actions</div>
        </div>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <div className="divide-y divide-gray-100">

          {filteredReviews.map(
            (review) => (
              <div
                key={
                  getReviewId(review) ||
                  Math.random()
                }
                onClick={() =>
                  setSelectedReview(
                    review
                  )
                }
                className="
                  group

                  cursor-pointer

                  hover:bg-purple-50/30

                  transition-all
                  duration-200
                "
              >

                {/* =========================================
                    MOBILE / TABLET
                ========================================= */}

                <div
                  className="
                    xl:hidden

                    p-4
                    sm:p-5
                  "
                >

                  {/* Top */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-3
                    "
                  >

                    <div className="min-w-0">

                      <h3
                        className="
                          font-bold
                          text-[#393E46]

                          truncate
                        "
                      >
                        {getReviewerName(
                          review
                        )}
                      </h3>

                      <p
                        className="
                          text-xs
                          sm:text-sm

                          text-gray-400

                          mt-1

                          truncate
                        "
                      >
                        {getProductName(
                          review
                        )}
                      </p>

                    </div>

                    <RatingStars
                      rating={getRating(
                        review
                      )}
                      compact
                    />

                  </div>

                  {/* Comment */}

                  <div
                    className="
                      mt-4

                      p-3

                      rounded-xl

                      bg-gray-50
                    "
                  >
                    <p
                      className="
                        text-sm
                        text-gray-600

                        leading-6

                        line-clamp-2
                      "
                    >
                      {getComment(
                        review
                      )}
                    </p>
                  </div>

                  {/* Bottom */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row

                      sm:items-center
                      sm:justify-between

                      gap-3

                      mt-4
                    "
                  >

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedReview(
                          review
                        );
                      }}
                      className="
                        w-full
                        sm:w-auto

                        px-4
                        py-2

                        rounded-lg

                        bg-purple-50
                        text-purple-600

                        text-xs
                        font-semibold

                        hover:bg-purple-100

                        active:scale-95

                        transition-all
                      "
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setReviewToDelete(
                          review
                        );
                      }}
                      className="
                        w-full
                        sm:w-auto

                        px-4
                        py-2

                        rounded-lg

                        bg-red-50
                        text-red-600

                        text-xs
                        font-semibold

                        hover:bg-red-600
                        hover:text-white

                        active:scale-95

                        transition-all
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* =========================================
                    DESKTOP TABLE ROW
                ========================================= */}

                <div
                  className="
                    hidden
                    xl:grid

                    grid-cols-[1.1fr_1.2fr_130px_2fr_140px]

                    gap-4

                    px-6
                    py-5

                    items-center
                  "
                >

                  {/* Customer */}

                  <div className="min-w-0">

                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#393E46]

                        truncate
                      "
                    >
                      {getReviewerName(
                        review
                      )}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400

                        mt-1

                        truncate
                      "
                    >
                      {getReviewerEmail(
                        review
                      )}
                    </p>

                  </div>

                  {/* Product */}

                  <p
                    className="
                      text-sm
                      text-gray-600

                      truncate
                    "
                    title={getProductName(
                      review
                    )}
                  >
                    {getProductName(
                      review
                    )}
                  </p>

                  {/* Rating */}

                  <RatingStars
                    rating={getRating(
                      review
                    )}
                    compact
                  />

                  {/* Comment */}

                  <p
                    className="
                      text-sm
                      text-gray-500

                      truncate
                    "
                    title={getComment(
                      review
                    )}
                  >
                    {getComment(
                      review
                    )}
                  </p>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    {/* View */}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedReview(
                          review
                        );
                      }}
                      className="
                        w-9
                        h-9

                        rounded-lg

                        bg-purple-50
                        text-purple-600

                        flex
                        items-center
                        justify-center

                        hover:bg-purple-600
                        hover:text-white

                        hover:-translate-y-0.5

                        active:scale-90

                        transition-all
                      "
                      title="View review"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0s-4 7-10 7S2 12 2 12s4-7 10-7 10 7 10 7z"
                        />
                      </svg>
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setReviewToDelete(
                          review
                        );
                      }}
                      className="
                        w-9
                        h-9

                        rounded-lg

                        bg-red-50
                        text-red-600

                        flex
                        items-center
                        justify-center

                        hover:bg-red-600
                        hover:text-white

                        hover:-translate-y-0.5

                        active:scale-90

                        transition-all
                      "
                      title="Delete review"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3m-8 0h10"
                        />
                      </svg>
                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredReviews.length === 0 && (
          <div
            className="
              py-16
              sm:py-20

              px-5

              text-center
            "
          >

            <div
              className="
                w-16
                h-16

                mx-auto

                rounded-full

                bg-purple-50
                text-purple-400

                flex
                items-center
                justify-center

                mb-4
              "
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4-4 7-9 7a10.8 10.8 0 01-4-.75L3 20l1.35-3.37A6.57 6.57 0 013 12c0-4 4-7 9-7s9 3 9 7z"
                />
              </svg>
            </div>

            <h3
              className="
                text-lg
                font-bold
                text-[#393E46]
              "
            >
              No reviews found
            </h3>

            <p
              className="
                text-sm
                text-gray-400

                mt-1
              "
            >
              {search ||
              ratingFilter !== "all"
                ? "Try changing your search or rating filter."
                : "Customer reviews will appear here."}
            </p>

            {(search ||
              ratingFilter !==
                "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRatingFilter(
                    "all"
                  );
                  setSortBy(
                    "newest"
                  );
                }}
                className="
                  mt-4

                  px-4
                  py-2

                  rounded-xl

                  bg-[#393E46]
                  text-white

                  text-sm
                  font-semibold

                  hover:bg-[#222831]

                  active:scale-95

                  transition-all
                "
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

      </div>

      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes reviewPageEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes reviewModalEnter {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

// =========================================================
// RATING COMPONENT
// =========================================================

function RatingStars({
  rating,
  compact = false,
}) {
  const value = Number(rating || 0);

  return (
    <div
      className="
        flex
        items-center
        gap-0.5

        shrink-0
      "
    >

      {[1, 2, 3, 4, 5].map(
        (star) => (
          <svg
            key={star}
            className={`
              ${
                compact
                  ? "w-4 h-4"
                  : "w-5 h-5"
              }

              ${
                star <= value
                  ? "text-yellow-400"
                  : "text-gray-200"
              }
            `}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.18 3.63a1 1 0 00.95.69h3.817c.969 0 1.371 1.24.588 1.81l-3.088 2.244a1 1 0 00-.364 1.118l1.18 3.63c.3.921-.755 1.688-1.538 1.118l-3.088-2.244a1 1 0 00-1.176 0l-3.088 2.244c-.783.57-1.838-.197-1.539-1.118l1.18-3.63a1 1 0 00-.363-1.118L2.515 9.057c-.783-.57-.38-1.81.588-1.81H6.92a1 1 0 00.95-.69l1.18-3.63z" />
          </svg>
        )
      )}

      <span
        className="
          ml-1.5

          text-xs
          font-bold
          text-gray-500
        "
      >
        {value.toFixed(1)}
      </span>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        bg-white

        border
        border-gray-100

        rounded-2xl

        p-4
        sm:p-5

        shadow-sm

        transition-all
        duration-300

        hover:shadow-md
        hover:-translate-y-1
      "
    >

      <p
        className="
          text-[11px]
          sm:text-sm

          text-gray-400
        "
      >
        {title}
      </p>

      <p
        className="
          text-xl
          sm:text-2xl

          font-bold
          text-[#393E46]

          mt-1
        "
      >
        {value}
      </p>

    </div>
  );
}

// =========================================================
// DETAIL COMPONENT
// =========================================================

function ReviewDetail({
  title,
  value,
}) {
  return (
    <div
      className="
        p-4

        rounded-xl

        bg-gray-50

        border
        border-gray-100

        transition-all

        hover:bg-white
        hover:shadow-sm
      "
    >

      <p
        className="
          text-xs
          text-gray-400

          mb-1
        "
      >
        {title}
      </p>

      <p
        className="
          text-sm
          font-semibold
          text-[#393E46]

          break-words
        "
      >
        {value}
      </p>

    </div>
  );
}