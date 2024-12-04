"use client";

import Button from "@/components/button";
import { useRouter } from "next/navigation";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Field from "@/components/field";
import TextAreaField from "@/components/text-area-field";
import { toastError, toastSuccess } from "@/components/toast";
import {
  get,
  getWithCredentials,
  postBotWithJson,
  postWithForm,
  postWithJson,
} from "@/lib/api";
import { UserContext } from "@/lib/context/user-context";

interface InquiryData {
  cars_brand: string;
  cars_year: string;
  problem: string;
  phone: string;
}

function InquiryForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  const context = useContext(UserContext);
  const router = useRouter(); // Use useRouter hook to access router
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [email, setEmail] = useState<EmailAdmin[]>([]);

  const [inquiry, setInquiry] = useReducer(
    (prev: InquiryData, next: Partial<InquiryData>) => {
      return { ...prev, ...next };
    },
    {
      cars_brand: "",
      cars_year: "",
      problem: "",
      phone: "",
    }
  );

  const getEmail = async () => {
    try {
      const response = await get("email");
      const data = response.data.data;
      setEmail(data);
      console.log(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);

  const handleAddInquiry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);
    try {
      const message =
        "🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔\n" +
        "New Inquiry Submitted\n" +
        "\n" +
        "Car's Brand & Type : " +
        inquiry.cars_brand +
        "\n" +
        "Car's Year : " +
        inquiry.cars_year +
        "\n" +
        "No HP : " +
        inquiry.phone +
        "\n" +
        "Problem : " +
        inquiry.problem +
        "\n";

      const emailAddress = email.map((item) => item.email);
      console.log("email :", emailAddress);

      const response = await postWithJson("inquiry", {
        cars_brand: inquiry.cars_brand,
        cars_year: inquiry.cars_year,
        problem: inquiry.problem,
        phone: inquiry.phone,
      });

      const bot = await postBotWithJson("send-mail", {
        to: emailAddress.join(", "),
        subject: `New Inquiry`,
        text: message,
        html: `🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔<br>
New Inquiry<br><br>
Car's Brand & Type : ${inquiry.cars_brand}<br>
Car's Year : ${inquiry.cars_year}<br><br>
Phone : ${inquiry.phone}<br>
Problem : ${inquiry.problem}<br>`,
      });

      toastSuccess(response.data.message);
      router.push("/thank-you-for-submitting-inquiry");
    } catch (error) {
      toastError((error as any).response?.data?.error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-auto bg-[url('/assets/transparency.png')] bg-center bg-cover relative overflow-hidden">
        <div className="bg-black bg-opacity-75 w-full h-fit flex flex-col gap-5 lg:gap-10 pt-[60px] lg:pt-[96px] pb-[60px] lg:pb-[96px] px-[7.5%] lg:px-[92px]">
          <div className="flex justify-evenly items-center">
            {/* Form: Visible on all screen sizes */}
            <div className="">
              <h1 className="text-white font-robotoSlab font-bold text-[16px] md:text-[40px] mb-[2%]">
                We’re happy to help, <br />so please fill out the information below.
              </h1>
              <form
                className="flex flex-col gap-5 lg:gap-7 bg-white p-5 rounded"
                onSubmit={(e) => handleAddInquiry(e)}
              >
                <div id="inquiry_form" className="flex flex-col gap-5 lg:gap-7 items-center justify-center">
                  <div className="w-full flex flex-row gap-2">
                    <div className="flex w-2/3">
                       <Field
                      id="car_brand_type"
                      type={"field"}
                      placeholder={"Car's Brand & Type"}
                      useLabel
                      labelText="Car's Brand & Type"
                      labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                      required
                      onChange={(e) =>
                        setInquiry({ cars_brand: e.target.value })
                      }
                    /> 
                    </div>
                    
                    <div className="flex w-1/3">
                      <Field
                        id="car_year"
                        type={"field"}
                        placeholder={"Car's Year"}
                        useLabel
                        labelText="Car's Year"
                        labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                        required
                        onChange={(e) =>
                          setInquiry({ cars_year: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <TextAreaField
                    id="car_problem"
                    placeholder="Please State Your Car Problem"
                    useLabel
                    labelText="Please State Your Car Problem"
                    labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                    required
                    onChange={(e) => setInquiry({ problem: e.target.value })}
                  />

                  <Field
                    id="wa_number"
                    type={"field"}
                    placeholder={"WhatsApp Number"}
                    useLabel
                    labelText="WhatsApp Number"
                    labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                    required
                    onChange={(e) => setInquiry({ phone: e.target.value })}
                  />
                </div>
                <div className="lg:col-start-2">
                  <Button
                    type={"submit"}
                    color="yellow"
                    text="submit"
                    isLoading={isLoading}
                    onClick={() => handleAddInquiry}
                  />
                </div>
              </form>
            </div>

            {/* Large screen heading: Only visible on lg screens */}
            <h1 className="hidden lg:block text-white font-robotoSlab font-bold text-[48px]">
              YOU TELL, <br /> WE SOLVE.
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default InquiryForm;
