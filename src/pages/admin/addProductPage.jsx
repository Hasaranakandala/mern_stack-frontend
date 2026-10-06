import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [labelPrice, setLabelPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    const previews = images.map((image) =>
      URL.createObjectURL(image)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [images]);

  // =====================================================
  // HANDLE IMAGE CHANGE
  // =====================================================

  function handleImageChange(e) {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    // Maximum 6 images
    if (selectedFiles.length > 6) {
      toast.error("You can upload a maximum of 6 images");
      return;
    }

    // Check file type
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      toast.error("Please select image files only");
      return;
    }

    // Check image size - maximum 5MB each
    const oversizedFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error("Each image must be smaller than 5MB");
      return;
    }

    setImages(selectedFiles);
  }

  // =====================================================
  // REMOVE SELECTED IMAGE
  // =====================================================

  function removeImage(index) {
    setImages((previousImages) =>
      previousImages.filter((_, i) => i !== index)
    );
  }

  // =====================================================
  // RESET FORM
  // =====================================================

  function resetForm() {
    setProductId("");
    setName("");
    setAltNames("");
    setDescription("");
    setImages([]);
    setLabelPrice(0);
    setPrice(0);
    setStock(0);
  }

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  async function addProduct(e) {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login first");
      return;
    }

    // Basic validation
    if (!productId.trim()) {
      toast.error("Please enter a Product ID");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a Product Name");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a product description");
      return;
    }

    if (images.length <= 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (Number(price) < 0 || Number(labelPrice) < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading(
      "Uploading images and adding product..."
    );

    try {
      // =========================================
      // UPLOAD IMAGES
      // =========================================

      const promisesArray = images.map((image) =>
        MediaUpload(image)
      );

      const productUrl = await Promise.all(promisesArray);

      console.log("Uploaded images:", productUrl);

      // =========================================
      // ALTERNATIVE NAMES
      // =========================================

      const alternativeNames = altNames
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // =========================================
      // PRODUCT OBJECT
      // =========================================

      const product = {
        productId: productId.trim(),
        productName: name.trim(),
        alternativeName: alternativeNames,
        description: description.trim(),
        images: productUrl,
        labelPrice: Number(labelPrice),
        price: Number(price),
        stock: Number(stock),
      };

      // =========================================
      // SEND TO BACKEND
      // =========================================

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/product",
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Product saved:", res.data);

      toast.dismiss(loadingToast);
      toast.success("Product added successfully!");

      resetForm();

      navigate("/admin/products");
    } catch (e) {
      console.error("Add product error:", e);

      toast.dismiss(loadingToast);

      toast.error(
        e?.response?.data?.message ||
          "Failed to add the product"
      );
    } finally {
      setIsSubmitting(false);
    }
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
      {/* ================================================
          PAGE CONTAINER
      ================================================ */}

      <div
        className="
          w-full
          max-w-4xl
          mx-auto

          animate-[addProductEnter_0.4s_ease-out]
        "
      >
        {/* ================================================
            TOP NAVIGATION
        ================================================ */}

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
                font-semibold
                uppercase
                tracking-[0.15em]
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
              Add New Product
            </h1>
          </div>

          {/* Back button */}

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

              hover:text-accent
              hover:border-accent
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

        {/* ================================================
            FORM CARD
        ================================================ */}

        <form
          onSubmit={addProduct}
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

            transition-all
            duration-300

            hover:shadow-md
          "
        >
          {/* ================================================
              FORM HEADER
          ================================================ */}

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

                bg-green-50
                text-green-600

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
                  d="M12 4v16m8-8H4"
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
                Enter the details of the new product below.
              </p>
            </div>
          </div>

          {/* ================================================
              PRODUCT ID + NAME
          ================================================ */}

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
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. P001"
                value={productId}
                disabled={isSubmitting}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
                className="
                  w-full

                  px-4
                  py-3

                  text-sm
                  sm:text-base

                  border
                  border-gray-300

                  rounded-xl

                  bg-white

                  outline-none

                  placeholder:text-gray-400

                  focus:ring-2
                  focus:ring-green-500/20
                  focus:border-green-500

                  hover:border-gray-400

                  disabled:bg-gray-100
                  disabled:cursor-not-allowed

                  transition-all
                  duration-200
                "
              />
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
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                disabled={isSubmitting}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full

                  px-4
                  py-3

                  text-sm
                  sm:text-base

                  border
                  border-gray-300

                  rounded-xl

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

          {/* ================================================
              ALTERNATIVE NAMES
          ================================================ */}

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
              placeholder="e.g. Vitamin C Serum, Glow Serum"
              value={altNames}
              disabled={isSubmitting}
              onChange={(e) =>
                setAltNames(e.target.value)
              }
              className="
                w-full

                px-4
                py-3

                text-sm
                sm:text-base

                border
                border-gray-300

                rounded-xl

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

            <p className="text-xs text-gray-400 mt-2">
              Separate multiple names using commas.
            </p>
          </div>

          {/* ================================================
              DESCRIPTION
          ================================================ */}

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>

              <span className="text-xs text-gray-400">
                {description.length} characters
              </span>
            </div>

            <textarea
              rows="5"
              maxLength="1000"
              placeholder="Describe the product, benefits, ingredients, usage..."
              value={description}
              disabled={isSubmitting}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="
                w-full

                px-4
                py-3

                text-sm
                sm:text-base

                border
                border-gray-300

                rounded-xl

                outline-none
                resize-none

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

          {/* ================================================
              IMAGE UPLOAD
          ================================================ */}

          <div className="mt-6">
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
                Product Images
                <span className="text-red-500 ml-1">*</span>
              </label>

              <span className="text-xs text-gray-400">
                {images.length}/6 images selected
              </span>
            </div>

            {/* Upload Box */}

            <label
              className={`
                relative

                w-full

                min-h-[140px]

                border-2
                border-dashed

                rounded-2xl

                flex
                flex-col
                items-center
                justify-center

                text-center

                px-4
                py-6

                transition-all
                duration-300

                ${
                  isSubmitting
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "bg-gray-50 border-gray-300 cursor-pointer hover:border-green-500 hover:bg-green-50/30"
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isSubmitting}
                onChange={handleImageChange}
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

                  transition-transform
                  duration-300

                  group-hover:scale-110
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
                    d="M4 16l4-4 4 4 4-4 4 4M4 20h16M12 4v8m0-8l-3 3m3-3l3 3"
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
                Click to select product images
              </p>

              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG or WEBP • Maximum 5MB each
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                Maximum 6 images
              </p>
            </label>
          </div>

          {/* ================================================
              IMAGE PREVIEWS
          ================================================ */}

          {imagePreviews.length > 0 && (
            <div className="mt-5">
              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-3
                "
              >
                Image Preview
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  gap-3
                  sm:gap-4
                "
              >
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="
                      group
                      relative

                      aspect-square

                      overflow-hidden

                      rounded-xl

                      border
                      border-gray-200

                      bg-gray-100

                      shadow-sm

                      transition-all
                      duration-300

                      hover:shadow-md
                      hover:-translate-y-1
                    "
                  >
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="
                        w-full
                        h-full
                        object-cover

                        transition-transform
                        duration-500

                        group-hover:scale-105
                      "
                    />

                    {/* Image number */}

                    <div
                      className="
                        absolute
                        bottom-2
                        left-2

                        px-2
                        py-1

                        rounded-md

                        bg-black/60
                        backdrop-blur-sm

                        text-white
                        text-[10px]
                        font-semibold
                      "
                    >
                      {index === 0
                        ? "Main"
                        : `Image ${index + 1}`}
                    </div>

                    {/* Remove button */}

                    {!isSubmitting && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="
                          absolute
                          top-2
                          right-2

                          w-8
                          h-8

                          rounded-full

                          bg-white/90
                          backdrop-blur-sm

                          text-red-500

                          flex
                          items-center
                          justify-center

                          shadow-md

                          opacity-100
                          sm:opacity-0

                          sm:group-hover:opacity-100

                          hover:bg-red-500
                          hover:text-white

                          active:scale-90

                          transition-all
                          duration-200
                        "
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================
              PRICE SECTION
          ================================================ */}

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

              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Set the product pricing and available stock.
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
                      font-medium
                      text-gray-400
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={labelPrice}
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setLabelPrice(e.target.value)
                    }
                    className="
                      w-full

                      pl-12
                      pr-4
                      py-3

                      border
                      border-gray-300

                      rounded-xl

                      outline-none

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
                      font-medium
                      text-gray-400
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="
                      w-full

                      pl-12
                      pr-4
                      py-3

                      border
                      border-gray-300

                      rounded-xl

                      outline-none

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
                placeholder="Enter stock quantity"
                value={stock}
                disabled={isSubmitting}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                className="
                  w-full

                  px-4
                  py-3

                  border
                  border-gray-300

                  rounded-xl

                  outline-none

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

          {/* ================================================
              BUTTONS
          ================================================ */}

          <div
            className="
              flex
              flex-col-reverse
              sm:flex-row

              sm:items-center
              sm:justify-end

              gap-3

              mt-8
              pt-6

              border-t
              border-gray-100
            "
          >
            {/* Cancel */}

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

                text-gray-700
                text-center
                font-semibold

                bg-white

                hover:bg-gray-100
                hover:border-gray-400

                active:scale-[0.98]

                transition-all
                duration-200

                ${
                  isSubmitting
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              `}
            >
              Cancel
            </Link>

            {/* Add Product */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group

                w-full
                sm:w-auto

                min-w-[170px]

                px-7
                py-3

                rounded-xl

                bg-green-600
                text-white

                font-semibold

                flex
                items-center
                justify-center
                gap-2

                shadow-md

                hover:bg-green-700
                hover:shadow-lg
                hover:-translate-y-0.5

                active:scale-[0.98]

                disabled:bg-green-400
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                disabled:hover:shadow-md

                transition-all
                duration-300
              "
            >
              {isSubmitting ? (
                <>
                  {/* Spinner */}

                  <svg
                    className="w-5 h-5 animate-spin"
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

                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <svg
                    className="
                      w-5
                      h-5
                      transition-transform
                      duration-300
                      group-hover:rotate-90
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>

                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================================================
          ANIMATION
      ================================================ */}

      <style>
        {`
          @keyframes addProductEnter {
            from {
              opacity: 0;
              transform: translateY(12px);
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