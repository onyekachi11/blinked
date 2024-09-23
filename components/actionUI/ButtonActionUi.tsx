import { Field } from "formik";
import React from "react";
import Button from "../button";
import { ActionGetResponse } from "@solana/actions";
import { InitialBlinkValues } from "@/app/page";

interface ButtonAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: InitialBlinkValues;
  newValue?: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
}

const ButtonActionUi = ({ values, setNewValue }: ButtonAction) => {
  const addButtonAction = (buttonLabel: string, buttonAction: string) => {
    const value = {
      label: buttonLabel,
      href: buttonAction,
    };
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        actions: [...(prevValue.links?.actions || []), value], // Spread the existing actions and add the new action
      },
    }));
  };
  return (
    <div
      //   ref={drag}
      className="border p-2 mt-3 flex flex-col justify-between items-center gap-5"
      // className={`${
      //   isDragging
      //     ? "border border-red-500"
      //     : "border border-blue-500"
      // }`}
    >
      <div
        className="flex flex-col gap-3 w-full"
        // ref={drag}
        // role="drag"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">Button Label</label>
          <Field
            type="text"
            name="buttonLabel"
            placeholder="Enter button label"
            className="outline-none border rounded-lg px-5 py-3 "
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Button Action</label>
          <Field
            type="text"
            name="buttonAction"
            placeholder="Enter button label"
            className="outline-none border rounded-lg px-5 py-3 "
          />
        </div>
        <Button
          value="Add"
          type="button"
          onClick={() =>
            addButtonAction(values.buttonLabel, values.buttonAction)
          }
        />
      </div>
    </div>
  );
};

export default ButtonActionUi;
