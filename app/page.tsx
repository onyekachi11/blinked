"use client";
import BlinkCreationForm from "@/components/BlinkCreationForm";
import BlinkPreview from "@/components/BlinkPreview";

import Navbar from "@/components/navbar";
import { ActionGetResponse, LinkedAction } from "@solana/actions";
import { Formik, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
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
    optionLabel: "",
    optionValue: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    label: Yup.string().required("Label is required"),
    // icon: Yup.string()
    //   .url("Must be a valid URL")
    //   .required("Icon URL is required"),
    buttonLabel: Yup.string().required("Button label is required"),
    buttonAction: Yup.string()
      // .url("Must be a valid URL")
      .required("Button action is required"),
    inputName: Yup.string().required("Give input a name value"), // Optional string
    inputPlaceholder: Yup.string().required("Give input a place holder value"), // Optional string
    optionLabel: Yup.string().required("Option Label is required"), // Optional string
    optionValue: Yup.string().required("Option Label is required"), // Optional string
  });

  // setNewValue({
  //   ...newValue,
  //   title: ''
  // })

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <p className="text-[40px] font-semibold mt-6 mb-10">Create Blink</p>
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue, dirty, isValid }) => (
            <Form>
              <div className="flex justify-between gap-5 ">
                <BlinkCreationForm
                  values={values}
                  newValue={newValue}
                  setNewValue={setNewValue}
                  setFieldValue={setFieldValue}
                  dirty={dirty}
                  isValid={isValid}
                />
                <BlinkPreview values={values} newValue={newValue} />
              </div>
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
