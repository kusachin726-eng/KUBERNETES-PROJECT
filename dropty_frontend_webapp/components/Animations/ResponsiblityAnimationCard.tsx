// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";

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
//   index: number;
// }

// const buttonPositionClasses: Record<ButtonPosition, string> = {
//   "top-left": "top-[48px] left-[-18px]",
//   "top-left1": "top-[29px] left-4",
//   "top-right": "top-[78px] right-[125px]",
//   "bottom-left": "bottom-2 left-2",
//   "top-right1": "top-[38px] right-40",
//   "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
// };

// export default function ResponsibilityCard({
//   badge,
//   title,
//   desc,
//   img,
//   button,
//   buttonPosition,
//   index,
// }: ResponsibilityItem) {
//   const isBlue = badge === "Certified" || badge === "Insured";
//   const isGreenButton = button === "Trained" || button === "Smooth";

//   return (
//     <motion.div
//       whileHover={{
//         y: -8,
//         boxShadow: "0px 14px 30px rgba(35,93,255,0.15)",
//       }}
//       transition={{ type: "spring", stiffness: 280, damping: 20 }}
//       className="relative border rounded-2xl px-8 bg-[#FFFFFF]
//       shadow-[0_2px_10px_rgba(35,93,255,0.15)]"
//     >
//       {/* Badge */}
//       <span
//         className={`absolute top-2 mt-[20px] left-4 text-xs px-3 py-1 ml-[14px] rounded-full font-medium
//         ${
//           isBlue
//             ? "bg-blue-100 text-blue-700"
//             : "bg-green-100 text-green-700"
//         }`}
//       >
//         {badge}
//       </span>

//       <div className="mt-[58px]">
//         <h3 className="text-[18px] md:text-[24px] font-semibold mb-[5px]">
//           {title}
//         </h3>

//         <p className="text-gray-600 text-[14px] md:text-[16px] leading-relaxed">
//           {desc}
//         </p>

//         {/* Image */}
//         <div className="relative mx-auto mt-4 w-[200px] h-[200px] pt-[12px] mb-[20px]">
//           <Image src={img} alt={title} fill className="object-contain" />

//           {/* Main Button */}
//           <button
//             className={`absolute text-[10px] px-3 py-1 rounded-[38px] font-semibold
//             transition-all duration-300
//             ${
//               isGreenButton
//                 ? "bg-white text-green-700 shadow-md hover:shadow-lg"
//                 : "bg-white text-[#235DFF] shadow-md hover:shadow-lg"
//             }
//             ${buttonPositionClasses[buttonPosition]}`}
//           >
//             {button}
//           </button>

//           {/* DGCA Certified – only first card */}
//           {index === 0 && (
//             <button
//               className="absolute bottom-[6px] right-[2px] px-3 py-1 text-[10px]
//               font-semibold bg-white text-[#235DFF] rounded-full
//               shadow-[0_8px_20px_rgba(35,93,255,0.25)]"
//             >
//               DGCA Certified
//             </button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ButtonPosition =
  | "top-left"
  | "top-left1"
  | "top-right"
  | "bottom-left"
  | "top-right1"
  | "bottom-center";

interface ResponsibilityItem {
  badge: string;
  title: string;
  desc: string;
  img: string;
  button: string;
  buttonPosition: ButtonPosition;
  index: number;
  priority?: boolean; // 👈 NEW
}

const buttonPositionClasses: Record<ButtonPosition, string> = {
  "top-left": "top-[48px] left-[-18px]",
  "top-left1": "top-[29px] left-4",
  "top-right": "top-[78px] right-[125px]",
  "bottom-left": "bottom-2 left-2",
  "top-right1": "top-[38px] right-40",
  "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
};

export default function ResponsibilityCard({
  badge,
  title,
  desc,
  img,
  button,
  buttonPosition,
  index,
  priority = false,
}: ResponsibilityItem) {
  const isBlue = badge === "Certified" || badge === "Insured";
  const isGreenButton = button === "Trained" || button === "Smooth";

  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: "0px 14px 30px rgba(35,93,255,0.15)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="relative border rounded-2xl px-8 bg-[#FFFFFF]
      shadow-[0_2px_10px_rgba(35,93,255,0.15)]"
    >
      {/* Badge */}
      <span
        className={`absolute top-2 mt-[20px] left-4 text-xs px-3 py-1 ml-[14px] rounded-full font-medium
        ${
          isBlue
            ? "bg-blue-100 text-blue-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {badge}
      </span>

      <div className="mt-[58px]">
        <h3 className="text-[18px] md:text-[24px] font-semibold mb-[5px]">
          {title}
        </h3>

        <p className="text-gray-600 text-[14px] md:text-[16px] leading-relaxed">
          {desc}
        </p>

        {/* Image */}
        <div className="relative mx-auto mt-4 w-[200px] h-[200px] pt-[12px] mb-[20px]">
          <Image
            src={img}
            alt={title}
            fill
            priority={priority}            // 👈 preload for top cards
            loading="eager"                // 👈 force eager load
            sizes="200px"                  // 👈 VERY IMPORTANT
            className="object-contain"
          />

          {/* Main Button */}
          <button
            className={`absolute text-[10px] px-3 py-1 rounded-[38px] font-semibold
            transition-all duration-300
            ${
              isGreenButton
                ? "bg-white text-green-700 shadow-md hover:shadow-lg"
                : "bg-white text-[#235DFF] shadow-md hover:shadow-lg"
            }
            ${buttonPositionClasses[buttonPosition]}`}
          >
            {button}
          </button>

          {/* DGCA Certified – only first card */}
          {index === 0 && (
            <button
              className="absolute bottom-[6px] right-[2px] px-3 py-1 text-[10px]
              font-semibold bg-white text-[#235DFF] rounded-full
              shadow-[0_8px_20px_rgba(35,93,255,0.25)]"
            >
              DGCA Certified
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
