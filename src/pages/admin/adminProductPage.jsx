import { useEffect, useState } from "react";
  

import { Link } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminProductPage() {

  const [products, setProducts] = useState([]);
const [isLoading,setIsLoading]=useState(true);

  const navigate=useNavigate();


  useEffect(() => {
    if(isLoading){
 axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setIsLoading(false);

      })
      .catch((error) => {  
        console.log(error);
      });  


    }
   
  }, [isLoading]);


  function deleteProducts(productId){
    const token=localStorage.getItem("token");
    if(token==null){
      toast.error("please login first !");
      return;

    }
    axios.delete(import.meta.env.VITE_BACKEND_URL+"/api/product/"+productId,{
      headers:{
        "Authorization":"Bearer "+token
      }
    
  }).then(()=>{
    toast.success("Product delete successfully !");
   setIsLoading(true);


  }).catch((e)=>{
    toast.error(e.response.data.message);

  })

}

  return (
    <div className="w-full h-full max-h-full overflow-y-auto bg-gray-50 p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your products
        </p>
      </div>


      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
{ isLoading ? <div className="w-full h-full flex justify-center items-center">
<div className="w-[50px] h-[60px] border-[5px] border-gray-400 border-t-blue-300 rounded-full animate-spin">
  </div>

</div>
:
          <table className="w-full text-sm text-left">

            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Product ID
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Product Name
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Product Image
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Label Price
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Price
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Stock
                </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                  
                  Actions
                </th>
                

              </tr>
            </thead>


            <tbody className="divide-y divide-gray-200">

              {products.map((product) => (

                <tr
                  key={product.productId}
                  className="hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {product.productId}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {product.productName}
                  </td>

                  <td className="px-6 py-4">
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  </td>

                  <td className="px-6 py-4 text-gray-500 line-through">
                    Rs. {product.labelPrice}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    Rs. {product.price}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        product.stock > 0
                          ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                          : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} Available`
                        : "Out of Stock"}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center items-center w-full">
                    <FaTrash  onClick={()=>{deleteProducts(product.productId)}}  className="text-[20px] text-red-600  mx-6px"/> <MdEditDocument onClick={()=>{
                      navigate("/admin/edit-product",{state:product})
                    }}className="text-[20px] text-blue-600  mx-5px"  />
                    </div>


                  </td>

                </tr>

              ))}

            </tbody>

          </table>
}

        </div>


        {/* Add Product Button - Bottom */}
        <div className="flex justify-end p-5 border-t border-gray-200">

          <Link to="/admin/add-product"
            className="
              bg-green-500
              hover:bg-green-600
              text-white
              font-semibold
              px-5
              py-2.5
              rounded-lg
              shadow-sm
              transition
              duration-200
            "
          >
            + Add Product
          </Link>

        </div>

      </div>

    </div>
  );
}
