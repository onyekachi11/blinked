"use client";
import { Field, FormikErrors } from "formik";
import React, { useState } from "react";
import Button from "../button";
import {
  ActionGetResponse,
  ActionParameterType,
  LinkedAction,
} from "@solana/actions";
import { InitialBlinkValues } from "@/app/page";
import { TypedActionParameter } from "./MutipleInputUi";

interface InputButtons {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<InitialBlinkValues>>;
}

const InputButton = ({
  values,
  setNewValue,
  newValue,
  setFieldValue,
}: InputButtons) => {
  const [inputParameterOption, setInputParameterOption] =
    useState<ActionParameterType>("text");
  const [inputValue, setInputValue] = useState({
    label: "",
    href: "",
    parameters: [] as Array<TypedActionParameter>,
  } as LinkedAction);

  const addInputButtonAction = (
    buttonLabel: string,
    buttonAction: string,
    inputName: string,
    inputPlaceholder: string,
    optionLabel: string,
    optionValue: string
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
          type: inputParameterOption,
          options:
            inputParameterOption === "checkbox" ||
            inputParameterOption === "radio" ||
            inputParameterOption === "select"
              ? [
                  {
                    label: optionLabel,
                    value: optionValue,
                  },
                ]
              : undefined,
        },
      ] as Array<TypedActionParameter>,
    } as LinkedAction;
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        actions: [...(prevValue.links?.actions || []), value], // Spread the existing actions and add the new action
      },
    }));

    setInputValue(value);
  };

  const addNewOption = (optionLabel: string, optionValue: string) => {
    const newParam = {
      label: optionLabel,
      value: optionValue,
      // selected: false, // Uncomment if necessary
    };

    const updatedValue = newValue.links?.actions.map((action) => {
      if (action.label === inputValue.label) {
        console.log("Found matching action:", action);

        // Update the parameters for the matching action
        const updatedParameters = action.parameters?.map((param, index) => {
          console.log("Inspecting param:", param);

          // Find the last matching parameter (based on label and name)
          const inputParam =
            inputValue.parameters &&
            inputValue.parameters.find(
              (input) =>
                input.label === param.label && input.name === param.name
            );

          const isLastParam =
            action.parameters && index === action.parameters.length - 1; // Target last param

          if (
            inputParam &&
            (param.type === "select" ||
              param.type === "radio" ||
              (param.type === "checkbox" && "options" in param)) &&
            isLastParam
          ) {
            console.log("Before adding new option:", param.options);

            // Add the new option to the specific matching parameter
            const updatedOptions = [...(param.options || []), newParam];
            console.log("After adding new option:", updatedOptions);

            return {
              ...param,
              options: updatedOptions, // Update options for the last matching param
            };
          }

          // If the param doesn't match, return it unchanged
          return param;
        });

        // Return the updated action with the modified parameters
        return {
          ...action,
          parameters: updatedParameters,
        };
      }

      // If the action label doesn't match, return the action unchanged
      return action;
    }) as LinkedAction[];

    // Update newValue with the modified actions
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        actions: updatedValue,
      },
    }));

    // Update inputValue's parameters
    setInputValue((prev) => ({
      ...prev,
      parameters:
        prev.parameters &&
        prev.parameters.map((param, index) => {
          // Find the last matching parameter by label and name
          const inputParam =
            inputValue.parameters &&
            inputValue.parameters.find(
              (input) =>
                input.label === param.label && input.name === param.name
            );

          const isLastParam =
            prev.parameters && index === prev.parameters.length - 1; // Target last param

          if (
            inputParam &&
            (param.type === "select" ||
              param.type === "radio" ||
              param.type === "checkbox") &&
            isLastParam
          ) {
            return {
              ...param,
              options: [...(param.options || []), newParam], // Add newParam to options array for last match
            };
          }

          // Return unchanged param if it doesn't match the condition
          return param;
        }),
    }));

    // Uncomment to reset option details if needed
    // resetOptionDetails();
  };

  const resetInputDetails = async () => {
    await setFieldValue("inputName", "");
    await setFieldValue("inputPlaceholder", "");
  };

  const resetOptionDetails = async () => {
    await setFieldValue("optionValue", "");
    await setFieldValue("optionLabel", "");
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
                setInputParameterOption(e.target.value as ActionParameterType);
                resetInputDetails();
                resetOptionDetails();
              }}
              defaultValue={"text"}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="date">Button</option>
              <option value="datetime-local">Datetime-local</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="textarea">Textarea</option>
              <option value="url">Url</option>
            </select>
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
          {inputParameterOption == "select" ||
          inputParameterOption == "radio" ||
          inputParameterOption == "checkbox" ? (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <p className="font-medium text-[20px] capitalize">
                  {inputParameterOption} Options
                </p>
                <Button
                  value={`Add new ${inputParameterOption} option`}
                  type="button"
                  onClick={() =>
                    addNewOption(values.optionLabel, values.optionValue)
                  }
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="">Label</label>
                <Field
                  type="text"
                  name="optionLabel"
                  placeholder={`Enter ${inputParameterOption} label"`}
                  className="outline-none border rounded-md px-3 py-2  "
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="">Value</label>
                <Field
                  type="text"
                  name="optionValue"
                  placeholder={`Enter ${inputParameterOption} value"`}
                  className="outline-none border rounded-md px-3 py-2  "
                />
              </div>
              {/* <div className="flex flex-row gap-2 items-center">
                <label htmlFor="">Label</label>
                <Field
                  type="text"
                  name="optionLabel"
                  placeholder="Enter placeholder value"
                  className="outline-none border rounded-md px-3 py-2  "
                />
              </div> */}
            </div>
          ) : null}
        </div>

        <Button
          value="Add"
          type="button"
          onClick={() =>
            addInputButtonAction(
              values.buttonLabel,
              values.buttonAction,
              values.inputName,
              values.inputPlaceholder,
              values.optionLabel,
              values.optionValue
            )
          }
        />
      </div>
    </div>
  );
};

export default InputButton;
