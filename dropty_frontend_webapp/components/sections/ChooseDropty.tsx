


import AnimatedCard from "../Animations/AnimatedCard";

type ChooseDroptyItem = {
  id: number;
  image: string;
  title: string;
  description: string;
};

const chooseDroptyData: ChooseDroptyItem[] = [
  {
    id: 1,
    image: "/images/airportrush.webp",
    title: "Skip the airport rush",
    description: "Start your journey stress-free with doorstep pickup.",
  },
  {
    id: 2,
    image: "/images/savemoney.webp",
    title: "Save money while you travel",
    description:
      "Save on cab fares, Dropty helps you travel smarter and spend less.",
  },
  {
    id: 3,
    image: "/images/choosedropty.webp",
    title: "Travel hassle-free",
    description: "We take care of your luggage so you can travel freely.",
  },
  {
    id: 4,
    image: "/images/savetime.webp",
    title: "Save 45–60 minutes",
    description: "Make more time for what matters the most.",
  },
  {
    id: 5,
    image: "/images/easetravel.webp",
    title: "Easy travel for every individual",
    description:
      "We provide smoother travel experience for families & professionals.",
  },
  {
    id: 6,
    image: "/images/suitcase.webp",
    title: "Reliable & Secure",
    description: "Your luggage is tracked and insured throughout.",
  },
];

export default function ChooseDropty() {
  return (
    <main className="max-w-[79rem] mx-auto px-4 mt-[48px]">
      {/* Heading */}
      <section className="max-w-[723px] w-full mx-auto text-center mb-6 md:mb-[36px]">
        <h2 className="text-[18px] md:text-[32px] font-semibold text-[#07040F] mb-[4px] md:mb-[6px]">
          Why Choose <span className="text-[#235DFF]">Dropty?</span>
        </h2>
        <p className="font-medium text-[12px] md:text-base text-[#575757]">
          Our luggage service that transforms how you travel. 
        </p>
      </section>

      {/* Cards */}
   <section className="flex flex-wrap gap-4 justify-center">
  {chooseDroptyData.map((item, index) => (
    <AnimatedCard
      key={item.id}
      image={item.image}
      title={item.title}
      description={item.description}
      priority={index < 3}   // 👈 FIX
    />
  ))}
</section>
    </main>
  );
}
