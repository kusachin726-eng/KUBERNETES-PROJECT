"use client";

import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type AccordionItem = {
  title: string;
  content: string;
};

type AccordionProps = {
  data: AccordionItem[];
  defaultOpen?: number | null;
};

export default function Accordion({
  data,
  defaultOpen = null,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="w-full max-w-[79rem] px-4 mx-auto mt-[36px]">
      {data.map((item, index) => (
        <div
          key={index}
          className="border-b border-[#E1E1E1] py-[20px] transition-all duration-200"
        >
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="w-full flex justify-between items-center text-left
                      text-[18px] md:text-[24px] font-medium text-[#07040F]"
          >
            {item.title}

            <span
              className={`transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
            >
              <MdKeyboardArrowDown className="text-[20px]" />
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out
                        max-w-[840px] ${
                          openIndex === index
                            ? "max-h-[500px] mt-4"
                            : "max-h-0"
                        }`}
          >
            <p className="text-[12px] md:text-[16px] text-[#575757] font-medium leading-[1.6] px-1">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
