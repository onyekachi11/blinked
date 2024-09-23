"use client";
import { Field } from "formik";
import React from "react";
import Button from "../button";
import { ActionGetResponse } from "@solana/actions";
import { InitialBlinkValues } from "@/app/page";

interface InputButtons {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
}

const InputButton = ({ values, setNewValue }: InputButtons) => {
  const addInputButtonAction = (
    buttonLabel: string,
    buttonAction: string,
    inputName: string,
    inputPlaceholder: string
  ) => {
    const value = {
      label: buttonLabel,
      // href: `/api/action?campaign_id=$&fund_amount=0.1`,
      href: buttonAction,
      parameters: [
        {
          name: inputName,
          label: inputPlaceholder,
          required: true,
        },
      ],
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
      // ref={drag}
      className="border p-2 mt-3 flex flex-col justify-between items-cente gap-5"
      // className={`${
      //   isDragging
      //     ? "border border-red-500"
      //     : "border border-blue-500"
      // }`}
    >
      <p className="font-medium text-[20px]">Action Details</p>
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="font-medium text-[20px]">Input Parameters</p>
            {/* <Button value="Add new input" type="button" /> */}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="">Input name</label>
            <Field
              type="text"
              name="inputName"
              placeholder="Enter name value"
              className="outline-none border rounded-md px-3 py-2 "
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="">Input Placeholder</label>
            <Field
              type="text"
              name="inputPlaceholder"
              placeholder="Enter placeholder value"
              className="outline-none border rounded-md px-3 py-2  "
            />
          </div>
        </div>

        <Button
          value="Add"
          type="button"
          onClick={() =>
            addInputButtonAction(
              values.buttonLabel,
              values.buttonAction,
              values.inputName,
              values.inputPlaceholder
            )
          }
        />
      </div>
    </div>
  );
};

export default InputButton;
