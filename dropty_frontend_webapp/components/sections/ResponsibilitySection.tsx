// import Image from "next/image";

// type ButtonPosition =
//   | "top-left"
//   | "top-left1"
//   | "top-right"
//   | "bottom-left"
//   | "top-right1"
//   | "bottom-center";

// interface ResponsibilityItem {
//   badge: string;
//   title: string;
//   desc: string;
//   img: string;
//   button: string;
//   buttonPosition: ButtonPosition;
// }

// const data: ResponsibilityItem[] = [
//   {
//     badge: "Certified",
//     title: "Licensed & Compliant",
//     desc: "Fully authorized under BCAS and DGCA aviation security standards, ensuring every step follows strict regulations.",
//     img: "/images/License.png",
//     button: "BCAS Certified",
//     buttonPosition: "top-left1",
//   },
//   {
//     badge: "Verified",
//     title: "Verified & Trained Staff",
//     desc: "All Dropty executives are background-verified and professionally trained for safe luggage handling.",
//     img: "/images/Verified1.png",
//     button: "Trained",
//     buttonPosition: "top-left",
//   },
//   {
//     badge: "Insured",
//     title: "Insured Handling",
//     desc: "Every bag is insured, offering complete peace of mind against loss or damage.",
//     img: "/images/Insured-handling.png",
//     button: "Protected",
//     buttonPosition: "top-right",
//   },
//   {
//     badge: "Secure",
//     title: "Secure & Reliable Service",
//     desc: "From pickup to handover, Dropty ensures a seamless, secure, and trustworthy luggage experience.",
//     img: "/images/Secure.png",
//     button: "Smooth",
//     buttonPosition: "top-right1",
//   },
// ];

// const buttonPositionClasses: Record<ButtonPosition, string> = {
//   "top-left": "top-[48px] left-[-18px]",
//   "top-left1": "top-[29px] left-4",
//   "top-right": "top-[78px] right-[125px]",
//   "bottom-left": "bottom-2 left-2",
//   "top-right1": "top-[55px] right-40",
//   "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
// };

// export default function ResponsibilitySection() {
//   return (
//     <section className="max-w-[79rem] mx-auto px-8 py-10 mt-[48px] bg-[#FAFBFC]">
//       <div className="text-center mb-[24px] md:mb-9">
//         <h2 className="text-[18px] md:text-[32px] font-semibold">
//           Your Bags, Our <span className="text-[#235DFF]">Responsibility</span>
//         </h2>
//         <p className="text-[#575757] mt-[4px] md:mt-[6px] text-sm md:text-base">
//           Seamless, secure, and stress-free luggage service
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] max-w-[1024px] mx-auto mb-[20px]">
//         {data.map((item, index) => {
//           const isBlue = item.badge === "Certified" || item.badge === "Insured";

//           const isGreenButton =
//             item.button === "Trained" || item.button === "Smooth";

//           return (
//             <div
//               key={index}
//               className="relative border rounded-2xl px-8 bg-[#FFFFFF]
//               shadow-[0_2px__1px_1px#235DFF33] transition "
//             >
//               <span
//                 className={`absolute top-2 mt-[20px] block mb-[12px] left-4 text-xs px-3 py-1 ml-[14px] rounded-full font-medium
//                 ${
//                   isBlue
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-green-100 text-green-700"
//                 }`}
//               >
//                 {item.badge}
//               </span>

//               <div className="mt-[58px] ">
//                 <h3 className="text-[18px] md:text-[24px] font-semibold mb-[5px]">
//                   {item.title}
//                 </h3>

//                 <p className="text-gray-600 text-[14px] md:text-[16px] leading-relaxed ">
//                   {item.desc}
//                 </p>

//                 <div
//                   className={`relative mx-auto mt-4
//     ${
//       index === 1 || index === 3 ? "w-[200px] h-[200px]" : "w-[200px] h-[200px]"
//     }
//   `}
//                 >
//                   <Image
//                     src={item.img}
//                     alt={item.title}
//                     fill
//                     className="object-contain"
//                   />

//                   <button
//                     className={`absolute text-[10px] px-3 py-1 rounded-[38px] font-semibold
//   transition-all duration-300
//   ${
//     isGreenButton
//       ? "bg-[#FFFFFF] text-green-700 shadow-md  hover:shadow-lg"
//       : "bg-[#FFFFFF] text-[#235DFF] shadow-md  hover:shadow-lg"
//   }
//   ${buttonPositionClasses[item.buttonPosition]}`}
//                   >
//                     {item.button}
//                   </button>
//                   {/* DGCA Certified button – ONLY for first card */}
// {index === 0 && (
//   <button
//     className="
//       absolute
//       bottom-[6px]
//       right-[2px]
//       px-3
//       py-1
//       text-[10px]
//       font-semibold
//       bg-[#FFFFFF]
//       text-[#235DFF]
//       rounded-full
//       shadow-[0_8px_20px_rgba(35,93,255,0.25)]
//       transition-all
//     "
//   >
//     DGCA Certified
//   </button>
// )}

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

import ResponsibilityCard from "../Animations/ResponsiblityAnimationCard";

const data = [
  {
    badge: "Certified",
    title: "Licensed & Compliant",
    desc: "Fully authorized under BCAS and DGCA aviation security standards, ensuring every step follows strict regulations.",
    img: "/images/License.png",
    button: "BCAS Certified",
    buttonPosition: "top-left1",
  },
  {
    badge: "Verified",
    title: "Verified & Trained Staff",
    desc: "All Dropty executives are background-verified and professionally trained for safe luggage handling.",
    img: "/images/Verified1.png",
    button: "Trained",
    buttonPosition: "top-left",
  },
  {
    badge: "Insured",
    title: "Insured Handling",
    desc: "Every bag is insured, offering complete peace of mind against loss or damage.",
    img: "/images/Insured-Handling.png",
    button: "Protected",
    buttonPosition: "top-right",
  },
  {
    badge: "Secure",
    title: "Secure & Reliable Service",
    desc: "From pickup to handover, Dropty ensures a seamless, secure, and trustworthy luggage experience.",
    img: "/images/Secure44.png",
    button: "Smooth",
    buttonPosition: "top-right1",
  },
] as const;


export default function ResponsibilitySection() {
  return (
    <div className="bg-[#FAFBFC] w-full">

    <section className="max-w-[77rem] mx-auto px-4 md:px-[82px] py-10 mt-[48px] bg-[#FAFBFC] w-full">
      <div className="text-center mb-[24px] md:mb-9">
        <h2 className="text-[18px] md:text-[32px] font-semibold">
          Your Bags, Our <span className="text-[#235DFF]">Responsibility</span>
        </h2>
        <p className="text-[#575757] mt-[4px] md:mt-[6px] text-sm md:text-base">
          Seamless, secure, and stress-free luggage service
        </p>
      </div>

      {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] mx-auto">
  {data.map((item, index) => (
    <ResponsibilityCard
      key={index}
      {...item}
      index={index}
      priority={index < 2} // 👈 first row images
    />
  ))}
</div>
    </section>
    </div>
  );
}
