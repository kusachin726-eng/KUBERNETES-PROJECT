import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="w-full bg-[#FAFBFC]">
      <main
        id="about"
        className="max-w-[79rem] mx-auto bg-[#FAFBFC]
             my-[48px] scroll-mt-[60px] md:pt-[36px]">
        <section className="max-w-[723px] w-full mx-auto text-center pt-6 md:pt-8 mb-6 md:mb-[36px]">
          {" "}
          <h2 className="text-[18px] md:text-[32px] font-semibold text-[#07040F] mb-[4px] md:mb-[6px]">
            About <span className="text-[#235DFF]">Dropty</span>
          </h2>
          <p className="font-medium text-[12px] md:text-base text-[#575757]">
            Pack, relax. we’ll do the rest{" "}
          </p>
        </section>
        <section className="w-full mx-auto  md:px-[80px] mt-[48px] grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ================= FIRST ROW ================= */}
          {/* Text */}
          <div className="max-w-[585px] w-full text-[12px] md:text-base font-medium text-[#575757]">
          <Image
  src="/images/aboutdropty.webp"
  alt="about dropty"
  width={534}
  height={405}
  loading="eager"     // 👈 FIX
  sizes="100vw"
  className="block md:hidden mb-6 px-4"
/>
            <p className="mb-6 md:mb-12 text-[12px] md:text-[16px] leading-[22px] md:leading-[26px] font-medium text-[#575757] px-4 md:px-0">
              At Dropty, we’re redefining air travel for flyers across India. As
              India’s smart home luggage check-in assistance service, we pick up
              your luggage from your doorstep and helps you with the check-in
              process . So you can travel light, move freely, and focus on what
              truly matters your journey, not your bags.
            </p>

            <h3 className="text-[16px] md:text-[24px] font-semibold text-[#07040F] mb-4 px-4 md:px-0">
              Our <span className="text-[#235DFF]">Founders</span>
            </h3>

            <p className="text-[12px] md:text-[16px] leading-[22px] md:leading-[26px] px-4 md:px-0 font-medium text-[#575757]">
              Dropty is led by a founding team with strong experience in,
              logistics, and digital operations. With a clear focus on traveler
              convenience, they are reshaping how luggage moves—saving time,
              reducing friction, and making travel feel effortless.
            </p>
          </div>

          {/* Image */}
         <Image
  src="/images/aboutdropty.webp"
  alt="about dropty"
  width={634}
  height={455}
  priority            // 👈 ONLY priority image here
  sizes="(min-width: 768px) 634px, 100vw"
  className="hidden md:block"
/>

          {/* ================= SECOND ROW ================= */}
          {/* Image BELOW image */}
          <div className="flex items-center justify-center">
           <Image
  src="/images/aboutdropty2.webp"
  alt="about dropty story"
  width={300}
  height={330}
  loading="eager"     // 👈 FIX
  sizes="300px"
  className="hidden md:block px-4 md:px-0"
/>
          </div>

          {/* Text BELOW text */}
          <div className="max-w-[585px] w-full md:mt-[86px] text-[12px] md:text-[16px] leading-[22px] md:leading-[26px] font-medium text-[#575757]">
            <h3 className="text-[16px] md:text-[24px] font-semibold text-[#07040F] mb-4 px-4 md:px-0">
              Our <span className="text-[#235DFF]">Story</span>
            </h3>

            <p className="px-4 md:px-0">
              Dropty began with a frustration every traveler knows, long airport
              queues, heavy luggage, and tiring check-ins. It started with one
              simple question: What if travel could begin right at your
              doorstep? From that idea grew a vision to remove stress from
              flying by making journeys lighter and easier. Built in India for a
              nation that travels every day, Dropty helps in luggage check-in,
              smart tracking, and human care to bring the airport experience
              closer to you. Every bag we handle carries more than belongings,
              it carries trust, memories, and stories. Today, Dropty is
              redefining how people travel by making every journey smoother,
              calmer, and truly effortless.
            </p>
           
   <Image
  src="/images/aboutdroptymobile2.webp"
  alt="about dropty story"
  width={300}
  height={330}
  loading="eager"     // 👈 FIX
  sizes="100vw"
  className="block md:hidden"
/>
          
        </div>
        </section>
      </main>
    </div>
  );
}
