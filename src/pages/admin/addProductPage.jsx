import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import MediaUpload from "../../utils/mediaUpload";

import axios from "axios";

/*
=========================================================
VELMORA — ADD PRODUCT
=========================================================

ADMIN DESIGN SYSTEM

Primary Violet   #6C5CE7
Lavender         #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280
Success          #4F9D7A
Error            #D95C5C

Admin direction:
Premium + Professional
Calm + Structured
Mobile-first
=========================================================
*/

/* =========================================================
   SMALL ICONS
========================================================= */

function ArrowLeftIcon() {
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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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
      className="h-6 w-6"
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

function PackageIcon() {
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

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
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
          border-[#E1D8F7]

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
   MAIN PAGE
========================================================= */

export default function AddProductPage() {
  /* =====================================================
     STATES
  ===================================================== */

  const [
    productId,
    setProductId,
  ] = useState("");

  const [
    name,
    setName,
  ] = useState("");

  const [
    altNames,
    setAltNames,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    images,
    setImages,
  ] = useState([]);

  const [
    imagePreviews,
    setImagePreviews,
  ] = useState([]);

  const [
    labelPrice,
    setLabelPrice,
  ] = useState(0);

  const [
    price,
    setPrice,
  ] = useState(0);

  const [
    stock,
    setStock,
  ] = useState(0);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const navigate =
    useNavigate();

  /* =====================================================
     IMAGE PREVIEW
  ===================================================== */

  useEffect(() => {
    const previews =
      images.map(
        (image) =>
          URL.createObjectURL(
            image
          )
      );

    setImagePreviews(
      previews
    );

    return () => {
      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview
          );
        }
      );
    };
  }, [images]);

  /* =====================================================
     HANDLE IMAGE CHANGE
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
        "You can upload a maximum of 6 images."
      );

      return;
    }

    const invalidFile =
      selectedFiles.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFile) {
      toast.error(
        "Please select image files only."
      );

      return;
    }

    const oversizedFile =
      selectedFiles.find(
        (file) =>
          file.size >
          5 *
            1024 *
            1024
      );

    if (
      oversizedFile
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
     REMOVE IMAGE
  ===================================================== */

  function removeImage(
    index
  ) {
    setImages(
      (
        previousImages
      ) =>
        previousImages.filter(
          (_, i) =>
            i !==
            index
        )
    );
  }

  /* =====================================================
     RESET FORM
  ===================================================== */

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

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  async function addProduct(
    event
  ) {
    event.preventDefault();

    if (
      isSubmitting
    ) {
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
        "Please enter a Product ID."
      );

      return;
    }

    if (!name.trim()) {
      toast.error(
        "Please enter a Product Name."
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
      images.length <=
      0
    ) {
      toast.error(
        "Please select at least one product image."
      );

      return;
    }

    if (
      Number(price) <
        0 ||
      Number(
        labelPrice
      ) < 0
    ) {
      toast.error(
        "Price cannot be negative."
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

    setIsSubmitting(
      true
    );

    const loadingToast =
      toast.loading(
        "Preparing your Velmora product..."
      );

    try {
      /* ================================================
         UPLOAD IMAGES
      ================================================ */

      const promisesArray =
        images.map(
          (image) =>
            MediaUpload(
              image
            )
        );

      const productUrl =
        await Promise.all(
          promisesArray
        );

      console.log(
        "Uploaded images:",
        productUrl
      );

      /* ================================================
         ALTERNATIVE NAMES
      ================================================ */

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

      /* ================================================
         PRODUCT
      ================================================ */

      const product = {
        productId:
          productId.trim(),

        productName:
          name.trim(),

        alternativeName:
          alternativeNames,

        description:
          description.trim(),

        images:
          productUrl,

        labelPrice:
          Number(
            labelPrice
          ),

        price:
          Number(price),

        stock:
          Number(stock),
      };

      /* ================================================
         BACKEND
      ================================================ */

      const res =
        await axios.post(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/product",

          product,

          {
            headers: {
              Authorization:
                "Bearer " +
                token,
            },
          }
        );

      console.log(
        "Product saved:",
        res.data
      );

      toast.dismiss(
        loadingToast
      );

      toast.success(
        "Velmora product added successfully."
      );

      resetForm();

      navigate(
        "/admin/products"
      );
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      toast.dismiss(
        loadingToast
      );

      toast.error(
        error?.response
          ?.data
          ?.message ||
          "Failed to add the product."
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  /* =====================================================
     DERIVED VALUES
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

  const previewName =
    name.trim() ||
    "Your Velmora product";

  const previewDescription =
    description.trim() ||
    "Add a thoughtful product description to preview how this beauty essential will feel in the Velmora collection.";

  const inputClass = `
    w-full
    min-h-[52px]

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
    disabled:text-[#99919D]

    sm:text-base
  `;

  const labelClass = `
    mb-2
    block

    text-sm
    font-bold

    text-[#4B4550]
  `;

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

        lg:px-8
        lg:py-9
      "
    >
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-[-80px]

          h-[330px]
          w-[330px]

          rounded-full

          bg-[#B8A1FF]/10

          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-[480px]

          h-[360px]
          w-[360px]

          rounded-full

          bg-[#F2B8C6]/8

          blur-[120px]
        "
      />

      {/* =================================================
          PAGE CONTAINER
      ================================================= */}

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1380px]

          animate-[addProductEnter_0.4s_ease-out]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-6

            flex
            flex-col
            gap-4

            sm:mb-7
            sm:flex-row
            sm:items-end
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
                border-[#E0D7F5]

                bg-[#F4F0FF]

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
              <span
                className="
                  text-[#B9955B]
                "
              >
                ✦
              </span>

              Velmora
              Administration
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
              Add a new beauty
              selection.
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
              Create a polished
              Velmora product
              listing with
              imagery,
              descriptive
              content, pricing
              and inventory.
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
              border-[#DED8E4]

              bg-white

              px-4

              text-sm
              font-bold

              text-[#625C68]

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-[#CFC1F5]
              hover:bg-[#F8F5FF]
              hover:text-[#6C5CE7]
              hover:shadow-md

              active:scale-[0.98]

              sm:w-auto
            "
          >
            <ArrowLeftIcon />

            Back to Products
          </Link>
        </div>

        {/* =================================================
            PAGE GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6

            xl:grid-cols-[minmax(0,1fr)_340px]
            xl:items-start
            xl:gap-7
          "
        >
          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              addProduct
            }
            className="
              min-w-0

              rounded-[26px]

              border
              border-[#EAE4F0]

              bg-white

              p-4

              shadow-[0_18px_60px_rgba(64,48,86,0.055)]

              sm:rounded-[32px]
              sm:p-6

              lg:p-8
            "
          >
            {/* =============================================
                PRODUCT INFORMATION
            ============================================= */}

            <section>
              <SectionHeading
                icon={
                  <PackageIcon />
                }
                eyebrow="01 · Product Identity"
                title="Product Information"
                description="Add the essential information customers will see across the Velmora collection."
              />

              {/* ID + NAME */}

              <div
                className="
                  mt-6

                  grid
                  grid-cols-1
                  gap-5

                  md:grid-cols-2
                "
              >
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Product ID

                    <span
                      className="
                        ml-1
                        text-[#B86A7D]
                      "
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. P001"
                    value={
                      productId
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event
                    ) =>
                      setProductId(
                        event
                          .target
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
                    Use a unique
                    internal
                    identifier
                    for this
                    Velmora
                    item.
                  </p>
                </div>

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
                        text-[#B86A7D]
                      "
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Velmora Radiance Serum"
                    value={name}
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event
                    ) =>
                      setName(
                        event
                          .target
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
                  placeholder="e.g. Vitamin C Serum, Glow Serum"
                  value={
                    altNames
                  }
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event
                  ) =>
                    setAltNames(
                      event
                        .target
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
                  multiple
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
                    gap-4
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
                        text-[#B86A7D]
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
                  placeholder="Describe the product, beauty benefits, key features, ingredients or recommended use..."
                  value={
                    description
                  }
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event
                        .target
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
                IMAGES
            ============================================= */}

            <section
              className="
                mt-8
                border-t
                border-[#EEE9F2]
                pt-7
              "
            >
              <SectionHeading
                icon={
                  <ImageIcon />
                }
                eyebrow="02 · Product Imagery"
                title="Visual Presentation"
                description="Upload clean, high-quality product imagery to create a premium Velmora presentation."
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
                    Product Images

                    <span
                      className="
                        ml-1
                        text-[#B86A7D]
                      "
                    >
                      *
                    </span>
                  </label>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#8F8794]

                      sm:text-xs
                    "
                  >
                    {
                      images.length
                    }
                    /6 selected
                  </span>
                </div>

                {/* UPLOAD */}

                <label
                  className={`
                    group
                    relative

                    flex
                    min-h-[180px]
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

                    sm:min-h-[200px]

                    ${
                      isSubmitting
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
                      isSubmitting
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
                    <ImageIcon />
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
                    Select Velmora
                    product images
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
                    5MB each ·
                    Up to 6
                    images
                  </p>

                  <span
                    className="
                      relative

                      mt-4

                      rounded-full

                      border
                      border-[#DDD4F3]

                      bg-white

                      px-3
                      py-1.5

                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.12em]

                      text-[#6C5CE7]

                      shadow-sm
                    "
                  >
                    First image
                    becomes the
                    primary view
                  </span>
                </label>
              </div>

              {/* PREVIEWS */}

              {imagePreviews.length >
                0 && (
                <div className="mt-6">
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#4B4550]
                      "
                    >
                      Image
                      Preview
                    </p>

                    <span
                      className="
                        text-[10px]
                        text-[#99919D]
                      "
                    >
                      Tap × to
                      remove
                    </span>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3

                      sm:grid-cols-3
                      sm:gap-4

                      lg:grid-cols-4
                    "
                  >
                    {imagePreviews.map(
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
                            border-[#E7E0EC]

                            bg-[#F7F4F8]

                            shadow-sm

                            transition-all
                            duration-300

                            hover:-translate-y-1
                            hover:border-[#D6CAF1]
                            hover:shadow-lg
                          "
                        >
                          <img
                            src={
                              preview
                            }
                            alt={`Product preview ${
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

                          {/* NUMBER */}

                          <div
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
                          </div>

                          {/* REMOVE */}

                          {!isSubmitting && (
                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  index
                                )
                              }
                              aria-label={`Remove image ${
                                index +
                                1
                              }`}
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

                                text-[#B35C6B]

                                shadow-md

                                backdrop-blur-md

                                transition-all
                                duration-200

                                hover:bg-[#FFF0F3]
                                hover:text-[#A54657]

                                active:scale-90

                                sm:h-8
                                sm:w-8
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
                PRICE & INVENTORY
            ============================================= */}

            <section
              className="
                mt-8
                border-t
                border-[#EEE9F2]
                pt-7
              "
            >
              <SectionHeading
                icon={
                  <PriceIcon />
                }
                eyebrow="03 · Commercial Details"
                title="Pricing & Inventory"
                description="Define the pricing customers see and the inventory available for ordering."
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
                      placeholder="0.00"
                      value={
                        labelPrice
                      }
                      disabled={
                        isSubmitting
                      }
                      onChange={(
                        event
                      ) =>
                        setLabelPrice(
                          event
                            .target
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
                      placeholder="0.00"
                      value={
                        price
                      }
                      disabled={
                        isSubmitting
                      }
                      onChange={(
                        event
                      ) =>
                        setPrice(
                          event
                            .target
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
                    border-[#F1D8E0]

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
                      text-[#B4607A]

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
                      This saving
                      will appear
                      when label
                      price is
                      higher than
                      selling
                      price.
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
                  placeholder="Enter available quantity"
                  value={stock}
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event
                  ) =>
                    setStock(
                      event
                        .target
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
                  Enter 0 if the
                  product should
                  start without
                  available
                  inventory.
                </p>
              </div>
            </section>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <div
              className="
                mt-8
                border-t
                border-[#EEE9F2]
                pt-6

                flex
                flex-col-reverse
                gap-3

                sm:flex-row
                sm:items-center
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
                  duration-300

                  hover:border-[#CFC5D8]
                  hover:bg-[#F8F6F9]

                  active:scale-[0.98]

                  sm:w-auto

                  ${
                    isSubmitting
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
                  isSubmitting
                }
                className="
                  group

                  flex
                  min-h-[50px]
                  w-full
                  min-w-[185px]
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
                {isSubmitting ? (
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

                    Publishing...
                  </>
                ) : (
                  <>
                    <PlusIcon />

                    Add to
                    Velmora
                  </>
                )}
              </button>
            </div>
          </form>

          {/* =================================================
              RIGHT PREVIEW
          ================================================= */}

          <aside
            className="
              min-w-0

              xl:sticky
              xl:top-6
            "
          >
            {/* LIVE PREVIEW */}

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
                  Velmora
                  Product Card
                </h3>
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

                {imagePreviews[0] ? (
                  <img
                    src={
                      imagePreviews[0]
                    }
                    alt="Primary product preview"
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
                      Primary image
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
              </div>

              {/* CONTENT */}

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
                  {
                    previewName
                  }
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
                  {
                    previewDescription
                  }
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
                      price ||
                        0
                    ).toLocaleString(
                      undefined,
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
                        undefined,
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

                <div
                  className="
                    mt-4

                    flex
                    items-center
                    justify-between

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
                        Number(
                          stock
                        ) >
                        0
                          ? "text-[#4F8F70]"
                          : "text-[#B25C69]"
                      }
                    `}
                  >
                    {Number(
                      stock
                    ) >
                    0
                      ? `${stock} available`
                      : "No stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* CHECKLIST */}

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
                Publishing
                Checklist
              </p>

              <h3
                className="
                  mt-1
                  font-extrabold
                  text-[#332E37]
                "
              >
                Ready for the
                collection?
              </h3>

              <div
                className="
                  mt-4
                  space-y-3
                "
              >
                {[
                  {
                    label:
                      "Product identity",
                    ready:
                      Boolean(
                        productId.trim() &&
                          name.trim()
                      ),
                  },
                  {
                    label:
                      "Description",
                    ready:
                      Boolean(
                        description.trim()
                      ),
                  },
                  {
                    label:
                      "Product imagery",
                    ready:
                      images.length >
                      0,
                  },
                  {
                    label:
                      "Pricing",
                    ready:
                      Number(
                        price
                      ) >= 0,
                  },
                  {
                    label:
                      "Inventory",
                    ready:
                      Number(
                        stock
                      ) >= 0,
                  },
                ].map(
                  (item) => (
                    <div
                      key={
                        item.label
                      }
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
                            item.ready
                              ? "bg-[#EDF7F2] text-[#4F8F70]"
                              : "bg-[#F0ECF2] text-[#A69EA9]"
                          }
                        `}
                      >
                        {item.ready ? (
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
                            item.ready
                              ? "text-[#514A56]"
                              : "text-[#99919D]"
                          }
                        `}
                      >
                        {
                          item.label
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* BRAND NOTE */}

            <div
              className="
                mt-5

                overflow-hidden

                rounded-[24px]

                bg-[#2F3136]

                p-5

                text-white

                shadow-[0_18px_44px_rgba(47,49,54,0.16)]
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

                  bg-white/10

                  text-[#EADBC8]
                "
              >
                ✦
              </div>

              <p
                className="
                  mt-4
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#CFC1FF]
                "
              >
                Velmora
                Standard
              </p>

              <h3
                className="
                  mt-1
                  font-extrabold
                "
              >
                Keep every
                listing refined.
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-white/55
                "
              >
                Use clear names,
                polished product
                images and
                concise beauty
                descriptions to
                keep the
                collection
                visually
                consistent.
              </p>
            </div>
          </aside>
        </div>

        {/* =================================================
            ANIMATION
        ================================================= */}

        <style>{`
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

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[addProductEnter_0\\.4s_ease-out\\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}