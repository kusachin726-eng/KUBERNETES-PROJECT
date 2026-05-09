import Accordion from "@/components/ui/Accordion";

export default function Questions() {
  const luggageBookingFAQs = [
    {
      title: "Which cities and airports does Dropty currently serve?",
      content:
        "Dropty is preparing to launch its services very soon. We’ll be starting with major metro airports and expanding rapidly across India.",
    },
    {
      title: "Is my luggage safe with Dropty?",
      content:
        "Absolutely. Every bag is sealed at pickup, tracked in real time through our system, and insured for extra protection. Our staff are background-verified, trained in secure handling, and follow BCAS/DGCA aviation security guidelines. Your luggage is always in safe hands.",
    },
    {
      title: " How our Home-luggage Check-in Assistance Service works?",
      content: "We pick up your luggage from your home at a scheduled time and securely transport it to the airport. Our team assists with the necessary airport baggage procedures, so you can travel comfortably without carrying your bags.",
    },
    {
      title: "What types of luggage do you accept?",
      content:
        "We accept standard domestic flight luggage, including suitcases, trolley bags, and travel bags that comply with Indian airline size and weight guidelines.",
    },
  ];

  return (
    <section className="overflow-visible">
      <div className="max-w-[70rem] mx-auto mt-[48px] px-4">
        <h1 className="text-[18px] md:text-[32px] font-semibold text-center text-[#07040F] mb-[4px] md:mb-[6px]">
          Frequently Asked <span className="text-[#235DFF]">Questions</span>
        </h1>
        <p className="font-medium text-[12px] md:text-base text-[#575757] text-center">
          Have Questions? We Have The Answers
        </p>

        <Accordion data={luggageBookingFAQs} />
      </div>
    </section>
  );
}
