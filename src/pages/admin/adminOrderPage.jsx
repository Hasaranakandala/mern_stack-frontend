import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import Modal from "react-modal";
import jsPDF from "jspdf";

Modal.setAppElement("#root");

/*
=========================================================
VELMORA — ADMIN ORDER MANAGEMENT
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

Direction:
Premium Operations
Luxury Beauty
Professional Admin
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
      <circle
        cx="11"
        cy="11"
        r="7"
      />

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

function CustomerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7 9V4h10v5" />
      <rect
        x="5"
        y="14"
        width="14"
        height="6"
        rx="1"
      />

      <path d="M5 16H3v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5h-2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
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
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminOrderPage() {
  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);

  /* =====================================================
     MODAL STYLE
  ===================================================== */

  const customStyles = {
    overlay: {
      backgroundColor:
        "rgba(40, 34, 48, 0.62)",

      backdropFilter:
        "blur(8px)",

      zIndex: 9999,

      padding: "12px",
    },

    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",

      transform:
        "translate(-50%, -50%)",

      width:
        "calc(100% - 24px)",

      maxWidth: "820px",

      maxHeight: "92dvh",

      overflowY: "auto",

      borderRadius:
        "28px",

      padding: "0",

      border:
        "1px solid #E8E1EF",

      background:
        "#FFFFFF",

      boxShadow:
        "0 35px 100px rgba(33, 25, 45, 0.28)",
    },
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  function formatMoney(
    value
  ) {
    const amount =
      Number(
        value || 0
      );

    return amount.toLocaleString(
      "en-LK",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      }
    );
  }

  function formatDate(
    date
  ) {
    if (!date) {
      return "No date";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "No date";
    }

    return value.toLocaleString(
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

  function normalizeStatus(
    status
  ) {
    const value =
      String(
        status || ""
      ).toLowerCase();

    // Support earlier typo
    if (
      value ===
      "returened"
    ) {
      return "returned";
    }

    return value;
  }

  function getStatusClass(
    status
  ) {
    switch (
      normalizeStatus(
        status
      )
    ) {
      case "pending":
        return "bg-[#FFF8EC] text-[#A87328] border-[#F1DFC0]";

      case "processing":
        return "bg-[#F2EEFF] text-[#6C5CE7] border-[#DED5F7]";

      case "completed":
        return "bg-[#EDF7F2] text-[#478465] border-[#D5E9DF]";

      case "cancelled":
        return "bg-[#FFF1F3] text-[#B45462] border-[#F1D4D9]";

      case "returned":
        return "bg-[#F7F1FF] text-[#8267D8] border-[#E3D9FA]";

      default:
        return "bg-[#F2EFF3] text-[#746D78] border-[#E5E0E8]";
    }
  }

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  async function fetchOrders(
    showToast = false
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
      setIsRefreshing(
        false
      );

      return;
    }

    try {
      const res =
        await axios.get(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/order",

          {
            headers: {
              Authorization:
                "Bearer " +
                token,
            },
          }
        );

      setOrders(
        Array.isArray(
          res.data
        )
          ? res.data
          : []
      );

      if (showToast) {
        toast.success(
          "Velmora orders refreshed"
        );
      }
    } catch (error) {
      console.error(
        "GET ORDER ERROR:",
        error.response
          ?.data ||
          error
      );

      toast.error(
        error.response
          ?.data
          ?.errorMessage ||
          error.response
            ?.data
            ?.message ||
          "Failed to load Velmora orders"
      );
    } finally {
      setIsLoading(
        false
      );

      setIsRefreshing(
        false
      );
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =====================================================
     REFRESH
  ===================================================== */

  async function refreshOrders() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(
      true
    );

    await fetchOrders(
      true
    );
  }

  /* =====================================================
     MODAL
  ===================================================== */

  function openOrderModal(
    item
  ) {
    setSelectedOrder(
      item
    );

    setIsModalOpen(
      true
    );
  }

  function closeOrderModal() {
    if (
      updatingStatus
    ) {
      return;
    }

    setIsModalOpen(
      false
    );

    setSelectedOrder(
      null
    );
  }

  /* =====================================================
     STATUS UPDATE
  ===================================================== */

  async function updateOrderStatus(
    updatedValue
  ) {
    if (
      !selectedOrder
    ) {
      return;
    }

    if (
      !updatedValue
    ) {
      toast.error(
        "Please select an order status"
      );

      return;
    }

    if (
      normalizeStatus(
        updatedValue
      ) ===
      normalizeStatus(
        selectedOrder.status
      )
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

    setUpdatingStatus(
      true
    );

    try {
      await axios.put(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/order/" +
          selectedOrder.orderId +
          "/" +
          updatedValue,

        {},

        {
          headers: {
            Authorization:
              "Bearer " +
              token,
          },
        }
      );

      setSelectedOrder(
        (previous) => ({
          ...previous,

          status:
            updatedValue,
        })
      );

      setOrders(
        (
          previousOrders
        ) =>
          previousOrders.map(
            (item) =>
              item.orderId ===
              selectedOrder.orderId
                ? {
                    ...item,

                    status:
                      updatedValue,
                  }
                : item
          )
      );

      toast.success(
        "Velmora order status updated"
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER ERROR:",
        error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          "Unable to update the order status"
      );
    } finally {
      setUpdatingStatus(
        false
      );
    }
  }

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredOrders =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (item) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            normalizeStatus(
              item.status
            ) ===
              statusFilter;

          /*
            This lowercases only
            temporary comparison values.
            It does NOT modify stored email.
          */

          const matchesSearch =
            searchValue ===
              "" ||
            item.orderId
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            item.name
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            item.email
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            item.phone
              ?.toLowerCase()
              .includes(
                searchValue
              );

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      orders,
      search,
      statusFilter,
    ]);

  /* =====================================================
     ANALYTICS
  ===================================================== */

  const pendingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            normalizeStatus(
              order.status
            ) === "pending"
        ),
      [orders]
    );

  const processingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            normalizeStatus(
              order.status
            ) ===
            "processing"
        ),
      [orders]
    );

  const completedOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            normalizeStatus(
              order.status
            ) ===
            "completed"
        ),
      [orders]
    );

  const completedValue =
    useMemo(
      () =>
        completedOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.total ||
                0
            ),
          0
        ),
      [completedOrders]
    );

  /* =====================================================
     PDF
  ===================================================== */

  function generatePDF() {
    if (
      !selectedOrder
    ) {
      return;
    }

    const doc =
      new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    /* ===============================================
       VELMORA HEADER
    =============================================== */

    doc.setFillColor(
      108,
      92,
      231
    );

    doc.rect(
      0,
      0,
      pageWidth,
      34,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(
      20
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "VELMORA",
      20,
      15
    );

    doc.setFontSize(
      9
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Beauty  •  Skincare  •  Confidence",
      20,
      23
    );

    doc.setTextColor(
      47,
      49,
      54
    );

    doc.setFontSize(
      18
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Order Invoice",
      20,
      50
    );

    doc.setDrawColor(
      234,
      228,
      240
    );

    doc.line(
      20,
      56,
      pageWidth - 20,
      56
    );

    /* ===============================================
       ORDER INFORMATION
    =============================================== */

    doc.setFontSize(
      10
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    let y = 68;

    const details = [
      [
        "Order ID",
        selectedOrder.orderId ||
          "-",
      ],

      [
        "Customer",
        selectedOrder.name ||
          "-",
      ],

      [
        "Email",
        selectedOrder.email ||
          "-",
      ],

      [
        "Phone",
        selectedOrder.phone ||
          "-",
      ],

      [
        "Date",
        formatDate(
          selectedOrder.date ||
            selectedOrder.createdAt
        ),
      ],

      [
        "Status",
        selectedOrder.status ||
          "-",
      ],
    ];

    details.forEach(
      ([
        label,
        value,
      ]) => {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(
          107,
          114,
          128
        );

        doc.text(
          `${label}:`,
          20,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(
          47,
          49,
          54
        );

        doc.text(
          String(value),
          52,
          y
        );

        y += 8;
      }
    );

    /* ===============================================
       ADDRESS
    =============================================== */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      107,
      114,
      128
    );

    doc.text(
      "Address:",
      20,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      47,
      49,
      54
    );

    const addressLines =
      doc.splitTextToSize(
        selectedOrder.address ||
          "-",
        pageWidth - 72
      );

    doc.text(
      addressLines,
      52,
      y
    );

    y +=
      addressLines.length *
        6 +
      10;

    /* ===============================================
       TOTAL
    =============================================== */

    doc.setFillColor(
      247,
      244,
      255
    );

    doc.roundedRect(
      20,
      y,
      pageWidth - 40,
      20,
      4,
      4,
      "F"
    );

    doc.setTextColor(
      108,
      92,
      231
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(
      13
    );

    doc.text(
      `Total: Rs. ${formatMoney(
        selectedOrder.total
      )}`,
      26,
      y + 13
    );

    y += 34;

    /* ===============================================
       PRODUCTS
    =============================================== */

    doc.setTextColor(
      47,
      49,
      54
    );

    doc.setFontSize(
      14
    );

    doc.text(
      "Products",
      20,
      y
    );

    y += 10;

    selectedOrder.products?.forEach(
      (
        product,
        index
      ) => {
        const productName =
          product.productInfo
            ?.name ||
          product.productInfo
            ?.productName ||
          "Product";

        const quantity =
          Number(
            product.quantity ||
              0
          );

        const unitPrice =
          Number(
            product.productInfo
              ?.price ||
              0
          );

        const subtotal =
          unitPrice *
          quantity;

        const nameLines =
          doc.splitTextToSize(
            `${index + 1}. ${productName}`,
            80
          );

        const requiredHeight =
          Math.max(
            nameLines.length *
              6,
            12
          );

        if (
          y +
            requiredHeight >
          278
        ) {
          doc.addPage();

          y = 20;
        }

        doc.setFontSize(
          10
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(
          47,
          49,
          54
        );

        doc.text(
          nameLines,
          20,
          y
        );

        doc.setTextColor(
          107,
          114,
          128
        );

        doc.text(
          `Qty: ${quantity}`,
          112,
          y
        );

        doc.setTextColor(
          108,
          92,
          231
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.text(
          `Rs. ${formatMoney(
            subtotal
          )}`,
          150,
          y
        );

        y +=
          requiredHeight +
          7;

        doc.setDrawColor(
          238,
          233,
          242
        );

        doc.line(
          20,
          y - 3,
          pageWidth - 20,
          y - 3
        );
      }
    );

    /* ===============================================
       FOOTER
    =============================================== */

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(
      8
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      145,
      137,
      150
    );

    doc.text(
      "Thank you for choosing Velmora.",
      20,
      y + 12
    );

    doc.text(
      "Beauty • Skincare • Confidence",
      20,
      y + 18
    );

    doc.save(
      `${
        selectedOrder.orderId ||
        "velmora-order"
      }.pdf`
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading message="Preparing Velmora orders..." />
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

        animate-[orderPageEnter_0.4s_ease-out]
      "
    >
      {/* =================================================
          BACKGROUND AMBIENCE
      ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          -left-36
          -top-32

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
            MODAL
        ================================================= */}

        <Modal
          isOpen={
            isModalOpen
          }
          onRequestClose={
            closeOrderModal
          }
          style={
            customStyles
          }
          contentLabel="Velmora Order Details"
          shouldCloseOnOverlayClick={
            !updatingStatus
          }
        >
          {selectedOrder && (
            <div
              className="
                bg-white
                text-[#2F3136]
              "
            >
              {/* =========================================
                  MODAL HEADER
              ========================================= */}

              <div
                className="
                  sticky
                  top-0
                  z-20

                  border-b
                  border-[#EAE4EF]

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
                  <div className="min-w-0">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-[#DFD5F5]

                        bg-[#F4F0FF]

                        px-3
                        py-1.5

                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]

                        text-[#6C5CE7]
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
                      Order
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
                      Order
                      Details
                    </h2>

                    <p
                      className="
                        mt-1

                        truncate

                        text-xs
                        text-[#918A96]

                        sm:text-sm
                      "
                    >
                      Reference{" "}
                      {
                        selectedOrder.orderId
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeOrderModal
                    }
                    disabled={
                      updatingStatus
                    }
                    aria-label="Close modal"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#E9E3ED]

                      bg-[#FAF8FB]

                      text-[#77707C]

                      transition-all
                      duration-200

                      hover:border-[#E7C6CE]
                      hover:bg-[#FFF2F4]
                      hover:text-[#B65566]

                      active:scale-90

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* =========================================
                  MODAL CONTENT
              ========================================= */}

              <div
                className="
                  p-4

                  sm:p-6
                "
              >
                {/* CUSTOMER */}

                <section
                  className="
                    mb-5

                    rounded-[22px]

                    border
                    border-[#E8E1EF]

                    bg-gradient-to-br
                    from-[#FBF9FF]
                    via-white
                    to-[#FFF7F9]

                    p-4

                    sm:p-5
                  "
                >
                  <div
                    className="
                      mb-5

                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-xl

                        bg-[#F2EDFF]

                        text-[#6C5CE7]
                      "
                    >
                      <CustomerIcon />
                    </div>

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
                        Customer
                        Care
                      </p>

                      <h3
                        className="
                          mt-0.5
                          font-extrabold
                          text-[#39333E]
                        "
                      >
                        Customer
                        Information
                      </h3>
                    </div>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4

                      sm:grid-cols-2
                      sm:gap-5
                    "
                  >
                    <InfoItem
                      label="Customer"
                      value={
                        selectedOrder.name ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Phone"
                      value={
                        selectedOrder.phone ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Email"
                      value={
                        selectedOrder.email ||
                        "-"
                      }
                      breakAll
                    />

                    <InfoItem
                      label="Placed"
                      value={formatDate(
                        selectedOrder.date ||
                          selectedOrder.createdAt
                      )}
                    />
                  </div>

                  <div
                    className="
                      mt-5

                      border-t
                      border-[#EEE8F2]

                      pt-4
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[#99919D]
                      "
                    >
                      Delivery
                      Address
                    </p>

                    <p
                      className="
                        mt-1.5

                        break-words

                        text-sm
                        leading-6
                        text-[#625B67]
                      "
                    >
                      {selectedOrder.address ||
                        "-"}
                    </p>
                  </div>
                </section>

                {/* TOTAL + STATUS */}

                <div
                  className="
                    mb-5

                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  <div
                    className="
                      relative
                      overflow-hidden

                      rounded-[20px]

                      border
                      border-[#E4DCF1]

                      bg-[#F8F5FF]

                      p-4
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10

                        h-24
                        w-24

                        rounded-full

                        bg-[#B8A1FF]/20

                        blur-2xl
                      "
                    />

                    <p
                      className="
                        relative
                        text-[10px]
                        font-semibold
                        text-[#8E8693]
                      "
                    >
                      Order Total
                    </p>

                    <p
                      className="
                        relative

                        mt-1

                        text-xl
                        font-extrabold
                        tracking-[-0.03em]

                        text-[#6C5CE7]

                        sm:text-2xl
                      "
                    >
                      Rs.{" "}
                      {formatMoney(
                        selectedOrder.total
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-[20px]

                      border
                      border-[#E9E3EE]

                      bg-white

                      p-4
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[#8E8693]
                      "
                    >
                      Current
                      Status
                    </p>

                    <span
                      className={`
                        mt-2

                        inline-flex
                        items-center

                        rounded-full

                        border

                        px-3
                        py-1.5

                        text-xs
                        font-bold
                        capitalize

                        ${getStatusClass(
                          selectedOrder.status
                        )}
                      `}
                    >
                      {selectedOrder.status ||
                        "Unknown"}
                    </span>
                  </div>
                </div>

                {/* =========================================
                    UPDATE STATUS
                ========================================= */}

                <section
                  className="
                    mb-6

                    rounded-[22px]

                    border
                    border-[#E7E0EE]

                    bg-white

                    p-4

                    shadow-[0_8px_25px_rgba(63,48,84,0.035)]
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-[#927CE4]
                        "
                      >
                        Order
                        Operations
                      </p>

                      <h3
                        className="
                          mt-1
                          font-extrabold
                          text-[#39333E]
                        "
                      >
                        Update
                        Order
                        Status
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-[#918996]
                        "
                      >
                        Select a
                        new stage
                        for this
                        Velmora
                        order.
                      </p>
                    </div>

                    <select
                      value={
                        normalizeStatus(
                          selectedOrder.status
                        )
                      }
                      disabled={
                        updatingStatus
                      }
                      onChange={(
                        event
                      ) =>
                        updateOrderStatus(
                          event
                            .target
                            .value
                        )
                      }
                      className="
                        min-h-[48px]
                        w-full

                        rounded-xl

                        border
                        border-[#DCD5E3]

                        bg-white

                        px-4
                        pr-9

                        text-sm
                        font-semibold
                        text-[#554E5A]

                        outline-none

                        transition-all

                        focus:border-[#B8A1FF]
                        focus:ring-4
                        focus:ring-[#B8A1FF]/15

                        disabled:cursor-not-allowed
                        disabled:bg-[#F4F2F5]

                        sm:w-[190px]
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

                  {updatingStatus && (
                    <div
                      className="
                        mt-3

                        flex
                        items-center
                        gap-2

                        text-xs
                        font-semibold
                        text-[#6C5CE7]
                      "
                    >
                      <span
                        className="
                          h-4
                          w-4

                          animate-spin

                          rounded-full

                          border-2
                          border-[#D8CFFF]
                          border-t-[#6C5CE7]
                        "
                      />

                      Updating
                      Velmora
                      order...
                    </div>
                  )}
                </section>

                {/* =========================================
                    PRODUCTS
                ========================================= */}

                <section>
                  <div
                    className="
                      mb-3

                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-[#927CE4]
                        "
                      >
                        Order
                        Contents
                      </p>

                      <h3
                        className="
                          mt-1
                          text-lg
                          font-extrabold
                          text-[#39333E]
                        "
                      >
                        Products
                      </h3>
                    </div>

                    <span
                      className="
                        rounded-full

                        border
                        border-[#E5DDEE]

                        bg-[#F8F5FF]

                        px-3
                        py-1.5

                        text-[10px]
                        font-bold
                        text-[#6C5CE7]
                      "
                    >
                      {selectedOrder.products
                        ?.length ||
                        0}{" "}
                      items
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedOrder.products?.map(
                      (
                        product,
                        index
                      ) => {
                        const productName =
                          product
                            .productInfo
                            ?.name ||
                          product
                            .productInfo
                            ?.productName ||
                          "Product";

                        const quantity =
                          Number(
                            product.quantity ||
                              0
                          );

                        const unitPrice =
                          Number(
                            product
                              .productInfo
                              ?.price ||
                              0
                          );

                        return (
                          <div
                            key={
                              index
                            }
                            className="
                              flex
                              flex-col
                              gap-4

                              rounded-2xl

                              border
                              border-[#EAE4EF]

                              bg-[#FCFAFD]

                              p-4

                              transition-all
                              duration-200

                              hover:border-[#DDD2F2]
                              hover:bg-white
                              hover:shadow-sm

                              sm:flex-row
                              sm:items-center
                              sm:justify-between
                            "
                          >
                            <div className="min-w-0">
                              <p
                                className="
                                  break-words
                                  font-bold
                                  text-[#39333E]
                                "
                              >
                                {
                                  productName
                                }
                              </p>

                              <span
                                className="
                                  mt-2
                                  inline-flex

                                  rounded-full

                                  bg-[#F2EDFF]

                                  px-2.5
                                  py-1

                                  text-[10px]
                                  font-semibold
                                  text-[#6C5CE7]
                                "
                              >
                                Quantity{" "}
                                {
                                  quantity
                                }
                              </span>
                            </div>

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-5

                                sm:block
                                sm:text-right
                              "
                            >
                              <div>
                                <p
                                  className="
                                    text-[10px]
                                    text-[#9B939F]
                                  "
                                >
                                  Each
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-sm
                                    font-semibold
                                    text-[#625B67]
                                  "
                                >
                                  Rs.{" "}
                                  {formatMoney(
                                    unitPrice
                                  )}
                                </p>
                              </div>

                              <div className="sm:mt-2">
                                <p
                                  className="
                                    text-[10px]
                                    text-[#9B939F]
                                  "
                                >
                                  Subtotal
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-sm
                                    font-extrabold
                                    text-[#6C5CE7]
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

                    {(!selectedOrder.products ||
                      selectedOrder
                        .products
                        .length ===
                        0) && (
                      <div
                        className="
                          rounded-2xl

                          border
                          border-dashed
                          border-[#DED7E4]

                          p-8

                          text-center
                          text-sm
                          text-[#99919D]
                        "
                      >
                        No product
                        information
                        available.
                      </div>
                    )}
                  </div>
                </section>

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div
                  className="
                    mt-6
                    pt-5

                    border-t
                    border-[#EEE9F2]

                    flex
                    flex-col-reverse
                    gap-3

                    sm:flex-row
                    sm:justify-end
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      window.print()
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
                      border-[#DCD5E2]

                      bg-white

                      px-5

                      text-sm
                      font-bold
                      text-[#625B67]

                      transition-all
                      duration-200

                      hover:border-[#CFC5D8]
                      hover:bg-[#F8F5FF]
                      hover:text-[#6C5CE7]

                      active:scale-[0.98]

                      sm:w-auto
                    "
                  >
                    <PrintIcon />

                    Print
                  </button>

                  <button
                    type="button"
                    onClick={
                      generatePDF
                    }
                    className="
                      flex
                      min-h-[48px]
                      w-full
                      items-center
                      justify-center
                      gap-2

                      rounded-xl

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#8F78EA]

                      px-5

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_10px_24px_rgba(108,92,231,0.22)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_14px_30px_rgba(108,92,231,0.30)]

                      active:scale-[0.98]

                      sm:w-auto
                    "
                  >
                    <DownloadIcon />

                    Download
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* =================================================
            PAGE HERO
        ================================================= */}

        <section
          className="
            relative

            mb-5

            overflow-hidden

            rounded-[26px]

            border
            border-[#E8E1EF]

            bg-gradient-to-r
            from-[#F5F1FF]
            via-white
            to-[#FFF3F7]

            p-5

            shadow-[0_15px_48px_rgba(63,48,84,0.05)]

            sm:mb-6
            sm:rounded-[30px]
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none

              absolute
              -right-16
              -top-16

              h-48
              w-48

              rounded-full

              bg-[#B8A1FF]/16

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
                  border-[#DDD4F3]

                  bg-white/75

                  px-3
                  py-1.5

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.17em]

                  text-[#6C5CE7]

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
                Order
                Operations
              </div>

              <h1
                className="
                  mt-3

                  text-2xl
                  font-extrabold
                  tracking-[-0.035em]

                  text-[#2F3136]

                  sm:text-3xl

                  lg:text-[34px]
                "
              >
                Orders &
                Fulfilment
              </h1>

              <p
                className="
                  mt-2

                  max-w-2xl

                  text-xs
                  leading-6

                  text-[#77717C]

                  sm:text-sm
                "
              >
                Review customer
                purchases,
                manage
                fulfilment
                progress and
                maintain a
                refined Velmora
                delivery
                experience.
              </p>
            </div>

            <button
              type="button"
              onClick={
                refreshOrders
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
                disabled:opacity-60

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
                : "Refresh Orders"}
            </button>
          </div>
        </section>

        {/* =================================================
            METRICS
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
          <OrderMetric
            label="All Orders"
            value={
              orders.length
            }
            type="all"
          />

          <OrderMetric
            label="Pending"
            value={
              pendingOrders.length
            }
            type="pending"
          />

          <OrderMetric
            label="Processing"
            value={
              processingOrders.length
            }
            type="processing"
          />

          <OrderMetric
            label="Completed Value"
            value={`Rs. ${formatMoney(
              completedValue
            )}`}
            type="completed"
          />
        </section>

        {/* =================================================
            FILTERS
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
              flex
              flex-col
              gap-3

              md:flex-row
              md:items-center
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
                flex-1
              "
            >
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
                    event
                      .target
                      .value
                  )
                }
                placeholder="Search order ID, customer, email or phone..."
                className="
                  min-h-[52px]
                  w-full

                  rounded-2xl

                  border
                  border-[#DDD7E2]

                  bg-white

                  pl-[58px]
                  pr-4

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
            </div>

            {/* FILTER */}

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
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
                duration-300

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15

                md:w-[200px]
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
                  filteredOrders.length
                }
              </span>{" "}
              of{" "}
              {
                orders.length
              }{" "}
              Velmora
              orders
            </p>

            {(search ||
              statusFilter !==
                "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setStatusFilter(
                    "all"
                  );
                }}
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
            ORDER LIST
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
          {/* LIST HEADER */}

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
                Customer
                Commerce
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
                Velmora
                Orders
              </h2>

              <p
                className="
                  mt-1

                  text-[10px]
                  text-[#99919D]

                  sm:text-xs
                "
              >
                Select an
                order to
                inspect or
                manage it.
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
                border-[#E1D8F3]

                bg-[#F5F1FF]

                px-3

                text-xs
                font-bold
                text-[#6C5CE7]
              "
            >
              {
                filteredOrders.length
              }
            </span>
          </div>

          {/* DESKTOP HEADINGS */}

          <div
            className="
              hidden

              grid-cols-[110px_1.1fr_1.4fr_1fr_1.1fr_1.2fr_110px_110px]
              gap-4

              border-b
              border-[#EAE4EE]

              bg-[#F8F5FB]

              px-5
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
              Order ID
            </div>

            <div>
              Customer
            </div>

            <div>
              Email
            </div>

            <div>
              Phone
            </div>

            <div>
              Date
            </div>

            <div>
              Address
            </div>

            <div>
              Total
            </div>

            <div>
              Status
            </div>
          </div>

          {/* ORDERS */}

          <div
            className="
              divide-y
              divide-[#F0EBF3]
            "
          >
            {filteredOrders.map(
              (item) => (
                <div
                  key={
                    item._id ||
                    item.orderId
                  }
                  onClick={() =>
                    openOrderModal(
                      item
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
                        mb-4

                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <span
                          className="
                            inline-flex

                            rounded-lg

                            border
                            border-[#E3DBED]

                            bg-[#F8F5FF]

                            px-3
                            py-1

                            text-xs
                            font-bold
                            text-[#6C5CE7]
                          "
                        >
                          {
                            item.orderId
                          }
                        </span>

                        <h3
                          className="
                            mt-2

                            truncate

                            font-extrabold
                            text-[#39333E]
                          "
                        >
                          {item.name ||
                            "Unknown customer"}
                        </h3>
                      </div>

                      <span
                        className={`
                          shrink-0

                          rounded-full

                          border

                          px-2.5
                          py-1

                          text-[10px]
                          font-bold
                          capitalize

                          ${getStatusClass(
                            item.status
                          )}
                        `}
                      >
                        {item.status ||
                          "Unknown"}
                      </span>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-3

                        text-sm

                        sm:grid-cols-2
                      "
                    >
                      <OrderDetail
                        label="Email"
                        value={
                          item.email ||
                          "-"
                        }
                      />

                      <OrderDetail
                        label="Phone"
                        value={
                          item.phone ||
                          "-"
                        }
                      />

                      <OrderDetail
                        label="Date"
                        value={formatDate(
                          item.date ||
                            item.createdAt
                        )}
                      />

                      <OrderDetail
                        label="Total"
                        value={`Rs. ${formatMoney(
                          item.total
                        )}`}
                        highlight
                      />
                    </div>

                    <div
                      className="
                        mt-4

                        flex
                        items-center
                        justify-between
                        gap-3

                        border-t
                        border-[#EEE9F2]

                        pt-3
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[10px]
                            text-[#9A929E]
                          "
                        >
                          Delivery
                          Address
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-sm
                            text-[#68616D]
                          "
                        >
                          {item.address ||
                            "-"}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          bg-[#F2EDFF]

                          text-[#6C5CE7]

                          transition-transform
                          duration-300

                          group-hover:translate-x-1
                        "
                      >
                        <ArrowIcon />
                      </div>
                    </div>
                  </div>

                  {/* ===================================
                      DESKTOP ROW
                  =================================== */}

                  <div
                    className="
                      hidden

                      grid-cols-[110px_1.1fr_1.4fr_1fr_1.1fr_1.2fr_110px_110px]
                      items-center
                      gap-4

                      px-5
                      py-5

                      xl:grid
                    "
                  >
                    <span
                      className="
                        inline-flex
                        w-fit

                        rounded-lg

                        bg-[#F5F1FF]

                        px-3
                        py-1.5

                        text-xs
                        font-bold
                        text-[#6C5CE7]
                      "
                    >
                      {
                        item.orderId
                      }
                    </span>

                    <p
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-[#39333E]
                      "
                    >
                      {item.name ||
                        "-"}
                    </p>

                    <p
                      className="
                        truncate
                        text-sm
                        text-[#6F6874]
                      "
                      title={
                        item.email
                      }
                    >
                      {item.email ||
                        "-"}
                    </p>

                    <p
                      className="
                        text-sm
                        text-[#6F6874]
                      "
                    >
                      {item.phone ||
                        "-"}
                    </p>

                    <p
                      className="
                        text-sm
                        text-[#6F6874]
                      "
                    >
                      {formatDate(
                        item.date ||
                          item.createdAt
                      )}
                    </p>

                    <p
                      className="
                        truncate
                        text-sm
                        text-[#6F6874]
                      "
                      title={
                        item.address
                      }
                    >
                      {item.address ||
                        "-"}
                    </p>

                    <p
                      className="
                        whitespace-nowrap
                        text-sm
                        font-extrabold
                        text-[#6C5CE7]
                      "
                    >
                      Rs.{" "}
                      {formatMoney(
                        item.total
                      )}
                    </p>

                    <span
                      className={`
                        inline-flex
                        w-fit

                        rounded-full

                        border

                        px-3
                        py-1

                        text-[10px]
                        font-bold
                        capitalize

                        ${getStatusClass(
                          item.status
                        )}
                      `}
                    >
                      {item.status ||
                        "Unknown"}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>

          {/* EMPTY */}

          {filteredOrders.length ===
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
                  border-[#E3DAF2]

                  bg-[#F5F1FF]

                  text-[#6C5CE7]
                "
              >
                <OrderIcon />
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
                Orders
              </p>

              <h3
                className="
                  mt-2

                  text-lg
                  font-extrabold

                  text-[#39333E]
                "
              >
                No orders
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
                statusFilter !==
                  "all"
                  ? "No Velmora orders match your current search or status filter."
                  : "Customer purchases will appear here when orders are placed."}
              </p>

              {(search ||
                statusFilter !==
                  "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");

                    setStatusFilter(
                      "all"
                    );
                  }}
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
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-[0_13px_28px_rgba(108,92,231,0.28)]

                    active:scale-[0.98]
                  "
                >
                  Clear
                  Filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            STYLES
        ================================================= */}

        <style>{`
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

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[orderPageEnter_0\\.4s_ease-out\\] {
              animation: none !important;
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
              border: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER METRIC
========================================================= */

function OrderMetric({
  label,
  value,
  type,
}) {
  const styles = {
    all: {
      surface:
        "bg-[#F5F1FF] border-[#E0D6F7]",
      icon:
        "bg-[#6C5CE7] text-white",
    },

    pending: {
      surface:
        "bg-[#FFF9EF] border-[#F2E3C8]",
      icon:
        "bg-[#FFF0D2] text-[#A87328]",
    },

    processing: {
      surface:
        "bg-[#F5F1FF] border-[#E1D8F5]",
      icon:
        "bg-[#E5DDFF] text-[#6C5CE7]",
    },

    completed: {
      surface:
        "bg-[#F2F9F5] border-[#D8EBE1]",
      icon:
        "bg-[#DCEFE5] text-[#4F8F70]",
    },
  };

  const current =
    styles[type] ||
    styles.all;

  return (
    <div
      className={`
        rounded-[20px]

        border

        p-3.5

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-md

        sm:p-4

        ${current.surface}
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <p
          className="
            text-[9px]
            font-semibold
            leading-4
            text-[#7D7581]

            sm:text-xs
          "
        >
          {label}
        </p>

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center

            rounded-xl

            ${current.icon}
          `}
        >
          <OrderIcon />
        </div>
      </div>

      <p
        className="
          mt-3

          break-words

          text-base
          font-extrabold
          tracking-[-0.02em]

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
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
  breakAll = false,
}) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[10px]
          font-semibold
          text-[#9B939F]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1

          text-sm
          font-semibold
          text-[#57505C]

          ${
            breakAll
              ? "break-all"
              : "break-words"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   ORDER DETAIL
========================================================= */

function OrderDetail({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[10px]
          text-[#9B939F]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1

          truncate

          text-sm

          ${
            highlight
              ? "font-extrabold text-[#6C5CE7]"
              : "font-medium text-[#68616D]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}