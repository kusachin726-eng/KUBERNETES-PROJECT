
// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
// import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

// const Footer = () => {
//   const Cont = [
//     {
//       title: "Quick Links",
//       link: [
//         { name: "About", url: "/about" },
//         { name: "Services", url: "/services" },
//         { name: "How it works", url: "/how-it-works" },
//         { name: "Connect with us", url: "/contact" },
//       ],
//     },
//   ];

//   const Contact = [
//     { icon: <MdEmail />, text: "info@dropty.com" },
//     { icon: <MdPhone />, text: "+91 92114 12951" },
//     {
//       icon: <MdLocationOn />,
//       text: "1st Floor, D-213, Sector 63 Noida, Gautam Budh Nagar, UP 201301",
//     },
//   ];

//   const SocialLink = [
//     { icon: <FaFacebook className="text-[#1877F2]" />, url: "https://facebook.com" },
//     {
//       icon: <FaInstagram className="text-[#F00073]" />,
//       url: "https://www.instagram.com/droptyofficial?igsh=YWt0bGFyaTl0YjI1",
//     },
//     { icon: <FaTwitter className="text-[#1DA1F2]" />, url: "https://twitter.com" },
//     {
//       icon: <FaLinkedin className="text-[#2867B2]" />,
//       url: "https://www.linkedin.com/company/drop-ty/",
//     },
//   ];

//   return (
//     <footer
//       id="Contact"
//       className="bg-white px-[40px] pt-[80px] pb-[50px] max-md:px-[20px]"
//     >
//       {/* Top Content */}
//       <div className="flex flex-wrap justify-between gap-y-[40px]">
//         {/* Logo + Description */}
//         <div className="w-full md:w-[30%]">
//           <Image
//             src="/images/droptylogo.png"
//             alt="Dropty Logo"
//             width={160}
//             height={40}
//           />

//           <p className="text-[#6F6C90] mt-[12px] max-w-[337px]">
//             Dropty is a home-to-airport luggage service that simplifies air travel
//             in India by offering doorstep luggage pickup and tagging, allowing
//             passengers to travel without carrying their check-in bags or waiting
//             in long queues.
//           </p>
//         </div>

//         {/* Quick Links + Contact (side-by-side on mobile) */}
//         <div className="w-full md:w-[40%] flex max-md:flex-row md:flex-row gap-[20px]">
//           {/* Quick Links */}
//           <div className="w-[40%] md:w-[500px] ">
//             <h4 className="text-[#170F49] font-semibold">Quick Links</h4>

//             <ul className="mt-[20px] list-none">
//               {Cont[0].link.map((link, i) => (
//                 <li key={i} className="mt-[10px] text-[15px]">
//                   <Link
//                     href={link.url}
//                     className="text-[#6F6C90] hover:text-[#170F49] transition-colors"
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Us */}
//           <div className="w-[60%] md:w-auto">
//             <h4 className="text-[#170F49] font-semibold">Contact Us</h4>

//             <ul className="mt-[20px] list-none">
//               {Contact.map((item, id) => (
//                 <li
//                   key={id}
//                   className="mt-[10px] flex items-start text-[15px] text-[#6F6C90]"
//                 >
//                   <span className="mr-[8px] leading-[24px]">{item.icon}</span>
//                   <span className="text-[15px]">{item.text}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Follow Us */}
//         <div className="w-full md:w-[20%]">
//           <h4 className="text-[#170F49] font-semibold">Follow Us On Social</h4>

//           <div className="mt-[20px] flex gap-[12px]">
//             {SocialLink.map((item, index) => (
//               <a
//                 key={index}
//                 href={item.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-[25px] transition-colors hover:text-[#6F6C90]"
//               >
//                 {item.icon}
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="w-full border-t border-[#E0E0E0] mt-[40px] pt-[20px] flex justify-center">
//         <p className="text-[#000000] text-[14px] text-center">
//           © 2025, DOORDROP LOGISTICS PRIVATE LIMITED.
//           <Link href="#" className="text-[#2F6FED] hover:underline ml-[4px]">
//             All Rights Reserved.
//           </Link>
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
"use client";

import React from "react";
import Image from "next/image";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const QuickLinks = [
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "How it works", id: "working" },
    { name: "Connect with us", id: "contact" },
  ];

  const Contact = [
    { icon: <MdEmail />, text: "info@dropty.com" },
    { icon: <MdPhone />, text: "+91 92114 12951" },
    {
      icon: <MdLocationOn />,
      text: "1st Floor, D-213, Sector 63 Noida, Gautam Budh Nagar, UP 201301",
    },
  ];

  const SocialLink = [
    { icon: <FaFacebook className="text-[#1877F2]" />, url: "https://facebook.com" },
    {
      icon: <FaInstagram className="text-[#F00073]" />,
      url: "https://www.instagram.com/droptyofficial?igsh=YWt0bGFyaTl0YjI1",
    },
    { icon: <FaTwitter className="text-[#1DA1F2]" />, url: "https://twitter.com" },
    {
      icon: <FaLinkedin className="text-[#2867B2]" />,
      url: "https://www.linkedin.com/company/drop-ty/",
    },
  ];

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white px-[60px]  pt-[80px] pb-[50px] max-md:px-[20px]">
      {/* Top Content */}
      <div className="flex flex-wrap justify-between gap-y-[40px] md:ml-[36px] ml-[10px] ">
        {/* Logo + Description */}
        <div className="w-full md:w-[30%]">
          <Image
            src="/images/droptylogo.png"
            alt="Dropty Logo"
            width={160}
            height={40}
          />

          <p className="text-[#6F6C90] mt-[12px] max-w-[337px]">
            Dropty is a home-to-airport luggage service that simplifies air travel
            in India by offering doorstep luggage pickup and tagging, allowing
            passengers to travel without carrying their check-in bags or waiting
            in long queues.
          </p>
        </div>

        {/* Quick Links + Contact */}
        <div className="w-full md:w-[40%] flex gap-[20px]">
          {/* Quick Links */}
          <div className="w-[40%] md:w-[500px]">
            <h4 className="text-[#170F49] font-semibold">Quick Links</h4>

            <ul className="mt-[20px] list-none">
              {QuickLinks.map((link, i) => (
                <li
                  key={i}
                  onClick={() => handleScroll(link.id)}
                  className="mt-[10px] text-[15px] cursor-pointer
                             text-[#6F6C90] hover:text-[#170F49] transition-colors"
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="w-[60%] md:w-auto">
            <h4 className="text-[#170F49] font-semibold">Contact Us</h4>

            <ul className="mt-[20px] list-none">
              {Contact.map((item, id) => (
                <li
                  key={id}
                  className="mt-[10px] flex items-start text-[15px] text-[#6F6C90]"
                >
                  <span className="mr-[8px] leading-[24px]">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Follow Us */}
        <div className="w-full md:w-[20%]">
          <h4 className="text-[#170F49] font-semibold">Follow Us On Social</h4>

          <div className="mt-[20px] flex gap-[12px]">
            {SocialLink.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[25px] transition-colors hover:text-[#6F6C90]"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full border-t border-[#E0E0E0] mt-[40px] pt-[20px] flex justify-center">
        <p className="text-[#000000] text-[14px] text-center">
          © 2025, DOORDROP LOGISTICS PRIVATE LIMITED. <span className="text-[#235DFF]">All Rights Reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
