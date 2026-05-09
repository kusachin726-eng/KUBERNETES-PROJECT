import Image from "next/image";

export default function OfferServices() {
  return (
    <section
      id="services"
      className="max-w-[79rem] mx-auto px-4
             my-[48px] scroll-mt-[60px]"
    >
      {/* Heading */}
      <div className="text-center mb-6 md:mb-9">
        <h2 className=" text-[18px] md:text-[32px] font-semibold text-[#0F172A]">
          What <span className="text-[#235DFF]">Services</span> We Offers
        </h2>
        <p className="text-[#64748B] mt-[4px] md:mt-[6px] text-[12px] md:text-[16px]">
          The best booking platform you can trust
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#EEF2FFB2] rounded-[24px] p-4 md:p-[80px] flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1">
          <h3 className="text-[20px] md:text-[28px] font-medium text-[#0F172A] mb-4">
            Home <span className="text-[#235DFF]">Luggage Check-in</span>{" "}
            Assistance
          </h3>

          <p className="text-[#575757] text-[12px] md:text-[16px] mb-6 max-w-[400px] w-full">
            We pick up your luggage from home and helps with airport check-in,
            so you can travel completely luggage-free.
          </p>

          <div className=" flex gap-[30px] flex-wrap max-w-[359px] w-full">
            <Feature icon="/images/lightning-fill.webp" text="Fast Pickup " />
            <Feature icon="/images/mdi_truck.webp" text="Secure transport" />
            <Feature
              icon="/images/mdi_account-tick.webp"
              text="Handled by Experts"
            />
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full">
          <div className="rounded-[20px] overflow-hidden">
            <Image
              src="/images/offerservices.webp"
              alt="Home Luggage Check-in"
              width={500}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ffff]">
        <Image
          src={icon}
          alt={text}
          width={16}
          height={16}
          className="object-contain"
        />
      </span>
      <p className="text-[#07040F] font-medium text-[12px] md:text-[16px]">
        {text}
      </p>
    </div>
  );
}
