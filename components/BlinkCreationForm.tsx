import { Field, FormikErrors, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import ButtonActionUi from "./actionUI/ButtonActionUi";
import InputButton from "./actionUI/InputButton";
import { ActionGetResponse } from "@solana/actions";
import MultiInputUi from "./actionUI/MutipleInputUi";
import { InitialBlinkValues } from "@/app/page";
import ErrorMessageUI from "./ErrorMessageUI";

interface BlinkCreationForm {
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<InitialBlinkValues>>;
  dirty: boolean;
  isValid: boolean;
}

const BlinkCreationForm = ({
  values,
  newValue,
  setNewValue,
  setFieldValue,
}: BlinkCreationForm) => {
  const [optionValue, setOptionValue] = useState("button");

  const resetActionDetails = async () => {
    await setFieldValue("buttonAction", "");
    await setFieldValue("buttonLabel", "");
    await setFieldValue("inputName", "");
    await setFieldValue("inputPlaceholder", "");
  };

  useEffect(() => {
    const { label, title, description } = values;
    setNewValue((prevValue) => ({
      ...prevValue,
      label: label,
      title: title,
      description: description,
    }));
  }, [values, setNewValue]);

  return (
    <div className="w-full flex flex-col gap-5">
      <p className="text-[25px] font-semibold">Details</p>
      <div className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <Field
          type="text"
          name="title"
          placeholder="Enter title"
          required
          className="outline-none border rounded-lg px-5 py-3"
        />
        <ErrorMessage name="title" component={ErrorMessageUI} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description">Description</label>
        <Field
          type="text"
          name="description"
          placeholder="Enter description"
          className="outline-none border rounded-lg px-5 py-3"
          required
        />
        <ErrorMessage name="description" component={ErrorMessageUI} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="label">Label</label>
        <Field
          type="text"
          name="label"
          placeholder="Enter label"
          className="outline-none border rounded-lg px-5 py-3"
          required
        />
        <ErrorMessage name="label" component={ErrorMessageUI} />
      </div>
      <p className="text-[25px] font-semibold">Actions</p>
      <div className="flex justify-between items-center">
        <p className="text-[15px]">
          Select between what type of action you want
        </p>
        <select
          className="border rounded-lg outline-none px-4 py-2 "
          onChange={(e) => {
            setOptionValue(e.target.value);
            resetActionDetails();
          }}
          defaultValue={"button"}
        >
          <option value="button">Button</option>
          <option value="input_button">Input Action</option>
          <option value="input">Input</option>
        </select>
      </div>
      {optionValue === "input" && (
        <MultiInputUi
          values={values}
          setNewValue={setNewValue}
          newValue={newValue}
          setFieldValue={setFieldValue}
          // dirty={dirty}
          // isValid={isValid}
        />
      )}

      {optionValue === "button" && (
        <ButtonActionUi values={values} setNewValue={setNewValue} />
      )}

      {optionValue === "input_button" && (
        <InputButton
          values={values}
          setNewValue={setNewValue}
          newValue={newValue}
          setFieldValue={setFieldValue}
          // dirty={dirty}
          // isValid={isValid}
        />
      )}
    </div>
  );
};

export default BlinkCreationForm;
