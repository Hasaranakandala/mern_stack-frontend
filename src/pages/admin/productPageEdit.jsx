import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

export default function EditProductPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Product sent from AdminProductPage
  const product = location.state;

  // =====================================================
  // STATES
  // =====================================================

  const [productId] = useState(
    product?.productId || ""
  );

  const [name, setName] = useState(
    product?.productName || ""
  );

  const [altNames, setAltNames] = useState(
    product?.alternativeName?.join(", ") || ""
  );

  const [description, setDescription] = useState(
    product?.description || ""
  );

  // New files selected by admin
  const [images, setImages] = useState([]);

  // New image local previews
  const [newImagePreviews, setNewImagePreviews] =
    useState([]);

  const [labelPrice, setLabelPrice] = useState(
    product?.labelPrice ?? 0
  );

  const [price, setPrice] = useState(
    product?.price ?? 0
  );

  const [stock, setStock] = useState(
    product?.stock ?? 0
  );

  const [isUpdating, setIsUpdating] =
    useState(false);

  // =====================================================
  // HANDLE MISSING PRODUCT STATE
  // =====================================================

  useEffect(() => {
    if (!product) {
      toast.error(
        "Product information not found. Please select a product again."
      );

      navigate("/admin/products", {
        replace: true,
      });
    }
  }, [product, navigate]);

  // =====================================================
  // CREATE PREVIEWS FOR NEW IMAGES
  // =====================================================

  useEffect(() => {
    if (images.length === 0) {
      setNewImagePreviews([]);
      return;
    }

    const previews = images.map((image) =>
      URL.createObjectURL(image)
    );

    setNewImagePreviews(previews);

    return () => {
      previews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
    };
  }, [images]);

  // =====================================================
  // HANDLE IMAGE SELECTION
  // =====================================================

  function handleImageChange(e) {
    const selectedFiles = Array.from(
      e.target.files
    );

    if (selectedFiles.length === 0) {
      return;
    }

    // Maximum 6 images
    if (selectedFiles.length > 6) {
      toast.error(
        "You can select a maximum of 6 images"
      );
      return;
    }

    // Validate type
    const invalidImage = selectedFiles.find(
      (file) =>
        !file.type.startsWith("image/")
    );

    if (invalidImage) {
      toast.error(
        "Please select image files only"
      );
      return;
    }

    // Maximum 5 MB each
    const oversizedImage = selectedFiles.find(
      (file) =>
        file.size >
        5 * 1024 * 1024
    );

    if (oversizedImage) {
      toast.error(
        "Each image must be smaller than 5MB"
      );
      return;
    }

    setImages(selectedFiles);
  }

  // =====================================================
  // REMOVE NEW SELECTED IMAGE
  // =====================================================

  function removeNewImage(index) {
    setImages((previousImages) =>
      previousImages.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  async function editProduct(e) {
    e.preventDefault();

    if (isUpdating) {
      return;
    }

    const token =
      localStorage.getItem("token");

    // ===============================================
    // TOKEN VALIDATION
    // ===============================================

    if (!token) {
      toast.error("Please login first");
      return;
    }

    // ===============================================
    // FORM VALIDATION
    // ===============================================

    if (!productId.trim()) {
      toast.error("Product ID is missing");
      return;
    }

    if (!name.trim()) {
      toast.error(
        "Please enter the product name"
      );
      return;
    }

    if (!description.trim()) {
      toast.error(
        "Please enter a product description"
      );
      return;
    }

    if (Number(labelPrice) < 0) {
      toast.error(
        "Label price cannot be negative"
      );
      return;
    }

    if (Number(price) < 0) {
      toast.error(
        "Selling price cannot be negative"
      );
      return;
    }

    if (Number(stock) < 0) {
      toast.error(
        "Stock cannot be negative"
      );
      return;
    }

    setIsUpdating(true);

    const loadingToast = toast.loading(
      images.length > 0
        ? "Uploading images and updating product..."
        : "Updating product..."
    );

    try {
      // ===============================================
      // KEEP EXISTING IMAGES BY DEFAULT
      // ===============================================

      let imageUrls = product?.images || [];

      // ===============================================
      // IF NEW IMAGES SELECTED, UPLOAD AND REPLACE
      // ===============================================

      if (images.length > 0) {
        const uploadPromises = images.map(
          (image) =>
            MediaUpload(image)
        );

        imageUrls =
          await Promise.all(
            uploadPromises
          );

        console.log(
          "New uploaded images:",
          imageUrls
        );
      }

      // ===============================================
      // CLEAN ALTERNATIVE NAMES
      // ===============================================

      const alternativeNames = altNames
        .split(",")
        .map((item) => item.trim())
        .filter(
          (item) => item !== ""
        );

      // ===============================================
      // UPDATED PRODUCT OBJECT
      // ===============================================

      const updatedProduct = {
        productId: productId.trim(),

        productName: name.trim(),

        alternativeName:
          alternativeNames,

        description:
          description.trim(),

        images: imageUrls,

        labelPrice:
          Number(labelPrice),

        price:
          Number(price),

        stock:
          Number(stock),
      };

      console.log(
        "Updating product:",
        updatedProduct
      );

      // ===============================================
      // UPDATE PRODUCT
      // IMPORTANT: / BEFORE productId
      // ===============================================

      const res = await axios.put(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/product/" +
          productId,

        updatedProduct,

        {
          headers: {
            Authorization:
              "Bearer " +
              token,
          },
        }
      );

      console.log(
        "Product updated:",
        res.data
      );

      toast.dismiss(
        loadingToast
      );

      toast.success(
        "Product updated successfully!"
      );

      navigate(
        "/admin/products"
      );
    } catch (error) {
      console.error(
        "EDIT PRODUCT ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error.response?.data
      );

      toast.dismiss(
        loadingToast
      );

      toast.error(
        error.response?.data
          ?.message ||
          error.response?.data
            ?.errorMessage ||
          "Failed to update product"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div
        className="
          w-full
          min-h-[60vh]

          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
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

              mb-3
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
                d="M12 9v2m0 4h.01"
              />
            </svg>
          </div>

          <p
            className="
              font-semibold
              text-gray-600
            "
          >
            Loading product...
          </p>
        </div>
      </div>
    );
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

        px-3
        sm:px-5
        md:px-8

        py-5
        sm:py-7
        md:py-10

        overflow-x-hidden
      "
    >
      <div
        className="
          w-full
          max-w-4xl

          mx-auto

          animate-[editProductEnter_0.4s_ease-out]
        "
      >
        {/* =================================================
            TOP HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-4

            mb-5
            sm:mb-6
          "
        >
          <div>
            <p
              className="
                text-xs

                uppercase
                tracking-[0.15em]

                font-semibold
                text-gray-400

                mb-1
              "
            >
              Product Management
            </p>

            <h1
              className="
                text-2xl
                sm:text-3xl

                font-bold
                text-[#393E46]
              "
            >
              Edit Product
            </h1>

            <p
              className="
                text-sm
                text-gray-500

                mt-1
              "
            >
              Update product information,
              pricing, stock and images.
            </p>
          </div>

          {/* Back */}

          <Link
            to="/admin/products"
            className="
              group

              w-full
              sm:w-auto

              inline-flex
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

              hover:border-green-500
              hover:text-green-600
              hover:shadow-md

              active:scale-[0.97]

              transition-all
              duration-300
            "
          >
            <svg
              className="
                w-4
                h-4

                transition-transform
                duration-300

                group-hover:-translate-x-1
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Products
          </Link>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={editProduct}
          className="
            w-full

            bg-white

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200

            shadow-sm

            p-4
            sm:p-6
            md:p-8

            transition-shadow
            duration-300

            hover:shadow-md
          "
        >
          {/* =================================================
              FORM HEADER
          ================================================= */}

          <div
            className="
              flex
              items-start

              gap-3

              pb-5
              sm:pb-6

              mb-6

              border-b
              border-gray-100
            "
          >
            <div
              className="
                w-11
                h-11
                sm:w-12
                sm:h-12

                shrink-0

                rounded-xl

                bg-blue-50
                text-blue-600

                flex
                items-center
                justify-center
              "
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>

            <div>
              <h2
                className="
                  text-lg
                  sm:text-xl

                  font-bold
                  text-[#393E46]
                "
              >
                Product Information
              </h2>

              <p
                className="
                  text-xs
                  sm:text-sm

                  text-gray-500

                  mt-1
                "
              >
                Editing product{" "}
                <span
                  className="
                    font-semibold
                    text-gray-700
                  "
                >
                  {productId}
                </span>
              </p>
            </div>
          </div>

          {/* =================================================
              PRODUCT ID + PRODUCT NAME
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-5
            "
          >
            {/* Product ID */}

            <div>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  text-gray-700

                  mb-2
                "
              >
                Product ID
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={
                    productId
                  }
                  disabled
                  className="
                    w-full

                    px-4
                    py-3

                    pr-10

                    rounded-xl

                    border
                    border-gray-200

                    bg-gray-100

                    text-gray-500

                    cursor-not-allowed

                    outline-none
                  "
                />

                <svg
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2

                    w-4
                    h-4

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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4"
                  />
                </svg>
              </div>

              <p
                className="
                  text-xs
                  text-gray-400

                  mt-1.5
                "
              >
                Product ID cannot be changed.
              </p>
            </div>

            {/* Product Name */}

            <div>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  text-gray-700

                  mb-2
                "
              >
                Product Name
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                disabled={
                  isUpdating
                }
                onChange={(e) =>
                  setName(
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

                  outline-none

                  placeholder:text-gray-400

                  focus:ring-2
                  focus:ring-green-500/20
                  focus:border-green-500

                  hover:border-gray-400

                  disabled:bg-gray-100

                  transition-all
                  duration-200
                "
              />
            </div>
          </div>

          {/* =================================================
              ALTERNATIVE NAMES
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                block

                text-sm
                font-semibold
                text-gray-700

                mb-2
              "
            >
              Alternative Names
            </label>

            <input
              type="text"
              placeholder="e.g. Lipstick, Lip Color"
              value={altNames}
              disabled={
                isUpdating
              }
              onChange={(e) =>
                setAltNames(
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

                outline-none

                focus:ring-2
                focus:ring-green-500/20
                focus:border-green-500

                hover:border-gray-400

                disabled:bg-gray-100

                transition-all
              "
            />

            <p
              className="
                text-xs
                text-gray-400

                mt-2
              "
            >
              Separate alternative names
              using commas.
            </p>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="mt-5">
            <div
              className="
                flex
                items-center
                justify-between

                gap-3

                mb-2
              "
            >
              <label
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Description
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                {description.length}/1000
              </span>
            </div>

            <textarea
              rows="5"
              maxLength="1000"
              placeholder="Enter product description..."
              value={
                description
              }
              disabled={
                isUpdating
              }
              onChange={(e) =>
                setDescription(
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

                outline-none
                resize-none

                focus:ring-2
                focus:ring-green-500/20
                focus:border-green-500

                hover:border-gray-400

                disabled:bg-gray-100

                transition-all
              "
            />
          </div>

          {/* =================================================
              EXISTING IMAGES
          ================================================= */}

          {product.images?.length >
            0 && (
            <div className="mt-6">

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row

                  sm:items-center
                  sm:justify-between

                  gap-1

                  mb-3
                "
              >
                <label
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Current Product Images
                </label>

                <span
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {product.images.length}{" "}
                  current image
                  {product.images.length >
                  1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4

                  gap-3
                "
              >
                {product.images.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={
                        image +
                        index
                      }
                      className="
                        group

                        relative

                        aspect-square

                        rounded-xl

                        overflow-hidden

                        bg-gray-100

                        border
                        border-gray-200

                        shadow-sm
                      "
                    >
                      <img
                        src={image}
                        alt={`Current product ${
                          index +
                          1
                        }`}
                        className="
                          w-full
                          h-full

                          object-cover

                          transition-transform
                          duration-500

                          group-hover:scale-105
                        "
                      />

                      {index ===
                        0 && (
                        <span
                          className="
                            absolute
                            bottom-2
                            left-2

                            px-2
                            py-1

                            rounded-md

                            bg-black/60

                            text-white

                            text-[10px]
                            font-semibold
                          "
                        >
                          Main
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

          {/* =================================================
              NEW IMAGES
          ================================================= */}

          <div
            className="
              mt-7
              pt-6

              border-t
              border-gray-100
            "
          >
            <div
              className="
                flex
                flex-col
                sm:flex-row

                sm:items-center
                sm:justify-between

                gap-1

                mb-2
              "
            >
              <label
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Replace Product Images
              </label>

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                {images.length}/6 new images
              </span>
            </div>

            <label
              className={`
                w-full

                min-h-[140px]

                border-2
                border-dashed

                rounded-2xl

                px-5
                py-6

                flex
                flex-col
                items-center
                justify-center

                text-center

                transition-all
                duration-300

                ${
                  isUpdating
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "bg-gray-50 border-gray-300 cursor-pointer hover:bg-green-50/30 hover:border-green-500"
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={
                  isUpdating
                }
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

              <div
                className="
                  w-12
                  h-12

                  rounded-full

                  bg-green-100
                  text-green-600

                  flex
                  items-center
                  justify-center

                  mb-3
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v12m0-12l-4 4m4-4l4 4M5 20h14"
                  />
                </svg>
              </div>

              <p
                className="
                  text-sm
                  sm:text-base

                  font-semibold
                  text-gray-700
                "
              >
                Select new product images
              </p>

              <p
                className="
                  text-xs
                  text-gray-400

                  mt-1
                "
              >
                Leave this empty to keep
                the current images.
              </p>

              <p
                className="
                  text-xs
                  text-gray-400

                  mt-1
                "
              >
                Maximum 6 images • 5MB each
              </p>
            </label>
          </div>

          {/* =================================================
              NEW IMAGE PREVIEW
          ================================================= */}

          {newImagePreviews.length >
            0 && (
            <div className="mt-5">

              <div
                className="
                  flex
                  items-center
                  justify-between

                  mb-3
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  New Image Preview
                </p>

                <span
                  className="
                    text-xs
                    font-semibold
                    text-orange-500
                  "
                >
                  These will replace current images
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4

                  gap-3
                "
              >
                {newImagePreviews.map(
                  (
                    preview,
                    index
                  ) => (
                    <div
                      key={
                        preview
                      }
                      className="
                        group

                        relative

                        aspect-square

                        overflow-hidden

                        rounded-xl

                        border
                        border-green-200

                        bg-gray-100

                        shadow-sm

                        transition-all

                        hover:-translate-y-1
                        hover:shadow-md
                      "
                    >
                      <img
                        src={
                          preview
                        }
                        alt={`New preview ${
                          index +
                          1
                        }`}
                        className="
                          w-full
                          h-full

                          object-cover

                          transition-transform
                          duration-500

                          group-hover:scale-105
                        "
                      />

                      {index ===
                        0 && (
                        <span
                          className="
                            absolute
                            bottom-2
                            left-2

                            px-2
                            py-1

                            bg-green-600
                            text-white

                            rounded-md

                            text-[10px]
                            font-semibold
                          "
                        >
                          New Main
                        </span>
                      )}

                      {!isUpdating && (
                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          className="
                            absolute
                            top-2
                            right-2

                            w-8
                            h-8

                            rounded-full

                            bg-white/90
                            text-red-500

                            shadow-md

                            flex
                            items-center
                            justify-center

                            sm:opacity-0

                            sm:group-hover:opacity-100

                            hover:bg-red-500
                            hover:text-white

                            active:scale-90

                            transition-all
                          "
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

          {/* =================================================
              PRICING AND STOCK
          ================================================= */}

          <div
            className="
              mt-7
              pt-6

              border-t
              border-gray-100
            "
          >
            <div className="mb-5">

              <h3
                className="
                  text-base
                  sm:text-lg

                  font-bold
                  text-[#393E46]
                "
              >
                Pricing & Inventory
              </h3>

              <p
                className="
                  text-xs
                  sm:text-sm

                  text-gray-400

                  mt-1
                "
              >
                Update pricing and current
                stock availability.
              </p>

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-5
              "
            >
              {/* Label Price */}

              <div>
                <label
                  className="
                    block

                    text-sm
                    font-semibold
                    text-gray-700

                    mb-2
                  "
                >
                  Label Price
                </label>

                <div className="relative">

                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2

                      text-sm
                      text-gray-400
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      labelPrice
                    }
                    disabled={
                      isUpdating
                    }
                    onChange={(e) =>
                      setLabelPrice(
                        e.target
                          .value
                      )
                    }
                    className="
                      w-full

                      pl-12
                      pr-4
                      py-3

                      rounded-xl

                      border
                      border-gray-300

                      outline-none

                      focus:ring-2
                      focus:ring-green-500/20
                      focus:border-green-500

                      disabled:bg-gray-100

                      transition-all
                    "
                  />
                </div>
              </div>

              {/* Selling Price */}

              <div>
                <label
                  className="
                    block

                    text-sm
                    font-semibold
                    text-gray-700

                    mb-2
                  "
                >
                  Selling Price
                </label>

                <div className="relative">

                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2

                      text-sm
                      text-gray-400
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    disabled={
                      isUpdating
                    }
                    onChange={(e) =>
                      setPrice(
                        e.target
                          .value
                      )
                    }
                    className="
                      w-full

                      pl-12
                      pr-4
                      py-3

                      rounded-xl

                      border
                      border-gray-300

                      outline-none

                      focus:ring-2
                      focus:ring-green-500/20
                      focus:border-green-500

                      disabled:bg-gray-100

                      transition-all
                    "
                  />
                </div>
              </div>
            </div>

            {/* Stock */}

            <div className="mt-5">

              <label
                className="
                  block

                  text-sm
                  font-semibold
                  text-gray-700

                  mb-2
                "
              >
                Stock Quantity
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                disabled={
                  isUpdating
                }
                onChange={(e) =>
                  setStock(
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

                  outline-none

                  focus:ring-2
                  focus:ring-green-500/20
                  focus:border-green-500

                  disabled:bg-gray-100

                  transition-all
                "
              />

              {/* Stock status */}

              <div className="mt-2">

                {Number(stock) ===
                0 ? (
                  <span
                    className="
                      inline-flex

                      px-2.5
                      py-1

                      rounded-full

                      bg-red-100
                      text-red-700

                      text-xs
                      font-semibold
                    "
                  >
                    Out of Stock
                  </span>
                ) : Number(
                    stock
                  ) <= 5 ? (
                  <span
                    className="
                      inline-flex

                      px-2.5
                      py-1

                      rounded-full

                      bg-yellow-100
                      text-yellow-700

                      text-xs
                      font-semibold
                    "
                  >
                    Low Stock
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex

                      px-2.5
                      py-1

                      rounded-full

                      bg-green-100
                      text-green-700

                      text-xs
                      font-semibold
                    "
                  >
                    {stock} Available
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              sm:flex-row

              sm:justify-end

              gap-3

              mt-8
              pt-6

              border-t
              border-gray-100
            "
          >
            <Link
              to="/admin/products"
              className={`
                w-full
                sm:w-auto

                px-6
                py-3

                rounded-xl

                border
                border-gray-300

                bg-white

                text-center
                text-gray-700

                font-semibold

                hover:bg-gray-100
                hover:border-gray-400

                active:scale-[0.98]

                transition-all

                ${
                  isUpdating
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              `}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                isUpdating
              }
              className="
                group

                w-full
                sm:w-auto

                min-w-[180px]

                px-7
                py-3

                rounded-xl

                bg-green-600
                text-white

                font-semibold

                shadow-md

                flex
                items-center
                justify-center
                gap-2

                hover:bg-green-700
                hover:shadow-lg
                hover:-translate-y-0.5

                active:scale-[0.98]

                disabled:bg-green-400
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0

                transition-all
                duration-300
              "
            >
              {isUpdating ? (
                <>
                  <svg
                    className="
                      w-5
                      h-5
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

                  Updating...
                </>
              ) : (
                <>
                  <svg
                    className="
                      w-5
                      h-5

                      transition-transform
                      duration-300

                      group-hover:rotate-12
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>

                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes editProductEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}