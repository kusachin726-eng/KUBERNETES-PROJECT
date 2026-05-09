import Image from "next/image";

export default function MobileSection() {
  return (
    <section className="max-w-[79rem] mx-auto px-4 mt-[48px]">
      {/* Card */}
      <div className="relative bg-[#EEF2FFB2] rounded-[24px] p-4 md:p-[80px] flex flex-col md:flex-row items-center gap-4 md:gap-10">

        {/* ✈️ Flight Path Image */}
        <Image
          src="/images/comingsoon.png"
          alt="Flight icon"
          width={385}
          height={91}
          className="
            mb-4 block w-[220px] ml-auto mr-4
            md:w-[385px] md:mb-0 md:absolute md:top-[13px] md:right-[24px]
            xl:right-auto xl:left-[831px]
            opacity-100 rotate-0
          "
        />

        {/* LEFT: Mobile Image */}
        <div className="flex-1 flex justify-center md:ml-[-40px] lg:ml-[-80px]">
          <Image
            src="/images/combineds.webp"
            alt="Dropty Mobile App"
            width={400}
            height={520}
            className="object-contain"
            priority
          />
        </div>

        {/* RIGHT: Text */}
            <div className="flex-1 ml-4 mt-6 md:mt-0 md:ml-[-40px] lg:ml-[-80px]">
            <h3 className="text-[18px] md:text-[38px] leading-[26px] md:leading-[50px] font-bold text-[#07040F] mb-4">
            Available soon on
            <span className="block text-[#235DFF]">
              Android and iOS
            </span>
          </h3>

          <p className="text-[16px] leading-[26px] font-medium text-[#575757] mb-6 md:mb-0">          
            Ready to take your travel plans to the next level of convenience and
            accessibility? Our mobile app is coming soon—your ultimate travel
            companion, right in the palm of your hand.
          </p>
        </div>
      </div>
    </section>
  );
}
