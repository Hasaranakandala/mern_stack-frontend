import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Loading from "../../components/loading";

/*
=========================================================
VELMORA ADMIN DASHBOARD
=========================================================

Primary Violet   #6C5CE7
Lavender         #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Secondary        #6B7280
Success          #4F9D7A
Warning          #D99A3E
Error            #D95C5C

Admin direction:
Premium
Professional
Data-focused
Calm Luxury
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

function RevenueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.5 2.4-5 5.5-5s5 1.5 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5" />
      <path d="M16.5 14c2.5.4 3.7 2 4 5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m12 2.7 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.7Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  function extractArray(data, keys = []) {
    if (Array.isArray(data)) {
      return data;
    }

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }
    }

    return [];
  }

  function numberValue(value) {
    if (typeof value === "number") {
      return value;
    }

    if (value === null || value === undefined) {
      return 0;
    }

    const cleaned = String(value)
      .replace(/,/g, "")
      .replace(/[^\d.-]/g, "");

    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  function getOrderAmount(order) {
    return numberValue(
      order.total ??
        order.labelTotal ??
        0
    );
  }

  function getOrderDate(order) {
    const value =
      order.date ||
      order.createdAt;

    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date;
  }

  function getReviewDate(review) {
    const value =
      review.date ||
      review.createdAt;

    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date;
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits:
          0,
        maximumFractionDigits:
          2,
      }
    );
  }

  function formatCompact(value) {
    return new Intl.NumberFormat(
      "en-US",
      {
        notation:
          "compact",
        maximumFractionDigits:
          1,
      }
    ).format(
      value || 0
    );
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getCustomerName(order) {
    return (
      order.name ||
      order.email ||
      "Customer"
    );
  }

  function getReviewCustomer(
    review
  ) {
    return (
      review.name ||
      review.userName ||
      review.email ||
      "Customer"
    );
  }

  function getProductName(
    review
  ) {
    return (
      review.product
        ?.productName ||
      review.product?.name ||
      review.productId
        ?.productName ||
      review.productId
        ?.name ||
      review.productId ||
      "Product"
    );
  }

  /* =====================================================
     FETCH DASHBOARD DATA
  ===================================================== */

  async function fetchDashboardData(
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

    const config = {
      headers: {
        Authorization:
          "Bearer " +
          token,
      },
    };

    try {
      const results =
        await Promise.allSettled(
          [
            axios.get(
              import.meta.env
                .VITE_BACKEND_URL +
                "/api/product",
              config
            ),

            axios.get(
              import.meta.env
                .VITE_BACKEND_URL +
                "/api/order",
              config
            ),

            axios.get(
              import.meta.env
                .VITE_BACKEND_URL +
                "/api/user",
              config
            ),

            axios.get(
              import.meta.env
                .VITE_BACKEND_URL +
                "/api/review",
              config
            ),
          ]
        );

      if (
        results[0]
          .status ===
        "fulfilled"
      ) {
        setProducts(
          extractArray(
            results[0]
              .value.data,
            [
              "products",
              "data",
            ]
          )
        );
      }

      if (
        results[1]
          .status ===
        "fulfilled"
      ) {
        setOrders(
          extractArray(
            results[1]
              .value.data,
            [
              "orders",
              "data",
            ]
          )
        );
      }

      if (
        results[2]
          .status ===
        "fulfilled"
      ) {
        setUsers(
          extractArray(
            results[2]
              .value.data,
            [
              "users",
              "data",
            ]
          )
        );
      }

      if (
        results[3]
          .status ===
        "fulfilled"
      ) {
        setReviews(
          extractArray(
            results[3]
              .value.data,
            [
              "reviews",
              "data",
            ]
          )
        );
      }

      const failedRequests =
        results.filter(
          (result) =>
            result.status ===
            "rejected"
        );

      if (
        failedRequests.length >
        0
      ) {
        console.error(
          "Some dashboard APIs failed:",
          failedRequests
        );

        toast.error(
          "Some Velmora dashboard information could not be loaded"
        );
      } else if (
        showSuccess
      ) {
        toast.success(
          "Velmora dashboard refreshed"
        );
      }
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );

      toast.error(
        "Failed to load the Velmora dashboard"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(
        false
      );
    }
  }

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* =====================================================
     REFRESH
  ===================================================== */

  async function refreshDashboard() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    await fetchDashboardData(
      true
    );
  }

  /* =====================================================
     ORDER ANALYSIS
  ===================================================== */

  const completedOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            String(
              order.status
            ).toLowerCase() ===
            "completed"
        ),
      [orders]
    );

  const pendingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            String(
              order.status
            ).toLowerCase() ===
            "pending"
        ),
      [orders]
    );

  const processingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            String(
              order.status
            ).toLowerCase() ===
            "processing"
        ),
      [orders]
    );

  const cancelledOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            String(
              order.status
            ).toLowerCase() ===
            "cancelled"
        ),
      [orders]
    );

  const returnedOrders =
    useMemo(
      () =>
        orders.filter(
          (order) => {
            const status =
              String(
                order.status
              ).toLowerCase();

            return (
              status ===
                "returned" ||
              status ===
                "returened"
            );
          }
        ),
      [orders]
    );

  const totalRevenue =
    useMemo(
      () =>
        completedOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            getOrderAmount(
              order
            ),
          0
        ),
      [completedOrders]
    );

  const averageOrderValue =
    completedOrders.length >
    0
      ? totalRevenue /
        completedOrders.length
      : 0;

  /* =====================================================
     PRODUCT ANALYSIS
  ===================================================== */

  const lowStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) => {
            const value =
              numberValue(
                product.stock
              );

            return (
              value > 0 &&
              value <= 5
            );
          }
        ),
      [products]
    );

  const outOfStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            numberValue(
              product.stock
            ) <= 0
        ),
      [products]
    );

  /* =====================================================
     USERS
  ===================================================== */

  const blockedUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.isBlock ===
            true
        ),
      [users]
    );

  /*
    This is intentionally described
    as "unblocked", not customer
    activity. isBlock does not
    represent recent activity.
  */
  const unblockedUsers =
    users.length -
    blockedUsers.length;

  const customerUsers =
    users.filter(
      (user) =>
        user.role !==
        "admin"
    ).length;

  /* =====================================================
     REVIEW ANALYSIS
  ===================================================== */

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            numberValue(
              review.rating
            ),
          0
        ) /
        reviews.length
      : 0;

  const lowRatingReviews =
    reviews.filter(
      (review) =>
        numberValue(
          review.rating
        ) <= 2
    );

  const fiveStarReviews =
    reviews.filter(
      (review) =>
        numberValue(
          review.rating
        ) === 5
    );

  /* =====================================================
     LAST 7 DAYS SALES
  ===================================================== */

  const salesData =
    useMemo(() => {
      const data = [];

      const today =
        new Date();

      for (
        let offset = 6;
        offset >= 0;
        offset--
      ) {
        const targetDate =
          new Date(today);

        targetDate.setHours(
          0,
          0,
          0,
          0
        );

        targetDate.setDate(
          targetDate.getDate() -
            offset
        );

        const nextDate =
          new Date(
            targetDate
          );

        nextDate.setDate(
          nextDate.getDate() +
            1
        );

        const dayOrders =
          completedOrders.filter(
            (order) => {
              const orderDate =
                getOrderDate(
                  order
                );

              if (
                !orderDate
              ) {
                return false;
              }

              return (
                orderDate >=
                  targetDate &&
                orderDate <
                  nextDate
              );
            }
          );

        const revenue =
          dayOrders.reduce(
            (
              total,
              order
            ) =>
              total +
              getOrderAmount(
                order
              ),
            0
          );

        data.push({
          label:
            targetDate.toLocaleDateString(
              "en-US",
              {
                month:
                  "short",
                day: "numeric",
              }
            ),

          revenue,

          orders:
            dayOrders.length,
        });
      }

      return data;
    }, [completedOrders]);

  /* =====================================================
     STATUS DATA
  ===================================================== */

  const orderStatusData =
    [
      {
        status: "Pending",
        count:
          pendingOrders.length,
      },
      {
        status:
          "Processing",
        count:
          processingOrders.length,
      },
      {
        status:
          "Completed",
        count:
          completedOrders.length,
      },
      {
        status:
          "Cancelled",
        count:
          cancelledOrders.length,
      },
      {
        status:
          "Returned",
        count:
          returnedOrders.length,
      },
    ];

  /* =====================================================
     RECENT ORDERS
  ===================================================== */

  const recentOrders =
    useMemo(() => {
      return [...orders]
        .sort((a, b) => {
          const aDate =
            getOrderDate(a);

          const bDate =
            getOrderDate(b);

          return (
            (bDate?.getTime() ||
              0) -
            (aDate?.getTime() ||
              0)
          );
        })
        .slice(0, 5);
    }, [orders]);

  /* =====================================================
     RECENT REVIEWS
  ===================================================== */

  const recentReviews =
    useMemo(() => {
      return [...reviews]
        .sort((a, b) => {
          const aDate =
            getReviewDate(a);

          const bDate =
            getReviewDate(b);

          return (
            (bDate?.getTime() ||
              0) -
            (aDate?.getTime() ||
              0)
          );
        })
        .slice(0, 4);
    }, [reviews]);

  /* =====================================================
     INSIGHTS
  ===================================================== */

  const insights = [];

  if (
    pendingOrders.length >
    0
  ) {
    insights.push({
      type: "warning",

      title:
        "Orders awaiting attention",

      text: `${
        pendingOrders.length
      } order${
        pendingOrders.length ===
        1
          ? ""
          : "s"
      } currently ${
        pendingOrders.length ===
        1
          ? "requires"
          : "require"
      } attention in Pending status.`,

      link:
        "/admin/orders",

      action:
        "Manage Orders",
    });
  }

  if (
    lowStockProducts.length >
      0 ||
    outOfStockProducts.length >
      0
  ) {
    insights.push({
      type: "danger",

      title:
        "Inventory requires attention",

      text: `${lowStockProducts.length} low-stock and ${outOfStockProducts.length} out-of-stock Velmora products.`,

      link:
        "/admin/products",

      action:
        "Review Inventory",
    });
  }

  if (
    lowRatingReviews.length >
    0
  ) {
    insights.push({
      type: "warning",

      title:
        "Customer feedback needs review",

      text: `${
        lowRatingReviews.length
      } review${
        lowRatingReviews.length ===
        1
          ? ""
          : "s"
      } ${
        lowRatingReviews.length ===
        1
          ? "has"
          : "have"
      } a rating of 2 stars or lower.`,

      link:
        "/admin/reviews",

      action:
        "View Reviews",
    });
  }

  if (
    blockedUsers.length >
    0
  ) {
    insights.push({
      type: "info",

      title:
        "Blocked customer accounts",

      text: `${
        blockedUsers.length
      } account${
        blockedUsers.length ===
        1
          ? " is"
          : "s are"
      } currently blocked.`,

      link:
        "/admin/users",

      action:
        "Manage Users",
    });
  }

  if (
    insights.length ===
    0
  ) {
    insights.push({
      type: "success",

      title:
        "Velmora is running smoothly",

      text:
        "There are no major inventory, order, account or review alerts requiring immediate administrator attention.",

      link: null,
      action: null,
    });
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading message="Preparing your Velmora business overview..." />
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
      "
    >
      {/* BACKGROUND AMBIENCE */}

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
          -right-44
          top-[500px]

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
            HEADER
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

            px-5
            py-5

            shadow-[0_16px_50px_rgba(63,48,84,0.05)]

            sm:mb-6
            sm:rounded-[30px]
            sm:px-7
            sm:py-6
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

              bg-[#B8A1FF]/13

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

                  shadow-sm

                  sm:text-[10px]
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
                Business
                Intelligence
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
                Business
                Overview
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
                Monitor revenue,
                orders,
                customers,
                product
                inventory and
                customer
                experience
                across Velmora.
              </p>
            </div>

            <button
              type="button"
              onClick={
                refreshDashboard
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

                active:scale-[0.98]

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
                : "Refresh Data"}
            </button>
          </div>
        </section>

        {/* =================================================
            PRIMARY KPI
        ================================================= */}

        <section
          className="
            mb-5

            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2
            sm:gap-4

            xl:grid-cols-4
          "
        >
          <MetricCard
            title="Completed Revenue"
            value={`Rs. ${formatMoney(
              totalRevenue
            )}`}
            description={`${completedOrders.length} completed orders`}
            type="revenue"
          />

          <MetricCard
            title="Total Orders"
            value={
              orders.length
            }
            description={`${pendingOrders.length} awaiting action`}
            type="orders"
          />

          <MetricCard
            title="Customers"
            value={
              customerUsers
            }
            description={`${unblockedUsers} unblocked accounts`}
            type="users"
          />

          <MetricCard
            title="Customer Rating"
            value={
              reviews.length >
              0
                ? averageRating.toFixed(
                    1
                  )
                : "0.0"
            }
            description={`${reviews.length} customer reviews`}
            type="reviews"
          />
        </section>

        {/* =================================================
            SECONDARY KPI
        ================================================= */}

        <section
          className="
            mb-6

            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
            lg:gap-4
          "
        >
          <SmallMetric
            title="Pending Orders"
            value={
              pendingOrders.length
            }
            warning={
              pendingOrders.length >
              0
            }
          />

          <SmallMetric
            title="Average Completed Order"
            value={`Rs. ${formatMoney(
              averageOrderValue
            )}`}
          />

          <SmallMetric
            title="Low Stock"
            value={
              lowStockProducts.length
            }
            warning={
              lowStockProducts.length >
              0
            }
          />

          <SmallMetric
            title="Blocked Accounts"
            value={
              blockedUsers.length
            }
            warning={
              blockedUsers.length >
              0
            }
          />
        </section>

        {/* =================================================
            CHARTS
        ================================================= */}

        <section
          className="
            mb-6

            grid
            grid-cols-1
            gap-5

            xl:grid-cols-[1.55fr_1fr]
          "
        >
          {/* REVENUE */}

          <DashboardPanel>
            <div
              className="
                mb-6

                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <PanelEyebrow>
                  Revenue
                  Intelligence
                </PanelEyebrow>

                <h2
                  className="
                    mt-1

                    text-lg
                    font-extrabold
                    tracking-[-0.02em]

                    text-[#2F3136]
                  "
                >
                  Revenue Trend
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-[#89818D]

                    sm:text-sm
                  "
                >
                  Completed-order
                  revenue during
                  the last seven
                  days.
                </p>
              </div>

              <span
                className="
                  self-start

                  rounded-full

                  border
                  border-[#E0D7F5]

                  bg-[#F4F0FF]

                  px-3
                  py-1.5

                  text-[10px]
                  font-bold
                  text-[#6C5CE7]
                "
              >
                Last 7 days
              </span>
            </div>

            <div
              className="
                h-[260px]
                w-full

                sm:h-[320px]
              "
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={
                    salesData
                  }
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="velmoraRevenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6C5CE7"
                        stopOpacity={
                          0.3
                        }
                      />

                      <stop
                        offset="95%"
                        stopColor="#B8A1FF"
                        stopOpacity={
                          0
                        }
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={
                      false
                    }
                    stroke="#EEE9F2"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "#938B97",
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                  />

                  <YAxis
                    tickFormatter={
                      formatCompact
                    }
                    tick={{
                      fontSize: 10,
                      fill: "#938B97",
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                  />

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      `Rs. ${formatMoney(
                        value
                      )}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius:
                        16,
                      border:
                        "1px solid #E6DFF0",
                      boxShadow:
                        "0 12px 35px rgba(63,48,84,0.12)",
                      background:
                        "rgba(255,255,255,.97)",
                    }}
                    labelStyle={{
                      fontWeight:
                        700,
                      color:
                        "#2F3136",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6C5CE7"
                    strokeWidth={
                      3
                    }
                    fill="url(#velmoraRevenueGradient)"
                    activeDot={{
                      r: 5,
                      fill:
                        "#6C5CE7",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardPanel>

          {/* STATUS */}

          <DashboardPanel>
            <PanelEyebrow>
              Order Operations
            </PanelEyebrow>

            <h2
              className="
                mt-1

                text-lg
                font-extrabold
                tracking-[-0.02em]

                text-[#2F3136]
              "
            >
              Order Status
            </h2>

            <p
              className="
                mb-6
                mt-1
                text-xs
                leading-5
                text-[#89818D]

                sm:text-sm
              "
            >
              Current
              distribution of
              all Velmora
              orders.
            </p>

            <div
              className="
                h-[260px]
                w-full

                sm:h-[320px]
              "
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    orderStatusData
                  }
                  margin={{
                    top: 10,
                    right: 5,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={
                      false
                    }
                    stroke="#EEE9F2"
                  />

                  <XAxis
                    dataKey="status"
                    interval={0}
                    tick={{
                      fontSize: 9,
                      fill: "#938B97",
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                  />

                  <YAxis
                    allowDecimals={
                      false
                    }
                    tick={{
                      fontSize: 10,
                      fill: "#938B97",
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius:
                        16,
                      border:
                        "1px solid #E6DFF0",
                      boxShadow:
                        "0 12px 35px rgba(63,48,84,0.12)",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Orders"
                    fill="#6C5CE7"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardPanel>
        </section>

        {/* =================================================
            BUSINESS ANALYSIS
        ================================================= */}

        <section
          className="
            mb-6

            grid
            grid-cols-1
            gap-5

            xl:grid-cols-2
          "
        >
          {/* INSIGHTS */}

          <DashboardPanel>
            <PanelEyebrow>
              Administrator
              Attention
            </PanelEyebrow>

            <h2
              className="
                mt-1
                text-lg
                font-extrabold
                text-[#2F3136]
              "
            >
              Business Insights
            </h2>

            <p
              className="
                mb-5
                mt-1
                text-sm
                leading-6
                text-[#89818D]
              "
            >
              Areas that may
              require an
              administrator
              decision or
              action.
            </p>

            <div
              className="
                flex
                flex-col
                gap-3
              "
            >
              {insights.map(
                (
                  insight,
                  index
                ) => (
                  <InsightCard
                    key={
                      index
                    }
                    {...insight}
                  />
                )
              )}
            </div>
          </DashboardPanel>

          {/* HEALTH */}

          <DashboardPanel>
            <PanelEyebrow>
              Velmora Health
            </PanelEyebrow>

            <h2
              className="
                mt-1
                text-lg
                font-extrabold
                text-[#2F3136]
              "
            >
              Store Health
            </h2>

            <p
              className="
                mb-6
                mt-1
                text-sm
                leading-6
                text-[#89818D]
              "
            >
              Key indicators
              across orders,
              reviews,
              accounts and
              inventory.
            </p>

            <div
              className="
                flex
                flex-col
                gap-5
              "
            >
              <HealthRow
                title="Order completion"
                value={
                  orders.length >
                  0
                    ? (completedOrders.length /
                        orders.length) *
                      100
                    : 0
                }
              />

              <HealthRow
                title="5-star review share"
                value={
                  reviews.length >
                  0
                    ? (fiveStarReviews.length /
                        reviews.length) *
                      100
                    : 0
                }
              />

              <HealthRow
                title="Accounts not blocked"
                value={
                  users.length >
                  0
                    ? (unblockedUsers /
                        users.length) *
                      100
                    : 0
                }
              />

              <HealthRow
                title="Products in stock"
                value={
                  products.length >
                  0
                    ? ((products.length -
                        outOfStockProducts.length) /
                        products.length) *
                      100
                    : 0
                }
              />
            </div>
          </DashboardPanel>
        </section>

        {/* =================================================
            RECENT DATA
        ================================================= */}

        <section
          className="
            mb-6

            grid
            grid-cols-1
            gap-5

            xl:grid-cols-[1.2fr_1fr]
          "
        >
          {/* RECENT ORDERS */}

          <div
            className="
              overflow-hidden

              rounded-[24px]

              border
              border-[#E9E3EF]

              bg-white

              shadow-[0_15px_50px_rgba(63,48,84,0.045)]
            "
          >
            <PanelHeader
              eyebrow="Latest Commerce"
              title="Recent Orders"
              description="The latest customer purchases in Velmora."
              to="/admin/orders"
            />

            <div
              className="
                divide-y
                divide-[#F0EBF3]
              "
            >
              {recentOrders.length >
              0 ? (
                recentOrders.map(
                  (order) => (
                    <div
                      key={
                        order._id ||
                        order.orderId
                      }
                      className="
                        flex
                        flex-col
                        gap-3

                        px-4
                        py-4

                        transition-colors

                        hover:bg-[#FCFAFD]

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                      "
                    >
                      <div className="min-w-0">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-extrabold
                              text-[#39333E]
                            "
                          >
                            {order.orderId ||
                              "Order"}
                          </p>

                          <OrderBadge
                            status={
                              order.status
                            }
                          />
                        </div>

                        <p
                          className="
                            mt-1
                            truncate
                            text-sm
                            text-[#706A75]
                          "
                        >
                          {getCustomerName(
                            order
                          )}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-[#A098A5]

                            sm:text-xs
                          "
                        >
                          {formatDate(
                            order.date ||
                              order.createdAt
                          )}
                        </p>
                      </div>

                      <p
                        className="
                          shrink-0
                          text-sm
                          font-extrabold
                          text-[#6C5CE7]
                        "
                      >
                        Rs.{" "}
                        {formatMoney(
                          getOrderAmount(
                            order
                          )
                        )}
                      </p>
                    </div>
                  )
                )
              ) : (
                <EmptyRow text="No Velmora orders are available yet." />
              )}
            </div>
          </div>

          {/* RECENT REVIEWS */}

          <div
            className="
              overflow-hidden

              rounded-[24px]

              border
              border-[#E9E3EF]

              bg-white

              shadow-[0_15px_50px_rgba(63,48,84,0.045)]
            "
          >
            <PanelHeader
              eyebrow="Customer Voice"
              title="Recent Reviews"
              description="Latest feedback from the Velmora community."
              to="/admin/reviews"
            />

            <div
              className="
                divide-y
                divide-[#F0EBF3]
              "
            >
              {recentReviews.length >
              0 ? (
                recentReviews.map(
                  (review) => (
                    <div
                      key={
                        review._id ||
                        review.reviewId
                      }
                      className="
                        px-4
                        py-4

                        transition-colors

                        hover:bg-[#FCFAFD]

                        sm:px-6
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
                          <p
                            className="
                              truncate
                              text-sm
                              font-extrabold
                              text-[#39333E]
                            "
                          >
                            {getReviewCustomer(
                              review
                            )}
                          </p>

                          <p
                            className="
                              mt-1
                              truncate
                              text-xs
                              text-[#978F9B]
                            "
                          >
                            {getProductName(
                              review
                            )}
                          </p>
                        </div>

                        <span
                          className="
                            shrink-0

                            rounded-full

                            border
                            border-[#F1DFC3]

                            bg-[#FFF8ED]

                            px-2.5
                            py-1

                            text-xs
                            font-bold
                            text-[#A87835]
                          "
                        >
                          ★{" "}
                          {numberValue(
                            review.rating
                          ).toFixed(
                            1
                          )}
                        </span>
                      </div>

                      <p
                        className="
                          mt-3

                          line-clamp-2

                          text-sm
                          leading-6
                          text-[#706A75]
                        "
                      >
                        {review.comment ||
                          "No comment provided."}
                      </p>
                    </div>
                  )
                )
              ) : (
                <EmptyRow text="No Velmora reviews are available yet." />
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section
          className="
            rounded-[26px]

            border
            border-[#E9E2EF]

            bg-white

            p-4

            shadow-[0_15px_50px_rgba(63,48,84,0.045)]

            sm:p-6
          "
        >
          <PanelEyebrow>
            Velmora
            Administration
          </PanelEyebrow>

          <h2
            className="
              mt-1
              text-lg
              font-extrabold
              text-[#2F3136]
            "
          >
            Quick Actions
          </h2>

          <p
            className="
              mb-5
              mt-1
              text-sm
              text-[#89818D]
            "
          >
            Move quickly to
            common management
            tasks.
          </p>

          <div
            className="
              grid
              grid-cols-1
              gap-3

              min-[430px]:grid-cols-2

              lg:grid-cols-5
            "
          >
            <QuickAction
              to="/admin/add-product"
              title="Add Product"
              text="Create a new Velmora beauty listing."
            />

            <QuickAction
              to="/admin/orders"
              title="Orders"
              text="Review and update customer orders."
            />

            <QuickAction
              to="/admin/users"
              title="Customers"
              text="Review customer accounts."
            />

            <QuickAction
              to="/admin/reviews"
              title="Reviews"
              text="Manage customer feedback."
            />

            <QuickAction
              to="/"
              title="View Store"
              text="Open the customer-facing Velmora site."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD PANEL
========================================================= */

function DashboardPanel({
  children,
}) {
  return (
    <div
      className="
        rounded-[24px]

        border
        border-[#E9E3EF]

        bg-white

        p-4

        shadow-[0_15px_50px_rgba(63,48,84,0.045)]

        sm:p-6
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   EYEBROW
========================================================= */

function PanelEyebrow({
  children,
}) {
  return (
    <p
      className="
        text-[9px]
        font-black
        uppercase
        tracking-[0.18em]

        text-[#927CE4]

        sm:text-[10px]
      "
    >
      {children}
    </p>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  description,
  type,
}) {
  const config = {
    revenue: {
      icon:
        <RevenueIcon />,
      iconStyle:
        "bg-[#EDF7F2] text-[#4F8F70] border-[#D9ECE2]",
      glow:
        "bg-[#A8C7B8]/20",
    },

    orders: {
      icon:
        <OrderIcon />,
      iconStyle:
        "bg-[#F2EDFF] text-[#6C5CE7] border-[#E0D6FA]",
      glow:
        "bg-[#B8A1FF]/22",
    },

    users: {
      icon:
        <UsersIcon />,
      iconStyle:
        "bg-[#FFF2F6] text-[#B7627D] border-[#F3DCE3]",
      glow:
        "bg-[#F2B8C6]/20",
    },

    reviews: {
      icon:
        <StarIcon />,
      iconStyle:
        "bg-[#FFF8ED] text-[#B18442] border-[#F2E1C7]",
      glow:
        "bg-[#EADBC8]/28",
    },
  };

  const current =
    config[type] ||
    config.orders;

  return (
    <div
      className="
        group
        relative

        min-w-0

        overflow-hidden

        rounded-[22px]

        border
        border-[#E9E3EF]

        bg-white

        p-4

        shadow-[0_12px_38px_rgba(63,48,84,0.045)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[#DCD1F0]
        hover:shadow-[0_20px_45px_rgba(91,70,126,0.09)]

        sm:p-5
      "
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10

          h-28
          w-28

          rounded-full

          blur-3xl

          ${current.glow}
        `}
      />

      <div
        className="
          relative

          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              text-[#8E8792]

              sm:text-xs
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2

              break-words

              text-xl
              font-extrabold
              tracking-[-0.035em]

              text-[#2F3136]

              sm:text-2xl
            "
          >
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-2xl

            border

            transition-transform
            duration-300

            group-hover:scale-105

            ${current.iconStyle}
          `}
        >
          {current.icon}
        </div>
      </div>

      <p
        className="
          relative

          mt-4

          text-[10px]
          leading-5
          text-[#99919D]

          sm:text-xs
        "
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SMALL METRIC
========================================================= */

function SmallMetric({
  title,
  value,
  warning = false,
}) {
  return (
    <div
      className="
        rounded-[18px]

        border
        border-[#EAE4EF]

        bg-white

        p-3.5

        shadow-[0_9px_28px_rgba(63,48,84,0.035)]

        sm:p-4
      "
    >
      <p
        className="
          text-[9px]
          font-semibold
          leading-4
          text-[#938B97]

          sm:text-xs
        "
      >
        {title}
      </p>

      <div
        className="
          mt-1.5

          flex
          items-center
          gap-2
        "
      >
        <p
          className="
            break-words

            text-base
            font-extrabold

            text-[#37313B]

            sm:text-xl
          "
        >
          {value}
        </p>

        {warning && (
          <span
            className="
              h-2
              w-2
              shrink-0

              animate-pulse

              rounded-full

              bg-[#D99A3E]

              shadow-[0_0_0_4px_rgba(217,154,62,0.10)]
            "
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   INSIGHT
========================================================= */

function InsightCard({
  type,
  title,
  text,
  link,
  action,
}) {
  const styles = {
    warning:
      "border-[#F1E1C5] bg-[#FFF9EF]",

    danger:
      "border-[#F0D6DB] bg-[#FFF5F6]",

    info:
      "border-[#DED5F5] bg-[#F7F4FF]",

    success:
      "border-[#D5E8DE] bg-[#F3F9F5]",
  };

  const dots = {
    warning:
      "bg-[#D99A3E]",

    danger:
      "bg-[#D95C5C]",

    info:
      "bg-[#6C5CE7]",

    success:
      "bg-[#4F9D7A]",
  };

  return (
    <div
      className={`
        rounded-2xl

        border

        p-4

        ${styles[type]}
      `}
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <span
          className={`
            mt-1.5
            h-2
            w-2
            shrink-0
            rounded-full

            ${dots[type]}
          `}
        />

        <div className="min-w-0">
          <h3
            className="
              text-sm
              font-extrabold
              text-[#39333E]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-6
              text-[#6F6874]

              sm:text-sm
            "
          >
            {text}
          </p>

          {link &&
            action && (
              <Link
                to={link}
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-1.5

                  text-xs
                  font-bold
                  text-[#6C5CE7]

                  transition-all

                  hover:gap-2.5
                  hover:text-[#5544C5]
                "
              >
                {action}

                <ArrowIcon />
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HEALTH ROW
========================================================= */

function HealthRow({
  title,
  value,
}) {
  const percentage =
    Math.max(
      0,
      Math.min(
        100,
        Number(value || 0)
      )
    );

  return (
    <div>
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            text-xs
            font-semibold
            text-[#6F6874]

            sm:text-sm
          "
        >
          {title}
        </span>

        <span
          className="
            text-xs
            font-extrabold
            text-[#39333E]
          "
        >
          {percentage.toFixed(
            0
          )}
          %
        </span>
      </div>

      <div
        className="
          h-2
          w-full

          overflow-hidden

          rounded-full

          bg-[#EEEAF1]
        "
      >
        <div
          className="
            h-full

            rounded-full

            bg-gradient-to-r
            from-[#6C5CE7]
            via-[#8D77E5]
            to-[#B8A1FF]

            transition-all
            duration-700
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   ORDER BADGE
========================================================= */

function OrderBadge({
  status,
}) {
  const value =
    String(
      status ||
        "unknown"
    ).toLowerCase();

  let style =
    "bg-[#F1EFF2] text-[#746D78] border-[#E5E0E8]";

  if (
    value === "pending"
  ) {
    style =
      "bg-[#FFF8EC] text-[#A87328] border-[#F1DFC0]";
  }

  if (
    value ===
    "processing"
  ) {
    style =
      "bg-[#F2EEFF] text-[#6C5CE7] border-[#DED5F7]";
  }

  if (
    value ===
    "completed"
  ) {
    style =
      "bg-[#EDF7F2] text-[#478465] border-[#D5E9DF]";
  }

  if (
    value ===
    "cancelled"
  ) {
    style =
      "bg-[#FFF1F3] text-[#B45462] border-[#F1D4D9]";
  }

  if (
    value ===
      "returned" ||
    value ===
      "returened"
  ) {
    style =
      "bg-[#F6F1FF] text-[#8267D8] border-[#E3D9FA]";
  }

  return (
    <span
      className={`
        rounded-full

        border

        px-2.5
        py-1

        text-[9px]
        font-bold
        capitalize

        ${style}
      `}
    >
      {status ||
        "Unknown"}
    </span>
  );
}

/* =========================================================
   PANEL HEADER
========================================================= */

function PanelHeader({
  eyebrow,
  title,
  description,
  to,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-3

        border-b
        border-[#EEE9F2]

        px-4
        py-5

        sm:px-6
      "
    >
      <div className="min-w-0">
        <PanelEyebrow>
          {eyebrow}
        </PanelEyebrow>

        <h2
          className="
            mt-1
            text-lg
            font-extrabold
            text-[#2F3136]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[#918996]
          "
        >
          {description}
        </p>
      </div>

      <Link
        to={to}
        className="
          shrink-0

          rounded-lg

          px-2
          py-1.5

          text-[10px]
          font-bold
          text-[#6C5CE7]

          transition-all

          hover:bg-[#F3EEFF]

          sm:text-xs
        "
      >
        View All
      </Link>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  to,
  title,
  text,
}) {
  return (
    <Link
      to={to}
      className="
        group

        flex
        min-h-[112px]
        flex-col
        justify-between

        rounded-2xl

        border
        border-[#E8E1EF]

        bg-gradient-to-br
        from-[#FCFAFF]
        to-white

        p-4

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[#D4C7F2]
        hover:bg-[#F8F5FF]
        hover:shadow-[0_15px_32px_rgba(108,92,231,0.08)]
      "
    >
      <div>
        <p
          className="
            text-sm
            font-extrabold
            text-[#3B3540]

            transition-colors

            group-hover:text-[#6C5CE7]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[10px]
            leading-5
            text-[#918A96]

            sm:text-xs
          "
        >
          {text}
        </p>
      </div>

      <span
        className="
          mt-3

          flex
          h-8
          w-8
          items-center
          justify-center

          self-end

          rounded-full

          bg-[#F2EDFF]

          text-[#6C5CE7]

          transition-all
          duration-300

          group-hover:translate-x-1
          group-hover:bg-[#6C5CE7]
          group-hover:text-white
        "
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}

/* =========================================================
   EMPTY ROW
========================================================= */

function EmptyRow({
  text,
}) {
  return (
    <div
      className="
        px-5
        py-12
        text-center
      "
    >
      <div
        className="
          mx-auto

          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl

          bg-[#F3EEFF]

          text-sm
          text-[#6C5CE7]
        "
      >
        ✦
      </div>

      <p
        className="
          mt-3
          text-sm
          text-[#948C99]
        "
      >
        {text}
      </p>
    </div>
  );
}