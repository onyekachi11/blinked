"use client";
import BlinkCreationForm from "@/components/BlinkCreationForm";
import BlinkPreview from "@/components/BlinkPreview";
import Navbar from "@/components/navbar";
import { ActionGetResponse, LinkedAction } from "@solana/actions";
import { Formik, Form } from "formik";
import { useState } from "react";
// import { useDrag, useDrop } from "react-dnd";

export interface InitialBlinkValues {
  title: string;
  description: string;
  label: string;
  icon: string;
  buttonLabel: string;
  buttonAction: string;
  inputName: string;
  inputPlaceholder: string;
  optionLabel: string;
  optionValue: string;
}

export default function Home() {
  // const [inputParameterOption, setInputParameterOption] =
  //   useState<ActionParameterType>("text");
  const [newValue, setNewValue] = useState<ActionGetResponse>({
    title: "",
    description: "",
    icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
    label: "",
    links: {
      // actions: [

      // ] as LinkedAction[],
      actions: [
        // {
        //   label: "Fund 0.1 SOL",
        //   href: `/api/action?campaign_id=&fund_amount=0.1`,
        //   parameters: [
        //     {
        //       name: "title1",
        //       label: "Enter title",
        //       type: "text",
        //       // type: "checkbox",
        //       // options: [{ label: "", value: "", selected: false }],
        //     },
        //     {
        //       name: "title2",
        //       label: "Enter title",
        //       type: "email",
        //       max: 1,
        //     },
        //     {
        //       name: "title3",
        //       label: "Enter title",
        //       type: "checkbox",
        //       options: [
        //         { label: "Option 1", value: "option1", selected: false },
        //         { label: "Option 2", value: "option2", selected: false },
        //       ],
        //     },
        //     {
        //       name: "title4",
        //       label: "Enter title",
        //       type: "radio",
        //       options: [
        //         { label: "Option 1", value: "option1", selected: false },
        //         { label: "Option 2", value: "option2", selected: false },
        //       ],
        //     },
        //     {
        //       name: "title5",
        //       label: "Enter title",
        //       type: "date",
        //     },
        //     {
        //       name: "title6",
        //       label: "Enter title",
        //       type: "datetime-local",
        //     },
        //     {
        //       name: "title7",
        //       label: "Enter title",
        //       type: "number",
        //     },
        //     {
        //       name: "title8",
        //       label: "Enter title",
        //       type: "select",
        //       options: [
        //         { label: "Option 1", value: "option1", selected: false },
        //         { label: "Option 2", value: "option2", selected: false },
        //       ],
        //     },
        //     {
        //       name: "title9",
        //       label: "Enter title",
        //       type: "textarea",
        //     },
        //     {
        //       name: "title10",
        //       label: "Enter title",
        //       type: "url",
        //     },
        //   ],
        // },
        // {
        //   label: "Fund 0.1 SOL",
        //   href: `/api/action?campaign_id=&fund_amount=0.1`,
        //   parameters: [
        //     {
        //       name: "title1",
        //       label: "Enter title",
        //       type: "textarea",
        // options: [
        //   { label: "Option 1", value: "option1", selected: false },
        //   { label: "Option 2", value: "option2", selected: false },
        // ],
        //       // type: "checkbox",
        //       // options: [{ label: "", value: "", selected: false }],
        //     },
        //   ],
        // },
      ] as LinkedAction[],
    },
  });

  console.log(newValue);
  const initialValues: InitialBlinkValues = {
    title: "",
    description: "",
    label: "",
    icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
    buttonLabel: "",
    buttonAction: "",
    inputName: "",
    inputPlaceholder: "",
    optionLabel: "",
    optionValue: "",
  };

  // const handlePost = async (values: ActionGetResponse) => {
  //   console.log(values);
  //   try {
  //     const response = await fetch("http://localhost:3000/api/blink", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("POST request successful:", data);
  //   } catch (error) {
  //     console.error("POST request failed:", error);
  //   }
  // };

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <p className="text-[40px] font-semibold mt-6 mb-10">Create Blink</p>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex justify-between gap-5 ">
                {/* <div className="w-full"> */}
                <BlinkCreationForm
                  values={values}
                  newValue={newValue}
                  setNewValue={setNewValue}
                  setFieldValue={setFieldValue}
                  // setInputParameterOption={setInputParameterOption}
                />
                {/* </div> */}
                <BlinkPreview
                  values={values}
                  newValue={newValue}
                  // inputParameterOption={inputParameterOption}
                />
              </div>
              {/* 
              <Button
                value="Submit"
                // onClick={() => handlePost(newValue)}
                type="submit"
              /> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

{
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   // "type" is required. It is used by the "accept" specification of drop targets.
  //   type: "BOX",
  //   // The collect function utilizes a "monitor" instance (see the Overview for what this is)
  //   // to pull important pieces of state from the DnD system.
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  //   options: {
  //     dropEffect: "copy",
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // })) as any;
  // const [{ canDrop, isOver }, drop] = useDrop(() => ({
  //   // The type (or types) to accept - strings or symbols
  //   accept: "BOX",
  //   // Props to collect
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     canDrop: monitor.canDrop(),
  //   }),
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // })) as any;
  // console.log(canDrop, isOver);
}
