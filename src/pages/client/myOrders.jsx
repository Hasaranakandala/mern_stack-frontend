import axios from "axios";



import {

  useEffect,

  useMemo,

  useState,

} from "react";



import {

  useNavigate,

} from "react-router-dom";



import {

  jwtDecode,

} from "jwt-decode";



import toast from "react-hot-toast";



import {

  FiPackage,

  FiMapPin,

  FiPhone,

  FiShoppingBag,

  FiRefreshCw,

  FiArrowLeft,

  FiX,

  FiClock,

  FiCheckCircle,

  FiCreditCard,

} from "react-icons/fi";



/*

=========================================================

VELMORA MY ORDERS

=========================================================

*/



function getPaymentMethodLabel(method) {
  const value = String(method || "")
    .trim()
    .toLowerCase();

  if (value === "card") {
    return "Card Payment";
  }

  if (value === "cash_on_delivery") {
    return "Cash on Delivery";
  }

  return "Not specified";
}



function paymentStatusStyle(status) {
  const value = String(status || "pending")
    .trim()
    .toLowerCase();

  switch (value) {
    case "paid":
      return {
        label: "Paid",
        className:
          "border-[#D8EADF] bg-[#EFF8F3] text-[#3F8061]",
      };

    case "failed":
      return {
        label: "Failed",
        className:
          "border-[#F0D8DD] bg-[#FFF4F6] text-[#B45462]",
      };

    case "refunded":
      return {
        label: "Refunded",
        className:
          "border-[#E8DFD1] bg-[#FBF6EF] text-[#9A7548]",
      };

    default:
      return {
        label: "Pending",
        className:
          "border-[#F1E1C6] bg-[#FFF9EE] text-[#B0782E]",
      };
  }
}



export default function MyOrders() {

  const navigate =

    useNavigate();



  const [

    user,

    setUser,

  ] = useState(null);



  const [

    orders,

    setOrders,

  ] = useState([]);



  const [

    loading,

    setLoading,

  ] = useState(true);



  const [

    refreshing,

    setRefreshing,

  ] = useState(false);



  const [

    selectedOrder,

    setSelectedOrder,

  ] = useState(null);



  const [

    filter,

    setFilter,

  ] = useState("all");



  /* =====================================================

     GET LOGGED CUSTOMER

  ===================================================== */



  useEffect(() => {

    const token =

      localStorage.getItem(

        "token"

      );



    if (!token) {

      toast.error(

        "Please sign in to view your orders"

      );



      navigate(

        "/login",

        {

          replace: true,

        }

      );



      return;

    }



    try {

      const decoded =

        jwtDecode(token);



      if (

        decoded.exp &&

        decoded.exp *

          1000 <

          Date.now()

      ) {

        localStorage.removeItem(

          "token"

        );



        toast.error(

          "Your session has expired"

        );



        navigate(

          "/login",

          {

            replace: true,

          }

        );



        return;

      }



      if (

        decoded.role ===

        "admin"

      ) {

        navigate(

          "/admin/orders",

          {

            replace: true,

          }

        );



        return;

      }



      setUser({

        firstName:

          decoded.firstName ||

          "",



        lastName:

          decoded.lastName ||

          "",



        email:

          decoded.email ||

          "",



        role:

          decoded.role ||

          "customer",

      });

    } catch (error) {

      console.error(

        "ORDER TOKEN ERROR:",

        error

      );



      localStorage.removeItem(

        "token"

      );



      navigate(

        "/login",

        {

          replace: true,

        }

      );

    }

  }, [navigate]);



  /* =====================================================

     FETCH ORDERS AFTER USER EXISTS

  ===================================================== */



  useEffect(() => {

    if (

      user?.email

    ) {

      fetchOrders();

    }

  }, [user?.email]);



  /* =====================================================

     FETCH ORDERS

  ===================================================== */



  async function fetchOrders(

    showSuccess = false

  ) {

    const token =

      localStorage.getItem(

        "token"

      );



    if (!token) {

      navigate(

        "/login"

      );



      return;

    }



    try {

      const response =

        await axios.get(

          `${

            import.meta.env

              .VITE_BACKEND_URL

          }/api/order`,

          {

            headers: {

              Authorization:

                `Bearer ${token}`,

            },

          }

        );



      const allOrders =

        Array.isArray(

          response.data

        )

          ? response.data

          : response.data

              ?.orders &&

            Array.isArray(

              response.data

                .orders

            )

          ? response.data

              .orders

          : [];



      /*

      ===============================================

      CUSTOMER FILTER



      Do NOT use toLowerCase().

      Preserve your project's email casing.

      ===============================================

      */



      const customerOrders =

        allOrders.filter(

          (order) =>

            String(

              order.email ??

                ""

            ).trim() ===

            String(

              user.email ??

                ""

            ).trim()

        );



      customerOrders.sort(

        (a, b) =>

          new Date(

            b.createdAt ||

              b.date ||

              0

          ) -

          new Date(

            a.createdAt ||

              a.date ||

              0

          )

      );



      setOrders(

        customerOrders

      );



      if (

        showSuccess

      ) {

        toast.success(

          "Your orders are up to date"

        );

      }

    } catch (error) {

      console.error(

        "GET CUSTOMER ORDERS ERROR:",

        error

      );



      toast.error(

        error.response

          ?.data

          ?.message ||

          "Unable to load your orders"

      );



      setOrders([]);

    } finally {

      setLoading(false);

      setRefreshing(

        false

      );

    }

  }



  /* =====================================================

     REFRESH

  ===================================================== */



  async function handleRefresh() {

    if (refreshing) {

      return;

    }



    setRefreshing(

      true

    );



    await fetchOrders(

      true

    );

  }



  /* =====================================================

     NORMALIZE STATUS

  ===================================================== */



  function normalizeStatus(

    status

  ) {

    const value =

      String(

        status || ""

      )

        .trim()

        .toLowerCase();



    if (

      value ===

      "returened"

    ) {

      return "returned";

    }



    return (

      value ||

      "pending"

    );

  }



  /* =====================================================

     FILTERED ORDERS

  ===================================================== */



  const filteredOrders =

    useMemo(() => {

      if (

        filter === "all"

      ) {

        return orders;

      }



      return orders.filter(

        (order) =>

          normalizeStatus(

            order.status

          ) === filter

      );

    }, [

      orders,

      filter,

    ]);



  /* =====================================================

     STATS

  ===================================================== */



  const stats =

    useMemo(() => {

      return {

        total:

          orders.length,



        active:

          orders.filter(

            (order) =>

              [

                "pending",

                "processing",

              ].includes(

                normalizeStatus(

                  order.status

                )

              )

          ).length,



        completed:

          orders.filter(

            (order) =>

              normalizeStatus(

                order.status

              ) ===

              "completed"

          ).length,

      };

    }, [orders]);



  /* =====================================================

     STATUS UI

  ===================================================== */



  function statusStyle(

    status

  ) {

    switch (

      normalizeStatus(

        status

      )

    ) {

      case "completed":

        return {

          label:

            "Completed",



          className:

            "border-[#D8EADF] bg-[#EFF8F3] text-[#3F8061]",

        };



      case "processing":

        return {

          label:

            "Processing",



          className:

            "border-[#E3DAFF] bg-[#F5F1FF] text-[#6C5CE7]",

        };



      case "cancelled":

        return {

          label:

            "Cancelled",



          className:

            "border-[#F0D8DD] bg-[#FFF4F6] text-[#B45462]",

        };



      case "returned":

        return {

          label:

            "Returned",



          className:

            "border-[#E8DFD1] bg-[#FBF6EF] text-[#9A7548]",

        };



      default:

        return {

          label:

            "Pending",



          className:

            "border-[#F1E1C6] bg-[#FFF9EE] text-[#B0782E]",

        };

    }

  }



  /* =====================================================

     ORDER TOTAL

  ===================================================== */



  function getOrderTotal(

    order

  ) {

    const direct =

      Number(

        order.total

      );



    if (

      Number.isFinite(

        direct

      ) &&

      direct > 0

    ) {

      return direct;

    }



    const products =

      Array.isArray(

        order.products

      )

        ? order.products

        : [];



    return products.reduce(

      (

        total,

        item

      ) => {

        const price =

          Number(

            item.price ??

              item.productInfo

                ?.price ??

              item.labelPrice ??

              0

          );



        const quantity =

          Number(

            item.quantity

          ) || 1;



        return (

          total +

          price *

            quantity

        );

      },

      0

    );

  }



  /* =====================================================

     DATE

  ===================================================== */



  function formatDate(

    value

  ) {

    if (!value) {

      return "Date unavailable";

    }



    const date =

      new Date(

        value

      );



    if (

      Number.isNaN(

        date.getTime()

      )

    ) {

      return "Date unavailable";

    }



    return date.toLocaleDateString(

      "en-LK",

      {

        year:

          "numeric",

        month:

          "short",

        day:

          "numeric",

      }

    );

  }



  /* =====================================================

     LOADING

  ===================================================== */



  if (loading) {

    return (

      <main

        className="

          flex

          min-h-screen

          items-center

          justify-center



          bg-[#FAF9F7]

        "

      >

        <div className="text-center">

          <div

            className="

              mx-auto



              h-12

              w-12



              animate-spin



              rounded-full



              border-4

              border-[#EEE9F8]

              border-t-[#6C5CE7]

            "

          />



          <p

            className="

              mt-4



              text-sm

              font-medium

              text-[#807985]

            "

          >

            Gathering your

            Velmora orders...

          </p>

        </div>

      </main>

    );

  }



  return (

    <main

      className="

        relative



        min-h-screen



        overflow-hidden



        bg-[#FAF9F7]



        pb-16

        pt-[92px]



        sm:pb-20



        md:pt-[104px]

      "

    >

      {/* BACKGROUND */}



      <div

        className="

          pointer-events-none



          absolute

          -left-24

          top-28



          h-[320px]

          w-[320px]



          rounded-full



          bg-[#B8A1FF]/[0.10]



          blur-[100px]

        "

      />



      <div

        className="

          pointer-events-none



          absolute

          -right-20

          top-[500px]



          h-[300px]

          w-[300px]



          rounded-full



          bg-[#F2B8C6]/[0.10]



          blur-[100px]

        "

      />



      <div

        className="

          relative

          z-10



          mx-auto

          w-full

          max-w-[1200px]



          px-4



          sm:px-6



          lg:px-8

        "

      >

        {/* ================================================

            TOP

        ================================================ */}



        <div

          className="

            flex

            flex-col

            gap-5



            sm:flex-row

            sm:items-end

            sm:justify-between

          "

        >

          <div>

            <button

              type="button"

              onClick={() =>

                navigate(

                  "/profile"

                )

              }

              className="

                mb-4



                inline-flex

                min-h-[40px]

                items-center

                gap-2



                rounded-xl



                text-sm

                font-semibold

                text-[#766F7B]



                transition



                hover:text-[#6C5CE7]

              "

            >

              <FiArrowLeft />



              My Profile

            </button>



            <p

              className="

                text-[10px]

                font-black

                uppercase

                tracking-[0.18em]



                text-[#9A79E8]

              "

            >

              ✦ Velmora

              Orders

            </p>



            <h1

              className="

                mt-2



                text-3xl

                font-extrabold

                tracking-[-0.04em]



                text-[#2F3136]



                sm:text-4xl



                lg:text-[44px]

              "

            >

              My Orders

            </h1>



            <p

              className="

                mt-3



                max-w-xl



                text-sm

                leading-7



                text-[#7B7580]



                sm:text-base

              "

            >

              Follow your

              Velmora purchases

              from order

              placement through

              completion.

            </p>

          </div>



          <button

            type="button"

            disabled={

              refreshing

            }

            onClick={

              handleRefresh

            }

            className="

              inline-flex

              min-h-[48px]

              w-full

              items-center

              justify-center

              gap-2



              rounded-xl



              border

              border-[#DED5F5]



              bg-white



              px-5



              text-sm

              font-bold

              text-[#6C5CE7]



              shadow-sm



              transition-all

              duration-300



              hover:border-[#BFAFF2]

              hover:bg-[#F7F3FF]



              disabled:cursor-not-allowed

              disabled:opacity-60



              sm:w-auto

            "

          >

            <FiRefreshCw

              className={

                refreshing

                  ? "animate-spin"

                  : ""

              }

            />



            Refresh

          </button>

        </div>



        {/* ================================================

            STATS

        ================================================ */}



        <div

          className="

            mt-7



            grid

            grid-cols-1

            gap-3



            sm:grid-cols-3

          "

        >

          <StatCard

            icon={

              <FiShoppingBag />

            }

            label="Total Orders"

            value={

              stats.total

            }

          />



          <StatCard

            icon={

              <FiClock />

            }

            label="In Progress"

            value={

              stats.active

            }

          />



          <StatCard

            icon={

              <FiCheckCircle />

            }

            label="Completed"

            value={

              stats.completed

            }

          />

        </div>



        {/* ================================================

            FILTER

        ================================================ */}



        <div

          className="

            mt-6



            flex

            gap-2



            overflow-x-auto



            pb-2



            [scrollbar-width:none]



            [&::-webkit-scrollbar]:hidden

          "

        >

          {[

            [

              "all",

              "All",

            ],

            [

              "pending",

              "Pending",

            ],

            [

              "processing",

              "Processing",

            ],

            [

              "completed",

              "Completed",

            ],

            [

              "cancelled",

              "Cancelled",

            ],

            [

              "returned",

              "Returned",

            ],

          ].map(

            ([

              value,

              label,

            ]) => (

              <button

                key={

                  value

                }

                type="button"

                onClick={() =>

                  setFilter(

                    value

                  )

                }

                className={`

                  min-h-[42px]

                  shrink-0



                  rounded-full



                  border



                  px-4



                  text-xs

                  font-bold



                  transition-all



                  ${

                    filter ===

                    value

                      ? `

                        border-[#6C5CE7]

                        bg-[#6C5CE7]

                        text-white

                        shadow-[0_7px_18px_rgba(108,92,231,0.18)]

                      `

                      : `

                        border-[#E6E0EB]

                        bg-white

                        text-[#6E6772]



                        hover:border-[#CFC2F3]

                        hover:text-[#6C5CE7]

                      `

                  }

                `}

              >

                {

                  label

                }

              </button>

            )

          )}

        </div>



        {/* ================================================

            ORDERS

        ================================================ */}



        <section className="mt-5">

          {filteredOrders.length ===

          0 ? (

            <div

              className="

                rounded-[28px]



                border

                border-dashed

                border-[#DCD4E8]



                bg-white



                px-5

                py-14



                text-center



                shadow-[0_18px_55px_rgba(62,48,85,0.04)]

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



                  rounded-2xl



                  bg-[#F1ECFF]



                  text-2xl

                  text-[#6C5CE7]

                "

              >

                <FiPackage />

              </div>



              <h2

                className="

                  mt-5



                  text-xl

                  font-extrabold



                  text-[#342F38]

                "

              >

                {orders.length ===

                0

                  ? "No Velmora orders yet"

                  : "No orders match this filter"}

              </h2>



              <p

                className="

                  mx-auto

                  mt-2



                  max-w-md



                  text-sm

                  leading-6



                  text-[#85808A]

                "

              >

                {orders.length ===

                0

                  ? "When you place an order, its details and status will appear here."

                  : "Choose another status to explore your order history."}

              </p>



              {orders.length ===

                0 && (

                <button

                  type="button"

                  onClick={() =>

                    navigate(

                      "/products"

                    )

                  }

                  className="

                    mt-6



                    min-h-[48px]



                    rounded-xl



                    bg-gradient-to-r

                    from-[#6C5CE7]

                    to-[#8E7AF0]



                    px-6



                    text-sm

                    font-bold

                    text-white



                    shadow-[0_10px_24px_rgba(108,92,231,0.20)]

                  "

                >

                  Explore

                  Velmora

                </button>

              )}

            </div>

          ) : (

            <div className="space-y-4">

              {filteredOrders.map(

                (

                  order,

                  index

                ) => {

                  const status =

                    statusStyle(

                      order.status

                    );



                  const products =

                    Array.isArray(

                      order.products

                    )

                      ? order.products

                      : [];



                  const payment =

                    paymentStatusStyle(

                      order.paymentStatus

                    );



                  const paymentMethodLabel =

                    getPaymentMethodLabel(

                      order.paymentMethod

                    );



                  return (

                    <article

                      key={

                        order._id ||

                        order.orderId ||

                        index

                      }

                      className="

                        overflow-hidden



                        rounded-[24px]



                        border

                        border-[#E9E3F0]



                        bg-white



                        shadow-[0_15px_45px_rgba(59,44,82,0.055)]



                        transition-all

                        duration-300



                        hover:-translate-y-0.5

                        hover:border-[#D8CDF4]

                        hover:shadow-[0_20px_55px_rgba(65,48,92,0.08)]

                      "

                    >

                      {/* HEADER */}



                      <div

                        className="

                          flex

                          flex-col

                          gap-4



                          border-b

                          border-[#F0EBF4]



                          bg-gradient-to-r

                          from-[#FCFAFF]

                          to-[#FFF9FB]



                          p-4



                          sm:flex-row

                          sm:items-center

                          sm:justify-between



                          sm:p-5

                        "

                      >

                        <div>

                          <p

                            className="

                              text-[9px]

                              font-black

                              uppercase

                              tracking-[0.16em]



                              text-[#9A79E8]

                            "

                          >

                            Order

                          </p>



                          <h3

                            className="

                              mt-1



                              text-base

                              font-extrabold



                              text-[#36313A]



                              sm:text-lg

                            "

                          >

                            #

                            {order.orderId ||

                              "Velmora Order"}

                          </h3>



                          <p

                            className="

                              mt-1



                              text-xs

                              text-[#99929D]

                            "

                          >

                            {formatDate(

                              order.createdAt ||

                                order.date

                            )}

                          </p>

                        </div>



                        <span

                          className={`

                            inline-flex

                            w-fit

                            items-center



                            rounded-full



                            border



                            px-3

                            py-1.5



                            text-[10px]

                            font-black

                            uppercase

                            tracking-[0.08em]



                            ${status.className}

                          `}

                        >

                          {

                            status.label

                          }

                        </span>

                      </div>



                      {/* BODY */}



                      <div className="p-4 sm:p-5">

                        <div

                          className="

                            grid

                            grid-cols-1

                            gap-5



                            md:grid-cols-[1fr_auto]

                            md:items-end

                          "

                        >

                          <div>

                            <p

                              className="

                                text-xs

                                font-bold



                                text-[#6F6874]

                              "

                            >

                              {

                                products.length

                              }{" "}

                              {products.length ===

                              1

                                ? "Product"

                                : "Products"}

                            </p>



                            {/* PRODUCT PREVIEW */}



                            <div

                              className="

                                mt-3



                                flex

                                gap-2



                                overflow-x-auto



                                pb-1



                                [scrollbar-width:none]



                                [&::-webkit-scrollbar]:hidden

                              "

                            >

                              {products

                                .slice(

                                  0,

                                  4

                                )

                                .map(

                                  (

                                    item,

                                    productIndex

                                  ) => {

                                    const image =

                                      item.productInfo

                                        ?.images?.[0] ||

                                      item.productInfo

                                        ?.image ||

                                      item.image;



                                    const name =

                                      item.productInfo

                                        ?.name ||

                                      item.name ||

                                      "Velmora Product";



                                    return (

                                      <div

                                        key={

                                          productIndex

                                        }

                                        className="

                                          flex

                                          h-[68px]

                                          w-[68px]

                                          shrink-0

                                          items-center

                                          justify-center



                                          overflow-hidden



                                          rounded-xl



                                          border

                                          border-[#EBE5F0]



                                          bg-[#FAF8FC]

                                        "

                                        title={

                                          name

                                        }

                                      >

                                        {image ? (

                                          <img

                                            src={

                                              image

                                            }

                                            alt={

                                              name

                                            }

                                            className="

                                              h-full

                                              w-full

                                              object-cover

                                            "

                                          />

                                        ) : (

                                          <FiPackage

                                            className="

                                              text-xl

                                              text-[#A494D8]

                                            "

                                          />

                                        )}

                                      </div>

                                    );

                                  }

                                )}



                              {products.length >

                                4 && (

                                <div

                                  className="

                                    flex

                                    h-[68px]

                                    w-[68px]

                                    shrink-0

                                    items-center

                                    justify-center



                                    rounded-xl



                                    bg-[#F1ECFF]



                                    text-xs

                                    font-bold

                                    text-[#6C5CE7]

                                  "

                                >

                                  +

                                  {products.length -

                                    4}

                                </div>

                              )}

                            </div>

                          </div>



                          {/* PAYMENT INFO */}

                          <div
                            className="
                              mt-4
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                inline-flex
                                min-h-[34px]
                                items-center
                                gap-2

                                rounded-full

                                border
                                border-[#E4DDF0]

                                bg-[#FAF8FF]

                                px-3
                                py-1.5

                                text-[10px]
                                font-bold
                                text-[#625B69]

                                sm:text-xs
                              "
                            >
                              <FiCreditCard
                                className="
                                  shrink-0
                                  text-[#6C5CE7]
                                "
                              />

                              {paymentMethodLabel}
                            </span>

                            <span
                              className={`
                                inline-flex
                                min-h-[34px]
                                items-center

                                rounded-full

                                border

                                px-3
                                py-1.5

                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.08em]

                                sm:text-xs

                                ${payment.className}
                              `}
                            >
                              {payment.label}
                            </span>
                          </div>



                          <div

                            className="

                              flex

                              items-end

                              justify-between

                              gap-5



                              border-t

                              border-[#F0EBF4]



                              pt-4



                              md:block

                              md:border-0

                              md:pt-0

                              md:text-right

                            "

                          >

                            <div>

                              <p

                                className="

                                  text-[9px]

                                  font-bold

                                  uppercase

                                  tracking-[0.12em]



                                  text-[#A39CA7]

                                "

                              >

                                Order

                                Total

                              </p>



                              <p

                                className="

                                  mt-1



                                  text-xl

                                  font-extrabold



                                  text-[#6C5CE7]

                                "

                              >

                                Rs.{" "}

                                {getOrderTotal(

                                  order

                                ).toLocaleString(

                                  "en-LK",

                                  {

                                    minimumFractionDigits:

                                      2,

                                    maximumFractionDigits:

                                      2,

                                  }

                                )}

                              </p>

                            </div>



                            <button

                              type="button"

                              onClick={() =>

                                setSelectedOrder(

                                  order

                                )

                              }

                              className="

                                mt-3



                                min-h-[42px]



                                rounded-xl



                                border

                                border-[#DCD3EE]



                                bg-white



                                px-4



                                text-xs

                                font-bold

                                text-[#6C5CE7]



                                transition-all



                                hover:border-[#6C5CE7]

                                hover:bg-[#F5F1FF]

                              "

                            >

                              View

                              Details

                            </button>

                          </div>

                        </div>

                      </div>

                    </article>

                  );

                }

              )}

            </div>

          )}

        </section>

      </div>



      {/* ================================================

          ORDER DETAIL MODAL

      ================================================ */}



      {selectedOrder && (

        <OrderModal

          order={

            selectedOrder

          }

          onClose={() =>

            setSelectedOrder(

              null

            )

          }

          statusStyle={

            statusStyle

          }

          normalizeStatus={

            normalizeStatus

          }

          getOrderTotal={

            getOrderTotal

          }

          formatDate={

            formatDate

          }

        />

      )}

    </main>

  );

}



/* =========================================================

   STAT CARD

========================================================= */



function StatCard({

  icon,

  label,

  value,

}) {

  return (

    <div

      className="

        flex

        items-center

        gap-4



        rounded-[20px]



        border

        border-[#EAE4F0]



        bg-white



        p-4



        shadow-[0_10px_35px_rgba(60,45,80,0.04)]

      "

    >

      <div

        className="

          flex

          h-11

          w-11

          shrink-0

          items-center

          justify-center



          rounded-xl



          bg-[#F1ECFF]



          text-[#6C5CE7]

        "

      >

        {icon}

      </div>



      <div>

        <p

          className="

            text-2xl

            font-extrabold



            text-[#342F38]

          "

        >

          {value}

        </p>



        <p

          className="

            text-xs

            font-medium

            text-[#8E8793]

          "

        >

          {label}

        </p>

      </div>

    </div>

  );

}



/* =========================================================

   ORDER DETAILS MODAL

========================================================= */



function OrderModal({

  order,

  onClose,

  statusStyle,

  getOrderTotal,

  formatDate,

}) {

  const status =

    statusStyle(

      order.status

    );



  const products =

    Array.isArray(

      order.products

    )

      ? order.products

      : [];



  const payment =
    paymentStatusStyle(
      order.paymentStatus
    );



  const paymentMethodLabel =
    getPaymentMethodLabel(
      order.paymentMethod
    );



  return (

    <div

      className="

        fixed

        inset-0

        z-[100]



        flex

        items-end

        justify-center



        bg-[#211C28]/55



        p-0



        backdrop-blur-sm



        sm:items-center

        sm:p-4

      "

      onMouseDown={(

        event

      ) => {

        if (

          event.target ===

          event.currentTarget

        ) {

          onClose();

        }

      }}

    >

      <div

        className="

          max-h-[92dvh]

          w-full



          overflow-hidden



          rounded-t-[28px]



          bg-white



          shadow-[0_30px_90px_rgba(28,22,35,0.25)]



          sm:max-w-[720px]

          sm:rounded-[28px]

        "

      >

        {/* HEADER */}



        <div

          className="

            flex

            items-start

            justify-between

            gap-4



            border-b

            border-[#EEE8F2]



            bg-gradient-to-br

            from-[#F8F5FF]

            to-[#FFF8FA]



            p-5



            sm:p-6

          "

        >

          <div>

            <p

              className="

                text-[9px]

                font-black

                uppercase

                tracking-[0.18em]



                text-[#9A79E8]

              "

            >

              Velmora Order

            </p>



            <h2

              className="

                mt-1



                text-xl

                font-extrabold

                text-[#302B34]



                sm:text-2xl

              "

            >

              #

              {order.orderId ||

                "Order Details"}

            </h2>



            <p

              className="

                mt-1

                text-xs

                text-[#948D99]

              "

            >

              {formatDate(

                order.createdAt ||

                  order.date

              )}

            </p>

          </div>



          <button

            type="button"

            onClick={

              onClose

            }

            className="

              flex

              h-10

              w-10

              shrink-0

              items-center

              justify-center



              rounded-xl



              border

              border-[#E6DFEB]



              bg-white



              text-[#77707B]



              transition-all



              hover:border-[#E6C6CF]

              hover:bg-[#FFF3F6]

              hover:text-[#B45462]

            "

          >

            <FiX />

          </button>

        </div>



        {/* CONTENT */}



        <div

          className="

            max-h-[calc(92dvh-110px)]



            overflow-y-auto



            p-5



            sm:p-6

          "

        >

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

              className={`

                rounded-full

                border

                px-3

                py-1.5

                text-[10px]

                font-black

                uppercase

                tracking-[0.08em]



                ${status.className}

              `}

            >

              {

                status.label

              }

            </span>



            <p

              className="

                text-lg

                font-extrabold

                text-[#6C5CE7]

              "

            >

              Rs.{" "}

              {getOrderTotal(

                order

              ).toLocaleString(

                "en-LK",

                {

                  minimumFractionDigits:

                    2,

                  maximumFractionDigits:

                    2,

                }

              )}

            </p>

          </div>



          {/* DELIVERY */}



          <div

            className="

              mt-6



              grid

              grid-cols-1

              gap-3



              sm:grid-cols-2

            "

          >

            <DetailCard

              icon={

                <FiPhone />

              }

              label="Phone"

              value={

                order.phone ||

                "Not provided"

              }

            />



            <DetailCard

              icon={

                <FiMapPin />

              }

              label="Delivery Address"

              value={

                order.address ||

                "Not provided"

              }

            />

          </div>



          {/* PAYMENT */}

          <div
            className="
              mt-4

              grid
              grid-cols-1
              gap-3

              sm:grid-cols-2
            "
          >
            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-[#EEE8F3]

                bg-[#FCFBFD]

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

                  bg-[#F1ECFF]

                  text-[#6C5CE7]
                "
              >
                <FiCreditCard />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    text-[#A099A4]
                  "
                >
                  Payment Method
                </p>

                <p
                  className="
                    mt-1

                    text-sm
                    font-semibold
                    leading-5

                    text-[#4D4652]
                  "
                >
                  {paymentMethodLabel}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-[#EEE8F3]

                bg-[#FCFBFD]

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

                  bg-[#F1ECFF]

                  text-[#6C5CE7]
                "
              >
                <FiCheckCircle />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    text-[#A099A4]
                  "
                >
                  Payment Status
                </p>

                <span
                  className={`
                    mt-2
                    inline-flex

                    rounded-full

                    border

                    px-3
                    py-1

                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.08em]

                    ${payment.className}
                  `}
                >
                  {payment.label}
                </span>
              </div>
            </div>
          </div>



          {/* PRODUCTS */}



          <div

            className="

              mt-7



              border-t

              border-[#EEE9F1]



              pt-6

            "

          >

            <p

              className="

                text-[10px]

                font-black

                uppercase

                tracking-[0.16em]



                text-[#9A79E8]

              "

            >

              Products

            </p>



            <div

              className="

                mt-4

                space-y-3

              "

            >

              {products.map(

                (

                  item,

                  index

                ) => {

                  const name =

                    item.productInfo

                      ?.name ||

                    item.name ||

                    "Velmora Product";



                  const image =

                    item.productInfo

                      ?.images?.[0] ||

                    item.productInfo

                      ?.image ||

                    item.image;



                  const quantity =

                    Number(

                      item.quantity

                    ) || 1;



                  return (

                    <div

                      key={

                        index

                      }

                      className="

                        flex

                        items-center

                        gap-3



                        rounded-2xl



                        border

                        border-[#EEE8F3]



                        bg-[#FCFBFD]



                        p-3

                      "

                    >

                      <div

                        className="

                          flex

                          h-16

                          w-16

                          shrink-0

                          items-center

                          justify-center



                          overflow-hidden



                          rounded-xl



                          bg-[#F3EEFF]

                        "

                      >

                        {image ? (

                          <img

                            src={

                              image

                            }

                            alt={

                              name

                            }

                            className="

                              h-full

                              w-full

                              object-cover

                            "

                          />

                        ) : (

                          <FiPackage

                            className="

                              text-xl

                              text-[#927CE4]

                            "

                          />

                        )}

                      </div>



                      <div className="min-w-0">

                        <p

                          className="

                            font-bold

                            text-[#423C47]

                          "

                        >

                          {

                            name

                          }

                        </p>



                        <p

                          className="

                            mt-1

                            text-xs

                            text-[#938C98]

                          "

                        >

                          Qty:{" "}

                          {

                            quantity

                          }

                        </p>

                      </div>

                    </div>

                  );

                }

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}



function DetailCard({

  icon,

  label,

  value,

}) {

  return (

    <div

      className="

        flex

        items-start

        gap-3



        rounded-2xl



        border

        border-[#EEE8F3]



        bg-[#FCFBFD]



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



          bg-[#F1ECFF]



          text-[#6C5CE7]

        "

      >

        {icon}

      </div>



      <div className="min-w-0">

        <p

          className="

            text-[9px]

            font-black

            uppercase

            tracking-[0.12em]



            text-[#A099A4]

          "

        >

          {label}

        </p>



        <p

          className="

            mt-1



            break-words



            text-sm

            font-semibold

            leading-5



            text-[#4D4652]

          "

        >

          {value}

        </p>

      </div>

    </div>

  );

}