import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import Loading from "../../components/loading";

/*
=========================================================
VELMORA — CUSTOMER VOICE
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
Warning          #D99A3E
Error            #D95C5C
Gold Star        #D4A84F

Admin direction:
Premium
Calm
Beauty-focused
Customer insight
Mobile-first
=========================================================
*/

/* =========================================================
   ICONS
========================================================= */

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M5.6 15A7 7 0 0 0 18 18.4" />
      <path d="M18.4 9A7 7 0 0 0 6 5.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12c0 4-4 7-9 7a10.8 10.8 0 0 1-4-.75L3 20l1.35-3.37A6.57 6.57 0 0 1 3 12c0-4 4-7 9-7s9 3 9 7Z" />
      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminReviewPage() {
  /* =====================================================
     STATES
  ===================================================== */

  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    ratingFilter,
    setRatingFilter,
  ] = useState("all");

  const [
    sortBy,
    setSortBy,
  ] = useState("newest");

  const [
    selectedReview,
    setSelectedReview,
  ] = useState(null);

  const [
    reviewToDelete,
    setReviewToDelete,
  ] = useState(null);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  function getReviewId(review) {
    return (
      review?.reviewId ||
      review?._id ||
      ""
    );
  }

  function getReviewerName(review) {
    if (review?.user?.name) {
      return review.user.name;
    }

    if (
      review?.user?.firstName ||
      review?.user?.lastName
    ) {
      return `${review.user.firstName || ""} ${
        review.user.lastName || ""
      }`.trim();
    }

    if (
      review?.firstName ||
      review?.lastName
    ) {
      return `${review.firstName || ""} ${
        review.lastName || ""
      }`.trim();
    }

    return (
      review?.userName ||
      review?.name ||
      review?.email ||
      "Anonymous Customer"
    );
  }

  function getReviewerEmail(review) {
    return (
      review?.user?.email ||
      review?.email ||
      "-"
    );
  }

  function getRating(review) {
    return Number(
      review?.rating || 0
    );
  }

  function getComment(review) {
    return (
      review?.comment ||
      review?.review ||
      "No comment provided"
    );
  }

  function getProductName(review) {
    if (
      review?.product
        ?.productName
    ) {
      return review.product
        .productName;
    }

    if (
      review?.product?.name
    ) {
      return review.product
        .name;
    }

    if (
      review?.productId
        ?.productName
    ) {
      return review.productId
        .productName;
    }

    if (
      review?.productId
        ?.name
    ) {
      return review.productId
        .name;
    }

    if (
      review?.productInfo
        ?.productName
    ) {
      return review.productInfo
        .productName;
    }

    if (
      review?.productInfo
        ?.name
    ) {
      return review.productInfo
        .name;
    }

    if (
      typeof review?.productId ===
      "string"
    ) {
      return review.productId;
    }

    return "Velmora Product";
  }

  function getReviewDate(review) {
    return (
      review?.createdAt ||
      review?.date ||
      null
    );
  }

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "Not available";
    }

    return parsed.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  /* =====================================================
     FETCH REVIEWS
  ===================================================== */

  async function fetchReviews(
    showSuccess = false
  ) {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first"
      );

      setIsLoading(false);

      setIsRefreshing(false);

      return;
    }

    try {
      const res =
        await axios.get(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/review",

          {
            headers: {
              Authorization:
                "Bearer " +
                token,
            },
          }
        );

      const reviewList =
        Array.isArray(
          res.data
        )
          ? res.data
          : res.data
              ?.reviews ||
            res.data?.data ||
            [];

      setReviews(
        reviewList
      );

      if (showSuccess) {
        toast.success(
          "Velmora reviews refreshed"
        );
      }
    } catch (error) {
      console.error(
        "GET REVIEWS ERROR:",
        error.response
          ?.data ||
          error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          error.response
            ?.data
            ?.errorMessage ||
          "Failed to load Velmora reviews"
      );
    } finally {
      setIsLoading(false);

      setIsRefreshing(
        false
      );
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  /* =====================================================
     REFRESH
  ===================================================== */

  async function refreshReviews() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(
      true
    );

    await fetchReviews(
      true
    );
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function deleteReview() {
    if (
      !reviewToDelete
    ) {
      return;
    }

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first"
      );

      return;
    }

    const reviewId =
      getReviewId(
        reviewToDelete
      );

    if (!reviewId) {
      toast.error(
        "Review ID not found"
      );

      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/review/" +
          reviewId,

        {
          headers: {
            Authorization:
              "Bearer " +
              token,
          },
        }
      );

      setReviews(
        (
          previousReviews
        ) =>
          previousReviews.filter(
            (review) =>
              getReviewId(
                review
              ) !== reviewId
          )
      );

      if (
        selectedReview &&
        getReviewId(
          selectedReview
        ) === reviewId
      ) {
        setSelectedReview(
          null
        );
      }

      setReviewToDelete(
        null
      );

      toast.success(
        "Velmora review deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE REVIEW ERROR:",
        error.response
          ?.data ||
          error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          "Failed to delete review"
      );
    } finally {
      setIsDeleting(
        false
      );
    }
  }

  /* =====================================================
     FILTER + SEARCH + SORT
  ===================================================== */

  const filteredReviews =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      let result =
        reviews.filter(
          (review) => {
            /*
              toLowerCase() is used
              only for temporary
              comparison values.
              Stored email remains
              unchanged.
            */

            const reviewer =
              getReviewerName(
                review
              ).toLowerCase();

            const email =
              getReviewerEmail(
                review
              ).toLowerCase();

            const product =
              getProductName(
                review
              ).toLowerCase();

            const comment =
              getComment(
                review
              ).toLowerCase();

            const reviewId =
              String(
                getReviewId(
                  review
                )
              ).toLowerCase();

            const matchesSearch =
              searchValue ===
                "" ||
              reviewer.includes(
                searchValue
              ) ||
              email.includes(
                searchValue
              ) ||
              product.includes(
                searchValue
              ) ||
              comment.includes(
                searchValue
              ) ||
              reviewId.includes(
                searchValue
              );

            const matchesRating =
              ratingFilter ===
                "all" ||
              getRating(
                review
              ) ===
                Number(
                  ratingFilter
                );

            return (
              matchesSearch &&
              matchesRating
            );
          }
        );

      result = [
        ...result,
      ].sort((a, b) => {
        if (
          sortBy ===
          "highest"
        ) {
          return (
            getRating(b) -
            getRating(a)
          );
        }

        if (
          sortBy ===
          "lowest"
        ) {
          return (
            getRating(a) -
            getRating(b)
          );
        }

        const aDate =
          new Date(
            getReviewDate(a) ||
              0
          ).getTime();

        const bDate =
          new Date(
            getReviewDate(b) ||
              0
          ).getTime();

        if (
          sortBy ===
          "oldest"
        ) {
          return (
            aDate -
            bDate
          );
        }

        return (
          bDate -
          aDate
        );
      });

      return result;
    }, [
      reviews,
      search,
      ratingFilter,
      sortBy,
    ]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            getRating(
              review
            ),

          0
        ) /
        reviews.length;

  const fiveStarCount =
    reviews.filter(
      (review) =>
        getRating(
          review
        ) === 5
    ).length;

  const lowRatingCount =
    reviews.filter(
      (review) =>
        getRating(
          review
        ) <= 2
    ).length;

  const verifiedCount =
    reviews.filter(
      (review) =>
        review
          ?.verifiedPurchase ===
        true
    ).length;

  /* =====================================================
     MODAL BODY SCROLL
  ===================================================== */

  useEffect(() => {
    if (
      selectedReview ||
      reviewToDelete
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    selectedReview,
    reviewToDelete,
  ]);

  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    function handleEscape(
      event
    ) {
      if (
        event.key ===
          "Escape" &&
        !isDeleting
      ) {
        setSelectedReview(
          null
        );

        setReviewToDelete(
          null
        );
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

  /* =====================================================
     CLEAR FILTER
  ===================================================== */

  function clearFilters() {
    setSearch("");

    setRatingFilter(
      "all"
    );

    setSortBy(
      "newest"
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading
        message="Preparing Velmora customer feedback..."
        fullScreen={false}
      />
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden

        bg-[#FAF9F7]

        p-3

        sm:p-5

        lg:p-7

        xl:p-8

        animate-[reviewPageEnter_0.4s_ease-out]
      "
    >
      {/* =================================================
          AMBIENT LIGHTS
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-36
          -top-28

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
          -right-40
          top-[520px]

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#F2B8C6]/7

          blur-[130px]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1500px]
        "
      >
        {/* =================================================
            REVIEW DETAILS MODAL
        ================================================= */}

        {selectedReview && (
          <div
            onClick={() =>
              setSelectedReview(
                null
              )
            }
            className="
              fixed
              inset-0
              z-[9999]

              flex
              items-center
              justify-center

              bg-[#29222F]/65

              p-3

              backdrop-blur-md

              sm:p-5
            "
            role="presentation"
          >
            <div
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              role="dialog"
              aria-modal="true"
              aria-label="Velmora review details"
              className="
                w-full
                max-w-[680px]

                max-h-[92dvh]
                overflow-y-auto

                rounded-[26px]

                border
                border-[#E8E1EF]

                bg-white

                shadow-[0_35px_100px_rgba(33,25,45,0.30)]

                animate-[reviewModalEnter_0.25s_ease-out]

                sm:rounded-[30px]
              "
            >
              {/* =======================================
                  MODAL HEADER
              ======================================= */}

              <div
                className="
                  sticky
                  top-0
                  z-20

                  border-b
                  border-[#EEE9F2]

                  bg-white/95

                  px-4
                  py-4

                  backdrop-blur-xl

                  sm:px-6
                  sm:py-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-[#DED5F4]

                        bg-[#F5F1FF]

                        px-3
                        py-1.5

                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.17em]

                        text-[#6C5CE7]
                      "
                    >
                      <span className="text-[#B9955B]">
                        ✦
                      </span>

                      Velmora
                      Customer
                      Voice
                    </div>

                    <h2
                      className="
                        mt-3

                        text-xl
                        font-extrabold
                        tracking-[-0.03em]

                        text-[#2F3136]

                        sm:text-2xl
                      "
                    >
                      Review
                      Details
                    </h2>

                    <p
                      className="
                        mt-1

                        text-xs
                        text-[#918996]

                        sm:text-sm
                      "
                    >
                      Complete
                      customer
                      feedback
                      information.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReview(
                        null
                      )
                    }
                    aria-label="Close review details"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#E8E2EC]

                      bg-[#FAF8FB]

                      text-[#77707C]

                      transition-all
                      duration-200

                      hover:border-[#E7C6CE]
                      hover:bg-[#FFF2F4]
                      hover:text-[#B65566]

                      active:scale-90
                    "
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* =======================================
                  CONTENT
              ======================================= */}

              <div
                className="
                  space-y-5

                  p-4

                  sm:p-6
                "
              >
                {/* RATING HERO */}

                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-[22px]

                    border
                    border-[#E5DDF1]

                    bg-gradient-to-br
                    from-[#F7F4FF]
                    via-white
                    to-[#FFF5F8]

                    p-5
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12

                      h-32
                      w-32

                      rounded-full

                      bg-[#B8A1FF]/18

                      blur-3xl
                    "
                  />

                  <p
                    className="
                      relative

                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.16em]

                      text-[#927CE4]
                    "
                  >
                    Customer
                    Rating
                  </p>

                  <div
                    className="
                      relative
                      mt-3
                    "
                  >
                    <RatingStars
                      rating={getRating(
                        selectedReview
                      )}
                    />
                  </div>

                  {selectedReview
                    .verifiedPurchase && (
                    <span
                      className="
                        relative
                        mt-4
                        inline-flex
                        items-center
                        gap-1.5

                        rounded-full

                        border
                        border-[#D4E8DD]

                        bg-[#EDF7F2]

                        px-3
                        py-1.5

                        text-[10px]
                        font-bold
                        text-[#478465]
                      "
                    >
                      ✓ Verified
                      Purchase
                    </span>
                  )}
                </div>

                {/* CUSTOMER / PRODUCT */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  <ReviewDetail
                    title="Customer"
                    value={getReviewerName(
                      selectedReview
                    )}
                  />

                  <ReviewDetail
                    title="Email"
                    value={getReviewerEmail(
                      selectedReview
                    )}
                  />

                  <ReviewDetail
                    title="Product"
                    value={getProductName(
                      selectedReview
                    )}
                  />

                  <ReviewDetail
                    title="Submitted"
                    value={formatDate(
                      getReviewDate(
                        selectedReview
                      )
                    )}
                  />
                </div>

                {/* COMMENT */}

                <div
                  className="
                    rounded-[20px]

                    border
                    border-[#EAE4EF]

                    bg-[#FCFAFD]

                    p-4

                    sm:p-5
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-[#927CE4]
                    "
                  >
                    Customer
                    Comment
                  </p>

                  <p
                    className="
                      mt-3

                      whitespace-pre-wrap
                      break-words

                      text-sm
                      leading-7
                      text-[#625B67]

                      sm:text-[15px]
                    "
                  >
                    {getComment(
                      selectedReview
                    )}
                  </p>
                </div>

                {/* ID */}

                <ReviewDetail
                  title="Review ID"
                  value={
                    getReviewId(
                      selectedReview
                    ) || "-"
                  }
                />
              </div>

              {/* =======================================
                  FOOTER
              ======================================= */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3

                  border-t
                  border-[#EEE9F2]

                  bg-[#FCFAFD]

                  p-4

                  sm:flex-row
                  sm:justify-end
                  sm:px-6
                  sm:py-5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedReview(
                      null
                    )
                  }
                  className="
                    flex
                    min-h-[48px]
                    w-full
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-[#DCD5E2]

                    bg-white

                    px-5

                    text-sm
                    font-bold
                    text-[#625B67]

                    transition-all

                    hover:bg-[#F7F4F8]

                    active:scale-[0.98]

                    sm:w-auto
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
                    flex
                    min-h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-[#EBCFD5]

                    bg-[#FFF1F3]

                    px-5

                    text-sm
                    font-bold
                    text-[#B45462]

                    transition-all
                    duration-200

                    hover:bg-[#FFE6EA]

                    active:scale-[0.98]

                    sm:w-auto
                  "
                >
                  <TrashIcon />

                  Delete Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            DELETE CONFIRMATION
        ================================================= */}

        {reviewToDelete && (
          <div
            onClick={() => {
              if (!isDeleting) {
                setReviewToDelete(
                  null
                );
              }
            }}
            className="
              fixed
              inset-0
              z-[10000]

              flex
              items-center
              justify-center

              bg-[#29222F]/70

              p-4

              backdrop-blur-md
            "
          >
            <div
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              role="alertdialog"
              aria-modal="true"
              aria-label="Delete review confirmation"
              className="
                w-full
                max-w-[440px]

                rounded-[26px]

                border
                border-[#E9E1E7]

                bg-white

                p-5

                shadow-[0_30px_90px_rgba(33,25,45,0.30)]

                animate-[reviewModalEnter_0.2s_ease-out]

                sm:p-6
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

                  rounded-[20px]

                  border
                  border-[#F0D5DB]

                  bg-[#FFF1F3]

                  text-[#B45462]
                "
              >
                <WarningIcon />
              </div>

              <p
                className="
                  mt-5
                  text-center

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#B45462]
                "
              >
                Destructive
                Action
              </p>

              <h3
                className="
                  mt-2

                  text-center

                  text-xl
                  font-extrabold
                  tracking-[-0.025em]

                  text-[#2F3136]
                "
              >
                Delete this
                review?
              </h3>

              <p
                className="
                  mt-3

                  text-center
                  text-sm
                  leading-6

                  text-[#817A85]
                "
              >
                The feedback
                from{" "}

                <span
                  className="
                    font-bold
                    text-[#39333E]
                  "
                >
                  {getReviewerName(
                    reviewToDelete
                  )}
                </span>{" "}
                will be
                permanently
                removed from
                Velmora. This
                action cannot
                be undone.
              </p>

              <div
                className="
                  mt-6

                  flex
                  flex-col-reverse
                  gap-3

                  sm:flex-row
                "
              >
                <button
                  type="button"
                  disabled={
                    isDeleting
                  }
                  onClick={() =>
                    setReviewToDelete(
                      null
                    )
                  }
                  className="
                    flex
                    min-h-[48px]
                    flex-1
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-[#DCD5E2]

                    bg-white

                    px-4

                    text-sm
                    font-bold
                    text-[#625B67]

                    transition-all

                    hover:bg-[#F7F4F8]

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    isDeleting
                  }
                  onClick={
                    deleteReview
                  }
                  className="
                    flex
                    min-h-[48px]
                    flex-1
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-[#B45462]

                    px-4

                    text-sm
                    font-bold
                    text-white

                    shadow-[0_9px_22px_rgba(180,84,98,0.20)]

                    transition-all

                    hover:bg-[#9F4655]

                    active:scale-[0.98]

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4

                          animate-spin

                          rounded-full

                          border-2
                          border-white/35
                          border-t-white
                        "
                      />

                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon />

                      Delete
                      Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative

            mb-5

            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E2F0]

            bg-gradient-to-r
            from-[#F5F1FF]
            via-white
            to-[#FFF3F7]

            p-5

            shadow-[0_16px_50px_rgba(63,48,84,0.05)]

            sm:mb-6
            sm:rounded-[30px]
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none

              absolute
              -right-20
              -top-20

              h-52
              w-52

              rounded-full

              bg-[#B8A1FF]/14

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none

              absolute
              -bottom-24
              left-[35%]

              h-44
              w-44

              rounded-full

              bg-[#F2B8C6]/10

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-[#DED5F4]

                  bg-white/75

                  px-3
                  py-1.5

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#6C5CE7]

                  sm:text-[10px]
                "
              >
                <span className="text-[#B9955B]">
                  ✦
                </span>

                Velmora
                Customer
                Voice
              </div>

              <h1
                className="
                  mt-3

                  text-2xl
                  font-extrabold
                  tracking-[-0.04em]

                  text-[#2F3136]

                  sm:text-3xl

                  lg:text-[34px]
                "
              >
                Reviews &
                Feedback
              </h1>

              <p
                className="
                  mt-2

                  max-w-2xl

                  text-xs
                  leading-6

                  text-[#78717D]

                  sm:text-sm
                "
              >
                Understand how
                customers feel
                about their
                Velmora
                experience,
                identify
                concerns and
                protect the
                quality of the
                beauty
                collection.
              </p>
            </div>

            <button
              type="button"
              onClick={
                refreshReviews
              }
              disabled={
                isRefreshing
              }
              className="
                group

                flex
                min-h-[46px]
                w-full
                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-[#DAD1EC]

                bg-white

                px-4

                text-sm
                font-bold
                text-[#625A68]

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-[#C8B9F2]
                hover:text-[#6C5CE7]
                hover:shadow-md

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto
              "
            >
              <span
                className={`
                  ${
                    isRefreshing
                      ? "animate-spin"
                      : "transition-transform duration-500 group-hover:rotate-180"
                  }
                `}
              >
                <RefreshIcon />
              </span>

              {isRefreshing
                ? "Refreshing..."
                : "Refresh Reviews"}
            </button>
          </div>
        </section>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section
          className="
            mb-5

            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
            lg:gap-4
          "
        >
          <StatCard
            title="Total Reviews"
            value={
              reviews.length
            }
            type="total"
          />

          <StatCard
            title="Average Rating"
            value={`${averageRating.toFixed(
              1
            )} / 5`}
            type="average"
          />

          <StatCard
            title="5-Star Reviews"
            value={
              fiveStarCount
            }
            type="positive"
          />

          <StatCard
            title="Low Ratings"
            value={
              lowRatingCount
            }
            type="warning"
          />
        </section>

        {/* OPTIONAL VERIFIED INFO */}

        {verifiedCount >
          0 && (
          <div
            className="
              mb-5

              flex
              items-center
              gap-3

              rounded-2xl

              border
              border-[#D8EADF]

              bg-[#F2F9F5]

              px-4
              py-3
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

                bg-white

                text-[#4F8F70]

                shadow-sm
              "
            >
              ✓
            </div>

            <p
              className="
                text-xs
                leading-5
                text-[#5E7467]

                sm:text-sm
              "
            >
              <span className="font-bold">
                {
                  verifiedCount
                }
              </span>{" "}
              review
              {verifiedCount ===
              1
                ? ""
                : "s"}{" "}
              marked as verified
              purchases.
            </p>
          </div>
        )}

        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <section
          className="
            mb-5

            rounded-[24px]

            border
            border-[#E9E3EF]

            bg-white

            p-4

            shadow-[0_12px_38px_rgba(63,48,84,0.04)]

            sm:p-5
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-3

              md:grid-cols-[minmax(0,1fr)_180px_190px]
            "
          >
            {/* SEARCH */}

            <div className="relative">
              <div
                className="
                  pointer-events-none

                  absolute
                  left-3
                  top-1/2

                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F2EDFF]

                  text-[#6C5CE7]
                "
              >
                <SearchIcon />
              </div>

              <input
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search customer, product, email, review or ID..."
                className="
                  min-h-[52px]
                  w-full

                  rounded-2xl

                  border
                  border-[#DDD7E2]

                  bg-white

                  pl-[58px]
                  pr-12

                  text-sm
                  text-[#39333E]

                  outline-none

                  transition-all
                  duration-300

                  placeholder:text-[#AAA3AF]

                  hover:border-[#CFC5D8]

                  focus:border-[#B8A1FF]
                  focus:ring-4
                  focus:ring-[#B8A1FF]/15
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="
                    absolute
                    right-3
                    top-1/2

                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center

                    rounded-full

                    text-[#9B939F]

                    transition-colors

                    hover:bg-[#F2EDFF]
                    hover:text-[#6C5CE7]
                  "
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            {/* RATING */}

            <select
              value={
                ratingFilter
              }
              onChange={(
                event
              ) =>
                setRatingFilter(
                  event.target
                    .value
                )
              }
              className="
                min-h-[52px]
                w-full

                rounded-2xl

                border
                border-[#DDD7E2]

                bg-white

                px-4

                text-sm
                font-semibold
                text-[#625B67]

                outline-none

                transition-all

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15
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

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(
                event
              ) =>
                setSortBy(
                  event.target
                    .value
                )
              }
              className="
                min-h-[52px]
                w-full

                rounded-2xl

                border
                border-[#DDD7E2]

                bg-white

                px-4

                text-sm
                font-semibold
                text-[#625B67]

                outline-none

                transition-all

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15
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

          <div
            className="
              mt-3

              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[10px]
                text-[#99919D]

                sm:text-xs
              "
            >
              Showing{" "}
              <span
                className="
                  font-bold
                  text-[#6C5CE7]
                "
              >
                {
                  filteredReviews.length
                }
              </span>{" "}
              of{" "}
              {
                reviews.length
              }{" "}
              Velmora reviews
            </p>

            {(search ||
              ratingFilter !==
                "all" ||
              sortBy !==
                "newest") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  self-start

                  text-xs
                  font-bold
                  text-[#6C5CE7]

                  transition-colors

                  hover:text-[#5544C5]
                  hover:underline

                  sm:self-auto
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            REVIEW LIST
        ================================================= */}

        <section
          className="
            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E3EF]

            bg-white

            shadow-[0_15px_48px_rgba(63,48,84,0.045)]
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3

              border-b
              border-[#EEE9F2]

              px-4
              py-4

              sm:px-6
              sm:py-5
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.17em]

                  text-[#927CE4]
                "
              >
                Community
                Experience
              </p>

              <h2
                className="
                  mt-1

                  text-base
                  font-extrabold
                  text-[#2F3136]

                  sm:text-lg
                "
              >
                Customer
                Reviews
              </h2>

              <p
                className="
                  mt-1

                  text-[10px]
                  text-[#99919D]

                  sm:text-xs
                "
              >
                Select a review
                to see the
                complete
                feedback.
              </p>
            </div>

            <span
              className="
                flex
                h-9
                min-w-[38px]
                items-center
                justify-center

                rounded-full

                border
                border-[#E0D7F3]

                bg-[#F5F1FF]

                px-3

                text-xs
                font-bold
                text-[#6C5CE7]
              "
            >
              {
                filteredReviews.length
              }
            </span>
          </div>

          {/* DESKTOP TABLE HEADER */}

          <div
            className="
              hidden

              grid-cols-[1.15fr_1.15fr_145px_2fr_140px]
              gap-4

              border-b
              border-[#EAE4EE]

              bg-[#F8F5FB]

              px-6
              py-4

              text-[10px]
              font-black
              uppercase
              tracking-[0.08em]
              text-[#827A87]

              xl:grid
            "
          >
            <div>
              Customer
            </div>

            <div>
              Product
            </div>

            <div>
              Rating
            </div>

            <div>
              Review
            </div>

            <div className="text-center">
              Actions
            </div>
          </div>

          {/* LIST */}

          <div
            className="
              divide-y
              divide-[#F0EBF3]
            "
          >
            {filteredReviews.map(
              (
                review,
                index
              ) => {
                const reviewKey =
                  getReviewId(
                    review
                  ) ||
                  `${getReviewerEmail(
                    review
                  )}-${getProductName(
                    review
                  )}-${getReviewDate(
                    review
                  )}-${index}`;

                return (
                  <article
                    key={
                      reviewKey
                    }
                    onClick={() =>
                      setSelectedReview(
                        review
                      )
                    }
                    className="
                      group

                      cursor-pointer

                      transition-all
                      duration-200

                      hover:bg-[#FCFAFD]
                    "
                  >
                    {/* ===================================
                        MOBILE / TABLET
                    =================================== */}

                    <div
                      className="
                        p-4

                        sm:p-5

                        xl:hidden
                      "
                    >
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
                              truncate

                              font-extrabold
                              text-[#39333E]
                            "
                          >
                            {getReviewerName(
                              review
                            )}
                          </h3>

                          <p
                            className="
                              mt-1

                              truncate

                              text-xs
                              text-[#8F8794]

                              sm:text-sm
                            "
                          >
                            {getProductName(
                              review
                            )}
                          </p>

                          {review
                            .verifiedPurchase && (
                            <span
                              className="
                                mt-2
                                inline-flex

                                rounded-full

                                border
                                border-[#D5E9DF]

                                bg-[#EDF7F2]

                                px-2.5
                                py-1

                                text-[9px]
                                font-bold
                                text-[#478465]
                              "
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        <RatingStars
                          rating={getRating(
                            review
                          )}
                          compact
                        />
                      </div>

                      {/* COMMENT */}

                      <div
                        className="
                          mt-4

                          rounded-2xl

                          border
                          border-[#EEE9F2]

                          bg-[#FCFAFD]

                          p-3.5
                        "
                      >
                        <p
                          className="
                            line-clamp-3

                            text-sm
                            leading-6
                            text-[#69626E]
                          "
                        >
                          “
                          {getComment(
                            review
                          )}
                          ”
                        </p>
                      </div>

                      {/* FOOTER */}

                      <div
                        className="
                          mt-4

                          flex
                          flex-col
                          gap-3

                          border-t
                          border-[#EEE9F2]

                          pt-3

                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[10px]
                              text-[#99919D]
                            "
                          >
                            {
                              getReviewerEmail(
                                review
                              )
                            }
                          </p>

                          <p
                            className="
                              mt-1

                              text-[9px]
                              text-[#AAA3AE]
                            "
                          >
                            {formatDate(
                              getReviewDate(
                                review
                              )
                            )}
                          </p>
                        </div>

                        <div
                          className="
                            flex
                            gap-2
                          "
                        >
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              setSelectedReview(
                                review
                              );
                            }}
                            className="
                              flex
                              min-h-[42px]
                              flex-1
                              items-center
                              justify-center
                              gap-2

                              rounded-xl

                              border
                              border-[#DDD5F2]

                              bg-[#F4F0FF]

                              px-4

                              text-xs
                              font-bold
                              text-[#6C5CE7]

                              transition-all

                              hover:bg-[#ECE5FF]

                              active:scale-[0.98]

                              sm:flex-none
                            "
                          >
                            <EyeIcon />

                            Details
                          </button>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              setReviewToDelete(
                                review
                              );
                            }}
                            className="
                              flex
                              min-h-[42px]
                              flex-1
                              items-center
                              justify-center
                              gap-2

                              rounded-xl

                              border
                              border-[#F0D6DB]

                              bg-[#FFF3F5]

                              px-4

                              text-xs
                              font-bold
                              text-[#B45462]

                              transition-all

                              hover:bg-[#FFE9ED]

                              active:scale-[0.98]

                              sm:flex-none
                            "
                          >
                            <TrashIcon />

                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ===================================
                        DESKTOP
                    =================================== */}

                    <div
                      className="
                        hidden

                        grid-cols-[1.15fr_1.15fr_145px_2fr_140px]
                        items-center
                        gap-4

                        px-6
                        py-5

                        xl:grid
                      "
                    >
                      {/* CUSTOMER */}

                      <div className="min-w-0">
                        <p
                          className="
                            truncate

                            text-sm
                            font-bold
                            text-[#39333E]
                          "
                        >
                          {getReviewerName(
                            review
                          )}
                        </p>

                        <p
                          className="
                            mt-1

                            truncate

                            text-xs
                            text-[#99919D]
                          "
                        >
                          {getReviewerEmail(
                            review
                          )}
                        </p>

                        {review
                          .verifiedPurchase && (
                          <span
                            className="
                              mt-2
                              inline-flex

                              rounded-full

                              bg-[#EDF7F2]

                              px-2
                              py-1

                              text-[8px]
                              font-bold
                              text-[#478465]
                            "
                          >
                            Verified
                          </span>
                        )}
                      </div>

                      {/* PRODUCT */}

                      <p
                        className="
                          truncate

                          text-sm
                          text-[#625B67]
                        "
                        title={getProductName(
                          review
                        )}
                      >
                        {getProductName(
                          review
                        )}
                      </p>

                      {/* RATING */}

                      <RatingStars
                        rating={getRating(
                          review
                        )}
                        compact
                      />

                      {/* COMMENT */}

                      <p
                        className="
                          truncate

                          text-sm
                          text-[#746D78]
                        "
                        title={getComment(
                          review
                        )}
                      >
                        {getComment(
                          review
                        )}
                      </p>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            setSelectedReview(
                              review
                            );
                          }}
                          title="View review"
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-[#DDD5F2]

                            bg-[#F4F0FF]

                            text-[#6C5CE7]

                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:bg-[#6C5CE7]
                            hover:text-white

                            active:scale-90
                          "
                        >
                          <EyeIcon />
                        </button>

                        <button
                          type="button"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            setReviewToDelete(
                              review
                            );
                          }}
                          title="Delete review"
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-[#F0D6DB]

                            bg-[#FFF3F5]

                            text-[#B45462]

                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:bg-[#B45462]
                            hover:text-white

                            active:scale-90
                          "
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredReviews.length ===
            0 && (
            <div
              className="
                px-5
                py-14

                text-center

                sm:py-20
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

                  rounded-[20px]

                  border
                  border-[#E2D9F4]

                  bg-[#F5F1FF]

                  text-[#6C5CE7]
                "
              >
                <FeedbackIcon />
              </div>

              <p
                className="
                  mt-4

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#927CE4]
                "
              >
                Velmora
                Customer
                Voice
              </p>

              <h3
                className="
                  mt-2

                  text-lg
                  font-extrabold
                  text-[#39333E]
                "
              >
                No reviews
                found.
              </h3>

              <p
                className="
                  mx-auto
                  mt-2

                  max-w-sm

                  text-sm
                  leading-6
                  text-[#918996]
                "
              >
                {search ||
                ratingFilter !==
                  "all"
                  ? "No customer feedback matches the selected search or rating filter."
                  : "Customer experiences and product feedback will appear here."}
              </p>

              {(search ||
                ratingFilter !==
                  "all" ||
                sortBy !==
                  "newest") && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-5

                    min-h-[44px]

                    rounded-xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#8F78EA]

                    px-5

                    text-sm
                    font-bold
                    text-white

                    shadow-[0_9px_22px_rgba(108,92,231,0.20)]

                    transition-all

                    hover:-translate-y-0.5
                    hover:shadow-[0_13px_28px_rgba(108,92,231,0.28)]

                    active:scale-[0.98]
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            ANIMATIONS
        ================================================= */}

        <style>{`
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
              transform: scale(0.97) translateY(10px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[reviewPageEnter_0\\.4s_ease-out\\],
            .animate-\\[reviewModalEnter_0\\.25s_ease-out\\],
            .animate-\\[reviewModalEnter_0\\.2s_ease-out\\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* =========================================================
   RATING STARS
========================================================= */

function RatingStars({
  rating,
  compact = false,
}) {
  const value =
    Number(rating || 0);

  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-0.5
      "
      aria-label={`${value.toFixed(
        1
      )} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <svg
            key={star}
            className={`
              ${
                compact
                  ? "h-4 w-4"
                  : "h-5 w-5"
              }

              ${
                star <= value
                  ? "text-[#D4A84F]"
                  : "text-[#E6E1E9]"
              }
            `}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
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
          text-[#817985]
        "
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  type,
}) {
  const config = {
    total: {
      card:
        "border-[#E0D7F5] bg-[#F7F4FF]",

      accent:
        "bg-[#6C5CE7]",
    },

    average: {
      card:
        "border-[#F0E0C4] bg-[#FFF9EF]",

      accent:
        "bg-[#D4A84F]",
    },

    positive: {
      card:
        "border-[#D7EADF] bg-[#F2F9F5]",

      accent:
        "bg-[#4F9D7A]",
    },

    warning: {
      card:
        "border-[#F0D6DB] bg-[#FFF4F5]",

      accent:
        "bg-[#D95C5C]",
    },
  };

  const current =
    config[type] ||
    config.total;

  return (
    <div
      className={`
        relative
        overflow-hidden

        rounded-[20px]

        border

        p-3.5

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-md

        sm:p-4

        ${current.card}
      `}
    >
      <span
        className={`
          absolute
          right-3
          top-3

          h-2
          w-2

          rounded-full

          ${current.accent}
        `}
      />

      <p
        className="
          pr-5

          text-[9px]
          font-semibold
          leading-4

          text-[#7D7581]

          sm:text-xs
        "
      >
        {title}
      </p>

      <p
        className="
          mt-3

          text-lg
          font-extrabold
          tracking-[-0.025em]

          text-[#39333E]

          sm:text-xl
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   REVIEW DETAIL
========================================================= */

function ReviewDetail({
  title,
  value,
}) {
  return (
    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-[#EAE4EF]

        bg-[#FCFAFD]

        p-4

        transition-all
        duration-200

        hover:border-[#DED4EF]
        hover:bg-white
        hover:shadow-sm
      "
    >
      <p
        className="
          text-[9px]
          font-black
          uppercase
          tracking-[0.12em]

          text-[#9A929E]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2

          break-words

          text-sm
          font-semibold
          leading-6

          text-[#514A56]
        "
      >
        {value}
      </p>
    </div>
  );
}