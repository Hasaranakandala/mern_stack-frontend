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

export default function AdminDashboardPage() {
  // =====================================================
  // STATES
  // =====================================================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // =====================================================
  // HELPERS
  // =====================================================

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

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
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

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return null;
    }

    return date;
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString("en-LK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function formatCompact(value) {
    return new Intl.NumberFormat(
      "en-US",
      {
        notation: "compact",
        maximumFractionDigits: 1,
      }
    ).format(value || 0);
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getCustomerName(order) {
    return (
      order.name ||
      order.email ||
      "Customer"
    );
  }

  function getReviewCustomer(review) {
    return (
      review.name ||
      review.userName ||
      review.email ||
      "Customer"
    );
  }

  function getProductName(review) {
    return (
      review.product?.productName ||
      review.product?.name ||
      review.productId?.productName ||
      review.productId?.name ||
      review.productId ||
      "Product"
    );
  }

  // =====================================================
  // GET DASHBOARD DATA
  // =====================================================

  async function fetchDashboardData(
    showSuccess = false
  ) {
    const token =
      localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login first"
      );

      setIsLoading(false);
      setIsRefreshing(false);

      return;
    }

    const config = {
      headers: {
        Authorization:
          "Bearer " + token,
      },
    };

    try {
      /*
        Promise.allSettled is intentional.

        If Reviews API fails but Orders,
        Products and Users work, the entire
        dashboard should not become unusable.
      */

      const results =
        await Promise.allSettled([
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
        ]);

      // =================================
      // PRODUCTS
      // =================================

      if (
        results[0].status ===
        "fulfilled"
      ) {
        setProducts(
          extractArray(
            results[0].value.data,
            [
              "products",
              "data",
            ]
          )
        );
      }

      // =================================
      // ORDERS
      // =================================

      if (
        results[1].status ===
        "fulfilled"
      ) {
        setOrders(
          extractArray(
            results[1].value.data,
            [
              "orders",
              "data",
            ]
          )
        );
      }

      // =================================
      // USERS
      // =================================

      if (
        results[2].status ===
        "fulfilled"
      ) {
        setUsers(
          extractArray(
            results[2].value.data,
            [
              "users",
              "data",
            ]
          )
        );
      }

      // =================================
      // REVIEWS
      // =================================

      if (
        results[3].status ===
        "fulfilled"
      ) {
        setReviews(
          extractArray(
            results[3].value.data,
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
        failedRequests.length > 0
      ) {
        console.error(
          "Some dashboard APIs failed:",
          failedRequests
        );

        toast.error(
          "Some dashboard information could not be loaded"
        );
      } else if (showSuccess) {
        toast.success(
          "Dashboard refreshed"
        );
      }
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );

      toast.error(
        "Failed to load dashboard"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  async function refreshDashboard() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    await fetchDashboardData(true);
  }

  // =====================================================
  // ORDER ANALYSIS
  // =====================================================

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
          (order) =>
            String(
              order.status
            ).toLowerCase() ===
            "returned"
        ),
      [orders]
    );

  // Revenue only from completed orders

  const totalRevenue =
    useMemo(
      () =>
        completedOrders.reduce(
          (total, order) =>
            total +
            getOrderAmount(order),
          0
        ),
      [completedOrders]
    );

  const averageOrderValue =
    completedOrders.length > 0
      ? totalRevenue /
        completedOrders.length
      : 0;

  // =====================================================
  // PRODUCT ANALYSIS
  // =====================================================

  const lowStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) => {
            const stock =
              numberValue(
                product.stock
              );

            return (
              stock > 0 &&
              stock <= 5
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

  // =====================================================
  // USER ANALYSIS
  // =====================================================

  const blockedUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.isBlock === true
        ),
      [users]
    );

  const activeUsers =
    users.length -
    blockedUsers.length;

  const customerUsers =
    users.filter(
      (user) =>
        user.role !== "admin"
    ).length;

  // =====================================================
  // REVIEW ANALYSIS
  // =====================================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total +
            numberValue(
              review.rating
            ),
          0
        ) / reviews.length
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

  // =====================================================
  // LAST 7 DAYS SALES CHART
  // =====================================================

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
          new Date(targetDate);

        nextDate.setDate(
          nextDate.getDate() + 1
        );

        const dayOrders =
          completedOrders.filter(
            (order) => {
              const orderDate =
                getOrderDate(order);

              if (!orderDate) {
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
            (total, order) =>
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
                month: "short",
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

  // =====================================================
  // ORDER STATUS CHART
  // =====================================================

  const orderStatusData = [
    {
      status: "Pending",
      count:
        pendingOrders.length,
    },
    {
      status: "Processing",
      count:
        processingOrders.length,
    },
    {
      status: "Completed",
      count:
        completedOrders.length,
    },
    {
      status: "Cancelled",
      count:
        cancelledOrders.length,
    },
    {
      status: "Returned",
      count:
        returnedOrders.length,
    },
  ];

  // =====================================================
  // RECENT ORDERS
  // =====================================================

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

  // =====================================================
  // RECENT REVIEWS
  // =====================================================

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

  // =====================================================
  // BUSINESS INSIGHTS
  // =====================================================

  const insights = [];

  if (
    pendingOrders.length > 0
  ) {
    insights.push({
      type: "warning",

      title:
        "Orders need attention",

      text: `${pendingOrders.length} order${
        pendingOrders.length ===
        1
          ? ""
          : "s"
      } currently waiting in Pending status.`,

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
        "Inventory attention required",

      text: `${lowStockProducts.length} low-stock and ${outOfStockProducts.length} out-of-stock products.`,

      link:
        "/admin/products",

      action:
        "Manage Products",
    });
  }

  if (
    lowRatingReviews.length > 0
  ) {
    insights.push({
      type: "warning",

      title:
        "Customer feedback needs review",

      text: `${lowRatingReviews.length} review${
        lowRatingReviews.length ===
        1
          ? ""
          : "s"
      } currently have a rating of 2 stars or lower.`,

      link:
        "/admin/reviews",

      action:
        "View Reviews",
    });
  }

  if (blockedUsers.length > 0) {
    insights.push({
      type: "info",

      title:
        "Blocked accounts",

      text: `${blockedUsers.length} user account${
        blockedUsers.length === 1
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
    insights.length === 0
  ) {
    insights.push({
      type: "success",

      title:
        "Everything looks good",

      text:
        "There are no major inventory, order, account or review alerts requiring immediate attention.",

      link: null,

      action: null,
    });
  }

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
      "
    >
      {/* =================================================
          HEADER
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
            Business Overview
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
            Admin Dashboard
          </h1>

          <p
            className="
              text-sm
              text-gray-500

              mt-1
            "
          >
            Monitor sales,
            customers, inventory
            and store activity.
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

            disabled:opacity-50

            active:scale-[0.97]

            transition-all
          "
        >
          <svg
            className={`
              w-4
              h-4

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
            : "Refresh"}
        </button>
      </div>

      {/* =================================================
          MAIN KPI CARDS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-4

          gap-3
          sm:gap-4

          mb-6
        "
      >
        <MetricCard
          title="Total Revenue"
          value={`Rs. ${formatMoney(
            totalRevenue
          )}`}
          description="Completed orders"
          type="revenue"
        />

        <MetricCard
          title="Total Orders"
          value={
            orders.length
          }
          description={`${pendingOrders.length} pending`}
          type="orders"
        />

        <MetricCard
          title="Customers"
          value={
            customerUsers
          }
          description={`${activeUsers} active accounts`}
          type="users"
        />

        <MetricCard
          title="Average Rating"
          value={
            reviews.length > 0
              ? averageRating.toFixed(
                  1
                )
              : "0.0"
          }
          description={`${reviews.length} customer reviews`}
          type="reviews"
        />
      </div>

      {/* =================================================
          SECONDARY ANALYTICS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4

          gap-3
          sm:gap-4

          mb-6
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
          title="Average Order"
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
          title="Blocked Users"
          value={
            blockedUsers.length
          }
          warning={
            blockedUsers.length >
            0
          }
        />
      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.55fr_1fr]

          gap-5

          mb-6
        "
      >
        {/* =============================================
            REVENUE CHART
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            p-4
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-center
              sm:justify-between

              gap-2

              mb-6
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-[#393E46]
                "
              >
                Revenue Trend
              </h2>

              <p
                className="
                  text-xs
                  sm:text-sm

                  text-gray-400

                  mt-1
                "
              >
                Revenue from
                completed orders
                during the last
                7 days.
              </p>
            </div>

            <div
              className="
                self-start

                px-3
                py-1.5

                rounded-full

                bg-purple-50
                text-purple-600

                text-xs
                font-semibold
              "
            >
              Last 7 days
            </div>
          </div>

          <div
            className="
              w-full
              h-[260px]
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
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#7c3aed"
                      stopOpacity={
                        0.3
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#7c3aed"
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
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
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
                    fontSize: 11,
                    fill: "#9ca3af",
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
                  labelStyle={{
                    fontWeight: 600,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{
                    r: 5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =============================================
            ORDER STATUS CHART
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            p-4
            sm:p-6
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#393E46]
            "
          >
            Order Status
          </h2>

          <p
            className="
              text-xs
              sm:text-sm

              text-gray-400

              mt-1
              mb-6
            "
          >
            Current distribution
            of all orders.
          </p>

          <div
            className="
              w-full
              h-[260px]
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
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="status"
                  tick={{
                    fontSize: 10,
                    fill: "#9ca3af",
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
                    fontSize: 11,
                    fill: "#9ca3af",
                  }}
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Orders"
                  fill="#7c3aed"
                  radius={[
                    7,
                    7,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =================================================
          BUSINESS ANALYSIS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1fr_1fr]

          gap-5

          mb-6
        "
      >
        {/* =============================================
            INSIGHTS
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            p-4
            sm:p-6
          "
        >
          <div className="mb-5">
            <h2
              className="
                text-lg
                font-bold
                text-[#393E46]
              "
            >
              Business Insights
            </h2>

            <p
              className="
                text-sm
                text-gray-400

                mt-1
              "
            >
              Areas that may
              require administrator
              attention.
            </p>
          </div>

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
                  key={index}
                  {...insight}
                />
              )
            )}
          </div>
        </div>

        {/* =============================================
            STORE HEALTH
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            p-4
            sm:p-6
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#393E46]
            "
          >
            Store Health
          </h2>

          <p
            className="
              text-sm
              text-gray-400

              mt-1
              mb-5
            "
          >
            Quick performance
            indicators across
            your store.
          </p>

          <div
            className="
              flex
              flex-col

              gap-4
            "
          >
            <HealthRow
              title="Order completion"
              value={
                orders.length > 0
                  ? (completedOrders.length /
                      orders.length) *
                    100
                  : 0
              }
            />

            <HealthRow
              title="5-star review share"
              value={
                reviews.length > 0
                  ? (fiveStarReviews.length /
                      reviews.length) *
                    100
                  : 0
              }
            />

            <HealthRow
              title="Active user accounts"
              value={
                users.length > 0
                  ? (activeUsers /
                      users.length) *
                    100
                  : 0
              }
            />

            <HealthRow
              title="Products in stock"
              value={
                products.length > 0
                  ? ((products.length -
                      outOfStockProducts.length) /
                      products.length) *
                    100
                  : 0
              }
            />
          </div>
        </div>
      </div>

      {/* =================================================
          RECENT DATA
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.2fr_1fr]

          gap-5

          mb-6
        "
      >
        {/* =============================================
            RECENT ORDERS
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            overflow-hidden
          "
        >
          <div
            className="
              px-4
              sm:px-6

              py-5

              border-b
              border-gray-100

              flex
              items-center
              justify-between

              gap-3
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-[#393E46]
                "
              >
                Recent Orders
              </h2>

              <p
                className="
                  text-xs
                  text-gray-400

                  mt-1
                "
              >
                Latest customer
                orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="
                text-xs
                sm:text-sm

                font-semibold
                text-purple-600

                hover:text-purple-800
              "
            >
              View All
            </Link>
          </div>

          <div
            className="
              divide-y
              divide-gray-100
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
                      p-4
                      sm:px-6

                      flex
                      flex-col
                      sm:flex-row

                      sm:items-center
                      sm:justify-between

                      gap-3

                      hover:bg-gray-50

                      transition-all
                    "
                  >
                    <div>
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-bold
                            text-[#393E46]
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
                          text-sm
                          text-gray-500

                          mt-1
                        "
                      >
                        {getCustomerName(
                          order
                        )}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400

                          mt-1
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
                        text-sm
                        font-bold
                        text-[#393E46]

                        whitespace-nowrap
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
              <EmptyRow text="No orders available yet." />
            )}
          </div>
        </div>

        {/* =============================================
            RECENT REVIEWS
        ============================================= */}

        <div
          className="
            bg-white

            border
            border-gray-100

            rounded-2xl

            shadow-sm

            overflow-hidden
          "
        >
          <div
            className="
              px-4
              sm:px-6

              py-5

              border-b
              border-gray-100

              flex
              items-center
              justify-between

              gap-3
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-[#393E46]
                "
              >
                Recent Reviews
              </h2>

              <p
                className="
                  text-xs
                  text-gray-400

                  mt-1
                "
              >
                Latest customer
                feedback.
              </p>
            </div>

            <Link
              to="/admin/reviews"
              className="
                text-xs
                sm:text-sm

                font-semibold
                text-purple-600

                hover:text-purple-800
              "
            >
              View All
            </Link>
          </div>

          <div
            className="
              divide-y
              divide-gray-100
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
                      p-4
                      sm:px-6

                      hover:bg-gray-50

                      transition-all
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
                            text-sm
                            font-bold
                            text-[#393E46]

                            truncate
                          "
                        >
                          {getReviewCustomer(
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
                          {getProductName(
                            review
                          )}
                        </p>
                      </div>

                      <span
                        className="
                          shrink-0

                          px-2
                          py-1

                          rounded-full

                          bg-yellow-50
                          text-yellow-700

                          text-xs
                          font-bold
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
                        text-sm
                        text-gray-500

                        mt-3

                        line-clamp-2
                      "
                    >
                      {review.comment ||
                        "No comment"}
                    </p>
                  </div>
                )
              )
            ) : (
              <EmptyRow text="No reviews available yet." />
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div
        className="
          bg-white

          border
          border-gray-100

          rounded-2xl

          shadow-sm

          p-4
          sm:p-6
        "
      >
        <h2
          className="
            text-lg
            font-bold
            text-[#393E46]
          "
        >
          Quick Actions
        </h2>

        <p
          className="
            text-sm
            text-gray-400

            mt-1
            mb-5
          "
        >
          Common administration
          tasks.
        </p>

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-5

            gap-3
          "
        >
          <QuickAction
            to="/admin/add-product"
            title="Add Product"
          />

          <QuickAction
            to="/admin/orders"
            title="Manage Orders"
          />

          <QuickAction
            to="/admin/users"
            title="Manage Users"
          />

          <QuickAction
            to="/admin/reviews"
            title="Reviews"
          />

          <QuickAction
            to="/"
            title="View Website"
          />
        </div>
      </div>
    </div>
  );
}

// =========================================================
// METRIC CARD
// =========================================================

function MetricCard({
  title,
  value,
  description,
  type,
}) {
  const iconClasses = {
    revenue:
      "bg-green-50 text-green-600",

    orders:
      "bg-blue-50 text-blue-600",

    users:
      "bg-purple-50 text-purple-600",

    reviews:
      "bg-yellow-50 text-yellow-600",
  };

  return (
    <div
      className="
        group

        bg-white

        rounded-2xl

        border
        border-gray-100

        p-4
        sm:p-5

        shadow-sm

        transition-all
        duration-300

        hover:shadow-md
        hover:-translate-y-1
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

              break-words
            "
          >
            {value}
          </p>
        </div>

        <div
          className={`
            w-10
            h-10

            shrink-0

            rounded-xl

            flex
            items-center
            justify-center

            ${iconClasses[type]}
          `}
        >
          <span
            className="
              text-lg
              font-bold
            "
          >
            {type === "revenue" &&
              "Rs"}

            {type === "orders" &&
              "O"}

            {type === "users" &&
              "U"}

            {type === "reviews" &&
              "★"}
          </span>
        </div>
      </div>

      <p
        className="
          text-[11px]
          sm:text-xs

          text-gray-400

          mt-3
        "
      >
        {description}
      </p>
    </div>
  );
}

// =========================================================
// SMALL METRIC
// =========================================================

function SmallMetric({
  title,
  value,
  warning = false,
}) {
  return (
    <div
      className="
        bg-white

        border
        border-gray-100

        rounded-xl

        p-4

        shadow-sm
      "
    >
      <p
        className="
          text-[11px]
          sm:text-xs

          text-gray-400
        "
      >
        {title}
      </p>

      <div
        className="
          flex
          items-center

          gap-2

          mt-1
        "
      >
        <p
          className="
            text-lg
            sm:text-xl

            font-bold
            text-[#393E46]
          "
        >
          {value}
        </p>

        {warning && (
          <span
            className="
              w-2
              h-2

              rounded-full

              bg-orange-500

              animate-pulse
            "
          />
        )}
      </div>
    </div>
  );
}

// =========================================================
// INSIGHT CARD
// =========================================================

function InsightCard({
  type,
  title,
  text,
  link,
  action,
}) {
  const styles = {
    warning:
      "bg-yellow-50 border-yellow-100",

    danger:
      "bg-red-50 border-red-100",

    info:
      "bg-blue-50 border-blue-100",

    success:
      "bg-green-50 border-green-100",
  };

  return (
    <div
      className={`
        p-4

        rounded-xl

        border

        ${styles[type]}
      `}
    >
      <h3
        className="
          text-sm
          font-bold
          text-[#393E46]
        "
      >
        {title}
      </h3>

      <p
        className="
          text-xs
          sm:text-sm

          text-gray-600

          leading-6

          mt-1
        "
      >
        {text}
      </p>

      {link && action && (
        <Link
          to={link}
          className="
            inline-flex

            mt-3

            text-xs
            font-bold

            text-purple-600

            hover:text-purple-800
          "
        >
          {action} →
        </Link>
      )}
    </div>
  );
}

// =========================================================
// HEALTH ROW
// =========================================================

function HealthRow({
  title,
  value,
}) {
  const percentage = Math.max(
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
          flex
          items-center
          justify-between

          gap-3

          mb-2
        "
      >
        <span
          className="
            text-sm
            font-medium
            text-gray-600
          "
        >
          {title}
        </span>

        <span
          className="
            text-xs
            font-bold
            text-[#393E46]
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
          w-full
          h-2

          rounded-full

          bg-gray-100

          overflow-hidden
        "
      >
        <div
          className="
            h-full

            rounded-full

            bg-purple-500

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

// =========================================================
// ORDER BADGE
// =========================================================

function OrderBadge({
  status,
}) {
  const value =
    String(
      status || "unknown"
    ).toLowerCase();

  let style =
    "bg-gray-100 text-gray-600";

  if (value === "pending") {
    style =
      "bg-yellow-100 text-yellow-700";
  }

  if (
    value === "processing"
  ) {
    style =
      "bg-blue-100 text-blue-700";
  }

  if (
    value === "completed"
  ) {
    style =
      "bg-green-100 text-green-700";
  }

  if (
    value === "cancelled"
  ) {
    style =
      "bg-red-100 text-red-700";
  }

  if (
    value === "returned"
  ) {
    style =
      "bg-purple-100 text-purple-700";
  }

  return (
    <span
      className={`
        px-2
        py-1

        rounded-full

        text-[10px]
        font-bold

        capitalize

        ${style}
      `}
    >
      {status || "Unknown"}
    </span>
  );
}

// =========================================================
// QUICK ACTION
// =========================================================

function QuickAction({
  to,
  title,
}) {
  return (
    <Link
      to={to}
      className="
        group

        min-h-[80px]

        p-4

        rounded-xl

        border
        border-gray-200

        bg-gray-50

        flex
        items-center
        justify-between

        gap-3

        text-sm
        font-semibold
        text-[#393E46]

        hover:bg-purple-50
        hover:border-purple-200
        hover:text-purple-700
        hover:-translate-y-0.5

        transition-all
        duration-200
      "
    >
      {title}

      <span
        className="
          transition-transform

          group-hover:translate-x-1
        "
      >
        →
      </span>
    </Link>
  );
}

// =========================================================
// EMPTY ROW
// =========================================================

function EmptyRow({
  text,
}) {
  return (
    <div
      className="
        py-10
        px-5

        text-center
      "
    >
      <p
        className="
          text-sm
          text-gray-400
        "
      >
        {text}
      </p>
    </div>
  );
}