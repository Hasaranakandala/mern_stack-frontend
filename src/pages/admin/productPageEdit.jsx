import axios from "axios";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import MediaUpload from "../../utils/mediaUpload";

/*
=========================================================
VELMORA — EDIT PRODUCT
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
Quiet Luxury
Premium Beauty
Professional Administration
Responsive
=========================================================
*/

/* =========================================================
   ICONS
========================================================= */

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 20H5a1 1 0 0 1-1-1v-7" />
      <path d="m14.5 5.5 4 4" />
      <path d="m6 18 2.2-5.2L17 4a1.4 1.4 0 0 1 2 0l1 1a1.4 1.4 0 0 1 0 2l-8.8 8.8L6 18Z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="10"
        r="2"
      />

      <path d="m5 18 5-5 3 3 2-2 4 4" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2v20" />
      <path d="M17 6.5H9.5a3 3 0 0 0 0 6H14a3 3 0 0 1 0 6H6.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M5 20h14" />
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  description,
  icon,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3

        border-b
        border-[#EEE9F2]

        pb-5

        sm:gap-4
        sm:pb-6
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

          rounded-2xl

          border
          border-[#E0D7F5]

          bg-[#F3EEFF]

          text-[#6C5CE7]

          sm:h-12
          sm:w-12
        "
      >
        {icon}
      </div>

      <div>
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
          {eyebrow}
        </p>

        <h2
          className="
            mt-1

            text-lg
            font-extrabold
            tracking-[-0.02em]

            text-[#2F3136]

            sm:text-xl
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-1

              max-w-2xl

              text-xs
              leading-5

              text-[#817A85]

              sm:text-sm
              sm:leading-6
            "
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function EditProductPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  /*
    Product is passed from
    AdminProductPage.
  */

  const product =
    location.state;

  /* =====================================================
     STATES
  ===================================================== */

  const [
    productId,
  ] = useState(
    product?.productId ||
      ""
  );

  const [
    name,
    setName,
  ] = useState(
    product?.productName ||
      ""
  );

  const [
    altNames,
    setAltNames,
  ] = useState(
    Array.isArray(
      product?.alternativeName
    )
      ? product.alternativeName.join(
          ", "
        )
      : product?.alternativeName ||
        ""
  );

  const [
    description,
    setDescription,
  ] = useState(
    product?.description ||
      ""
  );

  /*
    New files selected by admin.
    New images replace current images
    after a successful update.
  */

  const [
    images,
    setImages,
  ] = useState([]);

  const [
    newImagePreviews,
    setNewImagePreviews,
  ] = useState([]);

  const [
    labelPrice,
    setLabelPrice,
  ] = useState(
    product?.labelPrice ??
      0
  );

  const [
    price,
    setPrice,
  ] = useState(
    product?.price ?? 0
  );

  const [
    stock,
    setStock,
  ] = useState(
    product?.stock ?? 0
  );

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  /* =====================================================
     HANDLE MISSING PRODUCT
  ===================================================== */

  useEffect(() => {
    if (!product) {
      toast.error(
        "Product information not found. Please select a product again."
      );

      navigate(
        "/admin/products",
        {
          replace: true,
        }
      );
    }
  }, [
    product,
    navigate,
  ]);

  /* =====================================================
     LOCAL PREVIEWS
  ===================================================== */

  useEffect(() => {
    if (
      images.length ===
      0
    ) {
      setNewImagePreviews(
        []
      );

      return;
    }

    const previews =
      images.map(
        (image) =>
          URL.createObjectURL(
            image
          )
      );

    setNewImagePreviews(
      previews
    );

    return () => {
      previews.forEach(
        (preview) =>
          URL.revokeObjectURL(
            preview
          )
      );
    };
  }, [images]);

  /* =====================================================
     IMAGE SELECTION
  ===================================================== */

  function handleImageChange(
    event
  ) {
    const selectedFiles =
      Array.from(
        event.target.files
      );

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    if (
      selectedFiles.length >
      6
    ) {
      toast.error(
        "You can select a maximum of 6 images."
      );

      return;
    }

    const invalidImage =
      selectedFiles.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (
      invalidImage
    ) {
      toast.error(
        "Please select image files only."
      );

      return;
    }

    const oversizedImage =
      selectedFiles.find(
        (file) =>
          file.size >
          5 *
            1024 *
            1024
      );

    if (
      oversizedImage
    ) {
      toast.error(
        "Each image must be smaller than 5MB."
      );

      return;
    }

    setImages(
      selectedFiles
    );
  }

  /* =====================================================
     REMOVE NEW IMAGE
  ===================================================== */

  function removeNewImage(
    index
  ) {
    setImages(
      (
        previousImages
      ) =>
        previousImages.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
    );
  }

  /* =====================================================
     CLEAR REPLACEMENT IMAGES
  ===================================================== */

  function clearReplacementImages() {
    setImages([]);
  }

  /* =====================================================
     UPDATE PRODUCT
  ===================================================== */

  async function editProduct(
    event
  ) {
    event.preventDefault();

    if (isUpdating) {
      return;
    }

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first."
      );

      return;
    }

    if (
      !productId.trim()
    ) {
      toast.error(
        "Product ID is missing."
      );

      return;
    }

    if (!name.trim()) {
      toast.error(
        "Please enter the product name."
      );

      return;
    }

    if (
      !description.trim()
    ) {
      toast.error(
        "Please enter a product description."
      );

      return;
    }

    if (
      Number(
        labelPrice
      ) < 0
    ) {
      toast.error(
        "Label price cannot be negative."
      );

      return;
    }

    if (
      Number(price) <
      0
    ) {
      toast.error(
        "Selling price cannot be negative."
      );

      return;
    }

    if (
      Number(stock) <
      0
    ) {
      toast.error(
        "Stock cannot be negative."
      );

      return;
    }

    setIsUpdating(true);

    const loadingToast =
      toast.loading(
        images.length >
          0
          ? "Uploading new Velmora imagery..."
          : "Updating Velmora product..."
      );

    try {
      /*
        Keep existing images if
        no replacement images
        were selected.
      */

      let imageUrls =
        product?.images ||
        [];

      /*
        New selection replaces
        current image collection.
      */

      if (
        images.length >
        0
      ) {
        const uploadPromises =
          images.map(
            (image) =>
              MediaUpload(
                image
              )
          );

        imageUrls =
          await Promise.all(
            uploadPromises
          );
      }

      const alternativeNames =
        altNames
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(
            (item) =>
              item !== ""
          );

      const updatedProduct = {
        productId:
          productId.trim(),

        productName:
          name.trim(),

        alternativeName:
          alternativeNames,

        description:
          description.trim(),

        images:
          imageUrls,

        labelPrice:
          Number(
            labelPrice
          ),

        price:
          Number(price),

        stock:
          Number(stock),
      };

      const response =
        await axios.put(
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
        response.data
      );

      toast.dismiss(
        loadingToast
      );

      toast.success(
        "Velmora product updated successfully."
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
          "Failed to update the product."
      );
    } finally {
      setIsUpdating(
        false
      );
    }
  }

  /* =====================================================
     DERIVED UI VALUES
  ===================================================== */

  const discountPercentage =
    useMemo(() => {
      const original =
        Number(
          labelPrice
        );

      const selling =
        Number(price);

      if (
        original <= 0 ||
        selling <= 0 ||
        original <= selling
      ) {
        return 0;
      }

      return Math.round(
        ((original -
          selling) /
          original) *
          100
      );
    }, [
      labelPrice,
      price,
    ]);

  const previewImages =
    newImagePreviews
      .length > 0
      ? newImagePreviews
      : product?.images ||
        [];

  const mainPreviewImage =
    previewImages?.[0];

  const stockNumber =
    Number(stock);

  const currentImages =
    product?.images ||
    [];

  /* =====================================================
     COMMON CLASSES
  ===================================================== */

  const labelClass = `
    mb-2
    block

    text-sm
    font-bold

    text-[#4B4550]
  `;

  const inputClass = `
    min-h-[52px]
    w-full

    rounded-2xl

    border
    border-[#DED8E4]

    bg-white

    px-4

    text-sm
    text-[#2F3136]

    outline-none

    transition-all
    duration-300

    placeholder:text-[#AAA3AF]

    hover:border-[#CFC5D8]

    focus:border-[#B8A1FF]
    focus:ring-4
    focus:ring-[#B8A1FF]/15

    disabled:cursor-not-allowed
    disabled:bg-[#F4F2F5]
    disabled:text-[#98909D]

    sm:text-base
  `;

  /* =====================================================
     MISSING PRODUCT FALLBACK
  ===================================================== */

  if (!product) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          w-full
          items-center
          justify-center

          bg-[#FAF9F7]

          px-4
        "
      >
        <div className="text-center">
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
              border-[#E1D8F4]

              bg-[#F4F0FF]

              text-[#6C5CE7]
            "
          >
            <EditIcon />
          </div>

          <p
            className="
              mt-4

              text-[9px]
              font-black
              uppercase
              tracking-[0.17em]

              text-[#927CE4]
            "
          >
            Velmora
          </p>

          <h2
            className="
              mt-2

              text-lg
              font-extrabold
              text-[#39333E]
            "
          >
            Product not
            available.
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-[#8D8591]
            "
          >
            Returning to the
            Velmora product
            collection.
          </p>
        </div>
      </div>
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

        px-3
        py-5

        sm:px-5
        sm:py-7

        lg:px-7
        lg:py-8

        xl:px-8
      "
    >
      {/* =================================================
          AMBIENCE
      ================================================= */}

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
          -right-36
          top-[600px]

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
          max-w-[1380px]

          animate-[velmoraEditEnter_0.4s_ease-out]
        "
      >
        {/* =================================================
            HERO / PAGE HEADER
        ================================================= */}

        <section
          className="
            relative

            mb-6

            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E2F0]

            bg-gradient-to-r
            from-[#F5F1FF]
            via-white
            to-[#FFF3F7]

            p-5

            shadow-[0_16px_50px_rgba(63,48,84,0.05)]

            sm:rounded-[30px]
            sm:p-6
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

              bg-[#B8A1FF]/14

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

                  sm:text-[10px]
                "
              >
                <span className="text-[#B9955B]">
                  ✦
                </span>

                Velmora
                Catalogue
                Management
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
                Refine a Beauty
                Selection
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
                Update product
                identity,
                imagery,
                pricing and
                inventory while
                keeping the
                Velmora
                collection
                polished and
                consistent.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="
                group

                inline-flex
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

                sm:w-auto
              "
            >
              <span
                className="
                  transition-transform
                  duration-300

                  group-hover:-translate-x-1
                "
              >
                <BackIcon />
              </span>

              Back to Products
            </Link>
          </div>
        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6

            xl:grid-cols-[minmax(0,1fr)_350px]
            xl:items-start
            xl:gap-7
          "
        >
          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              editProduct
            }
            className="
              min-w-0

              rounded-[26px]

              border
              border-[#E9E3EF]

              bg-white

              p-4

              shadow-[0_18px_60px_rgba(64,48,86,0.055)]

              sm:rounded-[32px]
              sm:p-6

              lg:p-8
            "
          >
            {/* =============================================
                PRODUCT IDENTITY
            ============================================= */}

            <section>
              <SectionTitle
                eyebrow="01 · Product Identity"
                title="Product Information"
                description="Refine the product name, alternative search terms and customer-facing description."
                icon={
                  <EditIcon />
                }
              />

              <div
                className="
                  mt-6

                  grid
                  grid-cols-1
                  gap-5

                  md:grid-cols-2
                "
              >
                {/* PRODUCT ID */}

                <div>
                  <label
                    className={
                      labelClass
                    }
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
                        min-h-[52px]
                        w-full

                        rounded-2xl

                        border
                        border-[#E2DCE7]

                        bg-[#F6F3F7]

                        px-4
                        pr-12

                        text-sm
                        font-semibold
                        text-[#8A828E]

                        outline-none

                        cursor-not-allowed

                        sm:text-base
                      "
                    />

                    <div
                      className="
                        absolute
                        right-4
                        top-1/2

                        -translate-y-1/2

                        text-[#9E95A3]
                      "
                    >
                      <LockIcon />
                    </div>
                  </div>

                  <p
                    className="
                      mt-2

                      text-[10px]
                      leading-5

                      text-[#99919D]

                      sm:text-xs
                    "
                  >
                    This unique
                    identifier is
                    locked and
                    cannot be
                    changed.
                  </p>
                </div>

                {/* PRODUCT NAME */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Product Name

                    <span
                      className="
                        ml-1
                        text-[#B46079]
                      "
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    disabled={
                      isUpdating
                    }
                    placeholder="e.g. Velmora Radiance Serum"
                    onChange={(
                      event
                    ) =>
                      setName(
                        event.target
                          .value
                      )
                    }
                    className={
                      inputClass
                    }
                  />
                </div>
              </div>

              {/* ALTERNATIVE NAMES */}

              <div className="mt-5">
                <label
                  className={
                    labelClass
                  }
                >
                  Alternative
                  Names
                </label>

                <input
                  type="text"
                  value={
                    altNames
                  }
                  disabled={
                    isUpdating
                  }
                  placeholder="e.g. Glow Serum, Vitamin C Serum"
                  onChange={(
                    event
                  ) =>
                    setAltNames(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />

                <p
                  className="
                    mt-2

                    text-[10px]
                    leading-5

                    text-[#99919D]

                    sm:text-xs
                  "
                >
                  Separate
                  alternative
                  search names
                  using commas.
                </p>
              </div>

              {/* DESCRIPTION */}

              <div className="mt-5">
                <div
                  className="
                    mb-2

                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <label
                    className="
                      text-sm
                      font-bold
                      text-[#4B4550]
                    "
                  >
                    Product
                    Description

                    <span
                      className="
                        ml-1
                        text-[#B46079]
                      "
                    >
                      *
                    </span>
                  </label>

                  <span
                    className="
                      shrink-0

                      text-[10px]
                      font-medium

                      text-[#A098A5]

                      sm:text-xs
                    "
                  >
                    {
                      description.length
                    }
                    /1000
                  </span>
                </div>

                <textarea
                  rows="6"
                  maxLength="1000"
                  value={
                    description
                  }
                  disabled={
                    isUpdating
                  }
                  placeholder="Describe the product, key beauty benefits and recommended use..."
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  className="
                    w-full

                    resize-none

                    rounded-2xl

                    border
                    border-[#DED8E4]

                    bg-white

                    px-4
                    py-3.5

                    text-sm
                    leading-7
                    text-[#2F3136]

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-[#AAA3AF]

                    hover:border-[#CFC5D8]

                    focus:border-[#B8A1FF]
                    focus:ring-4
                    focus:ring-[#B8A1FF]/15

                    disabled:cursor-not-allowed
                    disabled:bg-[#F4F2F5]

                    sm:text-base
                  "
                />
              </div>
            </section>

            {/* =============================================
                CURRENT IMAGES
            ============================================= */}

            <section
              className="
                mt-8

                border-t
                border-[#EEE9F2]

                pt-7
              "
            >
              <SectionTitle
                eyebrow="02 · Current Imagery"
                title="Existing Product Gallery"
                description="Review the images currently representing this product in the Velmora collection."
                icon={
                  <ImageIcon />
                }
              />

              {currentImages.length >
              0 ? (
                <div className="mt-6">
                  <div
                    className="
                      mb-3

                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#4B4550]
                      "
                    >
                      Current
                      Images
                    </p>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#918996]

                        sm:text-xs
                      "
                    >
                      {
                        currentImages.length
                      }{" "}
                      image
                      {currentImages.length ===
                      1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3

                      sm:grid-cols-3

                      lg:grid-cols-4
                    "
                  >
                    {currentImages.map(
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

                            overflow-hidden

                            rounded-2xl

                            border
                            border-[#E7E0EC]

                            bg-[#F8F5FA]

                            shadow-sm

                            transition-all
                            duration-300

                            hover:-translate-y-1
                            hover:border-[#D5C8EF]
                            hover:shadow-lg
                          "
                        >
                          <img
                            src={
                              image
                            }
                            alt={`Current ${
                              index +
                              1
                            }`}
                            className="
                              h-full
                              w-full

                              object-cover

                              transition-transform
                              duration-500

                              group-hover:scale-105
                            "
                          />

                          <span
                            className="
                              absolute
                              bottom-2
                              left-2

                              rounded-lg

                              bg-[#2F3136]/80

                              px-2
                              py-1

                              text-[9px]
                              font-bold
                              text-white

                              backdrop-blur-md
                            "
                          >
                            {index ===
                            0
                              ? "Primary"
                              : `Image ${
                                  index +
                                  1
                                }`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="
                    mt-6

                    rounded-2xl

                    border
                    border-dashed
                    border-[#DDD4E8]

                    bg-[#FCFAFD]

                    px-5
                    py-8

                    text-center
                  "
                >
                  <ImageIcon />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-[#827A87]
                    "
                  >
                    No current
                    product images
                    are available.
                  </p>
                </div>
              )}
            </section>

            {/* =============================================
                REPLACE IMAGES
            ============================================= */}

            <section
              className="
                mt-8

                border-t
                border-[#EEE9F2]

                pt-7
              "
            >
              <SectionTitle
                eyebrow="03 · Refresh Imagery"
                title="Replace Product Gallery"
                description="Choose a new complete image set only when you want to replace the product's current gallery."
                icon={
                  <UploadIcon />
                }
              />

              <div className="mt-6">
                <div
                  className="
                    mb-2

                    flex
                    flex-col
                    gap-1

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <label
                    className={
                      labelClass
                    }
                  >
                    Replacement
                    Images
                  </label>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#918996]

                      sm:text-xs
                    "
                  >
                    {
                      images.length
                    }
                    /6 selected
                  </span>
                </div>

                <label
                  className={`
                    group
                    relative

                    flex
                    min-h-[190px]
                    w-full
                    flex-col
                    items-center
                    justify-center

                    overflow-hidden

                    rounded-[22px]

                    border-2
                    border-dashed

                    px-5
                    py-7

                    text-center

                    transition-all
                    duration-300

                    ${
                      isUpdating
                        ? "cursor-not-allowed border-[#E1DDE5] bg-[#F4F2F5]"
                        : "cursor-pointer border-[#D9CFF1] bg-gradient-to-br from-[#FAF8FF] via-white to-[#FFF7FA] hover:border-[#B8A1FF] hover:shadow-[0_12px_32px_rgba(108,92,231,0.07)]"
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
                      pointer-events-none

                      absolute
                      -right-16
                      -top-16

                      h-40
                      w-40

                      rounded-full

                      bg-[#B8A1FF]/12

                      blur-3xl
                    "
                  />

                  <div
                    className="
                      pointer-events-none

                      absolute
                      -bottom-16
                      -left-16

                      h-40
                      w-40

                      rounded-full

                      bg-[#F2B8C6]/10

                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative

                      flex
                      h-14
                      w-14
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-[#6C5CE7]
                      to-[#B8A1FF]

                      text-white

                      shadow-[0_12px_26px_rgba(108,92,231,0.22)]

                      transition-transform
                      duration-300

                      group-hover:-translate-y-1
                    "
                  >
                    <UploadIcon />
                  </div>

                  <p
                    className="
                      relative
                      mt-4

                      text-sm
                      font-extrabold
                      text-[#3F3944]

                      sm:text-base
                    "
                  >
                    Select a new
                    Velmora image
                    collection
                  </p>

                  <p
                    className="
                      relative

                      mt-1

                      max-w-md

                      text-[10px]
                      leading-5

                      text-[#918A96]

                      sm:text-xs
                    "
                  >
                    PNG, JPG,
                    JPEG or WEBP
                    · Maximum
                    5MB each · Up
                    to 6 images
                  </p>

                  <div
                    className="
                      relative

                      mt-4

                      rounded-full

                      border
                      border-[#F0DCC0]

                      bg-[#FFF9EF]

                      px-3
                      py-1.5

                      text-[9px]
                      font-bold

                      text-[#A47A3E]
                    "
                  >
                    Leave empty to
                    keep current
                    images
                  </div>
                </label>
              </div>

              {/* NEW IMAGE NOTICE */}

              {newImagePreviews.length >
                0 && (
                <div
                  className="
                    mt-5

                    rounded-2xl

                    border
                    border-[#F1DFC2]

                    bg-[#FFF9EF]

                    px-4
                    py-3
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
                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          text-[#8E652D]
                        "
                      >
                        Replacement
                        gallery
                        selected
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          leading-5
                          text-[#A58150]

                          sm:text-xs
                        "
                      >
                        Saving the
                        product will
                        replace all
                        current images
                        with these new
                        images.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        isUpdating
                      }
                      onClick={
                        clearReplacementImages
                      }
                      className="
                        shrink-0

                        text-[10px]
                        font-bold

                        text-[#9A6930]

                        hover:underline

                        disabled:opacity-50
                      "
                    >
                      Keep Current
                    </button>
                  </div>
                </div>
              )}

              {/* NEW PREVIEWS */}

              {newImagePreviews.length >
                0 && (
                <div className="mt-5">
                  <div
                    className="
                      mb-3

                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#4B4550]
                      "
                    >
                      New Gallery
                      Preview
                    </p>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#B07E3F]
                      "
                    >
                      Replaces
                      current
                    </span>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3

                      sm:grid-cols-3

                      lg:grid-cols-4
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

                            rounded-2xl

                            border
                            border-[#DDD2F3]

                            bg-[#F8F5FA]

                            shadow-sm

                            transition-all
                            duration-300

                            hover:-translate-y-1
                            hover:shadow-lg
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
                              h-full
                              w-full

                              object-cover

                              transition-transform
                              duration-500

                              group-hover:scale-105
                            "
                          />

                          <span
                            className="
                              absolute
                              bottom-2
                              left-2

                              rounded-lg

                              bg-[#6C5CE7]/90

                              px-2
                              py-1

                              text-[9px]
                              font-bold
                              text-white

                              backdrop-blur-md
                            "
                          >
                            {index ===
                            0
                              ? "New Primary"
                              : `New ${
                                  index +
                                  1
                                }`}
                          </span>

                          {!isUpdating && (
                            <button
                              type="button"
                              aria-label={`Remove new image ${
                                index +
                                1
                              }`}
                              onClick={() =>
                                removeNewImage(
                                  index
                                )
                              }
                              className="
                                absolute
                                right-2
                                top-2

                                flex
                                h-9
                                w-9
                                items-center
                                justify-center

                                rounded-full

                                border
                                border-white

                                bg-white/90

                                text-[#B45462]

                                shadow-md

                                backdrop-blur-md

                                transition-all

                                hover:bg-[#FFF0F3]

                                active:scale-90
                              "
                            >
                              <CloseIcon />
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* =============================================
                PRICING / STOCK
            ============================================= */}

            <section
              className="
                mt-8

                border-t
                border-[#EEE9F2]

                pt-7
              "
            >
              <SectionTitle
                eyebrow="04 · Commercial Details"
                title="Pricing & Inventory"
                description="Update the selling price, reference price and stock available to Velmora customers."
                icon={
                  <PriceIcon />
                }
              />

              <div
                className="
                  mt-6

                  grid
                  grid-cols-1
                  gap-5

                  sm:grid-cols-2
                "
              >
                {/* LABEL PRICE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Original /
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
                        font-bold
                        text-[#8D8491]
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
                      onChange={(
                        event
                      ) =>
                        setLabelPrice(
                          event.target
                            .value
                        )
                      }
                      className={`
                        ${inputClass}
                        pl-12
                      `}
                    />
                  </div>
                </div>

                {/* SELLING PRICE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
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
                        font-bold
                        text-[#8D8491]
                      "
                    >
                      Rs.
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        price
                      }
                      disabled={
                        isUpdating
                      }
                      onChange={(
                        event
                      ) =>
                        setPrice(
                          event.target
                            .value
                        )
                      }
                      className={`
                        ${inputClass}
                        pl-12
                      `}
                    />
                  </div>
                </div>
              </div>

              {/* DISCOUNT */}

              {discountPercentage >
                0 && (
                <div
                  className="
                    mt-4

                    flex
                    items-center
                    gap-3

                    rounded-2xl

                    border
                    border-[#F0D7DF]

                    bg-[#FFF4F7]

                    px-4
                    py-3
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

                      bg-white

                      text-xs
                      font-black
                      text-[#B46079]

                      shadow-sm
                    "
                  >
                    %
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#824D5D]
                      "
                    >
                      {
                        discountPercentage
                      }
                      % customer
                      saving
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-[#A47A87]
                      "
                    >
                      Based on the
                      current
                      original and
                      selling
                      prices.
                    </p>
                  </div>
                </div>
              )}

              {/* STOCK */}

              <div className="mt-5">
                <label
                  className={
                    labelClass
                  }
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
                  onChange={(
                    event
                  ) =>
                    setStock(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                />

                <div className="mt-2">
                  {stockNumber <=
                  0 ? (
                    <span
                      className="
                        inline-flex

                        rounded-full

                        border
                        border-[#F0D4D9]

                        bg-[#FFF1F3]

                        px-3
                        py-1.5

                        text-[10px]
                        font-bold
                        text-[#B45462]
                      "
                    >
                      Out of Stock
                    </span>
                  ) : stockNumber <=
                    5 ? (
                    <span
                      className="
                        inline-flex

                        rounded-full

                        border
                        border-[#F1DFC0]

                        bg-[#FFF8EC]

                        px-3
                        py-1.5

                        text-[10px]
                        font-bold
                        text-[#A87328]
                      "
                    >
                      {stockNumber} ·
                      Low Stock
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex

                        rounded-full

                        border
                        border-[#D5E9DF]

                        bg-[#EDF7F2]

                        px-3
                        py-1.5

                        text-[10px]
                        font-bold
                        text-[#478465]
                      "
                    >
                      {stockNumber}{" "}
                      Available
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <div
              className="
                mt-8

                flex
                flex-col-reverse
                gap-3

                border-t
                border-[#EEE9F2]

                pt-6

                sm:flex-row
                sm:justify-end
              "
            >
              <Link
                to="/admin/products"
                className={`
                  flex
                  min-h-[50px]
                  w-full
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-[#DCD5E2]

                  bg-white

                  px-6

                  text-sm
                  font-bold
                  text-[#625C68]

                  transition-all

                  hover:border-[#CFC5D8]
                  hover:bg-[#F8F6F9]

                  active:scale-[0.98]

                  sm:w-auto

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

                  flex
                  min-h-[50px]
                  w-full
                  min-w-[190px]
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-gradient-to-r
                  from-[#6C5CE7]
                  to-[#8F78EA]

                  px-7

                  text-sm
                  font-bold
                  text-white

                  shadow-[0_10px_25px_rgba(108,92,231,0.22)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_32px_rgba(108,92,231,0.30)]

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0

                  sm:w-auto
                "
              >
                {isUpdating ? (
                  <>
                    <span
                      className="
                        h-5
                        w-5

                        animate-spin

                        rounded-full

                        border-2
                        border-white/35
                        border-t-white
                      "
                    />

                    Updating...
                  </>
                ) : (
                  <>
                    <EditIcon />

                    Update Velmora
                    Product
                  </>
                )}
              </button>
            </div>
          </form>

          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <aside
            className="
              min-w-0

              xl:sticky
              xl:top-6
            "
          >
            <div
              className="
                overflow-hidden

                rounded-[26px]

                border
                border-[#E8E1EF]

                bg-white

                shadow-[0_18px_55px_rgba(63,48,84,0.06)]
              "
            >
              {/* PREVIEW HEADER */}

              <div
                className="
                  border-b
                  border-[#EEE9F2]

                  bg-gradient-to-r
                  from-[#F5F1FF]
                  via-white
                  to-[#FFF3F7]

                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]

                    text-[#6C5CE7]
                  "
                >
                  Live Preview
                </p>

                <h3
                  className="
                    mt-1
                    font-extrabold
                    text-[#332E37]
                  "
                >
                  Updated Velmora
                  Listing
                </h3>

                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-5
                    text-[#918996]
                  "
                >
                  Preview the
                  product while
                  refining its
                  information.
                </p>
              </div>

              {/* IMAGE */}

              <div
                className="
                  relative

                  flex
                  aspect-[1.15/1]
                  items-center
                  justify-center

                  overflow-hidden

                  bg-gradient-to-br
                  from-[#FAF8FF]
                  via-[#F8F4FF]
                  to-[#FFF4F7]

                  p-5
                "
              >
                <div
                  className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-1/2

                    h-40
                    w-40

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-[#B8A1FF]/15

                    blur-[50px]
                  "
                />

                {mainPreviewImage ? (
                  <img
                    src={
                      mainPreviewImage
                    }
                    alt={
                      name ||
                      "Velmora product"
                    }
                    className="
                      relative
                      z-10

                      h-full
                      w-full

                      object-contain
                    "
                  />
                ) : (
                  <div
                    className="
                      relative
                      z-10
                      text-center
                    "
                  >
                    <div
                      className="
                        mx-auto

                        flex
                        h-14
                        w-14
                        items-center
                        justify-center

                        rounded-2xl

                        bg-white

                        text-[#8E78DD]

                        shadow-md
                      "
                    >
                      <ImageIcon />
                    </div>

                    <p
                      className="
                        mt-3
                        text-xs
                        font-semibold
                        text-[#948C99]
                      "
                    >
                      Product image
                      preview
                    </p>
                  </div>
                )}

                {discountPercentage >
                  0 && (
                  <span
                    className="
                      absolute
                      left-3
                      top-3
                      z-20

                      rounded-full

                      border
                      border-[#F1D5DE]

                      bg-[#FFF2F6]

                      px-2.5
                      py-1.5

                      text-[9px]
                      font-black
                      text-[#B45D77]
                    "
                  >
                    Save{" "}
                    {
                      discountPercentage
                    }
                    %
                  </span>
                )}

                {newImagePreviews.length >
                  0 && (
                  <span
                    className="
                      absolute
                      bottom-3
                      right-3
                      z-20

                      rounded-full

                      border
                      border-[#DFD6F7]

                      bg-white/90

                      px-2.5
                      py-1.5

                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.1em]

                      text-[#6C5CE7]

                      shadow-sm

                      backdrop-blur-md
                    "
                  >
                    New Gallery
                  </span>
                )}
              </div>

              {/* PRODUCT INFO */}

              <div className="p-5">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]

                    text-[#927CE4]
                  "
                >
                  Velmora
                  Selection
                </p>

                <h4
                  className="
                    mt-2

                    line-clamp-2

                    text-lg
                    font-extrabold
                    leading-snug
                    tracking-[-0.02em]

                    text-[#2F3136]
                  "
                >
                  {name.trim() ||
                    "Velmora Product"}
                </h4>

                <p
                  className="
                    mt-2

                    line-clamp-3

                    text-xs
                    leading-6

                    text-[#7A7380]
                  "
                >
                  {description.trim() ||
                    "Your refined product description will appear here."}
                </p>

                <div
                  className="
                    mt-4

                    flex
                    flex-wrap
                    items-end
                    gap-2
                  "
                >
                  <span
                    className="
                      text-xl
                      font-extrabold
                      tracking-[-0.025em]

                      text-[#6C5CE7]
                    "
                  >
                    Rs.{" "}
                    {Number(
                      price || 0
                    ).toLocaleString(
                      "en-LK",
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
                    )}
                  </span>

                  {Number(
                    labelPrice
                  ) >
                    Number(
                      price
                    ) && (
                    <span
                      className="
                        pb-[2px]

                        text-xs
                        text-[#A59DA8]
                        line-through
                      "
                    >
                      Rs.{" "}
                      {Number(
                        labelPrice
                      ).toLocaleString(
                        "en-LK",
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        }
                      )}
                    </span>
                  )}
                </div>

                {/* INVENTORY */}

                <div
                  className="
                    mt-4

                    flex
                    items-center
                    justify-between
                    gap-3

                    rounded-xl

                    bg-[#F8F5FF]

                    px-3
                    py-2.5
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#7B7380]
                    "
                  >
                    Inventory
                  </span>

                  <span
                    className={`
                      text-[10px]
                      font-bold

                      ${
                        stockNumber <=
                        0
                          ? "text-[#B45462]"
                          : stockNumber <=
                            5
                          ? "text-[#A87328]"
                          : "text-[#4F8F70]"
                      }
                    `}
                  >
                    {stockNumber <=
                    0
                      ? "Out of Stock"
                      : stockNumber <=
                        5
                      ? `${stockNumber} Low Stock`
                      : `${stockNumber} Available`}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                UPDATE CHECKLIST
            ================================================= */}

            <div
              className="
                mt-5

                rounded-[24px]

                border
                border-[#E8E1EF]

                bg-white

                p-5

                shadow-[0_14px_42px_rgba(63,48,84,0.045)]
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#6C5CE7]
                "
              >
                Update Checklist
              </p>

              <h3
                className="
                  mt-1
                  font-extrabold
                  text-[#332E37]
                "
              >
                Ready to save?
              </h3>

              <div
                className="
                  mt-4
                  space-y-3
                "
              >
                <ChecklistItem
                  label="Product name"
                  ready={Boolean(
                    name.trim()
                  )}
                />

                <ChecklistItem
                  label="Description"
                  ready={Boolean(
                    description.trim()
                  )}
                />

                <ChecklistItem
                  label="Product imagery"
                  ready={
                    previewImages.length >
                    0
                  }
                />

                <ChecklistItem
                  label="Valid pricing"
                  ready={
                    Number(price) >=
                      0 &&
                    Number(
                      labelPrice
                    ) >= 0
                  }
                />

                <ChecklistItem
                  label="Inventory value"
                  ready={
                    stockNumber >=
                    0
                  }
                />
              </div>
            </div>

            {/* =================================================
                BRAND NOTE
            ================================================= */}

            <div
              className="
                relative

                mt-5

                overflow-hidden

                rounded-[24px]

                bg-[#302C3C]

                p-5

                text-white

                shadow-[0_18px_44px_rgba(47,44,60,0.18)]
              "
            >
              <div
                className="
                  pointer-events-none

                  absolute
                  -right-14
                  -top-14

                  h-32
                  w-32

                  rounded-full

                  bg-[#B8A1FF]/18

                  blur-3xl
                "
              />

              <div
                className="
                  relative

                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-xl

                  bg-white/10

                  text-[#EADBC8]
                "
              >
                ✦
              </div>

              <p
                className="
                  relative

                  mt-4

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#D2C6FF]
                "
              >
                Velmora Standard
              </p>

              <h3
                className="
                  relative

                  mt-1
                  font-extrabold
                "
              >
                Refine, don't
                overcomplicate.
              </h3>

              <p
                className="
                  relative

                  mt-2

                  text-xs
                  leading-6

                  text-white/55
                "
              >
                Keep product
                names clear,
                imagery elegant
                and descriptions
                concise so every
                Velmora listing
                feels consistent.
              </p>
            </div>
          </aside>
        </div>

        {/* =================================================
            ANIMATION
        ================================================= */}

        <style>{`
          @keyframes velmoraEditEnter {
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
            .animate-\\[velmoraEditEnter_0\\.4s_ease-out\\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* =========================================================
   CHECKLIST ITEM
========================================================= */

function ChecklistItem({
  label,
  ready,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center

          rounded-full

          ${
            ready
              ? "bg-[#EDF7F2] text-[#4F8F70]"
              : "bg-[#F0ECF2] text-[#A69EA9]"
          }
        `}
      >
        {ready ? (
          <CheckIcon />
        ) : (
          <span className="text-[9px]">
            •
          </span>
        )}
      </div>

      <span
        className={`
          text-xs
          font-semibold

          ${
            ready
              ? "text-[#514A56]"
              : "text-[#99919D]"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}