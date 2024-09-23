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
}

export default function Home() {
  const [newValue, setNewValue] = useState<ActionGetResponse>({
    title: "",
    description: "",
    icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
    label: "",
    links: {
      actions: [] as LinkedAction[],
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
                />
                {/* </div> */}
                <BlinkPreview values={values} newValue={newValue} />
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
