import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import Modal from "react-modal";
import jsPDF from "jspdf";

Modal.setAppElement("#root");

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =====================================================
  // MODAL STYLES
  // =====================================================

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      padding: "12px",
    },

    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",

      transform: "translate(-50%, -50%)",

      width: "calc(100% - 24px)",
      maxWidth: "720px",
      maxHeight: "90vh",

      overflowY: "auto",

      borderRadius: "20px",

      padding: "0",

      border: "none",

      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    },
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  function formatMoney(value) {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) {
      return "No date";
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
  // STATUS COLOR
  // =====================================================

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "returned":
        return "bg-purple-100 text-purple-700 border-purple-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  // =====================================================
  // GET ORDERS
  // =====================================================

  async function fetchOrders(showToast = false) {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/order",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setOrders(Array.isArray(res.data) ? res.data : []);

      if (showToast) {
        toast.success("Orders refreshed");
      }
    } catch (e) {
      console.error(
        "GET ORDER ERROR:",
        e.response?.data || e
      );

      toast.error(
        e.response?.data?.errorMessage ||
          e.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  // =====================================================
  // LOAD ORDERS ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  async function refreshOrders() {
    if (isRefreshing) return;

    setIsRefreshing(true);

    await fetchOrders(true);
  }

  // =====================================================
  // OPEN MODAL
  // =====================================================

  function openOrderModal(item) {
    setSelectedOrder(item);
    setIsModalOpen(true);
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  function closeOrderModal() {
    if (updatingStatus) return;

    setIsModalOpen(false);
    setSelectedOrder(null);
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  async function updateOrderStatus(updatedValue) {
    if (!selectedOrder) return;

    if (!updatedValue) {
      toast.error("Please select a status");
      return;
    }

    if (updatedValue === selectedOrder.status) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    setUpdatingStatus(true);

    try {
      await axios.put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/order/" +
          selectedOrder.orderId +
          "/" +
          updatedValue,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Update selected modal order
      setSelectedOrder((previous) => ({
        ...previous,
        status: updatedValue,
      }));

      // Update order in main list
      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item.orderId === selectedOrder.orderId
            ? {
                ...item,
                status: updatedValue,
              }
            : item
        )
      );

      toast.success("Order status updated successfully");
    } catch (e) {
      console.error("UPDATE ORDER ERROR:", e);

      toast.error(
        e.response?.data?.message ||
          "Error updating order status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        item.status?.toLowerCase() === statusFilter;

      const matchesSearch =
        searchValue === "" ||
        item.orderId?.toLowerCase().includes(searchValue) ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue) ||
        item.phone?.toLowerCase().includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  // =====================================================
  // GENERATE PDF
  // =====================================================

  function generatePDF() {
    if (!selectedOrder) return;

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Order Invoice", 20, 20);

    doc.setFontSize(12);

    doc.text(
      `Order ID: ${selectedOrder.orderId || "-"}`,
      20,
      40
    );

    doc.text(
      `Customer: ${selectedOrder.name || "-"}`,
      20,
      50
    );

    doc.text(
      `Email: ${selectedOrder.email || "-"}`,
      20,
      60
    );

    doc.text(
      `Phone: ${selectedOrder.phone || "-"}`,
      20,
      70
    );

    doc.text(
      `Address: ${selectedOrder.address || "-"}`,
      20,
      80
    );

    doc.text(
      `Date: ${formatDate(selectedOrder.date)}`,
      20,
      90
    );

    doc.text(
      `Status: ${selectedOrder.status || "-"}`,
      20,
      100
    );

    doc.text(
      `Total: Rs. ${formatMoney(selectedOrder.total)}`,
      20,
      110
    );

    doc.setFontSize(14);

    doc.text("Products", 20, 130);

    let y = 145;

    selectedOrder.products?.forEach(
      (product, index) => {
        const name =
          product.productInfo?.name ||
          product.productInfo?.productName ||
          "Product";

        const quantity = Number(
          product.quantity || 0
        );

        const price = Number(
          product.productInfo?.price || 0
        );

        doc.setFontSize(11);

        doc.text(
          `${index + 1}. ${name}`,
          20,
          y
        );

        doc.text(
          `Qty: ${quantity}`,
          100,
          y
        );

        doc.text(
          `Rs. ${formatMoney(price * quantity)}`,
          145,
          y
        );

        y += 10;

        // Add another page if products go too low
        if (y > 275) {
          doc.addPage();

          y = 20;
        }
      }
    );

    doc.save(
      `${selectedOrder.orderId || "order"}.pdf`
    );
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

        animate-[orderPageEnter_0.4s_ease-out]
      "
    >

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeOrderModal}
        style={customStyles}
        contentLabel="Order Details"
        shouldCloseOnOverlayClick={!updatingStatus}
      >
        {selectedOrder && (
          <div className="bg-white">

            {/* ==========================================
                MODAL HEADER
            ========================================== */}

            <div
              className="
                sticky
                top-0
                z-10

                bg-white/95
                backdrop-blur-md

                border-b
                border-gray-100

                px-4
                sm:px-6

                py-4
                sm:py-5

                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div className="min-w-0">

                <h2
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold
                    text-[#393E46]
                  "
                >
                  Order Details
                </h2>

                <p
                  className="
                    text-xs
                    sm:text-sm

                    text-gray-400

                    mt-1

                    truncate
                  "
                >
                  {selectedOrder.orderId}
                </p>

              </div>

              <button
                type="button"
                onClick={closeOrderModal}
                disabled={updatingStatus}
                className="
                  w-10
                  h-10

                  shrink-0

                  flex
                  items-center
                  justify-center

                  rounded-full

                  bg-gray-100

                  hover:bg-red-50
                  hover:text-red-500

                  text-gray-600

                  active:scale-90

                  disabled:opacity-50

                  transition-all
                  duration-200
                "
                aria-label="Close modal"
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

            {/* ==========================================
                MODAL CONTENT
            ========================================== */}

            <div
              className="
                p-4
                sm:p-6
              "
            >

              {/* Customer card */}

              <div
                className="
                  bg-gray-50

                  border
                  border-gray-100

                  rounded-2xl

                  p-4
                  sm:p-5

                  mb-5
                "
              >
                <h3
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400

                    mb-4
                  "
                >
                  Customer Information
                </h3>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2

                    gap-4
                    sm:gap-5
                  "
                >

                  {/* Customer */}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Customer
                    </p>

                    <p className="font-semibold text-[#393E46]">
                      {selectedOrder.name || "-"}
                    </p>
                  </div>

                  {/* Phone */}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Phone
                    </p>

                    <p className="text-gray-600 break-words">
                      {selectedOrder.phone || "-"}
                    </p>
                  </div>

                  {/* Email */}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Email
                    </p>

                    <p className="text-gray-600 break-all">
                      {selectedOrder.email || "-"}
                    </p>
                  </div>

                  {/* Date */}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Date
                    </p>

                    <p className="text-gray-600">
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>

                </div>

                {/* Address */}

                <div className="mt-4">

                  <p className="text-xs text-gray-400 mb-1">
                    Delivery Address
                  </p>

                  <p className="text-gray-600 leading-relaxed break-words">
                    {selectedOrder.address || "-"}
                  </p>

                </div>

              </div>

              {/* ==========================================
                  TOTAL + STATUS
              ========================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2

                  gap-4

                  mb-6
                "
              >

                {/* Total */}

                <div
                  className="
                    p-4

                    border
                    border-gray-100

                    rounded-2xl

                    bg-white

                    shadow-sm
                  "
                >
                  <p className="text-xs text-gray-400 mb-1">
                    Order Total
                  </p>

                  <p
                    className="
                      text-xl
                      sm:text-2xl

                      font-bold
                      text-[#393E46]
                    "
                  >
                    Rs. {formatMoney(selectedOrder.total)}
                  </p>
                </div>

                {/* Status */}

                <div
                  className="
                    p-4

                    border
                    border-gray-100

                    rounded-2xl

                    bg-white

                    shadow-sm
                  "
                >
                  <p className="text-xs text-gray-400 mb-2">
                    Order Status
                  </p>

                  <span
                    className={`
                      inline-flex
                      items-center

                      px-3
                      py-1.5

                      rounded-full

                      border

                      text-xs
                      font-bold
                      capitalize

                      ${getStatusClass(
                        selectedOrder.status
                      )}
                    `}
                  >
                    {selectedOrder.status || "Unknown"}
                  </span>

                </div>

              </div>

              {/* ==========================================
                  CHANGE STATUS
              ========================================== */}

              <div
                className="
                  mb-6

                  p-4

                  rounded-2xl

                  border
                  border-gray-200

                  bg-white
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row

                    sm:items-center
                    sm:justify-between

                    gap-3
                  "
                >
                  <div>

                    <h3
                      className="
                        font-bold
                        text-[#393E46]
                      "
                    >
                      Update Order Status
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-1
                      "
                    >
                      Select the new order status.
                    </p>

                  </div>

                  <div className="relative">

                    <select
                      value={selectedOrder.status || ""}
                      disabled={updatingStatus}
                      onChange={(e) =>
                        updateOrderStatus(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        sm:w-[180px]

                        px-4
                        py-2.5

                        pr-10

                        rounded-xl

                        border
                        border-gray-300

                        bg-white

                        text-sm
                        font-semibold
                        text-gray-700

                        outline-none

                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500

                        disabled:bg-gray-100
                        disabled:cursor-not-allowed

                        transition-all
                      "
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                      <option value="returned">
                        Returned
                      </option>

                    </select>

                  </div>
                </div>

                {updatingStatus && (
                  <div
                    className="
                      mt-3

                      flex
                      items-center
                      gap-2

                      text-xs
                      text-blue-600
                    "
                  >
                    <svg
                      className="w-4 h-4 animate-spin"
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

                    Updating order status...
                  </div>
                )}

              </div>

              {/* ==========================================
                  PRODUCTS
              ========================================== */}

              <div>

                <div
                  className="
                    flex
                    items-center
                    justify-between

                    mb-3
                  "
                >
                  <h3
                    className="
                      text-lg
                      font-bold
                      text-[#393E46]
                    "
                  >
                    Products
                  </h3>

                  <span
                    className="
                      text-xs

                      px-2.5
                      py-1

                      bg-gray-100

                      rounded-full

                      text-gray-500
                    "
                  >
                    {selectedOrder.products?.length || 0} items
                  </span>
                </div>

                <div className="space-y-3">

                  {selectedOrder.products?.map(
                    (product, index) => {
                      const productName =
                        product.productInfo?.name ||
                        product.productInfo?.productName ||
                        "Product";

                      const quantity = Number(
                        product.quantity || 0
                      );

                      const unitPrice = Number(
                        product.productInfo?.price ||
                          0
                      );

                      return (
                        <div
                          key={index}
                          className="
                            flex
                            flex-col
                            sm:flex-row

                            sm:items-center
                            sm:justify-between

                            gap-3
                            sm:gap-4

                            p-4

                            bg-gray-50

                            border
                            border-gray-100

                            rounded-xl

                            transition-all
                            duration-200

                            hover:bg-white
                            hover:shadow-sm
                          "
                        >

                          <div className="min-w-0">

                            <p
                              className="
                                font-semibold
                                text-[#393E46]

                                break-words
                              "
                            >
                              {productName}
                            </p>

                            <p
                              className="
                                text-sm
                                text-gray-400
                                mt-1
                              "
                            >
                              Quantity: {quantity}
                            </p>

                          </div>

                          <div
                            className="
                              sm:text-right

                              flex
                              sm:block

                              items-center
                              justify-between

                              gap-3
                            "
                          >
                            <div>

                              <p
                                className="
                                  text-xs
                                  text-gray-400
                                "
                              >
                                Each
                              </p>

                              <p
                                className="
                                  font-semibold
                                  text-[#393E46]
                                "
                              >
                                Rs. {formatMoney(unitPrice)}
                              </p>

                            </div>

                            <div className="sm:mt-1">

                              <p
                                className="
                                  text-xs
                                  text-gray-400
                                "
                              >
                                Subtotal
                              </p>

                              <p
                                className="
                                  font-bold
                                  text-[#393E46]
                                "
                              >
                                Rs.{" "}
                                {formatMoney(
                                  unitPrice *
                                    quantity
                                )}
                              </p>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* ==========================================
                  ACTION BUTTONS
              ========================================== */}

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row

                  sm:justify-end

                  gap-3

                  mt-6
                  pt-5

                  border-t
                  border-gray-100
                "
              >

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="
                    w-full
                    sm:w-auto

                    bg-white

                    text-[#393E46]

                    border
                    border-gray-300

                    px-5
                    py-2.5

                    rounded-xl

                    font-semibold
                    text-sm

                    hover:bg-gray-100
                    hover:border-gray-400

                    active:scale-[0.97]

                    transition-all
                    duration-200
                  "
                >
                  Print
                </button>

                <button
                  type="button"
                  onClick={generatePDF}
                  className="
                    w-full
                    sm:w-auto

                    bg-[#393E46]
                    text-white

                    px-5
                    py-2.5

                    rounded-xl

                    font-semibold
                    text-sm

                    shadow-md

                    hover:bg-[#222831]
                    hover:shadow-lg
                    hover:-translate-y-0.5

                    active:scale-[0.97]

                    transition-all
                    duration-200
                  "
                >
                  Download PDF
                </button>

              </div>

            </div>

          </div>
        )}
      </Modal>

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
          md:mb-8
        "
      >

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]

              text-gray-400

              mb-1
            "
          >
            Order Management
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold
              text-[#393E46]
            "
          >
            Orders
          </h1>

          <p
            className="
              text-sm
              sm:text-base

              text-gray-500

              mt-1
            "
          >
            Manage and view all customer orders.
          </p>

        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={refreshOrders}
          disabled={isRefreshing}
          className="
            group

            w-full
            sm:w-auto

            flex
            items-center
            justify-center
            gap-2

            px-4
            py-2.5

            rounded-xl

            bg-white

            border
            border-gray-200

            text-sm
            font-semibold
            text-gray-600

            shadow-sm

            hover:border-[#393E46]
            hover:text-[#393E46]
            hover:shadow-md

            active:scale-[0.97]

            disabled:opacity-60
            disabled:cursor-not-allowed

            transition-all
            duration-200
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
            : "Refresh Orders"}
        </button>

      </div>

      {/* =================================================
          FILTER AREA
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
            flex
            flex-col
            md:flex-row

            md:items-center

            gap-3
          "
        >

          {/* Search */}

          <div className="relative flex-1">

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
              placeholder="Search order ID, customer, email or phone..."
              className="
                w-full

                pl-12
                pr-4
                py-3

                rounded-xl

                border
                border-gray-300

                text-sm

                outline-none

                focus:ring-2
                focus:ring-blue-500/20
                focus:border-blue-500

                hover:border-gray-400

                transition-all
              "
            />

          </div>

          {/* Status filter */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              w-full
              md:w-[190px]

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
              focus:ring-blue-500/20
              focus:border-blue-500

              transition-all
            "
          >
            <option value="all">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="returned">
              Returned
            </option>

          </select>

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-1

            mt-3
          "
        >
          <p className="text-xs text-gray-400">
            Showing {filteredOrders.length} of{" "}
            {orders.length} orders
          </p>

          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="
                text-xs
                font-semibold

                text-blue-600

                hover:text-blue-700

                self-start
                sm:self-auto
              "
            >
              Clear filters
            </button>
          )}
        </div>

      </div>

      {/* =================================================
          ORDERS CONTAINER
      ================================================= */}

      <div
        className="
          bg-white

          rounded-2xl

          shadow-sm

          border
          border-gray-100

          overflow-hidden
        "
      >

        {/* Top */}

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
                text-base
                sm:text-lg

                font-bold
                text-[#393E46]
              "
            >
              All Orders
            </h2>

            <p
              className="
                text-xs
                sm:text-sm

                text-gray-400

                mt-1
              "
            >
              Click an order to view details.
            </p>

          </div>

          <div
            className="
              min-w-[36px]
              h-9

              px-3

              rounded-full

              bg-gray-100

              flex
              items-center
              justify-center

              text-xs
              font-bold
              text-gray-600
            "
          >
            {filteredOrders.length}
          </div>

        </div>

        {/* =================================================
            DESKTOP HEADER
        ================================================= */}

        <div
          className="
            hidden
            xl:grid

            grid-cols-[110px_1.1fr_1.4fr_1fr_1.1fr_1.2fr_110px_110px]

            gap-4

            px-5
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
          <div>Order ID</div>
          <div>Customer</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Date</div>
          <div>Address</div>
          <div>Total</div>
          <div>Status</div>
        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="divide-y divide-gray-100">

          {filteredOrders.map((item) => (
            <div
              key={item._id || item.orderId}
              onClick={() =>
                openOrderModal(item)
              }
              className="
                group

                cursor-pointer

                transition-all
                duration-200

                hover:bg-[#FAFAFA]
              "
            >

              {/* ==========================================
                  MOBILE / TABLET CARD
              ========================================== */}

              <div
                className="
                  xl:hidden

                  p-4
                  sm:p-5
                "
              >

                {/* Card top */}

                <div
                  className="
                    flex
                    items-start
                    justify-between

                    gap-3

                    mb-4
                  "
                >

                  <div>

                    <span
                      className="
                        inline-flex

                        px-3
                        py-1

                        rounded-lg

                        bg-gray-100

                        text-[#393E46]

                        font-semibold
                        text-sm
                      "
                    >
                      {item.orderId}
                    </span>

                    <h3
                      className="
                        font-bold
                        text-[#393E46]

                        mt-2
                      "
                    >
                      {item.name || "Unknown customer"}
                    </h3>

                  </div>

                  <span
                    className={`
                      inline-flex

                      px-2.5
                      py-1

                      rounded-full

                      border

                      text-[11px]
                      font-bold
                      capitalize

                      ${getStatusClass(
                        item.status
                      )}
                    `}
                  >
                    {item.status}
                  </span>

                </div>

                {/* Details */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2

                    gap-3

                    text-sm
                  "
                >

                  <div>
                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p
                      className="
                        text-gray-600
                        truncate
                      "
                    >
                      {item.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="text-gray-600">
                      {item.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Date
                    </p>

                    <p className="text-gray-600">
                      {formatDate(item.date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p
                      className="
                        font-bold
                        text-[#393E46]
                      "
                    >
                      Rs. {formatMoney(item.total)}
                    </p>
                  </div>

                </div>

                <div
                  className="
                    mt-3

                    pt-3

                    border-t
                    border-gray-100

                    flex
                    items-center
                    justify-between

                    gap-3
                  "
                >

                  <div className="min-w-0">

                    <p className="text-xs text-gray-400">
                      Address
                    </p>

                    <p
                      className="
                        text-sm
                        text-gray-600

                        truncate
                      "
                    >
                      {item.address || "-"}
                    </p>

                  </div>

                  <svg
                    className="
                      w-5
                      h-5

                      shrink-0

                      text-gray-300

                      transition-transform
                      duration-300

                      group-hover:translate-x-1
                      group-hover:text-gray-500
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>

                </div>

              </div>

              {/* ==========================================
                  DESKTOP ROW
              ========================================== */}

              <div
                className="
                  hidden
                  xl:grid

                  grid-cols-[110px_1.1fr_1.4fr_1fr_1.1fr_1.2fr_110px_110px]

                  gap-4

                  px-5
                  py-5

                  items-center
                "
              >

                {/* Order ID */}

                <div>
                  <span
                    className="
                      inline-flex

                      px-3
                      py-1

                      rounded-lg

                      bg-gray-100

                      text-[#393E46]

                      font-semibold
                      text-sm
                    "
                  >
                    {item.orderId}
                  </span>
                </div>

                {/* Customer */}

                <div>
                  <span
                    className="
                      font-semibold
                      text-[#393E46]

                      text-sm
                    "
                  >
                    {item.name}
                  </span>
                </div>

                {/* Email */}

                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      text-gray-500

                      truncate
                    "
                    title={item.email}
                  >
                    {item.email}
                  </p>

                </div>

                {/* Phone */}

                <div>
                  <span className="text-sm text-gray-600">
                    {item.phone}
                  </span>
                </div>

                {/* Date */}

                <div>
                  <span
                    className="
                      text-sm
                      text-gray-600
                    "
                  >
                    {formatDate(item.date)}
                  </span>
                </div>

                {/* Address */}

                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      text-gray-500

                      truncate
                    "
                    title={item.address}
                  >
                    {item.address}
                  </p>

                </div>

                {/* Total */}

                <div>
                  <span
                    className="
                      font-bold
                      text-[#393E46]

                      text-sm

                      whitespace-nowrap
                    "
                  >
                    Rs. {formatMoney(item.total)}
                  </span>
                </div>

                {/* Status */}

                <div>
                  <span
                    className={`
                      inline-flex

                      px-3
                      py-1

                      rounded-full

                      border

                      text-xs
                      font-bold
                      capitalize

                      ${getStatusClass(
                        item.status
                      )}
                    `}
                  >
                    {item.status}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* =================================================
            EMPTY RESULT
        ================================================= */}

        {filteredOrders.length === 0 && (
          <div
            className="
              py-14
              sm:py-20

              px-5

              text-center
            "
          >

            <div
              className="
                w-14
                h-14

                mx-auto

                rounded-full

                bg-gray-100

                flex
                items-center
                justify-center

                mb-4
              "
            >
              <svg
                className="
                  w-7
                  h-7
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0l-2 7H6l-2-7m16 0h-5l-2 2h-2l-2-2H4"
                />
              </svg>
            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-[#393E46]
              "
            >
              No orders found
            </h3>

            <p
              className="
                text-sm
                text-gray-400

                mt-1
              "
            >
              {search ||
              statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Customer orders will appear here."}
            </p>

            {(search ||
              statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="
                  mt-4

                  px-4
                  py-2

                  rounded-lg

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
          @keyframes orderPageEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media print {
            body * {
              visibility: hidden;
            }

            .ReactModal__Content,
            .ReactModal__Content * {
              visibility: visible;
            }

            .ReactModal__Content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              transform: none !important;
              width: 100% !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>

    </div>
  );
}