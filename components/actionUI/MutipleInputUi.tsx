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
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
  setNewValue: React.Dispatch<React.SetStateAction<ActionGetResponse>>;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<InitialBlinkValues>>;
}

type SelectableParameterType = "select" | "radio" | "checkbox";

export type TypedActionParameter<
  T extends ActionParameterType = ActionParameterType
> = T extends SelectableParameterType
  ? ActionParameterSelectable<T>
  : ActionParameter<T>;

const MultiInputUi = ({
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
  });

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
          options: [
            {
              label: optionLabel,
              value: optionValue,
            },
          ],
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
    resetOptionDetails();
  };
  console.log(inputValue);

  const addNewInputAction = (
    inputName: string,
    inputPlaceholder: string,
    optionLabel: string,
    optionValue: string
  ) => {
    const newParam = {
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
      // max: 1,
      // min: 1,
      // pattern: inputPlaceholder == "text" && "",
      // patternDescription: "",
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
        actions: updatedActions,
      },
    }));

    setInputValue((prev) => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParam],
    }));
    // resetInputDetails();
  };

  const addNewOption = (optionLabel: string, optionValue: string) => {
    const newOption = {
      label: optionLabel,
      value: optionValue,
      // selected: false, // Uncomment if necessary
    };

    // Update options for the matching parameter in actions
    const updatedActions = newValue.links?.actions.map((action) => {
      const updatedParameters = action.parameters?.map((param, index) => {
        // If multiple params have the same label, use the index or name to differentiate
        const isLastParam =
          action?.parameters && index === action?.parameters.length - 1; // This targets the last param
        const inputParam = inputValue.parameters.find(
          (input) => param.label === input.label && param.name === input.name
        );

        // Only update if the param matches by label and is the last one (or use another condition)
        if (inputParam && param.label === inputParam.label && isLastParam) {
          console.log("Found matching last param:", param);

          if (
            param.type === "select" ||
            param.type === "radio" ||
            (param.type === "checkbox" && "options" in param)
          ) {
            console.log("Before adding new option:", param.options);

            const updatedOptions = [...(param.options || []), newOption];
            console.log("After adding new option:", updatedOptions);

            return {
              ...param,
              options: updatedOptions, // Update only the matching param's options
            };
          }
        }

        // Return param unchanged if no match
        return param;
      });

      return {
        ...action,
        parameters: updatedParameters, // Update only the parameters within this action
      };
    }) as LinkedAction[];

    // Update newValue with the modified actions
    setNewValue((prevValue) => ({
      ...prevValue,
      links: {
        ...prevValue.links,
        actions: updatedActions,
      },
    }));

    // Update inputValue's parameters
    setInputValue((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param, index) => {
        // Ensure we are targeting the last param with the same label
        const isLastParam = index === prev.parameters.length - 1; // Choose the last one
        if (
          param.label === optionLabel &&
          param.name === optionValue &&
          isLastParam
        ) {
          if (
            param.type === "select" ||
            param.type === "radio" ||
            (param.type === "checkbox" && "options" in param)
          )
            return {
              ...param,
              options: [...(param.options || []), newOption], // Add new option to matching param
            };
        }
        return param; // Return unchanged param if it doesn't match
      }),
    }));

    // Reset option details after updating
    resetOptionDetails();
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
            {/* {inputValue.parameters.length > 0 && (
              <Button
                value="Add new input"
                type="button"
                onClick={() =>
                  addNewInputAction(
                    values.inputName,
                    values.inputPlaceholder,
                    values.optionLabel,
                    values.optionValue
                  )
                }
              />
            )} */}
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
        {inputValue?.parameters.length == 0 && (
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
        )}
        {inputValue?.parameters.length > 0 && (
          <Button
            value={`Add new ${inputParameterOption} input`}
            type="button"
            onClick={() =>
              addNewInputAction(
                values.inputName,
                values.inputPlaceholder,
                values.optionLabel,
                values.optionValue
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default MultiInputUi;
