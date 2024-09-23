"use client";
import { Field, FormikErrors } from "formik";
import React, { useState } from "react";
import Button from "../button";
import {
  ActionGetResponse,
  ActionParameter,
  ActionParameterSelectable,
  ActionParameterType,
  LinkedAction,
} from "@solana/actions";
import { InitialBlinkValues } from "@/app/page";

interface InputButtons {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<InitialBlinkValues>>;
}

type SelectableParameterType = "select" | "radio" | "checkbox";

type TypedActionParameter<T extends ActionParameterType = ActionParameterType> =
  T extends SelectableParameterType
    ? ActionParameterSelectable<T>
    : ActionParameter<T>;

const MultiInputUi = ({
  values,
  setNewValue,
  newValue,
  setFieldValue,
}: InputButtons) => {
  const [optionValue, setOptionValue] = useState("text");
  const [inputValue, setInputValue] = useState({
    label: "",
    href: "",
    parameters: [] as Array<TypedActionParameter>,
  });

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
      ] as Array<TypedActionParameter>,
    };
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        // actions: [...(prevValue.links?.actions || []), value], // Spread the existing actions and add the new action
        actions: [value],
      },
    }));

    setInputValue(value);
  };
  console.log(inputValue);

  const addNewInputAction = (inputName: string, inputPlaceholder: string) => {
    const newParam = {
      name: inputName,
      label: inputPlaceholder,
      required: true,
    } as TypedActionParameter;

    // Map through the actions to find and update the one with matching label
    const updatedActions = newValue.links?.actions.map((action) => {
      if (action.label === inputValue.label) {
        // Return the action with the updated parameters array
        return {
          ...action,
          parameters: [...(action.parameters || []), newParam],
        };
      }
      return action; // Return the other actions unchanged
    }) as LinkedAction[];

    // Update the state with the modified actions
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        actions: updatedActions, // Set the updated actions array
      },
    }));

    resetInputDetails();
  };

  const resetInputDetails = async () => {
    await setFieldValue("inputName", "");
    await setFieldValue("inputPlaceholder", "");
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
            <select
              className="border rounded-lg outline-none px-4 py-2 "
              onChange={(e) => {
                setOptionValue(e.target.value);
              }}
              defaultValue={"input"}
            >
              <option value="input">Input</option>
              <option value="input_button">Input Action</option>
              <option value="button">Button</option>
            </select>
            {inputValue.parameters.length > 0 && (
              <Button
                value="Add new input"
                type="button"
                onClick={() =>
                  addNewInputAction(values.inputName, values.inputPlaceholder)
                }
              />
            )}
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
        {inputValue.parameters.length == 0 && (
          <Button
            value="Adds"
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
        )}
      </div>
    </div>
  );
};

export default MultiInputUi;
