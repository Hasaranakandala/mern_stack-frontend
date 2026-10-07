import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  SiGmail,
} from "react-icons/si";

import {
  FaPhoneVolume,
  FaLocationDot,
} from "react-icons/fa6";

import axios from "axios";

/*
=========================================================
VELMORA CONTACT EXPERIENCE
=========================================================

COLOR HARMONY

Primary Violet    #6C5CE7
Soft Lavender     #B8A1FF
Soft Rose         #F2B8C6
Champagne         #EADBC8
Warm Ivory        #FAF9F7
Surface White     #FFFFFF
Charcoal          #2F3136
Secondary Text    #6B7280
Success           #4F9D7A

Brand direction:
Soft Luxury + Modern Beauty + Calm Confidence
=========================================================
*/

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref =
    useRef(null);

  const [
    visible,
    setVisible,
  ] = useState(false);

  useEffect(() => {
    const element =
      ref.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setVisible(
              true
            );

            observer.unobserve(
              element
            );
          }
        },
        {
          threshold:
            0.12,
        }
      );

    observer.observe(
      element
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-700
        ease-out

        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-7 opacity-0"
        }

        ${className}
      `}
      style={{
        transitionDelay:
          `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}) {
  return (
    <div
      className={
        center
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.24em]
          text-[#6C5CE7]

          sm:text-xs
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-3
          text-3xl
          font-extrabold
          leading-[1.08]
          tracking-[-0.035em]
          text-[#2F3136]

          sm:mt-4
          sm:text-4xl

          lg:text-5xl
        "
      >
        {title}
      </h2>

      {text && (
        <p
          className="
            mt-4
            text-sm
            leading-7
            text-[#6B7280]

            sm:mt-5
            sm:text-base
          "
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   CONTACT METHODS
========================================================= */

const contactMethods = [
  {
    icon: <SiGmail />,
    title:
      "Email Velmora",
    value:
      "productsales92@gmail.com",
    text:
      "For product guidance, order assistance, account support and general enquiries.",
    href:
      "mailto:productsales92@gmail.com",
  },
  {
    icon:
      <FaPhoneVolume />,
    title:
      "Call our care team",
    value:
      "+94 71 651 0980",
    text:
      "Speak directly with our customer care team during support hours.",
    href:
      "tel:+94716510980",
  },
  {
    icon:
      <FaLocationDot />,
    title:
      "Velmora Sri Lanka",
    value:
      "Colombo, Sri Lanka",
    text:
      "Our customer support and beauty-commerce operations are based in Sri Lanka.",
    href:
      "#location",
  },
];

/* =========================================================
   FAQ
========================================================= */

const faqs = [
  {
    q:
      "How can Velmora help with my order?",
    a:
      "Choose Order Support in the contact form and include your order number together with a short description of the issue. This helps our team understand your request more quickly.",
  },
  {
    q:
      "Can I ask for beauty or product guidance?",
    a:
      "Yes. Select Product Advice and tell us what kind of product you are looking for. You can also describe your preferred routine, product type or beauty goal.",
  },
  {
    q:
      "How long does a response usually take?",
    a:
      "Response time can vary depending on the request. Messages sent during support hours are reviewed as quickly as possible, with order and account-related enquiries prioritised where appropriate.",
  },
  {
    q:
      "Can I report a website problem?",
    a:
      "Yes. Select Website Feedback and describe what happened. Mentioning the page, device and action you were taking can help us investigate the issue more effectively.",
  },
];

/* =========================================================
   CONTACT METHOD CARD
========================================================= */

function ContactMethodCard({
  item,
}) {
  return (
    <a
      href={
        item.href
      }
      className="
        group
        relative
        block
        h-full
        overflow-hidden

        rounded-[24px]
        border
        border-[#ECE6F4]

        bg-white

        p-5

        shadow-[0_15px_45px_rgba(63,48,87,0.05)]

        transition-all
        duration-500

        hover:-translate-y-1.5
        hover:border-[#D8CCFA]
        hover:shadow-[0_24px_60px_rgba(108,92,231,0.11)]

        sm:rounded-[28px]
        sm:p-6
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
          bg-[#B8A1FF]/10
          blur-3xl
          transition-all
          duration-500

          group-hover:scale-125
        "
      />

      <div
        className="
          relative
          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-2xl

          bg-[#F2EDFF]

          text-xl
          text-[#6C5CE7]

          transition-all
          duration-300

          group-hover:bg-gradient-to-br
          group-hover:from-[#6C5CE7]
          group-hover:to-[#9B82F2]
          group-hover:text-white
          group-hover:shadow-lg
        "
      >
        {item.icon}
      </div>

      <h3
        className="
          relative
          mt-5
          text-lg
          font-extrabold
          text-[#2F3136]

          sm:text-xl
        "
      >
        {item.title}
      </h3>

      <p
        className="
          relative
          mt-2
          break-words
          text-sm
          font-bold
          text-[#6C5CE7]
        "
      >
        {item.value}
      </p>

      <p
        className="
          relative
          mt-3
          text-sm
          leading-6
          text-[#77717C]
        "
      >
        {item.text}
      </p>

      <p
        className="
          relative
          mt-5
          text-xs
          font-bold
          text-[#9A79E8]
          transition-transform
          duration-300

          group-hover:translate-x-1
        "
      >
        Connect with
        Velmora →
      </p>
    </a>
  );
}

/* =========================================================
   CONTACT PAGE
========================================================= */

export default function Contact() {
  const [
    mouse,
    setMouse,
  ] = useState({
    x: 50,
    y: 50,
  });

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    subject:
      "General Question",
    message: "",
  });

  const [
    focused,
    setFocused,
  ] = useState("");

  const [
    openFaq,
    setOpenFaq,
  ] = useState(0);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  /* =====================================================
     HERO MOUSE GLOW
  ===================================================== */

  const handleHeroMove = (
    event
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    setMouse({
      x:
        ((event.clientX -
          rect.left) /
          rect.width) *
        100,

      y:
        ((event.clientY -
          rect.top) /
          rect.height) *
        100,
    });
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } =
      event.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]:
          value,
      })
    );

    setErrors(
      (prev) => ({
        ...prev,
        [name]: "",
      })
    );

    setSubmitError(
      ""
    );
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate =
    () => {
      const nextErrors =
        {};

      if (
        !form.name.trim()
      ) {
        nextErrors.name =
          "Please enter your name.";
      }

      if (
        !form.email.trim()
      ) {
        nextErrors.email =
          "Please enter your email address.";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email
        )
      ) {
        nextErrors.email =
          "Please enter a valid email address.";
      }

      if (
        !form.message.trim()
      ) {
        nextErrors.message =
          "Please enter your message.";
      } else if (
        form.message
          .trim()
          .length < 10
      ) {
        nextErrors.message =
          "Your message should contain at least 10 characters.";
      }

      return nextErrors;
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      const nextErrors =
        validate();

      if (
        Object.keys(
          nextErrors
        ).length >
        0
      ) {
        setErrors(
          nextErrors
        );

        setSubmitted(
          false
        );

        return;
      }

      try {
        setLoading(
          true
        );

        setSubmitError(
          ""
        );

        setSubmitted(
          false
        );

        const response =
          await axios.post(
            `${
              import.meta
                .env
                .VITE_BACKEND_URL
            }/api/user/contacts`,
            {
              name:
                form.name,
              email:
                form.email,
              subject:
                form.subject,
              message:
                form.message,
            }
          );

        console.log(
          response.data
        );

        setSubmitted(
          true
        );

        setForm({
          name: "",
          email: "",
          subject:
            "General Question",
          message: "",
        });

        setErrors({});
        setFocused(
          ""
        );
      } catch (error) {
        console.error(
          "CONTACT ERROR:",
          error
        );

        setSubmitError(
          error.response
            ?.data
            ?.message ||
            "We couldn't send your message. Please try again."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =====================================================
     SHARED INPUT STATE
  ===================================================== */

  const fieldClass = (
    field
  ) => `
    rounded-2xl
    border
    bg-[#FFFEFF]
    transition-all
    duration-200

    ${
      errors[field]
        ? "border-[#E8A5A5] ring-4 ring-[#FFF0F0]"
        : focused ===
          field
        ? "border-[#B8A1FF] ring-4 ring-[#B8A1FF]/15"
        : "border-[#E4DFEA] hover:border-[#D7CEE3]"
    }
  `;

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#FAF9F7]
        text-[#2F3136]
      "
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          px-3
          pb-10
          pt-5

          sm:px-6
          sm:pb-14
          sm:pt-8

          lg:px-10
          lg:pb-20
        "
      >
        <div
          onMouseMove={
            handleHeroMove
          }
          className="
            relative
            mx-auto
            max-w-7xl
            overflow-hidden

            rounded-[28px]

            border
            border-[#ECE6F4]

            bg-gradient-to-br
            from-[#FBF9FF]
            via-[#FFFAFC]
            to-[#FAF5EE]

            shadow-[0_30px_100px_rgba(68,52,95,0.08)]

            sm:rounded-[38px]

            lg:rounded-[44px]
          "
        >
          {/* Interactive glow */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-80
              transition-all
              duration-300
            "
            style={{
              background:
                `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(184,161,255,0.22), transparent 30%)`,
            }}
          />

          {/* Rose glow */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-20
              h-72
              w-72
              rounded-full
              bg-[#F2B8C6]/20
              blur-[90px]
            "
          />

          {/* Champagne glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-[#EADBC8]/30
              blur-[90px]
            "
          />

          <div
            className="
              relative
              grid
              min-h-[560px]
              grid-cols-1
              items-center
              gap-8

              px-5
              py-10

              sm:px-9
              sm:py-14

              lg:grid-cols-[1fr_0.82fr]
              lg:gap-12
              lg:px-14
              lg:py-16
            "
          >
            {/* ================= LEFT HERO ================= */}

            <Reveal>
              <div
                className="
                  max-w-2xl
                "
              >
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-[#DED4FF]

                    bg-white/70

                    px-3.5
                    py-2

                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.22em]

                    text-[#6C5CE7]

                    shadow-sm

                    backdrop-blur-xl

                    sm:px-4
                    sm:text-[11px]
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
                  Customer Care
                </div>

                <h1
                  className="
                    mt-6
                    text-[38px]
                    font-extrabold
                    leading-[1.02]
                    tracking-[-0.045em]
                    text-[#2F3136]

                    sm:text-5xl

                    lg:text-6xl
                  "
                >
                  Beauty feels
                  better with{" "}

                  <span
                    className="
                      font-serif
                      font-medium
                      italic

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      via-[#9A79E8]
                      to-[#C67896]

                      bg-clip-text
                      text-transparent
                    "
                  >
                    thoughtful
                    care.
                  </span>
                </h1>

                <p
                  className="
                    mt-6
                    max-w-xl
                    text-sm
                    leading-7
                    text-[#6D6772]

                    sm:text-base
                    sm:leading-8
                  "
                >
                  Whether you
                  need help
                  choosing a
                  beauty
                  essential,
                  checking an
                  order or
                  managing your
                  account,
                  Velmora is
                  here to make
                  the experience
                  feel simple
                  and personal.
                </p>

                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    gap-3

                    min-[450px]:flex-row
                  "
                >
                  <a
                    href="#contact-form"
                    className="
                      inline-flex
                      min-h-[52px]
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#927EF1]

                      px-7

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_12px_30px_rgba(108,92,231,0.23)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:shadow-[0_18px_38px_rgba(108,92,231,0.30)]

                      active:scale-[0.98]

                      sm:text-base
                    "
                  >
                    Contact
                    Velmora
                  </a>

                  <Link
                    to="/products"
                    className="
                      inline-flex
                      min-h-[52px]
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-[#DDD4EB]

                      bg-white/75

                      px-7

                      text-sm
                      font-bold
                      text-[#514B57]

                      backdrop-blur-xl

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-[#B8A1FF]
                      hover:bg-[#F8F5FF]
                      hover:text-[#6C5CE7]

                      sm:text-base
                    "
                  >
                    Explore
                    Velmora
                  </Link>
                </div>

                {/* MINI VALUES */}

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-3
                    gap-2

                    sm:gap-3
                  "
                >
                  {[
                    [
                      "Personal",
                      "Care",
                    ],
                    [
                      "Secure",
                      "Support",
                    ],
                    [
                      "Thoughtful",
                      "Beauty",
                    ],
                  ].map(
                    ([
                      title,
                      text,
                    ]) => (
                      <div
                        key={
                          title
                        }
                        className="
                          rounded-2xl
                          border
                          border-white
                          bg-white/55
                          px-2
                          py-3
                          text-center
                          shadow-sm
                          backdrop-blur-xl

                          sm:px-4
                          sm:py-4
                        "
                      >
                        <p
                          className="
                            text-[11px]
                            font-extrabold
                            text-[#6C5CE7]

                            sm:text-sm
                          "
                        >
                          {
                            title
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-[#8A8490]

                            sm:text-[11px]
                          "
                        >
                          {
                            text
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Reveal>

            {/* ================= RIGHT LUXURY VISUAL ================= */}

            <Reveal
              delay={120}
            >
              <div
                className="
                  relative
                  mx-auto
                  aspect-square
                  w-full
                  max-w-[360px]

                  sm:max-w-[420px]
                "
              >
                {/* Rings */}

                <div
                  className="
                    absolute
                    inset-[5%]
                    rounded-full
                    border
                    border-[#B8A1FF]/35
                  "
                />

                <div
                  className="
                    absolute
                    inset-[18%]
                    rounded-full
                    border
                    border-[#EADBC8]/70
                  "
                />

                <div
                  className="
                    absolute
                    inset-[31%]
                    rounded-full
                    border
                    border-[#F2B8C6]/55
                  "
                />

                {/* Glows */}

                <div
                  className="
                    absolute
                    left-[2%]
                    top-[10%]
                    h-24
                    w-24
                    rounded-full
                    bg-[#EADBC8]/50
                    blur-2xl
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[2%]
                    right-[0%]
                    h-32
                    w-32
                    rounded-full
                    bg-[#B8A1FF]/25
                    blur-3xl
                  "
                />

                {/* CENTER */}

                <div
                  className="
                    absolute
                    inset-[23%]

                    grid
                    place-items-center

                    rounded-[34%]

                    border
                    border-white

                    bg-white/80

                    shadow-[0_30px_90px_rgba(70,53,100,0.13)]

                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      text-center
                    "
                  >
                    <div
                      className="
                        mx-auto
                        grid
                        h-16
                        w-16
                        place-items-center

                        rounded-[22px]

                        bg-gradient-to-br
                        from-[#6C5CE7]
                        to-[#B8A1FF]

                        text-2xl
                        font-black
                        text-white

                        shadow-[0_15px_35px_rgba(108,92,231,0.28)]

                        sm:h-20
                        sm:w-20
                        sm:rounded-[28px]
                        sm:text-3xl
                      "
                    >
                      ✉
                    </div>

                    <p
                      className="
                        mt-4
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.23em]
                        text-[#6C5CE7]

                        sm:mt-5
                        sm:text-xs
                      "
                    >
                      We're
                      listening
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-extrabold
                        text-[#2F3136]

                        sm:mt-2
                        sm:text-2xl
                      "
                    >
                      VELMORA
                    </p>
                  </div>
                </div>

                {/* FLOATING CARDS */}

                <div
                  className="
                    absolute
                    left-[0%]
                    top-[39%]

                    rounded-xl

                    border
                    border-white

                    bg-white/85

                    px-3
                    py-2.5

                    shadow-lg
                    backdrop-blur-xl

                    sm:rounded-2xl
                    sm:px-4
                    sm:py-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-black
                      text-[#6C5CE7]

                      sm:text-xs
                    "
                  >
                    01
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-bold
                      text-[#615B66]

                      sm:text-xs
                    "
                  >
                    Beauty advice
                  </p>
                </div>

                <div
                  className="
                    absolute
                    right-[0%]
                    top-[15%]

                    rounded-xl

                    border
                    border-white

                    bg-white/85

                    px-3
                    py-2.5

                    shadow-lg
                    backdrop-blur-xl

                    sm:rounded-2xl
                    sm:px-4
                    sm:py-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-black
                      text-[#6C5CE7]

                      sm:text-xs
                    "
                  >
                    02
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-bold
                      text-[#615B66]

                      sm:text-xs
                    "
                  >
                    Order care
                  </p>
                </div>

                <div
                  className="
                    absolute
                    bottom-[3%]
                    left-[28%]

                    rounded-xl

                    border
                    border-white

                    bg-white/85

                    px-3
                    py-2.5

                    shadow-lg
                    backdrop-blur-xl

                    sm:rounded-2xl
                    sm:px-4
                    sm:py-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-black
                      text-[#6C5CE7]

                      sm:text-xs
                    "
                  >
                    03
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-bold
                      text-[#615B66]

                      sm:text-xs
                    "
                  >
                    Account help
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTACT METHODS
      =================================================== */}

      <section
        className="
          px-3
          py-12

          sm:px-6
          sm:py-16

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <Reveal>
            <SectionTitle
              center
              eyebrow="Velmora Care"
              title="Choose how you'd like to connect."
              text="Reach our customer care team through the option that feels most convenient for you."
            />
          </Reveal>

          <div
            className="
              mt-9
              grid
              grid-cols-1
              gap-4

              sm:mt-10

              md:grid-cols-3
            "
          >
            {contactMethods.map(
              (
                item,
                index
              ) => (
                <Reveal
                  key={
                    item.title
                  }
                  delay={
                    index *
                    90
                  }
                >
                  <ContactMethodCard
                    item={
                      item
                    }
                  />
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          FORM + CARE PANEL
      =================================================== */}

      <section
        id="contact-form"
        className="
          scroll-mt-24

          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-6

            lg:grid-cols-[1.08fr_0.92fr]
            lg:gap-7
          "
        >
          {/* =================================================
              FORM
          ================================================= */}

          <Reveal>
            <div
              className="
                relative
                overflow-hidden

                rounded-[28px]

                border
                border-[#ECE6F4]

                bg-white

                p-5

                shadow-[0_25px_75px_rgba(61,47,84,0.06)]

                sm:rounded-[34px]
                sm:p-8

                lg:p-10
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-56
                  w-56
                  rounded-full
                  bg-[#B8A1FF]/10
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                "
              >
                <SectionTitle
                  eyebrow="Send a Message"
                  title="Tell us how Velmora can help."
                  text="Share a few details below and our customer care team will have the information needed to understand your request."
                />

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="
                    mt-8
                    space-y-5
                  "
                >
                  {/* NAME + EMAIL */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-5

                      sm:grid-cols-2
                    "
                  >
                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="name"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-[#49434E]
                        "
                      >
                        Your name
                      </label>

                      <div
                        className={
                          fieldClass(
                            "name"
                          )
                        }
                      >
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={
                            form.name
                          }
                          onChange={
                            handleChange
                          }
                          onFocus={() =>
                            setFocused(
                              "name"
                            )
                          }
                          onBlur={() =>
                            setFocused(
                              ""
                            )
                          }
                          placeholder="Enter your name"
                          autoComplete="name"
                          className="
                            min-h-[54px]
                            w-full
                            bg-transparent
                            px-4
                            text-[15px]
                            text-[#2F3136]
                            outline-none

                            placeholder:text-[#AAA4AE]

                            sm:text-base
                          "
                        />
                      </div>

                      {errors.name && (
                        <p
                          className="
                            mt-2
                            text-xs
                            font-semibold
                            text-[#C65E5E]
                          "
                        >
                          {
                            errors.name
                          }
                        </p>
                      )}
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="email"
                        className="
                          mb-2
                          block
                          text-sm
                          font-bold
                          text-[#49434E]
                        "
                      >
                        Email
                        address
                      </label>

                      <div
                        className={
                          fieldClass(
                            "email"
                          )
                        }
                      >
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={
                            form.email
                          }
                          onChange={
                            handleChange
                          }
                          onFocus={() =>
                            setFocused(
                              "email"
                            )
                          }
                          onBlur={() =>
                            setFocused(
                              ""
                            )
                          }
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="
                            min-h-[54px]
                            w-full
                            bg-transparent
                            px-4
                            text-[15px]
                            text-[#2F3136]
                            outline-none

                            placeholder:text-[#AAA4AE]

                            sm:text-base
                          "
                        />
                      </div>

                      {errors.email && (
                        <p
                          className="
                            mt-2
                            text-xs
                            font-semibold
                            text-[#C65E5E]
                          "
                        >
                          {
                            errors.email
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SUBJECT */}

                  <div>
                    <label
                      htmlFor="subject"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-[#49434E]
                      "
                    >
                      How can we
                      help?
                    </label>

                    <div
                      className={
                        fieldClass(
                          "subject"
                        )
                      }
                    >
                      <select
                        id="subject"
                        name="subject"
                        value={
                          form.subject
                        }
                        onChange={
                          handleChange
                        }
                        onFocus={() =>
                          setFocused(
                            "subject"
                          )
                        }
                        onBlur={() =>
                          setFocused(
                            ""
                          )
                        }
                        className="
                          min-h-[54px]
                          w-full
                          cursor-pointer
                          bg-transparent
                          px-4
                          text-[15px]
                          text-[#2F3136]
                          outline-none

                          sm:text-base
                        "
                      >
                        <option>
                          General
                          Question
                        </option>

                        <option>
                          Order
                          Support
                        </option>

                        <option>
                          Product
                          Advice
                        </option>

                        <option>
                          Account Help
                        </option>

                        <option>
                          Website
                          Feedback
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* MESSAGE */}

                  <div>
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
                        htmlFor="message"
                        className="
                          block
                          text-sm
                          font-bold
                          text-[#49434E]
                        "
                      >
                        Your message
                      </label>

                      <span
                        className="
                          text-xs
                          font-semibold
                          text-[#A19AA6]
                        "
                      >
                        {
                          form
                            .message
                            .length
                        }
                        /600
                      </span>
                    </div>

                    <div
                      className={
                        fieldClass(
                          "message"
                        )
                      }
                    >
                      <textarea
                        id="message"
                        name="message"
                        value={
                          form.message
                        }
                        onChange={
                          handleChange
                        }
                        onFocus={() =>
                          setFocused(
                            "message"
                          )
                        }
                        onBlur={() =>
                          setFocused(
                            ""
                          )
                        }
                        maxLength={
                          600
                        }
                        rows={7}
                        placeholder="Tell us how we can help..."
                        className="
                          w-full
                          resize-none
                          bg-transparent
                          px-4
                          py-4
                          text-[15px]
                          leading-7
                          text-[#2F3136]
                          outline-none

                          placeholder:text-[#AAA4AE]

                          sm:text-base
                        "
                      />
                    </div>

                    {errors.message && (
                      <p
                        className="
                          mt-2
                          text-xs
                          font-semibold
                          text-[#C65E5E]
                        "
                      >
                        {
                          errors.message
                        }
                      </p>
                    )}
                  </div>

                  {/* ERROR */}

                  {submitError && (
                    <div
                      className="
                        rounded-2xl
                        border
                        border-[#F0D6D6]
                        bg-[#FFF7F7]
                        p-4
                        text-sm
                        font-semibold
                        leading-6
                        text-[#B95656]
                      "
                    >
                      {
                        submitError
                      }
                    </div>
                  )}

                  {/* SUCCESS */}

                  {submitted && (
                    <div
                      className="
                        rounded-2xl
                        border
                        border-[#D5E9DF]
                        bg-[#F1F8F4]
                        p-4
                        text-sm
                        font-semibold
                        leading-6
                        text-[#3F8062]
                      "
                    >
                      ✓ Thank you
                      for contacting
                      Velmora. Your
                      message has
                      been sent
                      successfully.
                    </div>
                  )}

                  {/* SUBMIT */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-3

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <button
                      type="submit"
                      disabled={
                        loading
                      }
                      className="
                        inline-flex
                        min-h-[54px]
                        w-full
                        items-center
                        justify-center

                        rounded-2xl

                        bg-gradient-to-r
                        from-[#6C5CE7]
                        to-[#927EF1]

                        px-7

                        text-sm
                        font-bold
                        text-white

                        shadow-[0_12px_28px_rgba(108,92,231,0.23)]

                        transition-all
                        duration-300

                        hover:-translate-y-1
                        hover:shadow-[0_17px_36px_rgba(108,92,231,0.30)]

                        active:scale-[0.98]

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        disabled:hover:translate-y-0

                        sm:w-auto
                        sm:text-base
                      "
                    >
                      {loading
                        ? "Sending..."
                        : "Send to Velmora →"}
                    </button>

                    <p
                      className="
                        text-center
                        text-[11px]
                        leading-5
                        text-[#9B95A0]

                        sm:max-w-[220px]
                        sm:text-right
                      "
                    >
                      Your details
                      are used only
                      to respond to
                      your support
                      request.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>

          {/* =================================================
              CUSTOMER CARE PANEL
          ================================================= */}

          <Reveal
            delay={120}
          >
            <div
              id="location"
              className="
                relative
                h-full
                overflow-hidden

                rounded-[28px]

                border
                border-[#E7DFF4]

                bg-gradient-to-br
                from-[#F2EDFF]
                via-white
                to-[#FFF2F5]

                p-5

                shadow-[0_25px_70px_rgba(68,52,95,0.06)]

                sm:rounded-[34px]
                sm:p-8

                lg:p-10
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-56
                  w-56
                  rounded-full
                  bg-[#B8A1FF]/20
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                "
              >
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.24em]
                    text-[#6C5CE7]

                    sm:text-xs
                  "
                >
                  Velmora Care
                </p>

                <h3
                  className="
                    mt-4
                    text-3xl
                    font-extrabold
                    leading-tight
                    tracking-[-0.035em]
                    text-[#2F3136]

                    sm:text-[34px]
                  "
                >
                  Support
                  designed to
                  feel{" "}

                  <span
                    className="
                      font-serif
                      font-medium
                      italic
                      text-[#765FDA]
                    "
                  >
                    personal.
                  </span>
                </h3>

                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-[#6F6974]
                  "
                >
                  Good customer
                  care should
                  remove
                  uncertainty.
                  Velmora keeps
                  the experience
                  clear, calm
                  and easy to
                  navigate from
                  your first
                  message to the
                  final response.
                </p>

                {/* BENEFITS */}

                <div
                  className="
                    mt-8
                    space-y-3
                  "
                >
                  {[
                    [
                      "Clear communication",
                      "Choose the subject that best matches your request so your message is easier to understand.",
                    ],

                    [
                      "Beauty guidance",
                      "Ask for help when you are exploring a product or trying to find the right type of beauty essential.",
                    ],

                    [
                      "Mobile comfort",
                      "Large controls, readable spacing and simple layouts make contacting us easy from smaller screens.",
                    ],

                    [
                      "Thoughtful feedback",
                      "Validation and clear response states keep you informed while submitting your request.",
                    ],
                  ].map(
                    (
                      [
                        title,
                        text,
                      ],
                      index
                    ) => (
                      <div
                        key={
                          title
                        }
                        className="
                          flex
                          gap-3

                          rounded-2xl

                          border
                          border-white

                          bg-white/65

                          p-4

                          backdrop-blur-xl

                          transition-all
                          duration-300

                          hover:bg-white/90
                          hover:shadow-sm

                          sm:gap-4
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-gradient-to-br
                            from-[#6C5CE7]
                            to-[#9B82F2]

                            text-[10px]
                            font-black
                            text-white

                            shadow-[0_7px_18px_rgba(108,92,231,0.20)]
                          "
                        >
                          0
                          {index +
                            1}
                        </span>

                        <div>
                          <p
                            className="
                              font-extrabold
                              text-[#3F3944]
                            "
                          >
                            {
                              title
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              leading-6
                              text-[#77717C]
                            "
                          >
                            {
                              text
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* HOURS */}

                <div
                  className="
                    mt-8

                    rounded-[24px]

                    bg-[#2F3136]

                    p-5

                    text-white

                    shadow-[0_20px_45px_rgba(47,49,54,0.18)]

                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.2em]
                          text-[#CFC1FF]

                          sm:text-xs
                        "
                      >
                        Customer
                        Care
                      </p>

                      <h4
                        className="
                          mt-2
                          text-lg
                          font-extrabold
                        "
                      >
                        Support
                        Hours
                      </h4>
                    </div>

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
                  </div>

                  <div
                    className="
                      mt-5
                      space-y-3
                      text-xs

                      sm:text-sm
                    "
                  >
                    <div
                      className="
                        flex
                        justify-between
                        gap-3
                        border-b
                        border-white/10
                        pb-3
                      "
                    >
                      <span
                        className="
                          text-white/55
                        "
                      >
                        Monday –
                        Friday
                      </span>

                      <span
                        className="
                          text-right
                          font-bold
                        "
                      >
                        9:00 AM –
                        6:00 PM
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        justify-between
                        gap-3
                        border-b
                        border-white/10
                        pb-3
                      "
                    >
                      <span
                        className="
                          text-white/55
                        "
                      >
                        Saturday
                      </span>

                      <span
                        className="
                          text-right
                          font-bold
                        "
                      >
                        9:00 AM –
                        2:00 PM
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-white/55
                        "
                      >
                        Sunday
                      </span>

                      <span
                        className="
                          font-bold
                          text-[#EADBC8]
                        "
                      >
                        Closed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================
          FAQ
      =================================================== */}

      <section
        className="
          px-3
          py-14

          sm:px-6
          sm:py-20

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
          "
        >
          <Reveal>
            <SectionTitle
              center
              eyebrow="Velmora Answers"
              title="A few answers before you reach out."
              text="Explore our most common customer care questions or send us a message if you need something more specific."
            />
          </Reveal>

          <div
            className="
              mt-9
              space-y-3

              sm:mt-10
            "
          >
            {faqs.map(
              (
                item,
                index
              ) => {
                const open =
                  openFaq ===
                  index;

                return (
                  <Reveal
                    key={
                      item.q
                    }
                    delay={
                      index *
                      70
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          open
                            ? -1
                            : index
                        )
                      }
                      aria-expanded={
                        open
                      }
                      className={`
                        w-full
                        rounded-[22px]
                        border
                        p-4
                        text-left

                        transition-all
                        duration-300

                        sm:rounded-[26px]
                        sm:p-6

                        ${
                          open
                            ? "border-[#D8CCFA] bg-[#F8F5FF] shadow-[0_12px_35px_rgba(108,92,231,0.07)]"
                            : "border-[#ECE7F1] bg-white hover:border-[#D8CCFA] hover:bg-[#FDFCFF]"
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3

                          sm:gap-4
                        "
                      >
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            text-[10px]
                            font-black

                            transition-all
                            duration-300

                            sm:h-10
                            sm:w-10
                            sm:text-xs

                            ${
                              open
                                ? "bg-gradient-to-br from-[#6C5CE7] to-[#9B82F2] text-white shadow-md"
                                : "bg-[#F2EDFF] text-[#6C5CE7]"
                            }
                          `}
                        >
                          0
                          {index +
                            1}
                        </div>

                        <h3
                          className="
                            min-w-0
                            flex-1
                            text-sm
                            font-extrabold
                            text-[#342F38]

                            sm:text-lg
                          "
                        >
                          {
                            item.q
                          }
                        </h3>

                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            rounded-full

                            text-lg

                            transition-all
                            duration-300

                            ${
                              open
                                ? "rotate-45 bg-white text-[#6C5CE7]"
                                : "bg-[#FAF8FC] text-[#A09AA5]"
                            }
                          `}
                        >
                          +
                        </span>
                      </div>

                      <div
                        className={`
                          grid
                          transition-all
                          duration-300

                          ${
                            open
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }
                        `}
                      >
                        <div
                          className="
                            overflow-hidden
                          "
                        >
                          <p
                            className="
                              pl-12
                              pt-4
                              text-sm
                              leading-7
                              text-[#716B76]

                              sm:pl-14
                              sm:text-base
                            "
                          >
                            {
                              item.a
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section
        className="
          px-3
          pb-20
          pt-8

          sm:px-6
          sm:pt-10

          lg:px-10
        "
      >
        <Reveal>
          <div
            className="
              relative
              mx-auto
              max-w-6xl
              overflow-hidden

              rounded-[28px]

              bg-[#2F3136]

              px-5
              py-12

              text-center
              text-white

              shadow-[0_30px_80px_rgba(47,49,54,0.20)]

              sm:rounded-[40px]
              sm:px-10
              sm:py-16
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-16
                top-0
                h-56
                w-56
                rounded-full
                bg-[#6C5CE7]/25
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                bottom-0
                h-56
                w-56
                rounded-full
                bg-[#F2B8C6]/15
                blur-3xl
              "
            />

            <div
              className="
                relative
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

                  border
                  border-white/10

                  bg-white/10

                  text-xl
                  text-[#EADBC8]

                  backdrop-blur-xl
                "
              >
                ✦
              </div>

              <p
                className="
                  mt-6
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-[#CDBFFF]

                  sm:text-xs
                "
              >
                Discover
                Velmora
              </p>

              <h2
                className="
                  mx-auto
                  mt-4
                  max-w-3xl

                  text-3xl
                  font-extrabold
                  leading-tight
                  tracking-[-0.035em]

                  sm:text-4xl

                  lg:text-5xl
                "
              >
                Your next beauty
                ritual may be
                waiting.
              </h2>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-2xl

                  text-sm
                  leading-7
                  text-white/65

                  sm:text-base
                "
              >
                Explore the
                Velmora
                collection when
                you're ready, or
                return to our
                customer care
                team whenever
                you need help.
              </p>

              <Link
                to="/products"
                className="
                  mt-8
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-r
                  from-[#6C5CE7]
                  to-[#9B82F2]

                  px-8

                  font-bold
                  text-white

                  shadow-[0_12px_28px_rgba(108,92,231,0.25)]

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:shadow-[0_18px_38px_rgba(108,92,231,0.34)]

                  active:scale-[0.98]
                "
              >
                Explore
                Collection
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}