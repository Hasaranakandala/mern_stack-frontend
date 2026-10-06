import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
/* =========================================================
   REVEAL ANIMATION
========================================================= */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {text && (
        <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   CONTACT CARDS
========================================================= */

const contactMethods = [
  {
    icon: <SiGmail />,
    title: "Email us",
    value: "productsales92@gmail.com",
    text: "For general questions, product help and account support.",
    href: "mailto:productsales92@gmail.com",
  },
  {
    icon:< FaPhoneVolume/>,
    title: "Call us",
    value: "+94 716510980",
    text: "Available during our customer support hours.",
    href: "tel:+94716510980",
  },
  {
    icon: <FaLocationDot />,
    title: "Visit us",
    value: "Colombo, Sri Lanka",
    text: "Beauty Store customer support and operations.",
    href: "#location",
  },
];

const faqs = [
  {
    q: "How can I get help with an order?",
    a: "Use the contact form and choose Order Support as the subject. Add your order number in the message so the team can understand the issue faster.",
  },
  {
    q: "Can I ask for product recommendations?",
    a: "Yes. Choose Product Advice in the contact form and explain your routine or what type of product you are looking for.",
  },
  {
    q: "How quickly will I receive a reply?",
    a: "This demo page shows the intended UX. When connected to your backend or email service, you can define your real response time and display it here.",
  },
  {
    q: "Can I report a problem with the website?",
    a: "Yes. Choose Website Feedback and describe what happened, including the page and device you were using.",
  },
];

/* =========================================================
   CONTACT PAGE
========================================================= */

export default function Contact() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Question",
    message: "",
  });

  const [focused, setFocused] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMouse({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message should contain at least 10 characters.";
    }

    return nextErrors;
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const nextErrors = validate();

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    setSubmitted(false);
    return;
  }

  try {
    setLoading(true);
    setSubmitError("");
    setSubmitted(false);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/contacts`,
      {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }
    );

    console.log(response.data);

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "General Question",
      message: "",
    });

    setErrors({});
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    setSubmitError(
      error.response?.data?.message ||
        "Failed to send message. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffafa] text-slate-900">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-10 lg:pb-20">
        <div
          onMouseMove={handleHeroMove}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white bg-gradient-to-br from-white via-rose-50/70 to-amber-50/60 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:rounded-[42px]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(251,113,133,0.17), transparent 28%)`,
            }}
          />

          <div className="relative grid min-h-[520px] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_0.8fr] lg:px-14 lg:py-16">
            <Reveal>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-500 backdrop-blur-xl">
                  <span className="text-base">✦</span>
                  Contact Beauty Store
                </div>

                <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  We’re here to help you
                  <span className="block bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                    feel confident.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                  Have a question about a product, an order or your account?
                  Send us a message and make your next step easier.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact-form"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-red-500 px-7 font-bold text-white shadow-lg shadow-red-200/60 transition duration-300 hover:-translate-y-1 hover:bg-red-600"
                  >
                    Send a Message
                  </a>

                  <Link
                    to="/products"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-7 font-bold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <div className="absolute inset-[6%] rounded-full border border-red-200/60" />
                <div className="absolute inset-[19%] rounded-full border border-amber-200/70" />
                <div className="absolute inset-[31%] rounded-full border border-rose-200/70" />

                <div className="absolute left-[4%] top-[12%] h-24 w-24 rounded-full bg-amber-100/80 blur-2xl" />
                <div className="absolute bottom-[5%] right-[0%] h-32 w-32 rounded-full bg-rose-200/70 blur-3xl" />

                <div className="absolute inset-[24%] grid place-items-center rounded-[38%] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
                  <div className="text-center">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-red-500 to-rose-400 text-3xl font-black text-white shadow-xl shadow-red-200/60">
                      ✉
                    </div>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-red-500">
                      Let’s Talk
                    </p>

                    <p className="mt-2 text-2xl font-black text-slate-950">
                      Beauty Store
                    </p>
                  </div>
                </div>

                <div className="absolute left-[0%] top-[42%] rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur-xl">
                  <p className="text-xs font-black text-red-500">01</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">
                    Product help
                  </p>
                </div>

                <div className="absolute right-[1%] top-[18%] rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur-xl">
                  <p className="text-xs font-black text-red-500">02</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">
                    Order support
                  </p>
                </div>

                <div className="absolute bottom-[3%] left-[30%] rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur-xl">
                  <p className="text-xs font-black text-red-500">03</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">
                    Feedback
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT METHODS
      ===================================================== */}

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="Reach Us"
              title="Choose the easiest way to connect."
              text="Use the form below or contact us directly using one of these options."
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {contactMethods.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <a
                  href={item.href}
                  className="group block h-full rounded-[26px] border border-white bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-[0_25px_70px_rgba(15,23,42,0.09)]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-xl text-red-500 transition duration-300 group-hover:bg-red-500 group-hover:text-white">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 font-bold text-red-500">{item.value}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FORM + SUPPORT PANEL
      ===================================================== */}

      <section
        id="contact-form"
        className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-[32px] border border-white bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
              <SectionTitle
                eyebrow="Send a Message"
                title="Tell us how we can help."
                text="Complete the form below. This version includes frontend validation and a success state."
              />

              {submitted && (
                <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-700">
                  ✓ Your message has been captured by the interface. Connect
                  this form to your backend API to send it to your real support
                  system.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Your name
                    </label>

                    <div
                      className={`
                        rounded-2xl border bg-[#fffdfd] transition
                        ${
                          focused === "name"
                            ? "border-red-300 ring-4 ring-red-50"
                            : errors.name
                            ? "border-red-300"
                            : "border-slate-200"
                        }
                      `}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        placeholder="Enter your name"
                        className="min-h-[52px] w-full bg-transparent px-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {errors.name && (
                      <p className="mt-2 text-xs font-semibold text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Email address
                    </label>

                    <div
                      className={`
                        rounded-2xl border bg-[#fffdfd] transition
                        ${
                          focused === "email"
                            ? "border-red-300 ring-4 ring-red-50"
                            : errors.email
                            ? "border-red-300"
                            : "border-slate-200"
                        }
                      `}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                        placeholder="you@example.com"
                        className="min-h-[52px] w-full bg-transparent px-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-2 text-xs font-semibold text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    What can we help with?
                  </label>

                  <div
                    className={`
                      rounded-2xl border bg-[#fffdfd] transition
                      ${
                        focused === "subject"
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-slate-200"
                      }
                    `}
                  >
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused("")}
                      className="min-h-[52px] w-full cursor-pointer bg-transparent px-4 text-base text-slate-900 outline-none"
                    >
                      <option>General Question</option>
                      <option>Order Support</option>
                      <option>Product Advice</option>
                      <option>Account Help</option>
                      <option>Website Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-slate-700"
                    >
                      Message
                    </label>

                    <span className="text-xs font-semibold text-slate-400">
                      {form.message.length}/600
                    </span>
                  </div>

                  <div
                    className={`
                      rounded-2xl border bg-[#fffdfd] transition
                      ${
                        focused === "message"
                          ? "border-red-300 ring-4 ring-red-50"
                          : errors.message
                          ? "border-red-300"
                          : "border-slate-200"
                      }
                    `}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                      maxLength={600}
                      rows={7}
                      placeholder="Tell us what you need help with..."
                      className="w-full resize-none bg-transparent px-4 py-4 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {errors.message && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>
{submitError && (
  <div
    className="
      rounded-2xl
      border
      border-red-100
      bg-red-50
      p-4
      text-sm
      font-semibold
      text-red-600
    "
  >
    {submitError}
  </div>
)}

<button
  type="submit"
  disabled={loading}
  className="
    inline-flex
    min-h-[54px]
    w-full
    items-center
    justify-center
    rounded-2xl
    bg-red-500
    px-7
    font-bold
    text-white
    shadow-lg
    shadow-red-200/60
    transition
    duration-300
    hover:-translate-y-1
    hover:bg-red-600
    disabled:cursor-not-allowed
    disabled:opacity-60
    sm:w-auto
  "
>
  {loading ? "Sending..." : "Send Message →"}
</button>

{submitted && (
  <div
    className="
      mt-7
      rounded-2xl
      border
      border-emerald-100
      bg-emerald-50
      p-4
      text-sm
      font-semibold
      text-emerald-700
    "
  >
    ✓ Your message has been sent successfully.
  </div>
)}

               
              </form>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              id="location"
              className="h-full overflow-hidden rounded-[32px] border border-red-100 bg-gradient-to-br from-red-50 via-white to-amber-50 p-6 sm:p-8 lg:p-10"
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
                Customer Care
              </p>

              <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                Support that feels clear and personal.
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                A good support experience should reduce uncertainty. That is
                why this page uses clear contact options, visible form states
                and simple feedback after submission.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  ["Response flow", "Clear subject selection helps route each request."],
                  ["Form feedback", "Validation appears directly beside the field that needs attention."],
                  ["Mobile friendly", "Inputs remain comfortable to use on small screens."],
                  ["Accessible", "Labels, native controls and visible focus states are included."],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-white bg-white/75 p-4 backdrop-blur-xl"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-500 text-xs font-black text-white">
                      0{index + 1}
                    </span>

                    <div>
                      <p className="font-black text-slate-800">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] bg-slate-950 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">
                  Support Hours
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-slate-400">Monday – Friday</span>
                    <span className="font-bold">9:00 AM – 6:00 PM</span>
                  </div>

                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-slate-400">Saturday</span>
                    <span className="font-bold">9:00 AM – 2:00 PM</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Sunday</span>
                    <span className="font-bold">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="Frequently Asked Questions"
              title="Quick answers before you message us."
              text="Tap a question to expand the answer."
            />
          </Reveal>

          <div className="mt-10 space-y-3">
            {faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <Reveal key={item.q} delay={index * 70}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className={`
                      w-full rounded-[24px] border p-5 text-left transition duration-300 sm:p-6
                      ${
                        open
                          ? "border-red-100 bg-red-50/70"
                          : "border-slate-100 bg-white hover:border-red-100 hover:bg-red-50/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-black
                          ${
                            open
                              ? "bg-red-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        0{index + 1}
                      </div>

                      <h3 className="min-w-0 flex-1 text-base font-black text-slate-950 sm:text-lg">
                        {item.q}
                      </h3>

                      <span
                        className={`
                          text-xl font-light text-slate-400 transition duration-300
                          ${open ? "rotate-45 text-red-500" : ""}
                        `}
                      >
                        +
                      </span>
                    </div>

                    <div
                      className={`
                        grid transition-all duration-300
                        ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <p className="pl-14 pt-4 text-sm leading-7 text-slate-500 sm:text-base">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-10">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-950 px-6 py-14 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-16 top-0 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl backdrop-blur-xl">
                ✦
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-red-300">
                Continue Shopping
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Your next beauty favourite might be one click away.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore the collection when you are ready, or send us a message
                whenever you need help.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-red-500 px-7 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-red-600"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
