import AboutSection from "@/components/sections/Aboutsection";
import ChooseDropty from "@/components/sections/ChooseDropty";
import MobileSection from "@/components/sections/Mobilesection";
import OfferServices from "@/components/sections/OfferServices";
import Questions from "@/components/sections/Question";
import Droptyworking from "@/components/sections/Droptyworking";
import ResponsibilitySection from "@/components/sections/ResponsibilitySection";

import ContactSection from "@/components/sections/ContactUs";
import HeaderSection from "@/components/sections/HeaderSection";




export default function Home() {
  return (
    <>
 
 <HeaderSection/>
 <OfferServices/>
 <ChooseDropty/>
 <Droptyworking/>
 <ResponsibilitySection/>
 <AboutSection/>
 <ContactSection/>
 <MobileSection/>
 <Questions/>

 
    </>
  );
}
