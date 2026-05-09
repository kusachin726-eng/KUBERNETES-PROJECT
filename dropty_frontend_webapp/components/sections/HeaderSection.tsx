'use client'
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeaderSection() {
  return (
    <div className="bg-[#F4F6FF] px-[26px] py-12  md:px-[92px]" id="home">

    <section className=" w-full max-w-[1200px] mx-auto  ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center md:mt-[40px] mt-[50px] ">
        <div >
          <h1 className="text-[26px] md:text-[44px] font-bold text-[#07040F]  max-w-[340px] md:max-w-[520px] w-full ">
            Effortless <span className="text-[#235DFF]">Luggage Delivery</span>{" "}
            with Dropty
          </h1>

          <p className="mt-4 text-[#575757] text-[13px] md:text-base max-w-[510px]  text-justify  font-semibold md:font-medium ">
            Dropty is a home-to-airport luggage service that simplifies air
            travel in India by offering doorstep luggage pickup and tagging,
            assisting passengers with the check-in process, so they can travel
            without carrying their check-in bags and move through the airport
            more comfortably.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[520px] h-[320px] md:h-[520px] mt-[-20px] ">
            <Image
              src="/images/Header_Image.webp"
              alt="Effortless luggage delivery"
              fill
              className="object-contain"
              priority
            />

            <span className="absolute top-[46%] left-[-10px] md:left-[10px] text-[#393E46] bg-[#FFFFFF] px-4 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
              <Image
                src="/images/mingcute_luggage-fill.png"
                alt=""
                width={16}
                height={16}
              />
              Fast Luggage Delivery
            </span>

            <span className="absolute top-[25%] right-[-10px] md:right-[20px] text-[#393E46] bg-[#FFFFFF] px-4 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
              <Image
                src="/images/mynaui_door-open-solid.png"
                alt=""
                width={16}
                height={16}
              />
              Secure Transport
            </span>

            <span className="absolute bottom-[2%] left-[20%] -translate-x-1/2 text-[#393E46] bg-[#FFFFFF] px-4 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
              <Image
                src="/images/tdesign_secure.png"
                alt=""
                width={16}
                height={16}
              />
              Doorstep Pickup
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Coming Soon Button */}
      
      <div className="fixed bottom-[32px] right-[32px] z-[999]">
  <button
    className="
      px-6 py-3 rounded-xl flex items-center gap-3 text-[18px] font-medium text-white
      bg-gradient-to-r from-[#002491] to-[#235DFF]
      shadow-lg hover:shadow-xl hover:opacity-90 transition
    "
  >
    {/* Animated Icon */}
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Image src="/images/speaker.png" alt="" width={16} height={16} className="mt-[8px]"/>
    </motion.div>

    Coming Soon
  </button>


      </div>
    </section>
    </div>
  );
}
