
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {
    const navigate=useNavigate()
  const location=useLocation();
  const product=location.state;

   


  console.log(location)
  const [productId, setProductId] = useState(product.productId);
  const [name, setName] = useState(product.productName);
  const [altNames, setAltNames] = useState(product.alternativeName?.join(",")|| " ");
  const [description, setDescription] = useState(product.description);

  const [images, setImages] = useState([]  );
 
  const [labelPrice, setLabelPrice] = useState(product.labelPrice);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);




  async function editProduct() {

    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("please login first");
      return;

    }

   let imageUrls=product.images;

    const promisesArray = [];

    for (let i = 0; i < images.length; i++) {
      promisesArray[i] = MediaUpload(images[i])

    }
    try {
      if(images.length>0){
        imageUrls = await Promise.all(promisesArray);


      }

      
     


      const alternativeNames = altNames.split(",");

      const product = {
        productId: productId,
        productName: name,
        alternativeName: alternativeNames,
        description: description,
        images: imageUrls,
        labelPrice: labelPrice,
        price: price,
        stock: stock,

      }

     const res = await axios.put(
    import.meta.env.VITE_BACKEND_URL + "/api/product"+productId,
    product,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  console.log("Product saved:", res.data);

  toast.success("Product update successfully!");

 
  setProductId("");
  setName("");
  setAltNames("");
  setDescription("");
  setImages([]);
  setLabelPrice(0);
  setPrice(0);
  setStock(0);

  navigate("/admin/products");



    }


    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="w-full min-h-full bg-gray-100 flex justify-center items-start py-10 px-4 overflow-y-auto">

      {/* Form Container */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="mb-8 border-b pb-5">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Product
          </h1>

          <p className="text-gray-500 mt-2">
            Enter the product details below
          </p>
        </div>


        {/* Product ID + Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Product ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product ID
            </label>

            <input
              type="text"
              placeholder="e.g. P001"
              value={productId} disabled
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-green-500
              focus:border-green-500 transition"
            />
          </div>


          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-green-500
              focus:border-green-500 transition"
            />
          </div>

        </div>


        {/* Alternative Names */}
        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alternative Names
          </label>

          <input
            type="text"
            placeholder="e.g. iPhone, Apple Phone"
            value={altNames}
            onChange={(e) => setAltNames(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
            outline-none focus:ring-2 focus:ring-green-500
            focus:border-green-500 transition"
          />

        </div>


        {/* Description */}
        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            rows="4"
            placeholder="Enter product description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
            outline-none resize-none
            focus:ring-2 focus:ring-green-500
            focus:border-green-500 transition"
          />

        </div>


        {/* Images */}
        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
            bg-gray-50 cursor-pointer
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-green-600 file:text-white
            hover:file:bg-green-700"
          />

          <p className="text-xs text-gray-500 mt-2">
            You can select multiple images.
          </p>

        </div>


        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {/* Label Price */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Label Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={labelPrice}
              onChange={(e) => setLabelPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-green-500
              focus:border-green-500 transition"
            />

          </div>


          {/* Selling Price */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selling Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-green-500
              focus:border-green-500 transition"
            />

          </div>

        </div>


        {/* Stock */}
        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stock Quantity
          </label>

          <input
            type="number"
            min="0"
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
            outline-none focus:ring-2 focus:ring-green-500
            focus:border-green-500 transition"
          />

        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">

          <Link to="/admin/products"
            type="button"
            className="px-6 py-3 rounded-lg
            border border-gray-300 text-gray-700
            font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </Link>

          <button onClick={editProduct}
            type="button"
            className="px-7 py-3 rounded-lg
            bg-green-600 text-white font-semibold
            hover:bg-green-700
            shadow-md hover:shadow-lg
            transition duration-200 "
          >
            Edit Product
          </button>

        </div>

      </div>

    </div>
  );
}