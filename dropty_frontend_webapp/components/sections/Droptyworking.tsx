"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */
interface BaggageCollectStep {
  step: string;
  icon: string;
  activeicon?: string;
  title: string;
  desc: string;
  boxSize: number;
}

/* ================= DATA ================= */
const baggageCollectSteps: BaggageCollectStep[] = [
  {
    step: "Step 1",
    icon: "/images/calender.png",
    activeicon: "/images/calender.png",
    boxSize: 36,
    title: "Schedule & Pickup",
    desc: "Book your luggage service with us — our executive arrives on time, verifies ID, and assists you with Care.",
  },
  {
    step: "Step 2",
    icon: "/images/suitcase.png",
    activeicon: "/images/suitcasewhite.png",
    boxSize: 36,
    title: "Safe & Secure Transport",
    desc: "We carefully handle your bags and ensure they are safely transported to the airport.",
  },
  {
    step: "Step 3",
    icon: "/images/movingluggage.png",
    activeicon: "/images/walkingluggagewhite.png",
    boxSize: 36,
    title: "Luggage delivered at airport",
    desc: "Your luggage is handed over to you at the airport. We assist with your luggage check-in at the airport, so you can proceed smoothly to security and boarding.",
  },
];

/* ================= COMPONENT ================= */
export default function Droptyworking() {
  const [activeStep, setActiveStep] = useState(0); // controls line
  const [activeBoxStep, setActiveBoxStep] = useState(0); // controls box
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActiveStep = useRef(0);

  /* ===== Intersection Observer ===== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveStep(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    stepRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  /* ===== Handle forward & reverse animation ===== */
  useEffect(() => {
    const prev = lastActiveStep.current;

    // ⬇️ Scroll DOWN (forward)
    if (activeStep > prev) {
      const timer = setTimeout(() => {
        setActiveBoxStep(activeStep);
      }, 1200); // wait for line to finish

      lastActiveStep.current = activeStep;
      return () => clearTimeout(timer);
    }

    // ⬆️ Scroll UP (reverse)
    if (activeStep < prev) {
      setActiveBoxStep(activeStep); // box resets immediately
      lastActiveStep.current = activeStep;
    }
  }, [activeStep]);

  return (
    <main
      id="working"
      className="max-w-[79rem] mx-auto px-4 my-[48px]
             scroll-mt-[60px] "
    >
      {/* ================= HEADING ================= */}
      <section className="max-w-[723px] w-full mx-auto text-center mb-6 md:mb-[36px]">
        <h2 className="text-[18px] md:text-[32px] font-semibold text-[#07040F] mb-[4px] md:mb-[6px]">
          How We Help With Your  <span className="text-[#235DFF]">Luggage <br />Check-in</span> 
        </h2>
        <p className="font-medium text-[12px] md:text-base text-[#575757]">
          From your home to the airport, we handle your luggage
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="flex flex-wrap md:flex-nowrap gap-6 md:gap-12 px-4 md:px-[80px]">
        {/* ===== LEFT COLUMN ===== */}
        <div className="max-w-[583px]">
          <h3 className="font-semibold text-base md:text-[24px] mb-4 text-[#235DFF]">
            Travel Light.{" "}
            <span className="font-medium text-[#07040F]">
              We Handle the Bags.
            </span>
          </h3>

          <p className="font-medium text-[12px] md:text-[18px] text-[#575757] mb-8">
            Our home luggage check-in service is convenient, secure, and
            stress-free, letting you hand over your luggage right at your
            doorstep.
          </p>

          <div className="flex items-center justify-center">
           <Image
  src="/images/workdropty.webp"
  alt="Dropty working illustration"
  width={300}
  height={330}
  priority                 // 👈 ONLY priority here
  sizes="(min-width: 768px) 300px, 100vw"
  className="hidden md:block"
/>
          </div>
        </div>

        {/* ===== RIGHT COLUMN – STEPS ===== */}
        <div className="flex flex-col w-full max-w-[650px] gap-[25px]">
          {baggageCollectSteps.map((step, index) => (
            <div
              key={step.step}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-index={index}
              className="relative flex items-start gap-[23px]"
            >
              {/* ===== Vertical Line ===== */}
          {index !== baggageCollectSteps.length - 1 && (
  <div className="absolute left-[18px] top-[36px] w-[2px] h-[calc(100%+25px)] bg-[#E5E7EB] overflow-hidden">
    <div
      className={`w-full h-full bg-[#235DFF]
        origin-top
        transition-transform
        duration-[1200ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${index < activeStep ? "scale-y-100" : "scale-y-0"}
      `}
    />
  </div>
)}


              {/* ===== Icon Box ===== */}
              <div
                style={{ width: step.boxSize, height: step.boxSize }}
                className={`z-10 rounded-[8px]
                  flex items-center justify-center flex-shrink-0
                  shadow-[0_1px_2px_rgba(0,0,0,0.1)]
                  transition-all duration-500 ease-out
                  ${index <= activeBoxStep ? "bg-[#235DFF]" : "bg-white"}
                `}
              >
                <Image
  src={
    index <= activeBoxStep && step.activeicon
      ? step.activeicon
      : step.icon
  }
  alt={step.title}
  width={Math.round(step.boxSize * 0.55)}
  height={Math.round(step.boxSize * 0.55)}
  loading="eager"          // 👈 FIX (icons must not be lazy)
  sizes="36px"
/>

              </div>

              {/* ===== Text ===== */}
              <div>
                <p className="text-[#235DFF] text-[12px] md:text-[14px] font-semibold mb-1">
                  {step.step}
                </p>
                <h4 className="text-[#07040F] text-base md:text-[20px] font-bold mb-[6px]">
                  {step.title}
                </h4>
                <p className="text-[#575757] text-[12px] md:text-[16px] font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

          {/* ===== Mobile Image ===== */}
          <div className="flex items-center justify-center">
            <Image
  src="/images/workdropty.webp"
  alt="Dropty working mobile"
  width={300}
  height={330}
  loading="eager"          // 👈 FIX
  sizes="100vw"
  className="block md:hidden"
/>
          </div>
        </div>
      </section>
    </main>
  );
}
