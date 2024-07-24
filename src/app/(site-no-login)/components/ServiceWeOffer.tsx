import React from "react";
import Card from "@/components/card";

function ServiceWeOffer() {
  return (
    <div className="w-full bg-white py-[36px] lg:py-[88px] px-[6.805%] lg:px-[98px]">
      <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
        SERVICE WE OFFER
      </h1>
      <p className="text-dark-maintext font-poppins text-justify text-[14px] md:text-[16px] lg:text-[20px] mt-4">
        From basic oil changes to extensive engine-out services, are tailored to
        you. Enjoy our professional care on your schedule, wherever you are.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-7 lg:grid-rows-4 gap-x-[13.889%] gap-y-4 md:gap-y-8 lg:gap-y-[88px] justify-between mt-10 lg:mt-20">
        <Card
          index={1}
          title={"Regular Maintenance"}
          paragraph={
            "We bring oil changes, filter replacements, tire rotations, and more directly to your driveway for hassle-free car care."
          }
          src_picture={"/assets/maintenance.png"}
          alt_pic={"Maintenance Parts Picture"}
        />
        <Card
          index={2}
          title={"Brakes"}
          paragraph={
            "Brake pad and rotor replacement, brake fluid flushes, and inspections of the entire braking system to ensure your car comes to a safe stop every time."
          }
          src_picture={"/assets/brakes.png"}
          alt_pic={"Brake Picture"}
        />
        <Card
          index={3}
          title={"Engine"}
          paragraph={
            "From check engine lights to major repairs, our experts diagnose and fix engine issues at your home."
          }
          src_picture={"/assets/engine.png"}
          alt_pic={"Engine Picture"}
        />
        <Card
          index={4}
          title={"Suspension"}
          paragraph={
            "Keep your ride smooth and responsive with our at-home suspension and steering repairs."
          }
          src_picture={"/assets/suspension.png"}
          alt_pic={"Suspension Picture"}
        />
        <Card
          index={5}
          title={"Electronical"}
          paragraph={
            "Troubleshooting electrical problems is a breeze with our on-site diagnostics and repair services."
          }
          src_picture={"/assets/electronical.png"}
          alt_pic={"Electronical Parts Picture"}
        />
        <Card
          index={6}
          title={"Air Conditioner"}
          paragraph={
            "Stay comfortable in any weather with our on-site A/C repair services."
          }
          src_picture={"/assets/air_conditioner.png"}
          alt_pic={"AC Picture"}
        />
        <Card
          index={7}
          title={"Transmission"}
          paragraph={
            "Diagnose and repair automatic or manual transmission problems, ensuring smooth gear changes and optimal performance."
          }
          src_picture={"/assets/transmission.png"}
          alt_pic={"Transmission Picture"}
        />
      </div>
    </div>
  );
}

export default ServiceWeOffer;
