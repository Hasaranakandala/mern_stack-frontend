import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import Modal from "react-modal";

import jsPDF from "jspdf";

Modal.setAppElement("#root");

export default function AdminOrderPage() {

  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const customStyles = {

    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      zIndex: 9999
    },

    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",

      width: "90%",
      maxWidth: "650px",
      maxHeight: "85vh",
      overflowY: "auto",

      borderRadius: "18px",
      padding: "28px",
      border: "none",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
    }
  };

  function generatePDF() {
  if (!selectedOrder) return;

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Order Invoice", 20, 20);

  doc.setFontSize(12);

  doc.text(`Order ID: ${selectedOrder.orderId}`, 20, 40);
  doc.text(`Customer: ${selectedOrder.name}`, 20, 50);
  doc.text(`Email: ${selectedOrder.email}`, 20, 60);
  doc.text(`Phone: ${selectedOrder.phone}`, 20, 70);
  doc.text(`Address: ${selectedOrder.address}`, 20, 80);

  doc.text(
    `Date: ${
      selectedOrder.date
        ? new Date(selectedOrder.date).toLocaleString()
        : "No date"
    }`,
    20,
    90
  );

  doc.text(
    `Status: ${selectedOrder.status}`,
    20,
    100
  );

  doc.text(
    `Total: Rs. ${Number(selectedOrder.total).toFixed(2)}`,
    20,
    110
  );

  doc.setFontSize(14);
  doc.text("Products", 20, 130);

  let y = 145;

  selectedOrder.products?.forEach((product, index) => {

    const name =
      product.productInfo?.name || "Product";

    const quantity =
      product.quantity || 0;

    const price =
      Number(product.productInfo?.price || 0);

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
      `Rs. ${(price * quantity).toFixed(2)}`,
      145,
      y
    );

    y += 10;
  });

  doc.save(`${selectedOrder.orderId}.pdf`);
}


  useEffect(() => {

    if (isLoading) {

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then((res) => {

          setOrder(res.data);
          setIsLoading(false);

          console.log(res.data);

        })
        .catch((e) => {

          console.log(
            "GET ORDER ERROR:",
            JSON.stringify(e.response?.data, null, 2)
          );

          toast.error(
            e.response?.data?.errorMessage ||
            e.response?.data?.message ||
            "Unknown Error"
          );

          setIsLoading(false);
        });
    }

  }, []);


  function openOrderModal(item) {

    console.log("CLICKED ORDER:", item);

    setSelectedOrder(item);
    setIsModalOpen(true);
  }


  function closeOrderModal() {

    setIsModalOpen(false);
    setSelectedOrder(null);
  }


  return (

    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-8">


      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeOrderModal}
        style={customStyles}
        contentLabel="Order Details"
        shouldCloseOnOverlayClick={true}
      >

        {selectedOrder && (

          <div>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-[#393E46]">
                  Order Details
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {selectedOrder.orderId}
                </p>

              </div>


              <button
                onClick={closeOrderModal}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-600
                  font-bold
                  cursor-pointer
                  transition
                "
              >
                ✕
              </button>

            </div>


            {/* Order Info */}
            <div className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <p className="text-xs text-gray-400 mb-1">
                    Customer
                  </p>

                  <p className="font-semibold text-[#393E46]">
                    {selectedOrder.name}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-400 mb-1">
                    Phone
                  </p>

                  <p className="text-gray-600">
                    {selectedOrder.phone}
                  </p>

                </div>

              </div>


              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Email
                </p>

                <p className="text-gray-600">
                  {selectedOrder.email}
                </p>

              </div>


              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Address
                </p>

                <p className="text-gray-600">
                  {selectedOrder.address}
                </p>

              </div>


              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Date
                </p>

                <p className="text-gray-600">

                  {selectedOrder.date
                    ? new Date(selectedOrder.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "No date"}

                </p>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <p className="text-xs text-gray-400 mb-1">
                    Total
                  </p>

                  <p className="font-bold text-[#393E46]">
                    Rs. {Number(selectedOrder.total).toFixed(2)}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-400 mb-1">
                    Status
                  </p>

                  <span
                    className={`
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      capitalize

                      ${
                        selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedOrder.status === "returened"
                          ? "bg-blue-100 text-blue-700"
                          : selectedOrder.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {selectedOrder.status}
                  </span>
                  <select onClick={async(e)=>{
  const updatedValue=e.target.value;
                    if (!updatedValue) {
  toast.error("Please select a status");
  return;
}

                    try{

                    

                      const token=localStorage.getItem("token");
                      await axios.put(import.meta.env.VITE_BACKEND_URL+"/api/order/"+selectedOrder.orderId+"/"+updatedValue,{

                      },{
                        headers:{Authorization:"Bearer "+token}                      });
                        setIsLoading(true);
                        const updatedOrder={...selectedOrder};
                        updatedOrder.status=updatedValue;
                        setSelectedOrder(updatedOrder)


                          toast.success("Order status updated successfully");

                    }catch(e){
toast.error("Error updating order status");
console.log(e);

                    }
                    ;
                  }}>
                   <option selected disabled>Change Status</option>
<option value="pending">pending</option>
<option value="completed">completed</option>
<option value="cancelled">cancelled</option>
<option value="returned">returened</option>


                  </select>

                </div>
               


              </div>


              {/* Products */}
              <div>

                <h3 className="text-lg font-bold text-[#393E46] mb-3">
                  Products
                </h3>

                <div className="space-y-3">

                  {selectedOrder.products?.map((product, index) => (

                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        p-4
                        bg-gray-50
                        rounded-xl
                      "
                    >

                      <div>

                        <p className="font-semibold text-[#393E46]">
                          {product.productInfo?.name || "Product"}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Qty: {product.quantity}
                        </p>

                      </div>


                      <div className="text-right">

                        <p className="font-semibold text-[#393E46]">
                          Rs. {Number(
                            product.productInfo?.price || 0
                          ).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400">
                          Each
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

            <button
  onClick={() => window.print()}
  className="
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
    active:scale-95
    transition-all
    duration-200
    cursor-pointer
  "
>
  Print
</button>

<button
  onClick={generatePDF}
  className="
    bg-[#393E46]
    text-white
    px-5
    py-2.5
    rounded-xl
    font-semibold
    hover:bg-[#222831]
    transition
  "
>
  Download PDF
</button>
</div>

          </div>

         

        )}

      </Modal>


      {/* Page Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#393E46]">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage and view all customer orders
        </p>

      </div>


      {isLoading ? (

        <Loading />

      ) : (

        <div
          className="
            bg-white
            rounded-2xl
            shadow-md
            border
            border-gray-100
            overflow-hidden
          "
        >

          {/* Top Section */}
          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-lg font-bold text-[#393E46]">
              All Orders
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Total {order.length} orders
            </p>

          </div>


          {/* Desktop Header */}
          <div
            className="
              hidden
              lg:grid
              grid-cols-[110px_1.1fr_1.5fr_1fr_1.2fr_1fr_110px_100px]
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


          {/* Orders */}
          <div className="divide-y divide-gray-100">

            {order.map((item) => (

              <div
                key={item._id}
                onClick={() => openOrderModal(item)}
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-[110px_1.1fr_1.5fr_1fr_1.2fr_1fr_110px_100px]
                  gap-4
                  px-5
                  py-5
                  items-center
                  hover:bg-[#FAFAFA]
                  transition-colors
                  duration-150
                  cursor-pointer
                "
              >

                {/* Order ID */}
                <div>

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Order ID
                  </span>

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

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Customer
                  </span>

                  <span className="font-semibold text-[#393E46] text-sm">
                    {item.name}
                  </span>

                </div>


                {/* Email */}
                <div className="min-w-0">

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Email
                  </span>

                  <p
                    className="text-sm text-gray-500 truncate"
                    title={item.email}
                  >
                    {item.email}
                  </p>

                </div>


                {/* Phone */}
                <div>

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Phone
                  </span>

                  <span className="text-sm text-gray-600">
                    {item.phone}
                  </span>

                </div>


                {/* Date */}
                <div>

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Date
                  </span>

                  <span className="text-sm text-gray-600">

                    {item.date
                      ? new Date(item.date).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "No date"}

                  </span>

                </div>


                {/* Address */}
                <div className="min-w-0">

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Address
                  </span>

                  <p
                    className="text-sm text-gray-500 truncate"
                    title={item.address}
                  >
                    {item.address}
                  </p>

                </div>


                {/* Total */}
                <div>

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Total
                  </span>

                  <span className="font-bold text-[#393E46] text-sm whitespace-nowrap">
                    Rs. {Number(item.total).toFixed(2)}
                  </span>

                </div>


                {/* Status */}
                <div>

                  <span className="lg:hidden text-xs text-gray-400 block mb-1">
                    Status
                  </span>

                  <span
                    className={`
                      inline-flex
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      capitalize

                      ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {item.status}
                  </span>

                </div>

              </div>

            ))}

          </div>


          {/* Empty */}
          {order.length === 0 && (

            <div className="py-16 text-center">

              <h3 className="text-lg font-semibold text-[#393E46]">
                No orders found
              </h3>

              <p className="text-gray-400 mt-1">
                Customer orders will appear here.
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}