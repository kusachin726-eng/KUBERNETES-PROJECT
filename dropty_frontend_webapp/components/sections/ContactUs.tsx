
// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";

// import SuccessMessage from "@/components/successmessage";
// import { submitContact } from "@/app/actions/submitContact";

// /* ===== Validators ===== */
// const isValidEmail = (email: string) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// export default function ContactSection() {
//   const [submitted, setSubmitted] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile_number: "",
//     message: "",
//   });

//   const [emailError, setEmailError] = useState("");

//   // ⏱️ Hide success message after 10 seconds
//   useEffect(() => {
//     if (submitted) {
//       const timer = setTimeout(() => {
//         setSubmitted(false);
//       }, 10000);

//       return () => clearTimeout(timer);
//     }
//   }, [submitted]);

//   /* ===== Handlers ===== */
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     setForm({ ...form, [name]: value });

//     // Live email validation
//     if (name === "email") {
//       if (value && !isValidEmail(value)) {
//         setEmailError("Please enter a valid email address");
//       } else {
//         setEmailError("");
//       }
//     }
//   };

//   const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "");

//     if (value.length <= 10) {
//       setForm({ ...form, mobile_number: value });
//     }
//   };

//   return (
//     <section
//   id="contact"
//   className="max-w-[72rem] mx-auto px-4 my-[48px] scroll-mt-[90px] ">

//       {/* ===== Heading ===== */}
//       <div className="text-center mb-10">
//         <h2 className="text-2xl md:text-3xl font-semibold text-[#07040F]">
//           Let’s <span className="text-[#235DFF]">Simplify</span> Your Travel
//         </h2>
//         <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
//           Contact us to experience a smarter, safer way to manage your luggage.
//         </p>
//       </div>

//       {/* ===== Content Grid ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//         {/* ===== IMAGE ===== */}
//         <div className="w-full flex justify-center">
//           <div className="relative w-full max-w-[530px] h-[260px] md:h-[400px] rounded-xl overflow-hidden">
//             <Image
//               src="/images/Contactform.webp"
//               alt="Customer support"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//         </div>

//         {/* ===== FORM ===== */}
//         <div className="w-full">
//           <form
//             action={async (formData) => {
//               const result = await submitContact(formData);
//               if (result?.ok) {
//                 setSubmitError("");
//                 setSubmitted(true);
//                 setForm({ name: "", email: "", mobile_number: "", message: "" });
//               } else {
//                 // show a simple user-facing error
//                 const message = result?.message
//                   ? `Submission failed: ${result.message}`
//                   : "Submission failed. Please try again later or contact support.";
//                 setSubmitError(message);
//                 console.error("Failed to submit contact", result?.message);

//                 // auto-clear after 8 seconds
//                 setTimeout(() => setSubmitError(""), 8000);
//               }
//             }}
//             className="w-full space-y-4 text-[#575757] font-semibold"
//           >
//             {/* 🔒 HARDCODED SUBJECT */}
//             <input
//               type="hidden"
//               name="subject"
//               value="Home Luggage Check-in Inquiry"
//             />

//             {/* NAME */}
//             <div>
//               <label className="block text-sm mb-1">Name*</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter your name"
//                 required
//                 className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* EMAIL */}
//             <div>
//               <label className="block text-sm mb-1">Email Address</label>
//               <input
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter email address"
//                 className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 ${
//                   emailError
//                     ? "border-red-500 focus:ring-red-400"
//                     : "focus:ring-blue-500"
//                 }`}
//               />
//               {emailError && (
//                 <p className="mt-1 text-xs text-red-500">{emailError}</p>
//               )}
//             </div>

//             {/* MOBILE */}
//             <div>
//               <label className="block text-sm mb-1">Mobile Number*</label>
//               <input
//                 name="mobile_number"
//                 value={form.mobile_number}
//                 onChange={handleMobileChange}
//                 placeholder="Enter mobile no."
//                 required
//                 inputMode="numeric"
//                 className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//               />
//               {form.mobile_number.length > 0 &&
//                 form.mobile_number.length < 10 && (
//                   <p className="mt-1 text-xs text-red-500">
//                     Mobile number must be exactly 10 digits
//                   </p>
//                 )}
//             </div>

//             {/* MESSAGE */}
//             <div>
//               <label className="block text-sm mb-1">
//                 Tell Us Your Requirement*
//               </label>
//               <textarea
//                 name="message"
//                 value={form.message}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="Tell us your requirement"
//                 required
//                 className="w-full rounded-lg border px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* SUBMIT */}
//             <button
//               type="submit"
//               disabled={
//                 !form.name ||
//                 !form.mobile_number ||
//                 form.mobile_number.length !== 10 ||
//                 !!emailError ||
//                 !form.message
//               }
//               className="mt-2 w-[140px] rounded-xl bg-[#235DFF] text-white py-3 text-[16px] font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               Submit
//             </button>
//           </form>

//           {/* ===== SUCCESS MESSAGE ===== */}
//           {submitted && <SuccessMessage />}

//           {/* ===== ERROR MESSAGE ===== */}
//           {submitError && (
//             <div className="mt-4 text-sm text-red-600 font-semibold">
//               {submitError}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import SuccessMessage from "@/components/successmessage";
import { submitContact } from "@/app/actions/submitContact";

/* ===== Validators ===== */
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    subject: "",
  });

  const [emailError, setEmailError] = useState("");

  // ⏱️ Hide success message after 10 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  /* ===== Handlers ===== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (value && !isValidEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setForm({ ...form, mobile_number: value });
    }
  };

  return (
    <section
      id="contact"
      className="max-w-[72rem] mx-auto px-4 my-[48px] scroll-mt-[90px]"
    >
      {/* ===== Heading ===== */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#07040F]">
          Let’s <span className="text-[#235DFF]">Simplify</span> Your Travel
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
          Contact us to experience a smarter, safer way to manage your luggage.
        </p>
      </div>

      {/* ===== Content Grid ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* ===== IMAGE ===== */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-[530px] h-[260px] md:h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/images/Contactform.webp"
              alt="Customer support"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ===== FORM ===== */}
        <div className="w-full">
          <form
            action={async (formData) => {
              const result = await submitContact(formData);

              if (result?.ok) {
                setSubmitError("");
                setSubmitted(true);
                setForm({
                  name: "",
                  email: "",
                  mobile_number: "",
                  subject: "",
                });
              } else {
                const message = result?.message
                  ? `Submission failed: ${result.message}`
                  : "Submission failed. Please try again later.";
                setSubmitError(message);
                console.error("Failed to submit contact", result?.message);

                setTimeout(() => setSubmitError(""), 8000);
              }
            }}
            className="w-full space-y-4 text-[#575757] font-semibold"
          >
            {/* NAME */}
            <div>
              <label className="block text-sm mb-1">Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm mb-1">Mobile Number*</label>
              <input
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleMobileChange}
                placeholder="Enter mobile no."
                required
                inputMode="numeric"
                className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {form.mobile_number.length > 0 &&
                form.mobile_number.length < 10 && (
                  <p className="mt-1 text-xs text-red-500">
                    Mobile number must be exactly 10 digits
                  </p>
                )}
            </div>

            {/* REQUIREMENT (SUBJECT) */}
            <div>
              <label className="block text-sm mb-1">
                Tell Us Your Requirement*
              </label>
              <textarea
                name="subject"
                value={form.subject}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us your requirement"
                required
                className="w-full rounded-lg border px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                !form.name ||
                !form.mobile_number ||
                form.mobile_number.length !== 10 ||
                !!emailError ||
                !form.subject
              }
              className="mt-2 w-[140px] rounded-xl bg-[#235DFF] text-white py-3 text-[16px] font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </form>

          {/* ===== SUCCESS MESSAGE ===== */}
          {submitted && <SuccessMessage />}

          {/* ===== ERROR MESSAGE ===== */}
          {submitError && (
            <div className="mt-4 text-sm text-red-600 font-semibold">
              {submitError}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
