// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";

// type AnimatedCardProps = {
//   image: string;
//   title: string;
//   description: string;
//   priority?: boolean;
// };

// export default function AnimatedCard({
//   image,
//   title,
//   description,
// }: AnimatedCardProps) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -8,
//         boxShadow: "0px 12px 30px rgba(0,0,0,0.12)",
//       }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       className="max-w-[400px] w-full bg-[#FAFAFA] rounded-[16px] p-4 md:p-6 cursor-pointer"
//     >
//       <Image
//         src={image}
//         alt={title}
//         width={345}
//         height={220}
//         className="mb-3"
//       />

//       <p className="font-semibold text-[18px] md:text-[20px] text-[#07040F] mb-2">
//         {title}
//       </p>

//       <p className="font-medium text-[12px] md:text-base text-[#575757] max-w-[300px]">
//         {description}
//       </p>
//     </motion.div>
//   );
// }
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type AnimatedCardProps = {
  image: string;
  title: string;
  description: string;
  priority?: boolean;
};

export default function AnimatedCard({
  image,
  title,
  description,
  priority = false,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: "0px 12px 30px rgba(0,0,0,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="max-w-[400px] w-full bg-[#FAFAFA] rounded-[16px] p-4 md:p-6 cursor-pointer"
    >
   <Image
  src={image}
  alt={title}
  width={345}
  height={220}
  priority={priority}
  loading={priority ? "eager" : "eager"} // 👈 force eager for ALL cards
  sizes="(max-width: 768px) 100vw, 345px"
  className="mb-3"
/>

      <p className="font-semibold text-[18px] md:text-[20px] text-[#07040F] mb-2">
        {title}
      </p>

      <p className="font-medium text-[12px] md:text-base text-[#575757] max-w-[300px]">
        {description}
      </p>
    </motion.div>
  );
}
