"use client";
import { Field, FormikErrors, ErrorMessage } from "formik";
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
import ErrorMessageUI from "../ErrorMessageUI";
import toast from "react-hot-toast";

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

  const {
    optionLabel,
    optionValue,
    buttonAction,
    buttonLabel,
    inputName,
    inputPlaceholder,
  } = values;

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
      href: buttonAction,
      parameters: [
        {
          name: inputName,
          label: inputPlaceholder,
          required: true,
          type: inputParameterOption,
          // Conditionally include the options key only if inputParameterOption is checkbox, radio, or select
          ...(inputParameterOption === "checkbox" ||
          inputParameterOption === "radio" ||
          inputParameterOption === "select"
            ? {
                options: [
                  {
                    label: optionLabel,
                    value: optionValue,
                  },
                ],
              }
            : {}),
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
      ...(inputParameterOption === "checkbox" ||
      inputParameterOption === "radio" ||
      inputParameterOption === "select"
        ? {
            options: [
              {
                label: optionLabel,
                value: optionValue,
              },
            ],
          }
        : {}),
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
    resetOptionDetails();
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

  const lastValues = newValue.links?.actions.map((action) => {
    if (action.parameters && action.parameters.length > 0) {
      return action.parameters[action.parameters.length - 1]; // Returns the last parameter object
    }
    return null; // Return null or any other value to indicate no parameters exist
  });

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
          <ErrorMessage name="buttonLabel" component={ErrorMessageUI} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Button Action</label>
          <Field
            type="text"
            name="buttonAction"
            placeholder="Enter button label"
            className="outline-none border rounded-lg px-5 py-3 "
          />
          <ErrorMessage name="buttonAction" component={ErrorMessageUI} />
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
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-between">
              <label htmlFor="inputName">Input name</label>
              <Field
                type="text"
                name="inputName"
                placeholder="Enter name value"
                className="outline-none border rounded-md px-3 py-2 w-[70%] "
              />
            </div>
            <ErrorMessage name="inputName" component={ErrorMessageUI} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-between">
              <label htmlFor="inputPlaceholder">Input Placeholder</label>
              <Field
                type="text"
                name="inputPlaceholder"
                placeholder="Enter placeholder value"
                className="outline-none border rounded-md px-3 py-2  w-[70%]  "
              />
            </div>
            <ErrorMessage name="inputPlaceholder" component={ErrorMessageUI} />
          </div>
          {inputParameterOption == "select" ||
          inputParameterOption == "radio" ||
          inputParameterOption == "checkbox" ? (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <p className="font-medium text-[20px] capitalize">
                  {inputParameterOption} Options
                </p>
                {lastValues && lastValues?.length > 0 && (
                  <Button
                    value={`Add ${inputParameterOption} option`}
                    type="button"
                    disabled={optionLabel === "" || optionValue === ""}
                    onClick={() => {
                      if (
                        buttonLabel !== "" &&
                        buttonAction !== "" &&
                        inputName !== "" &&
                        inputPlaceholder !== "" &&
                        optionLabel !== "" &&
                        optionValue !== ""
                      ) {
                        addNewOption(optionLabel, optionValue);
                      } else {
                        toast.error(
                          `complete ${inputParameterOption} option details`
                        );
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center justify-between capitalize">
                  <label htmlFor="optionLabel">
                    {inputParameterOption} Label
                  </label>
                  <Field
                    type="text"
                    name="optionLabel"
                    placeholder={`Enter ${inputParameterOption} label"`}
                    className="outline-none border rounded-md px-3 py-2 w-[70%]  "
                  />
                </div>
                <ErrorMessage name="optionLabel" component={ErrorMessageUI} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center justify-between capitalize">
                  <label htmlFor="optionValue">
                    {inputParameterOption} Value
                  </label>
                  <Field
                    type="text"
                    name="optionValue"
                    placeholder={`Enter ${inputParameterOption} value"`}
                    className="outline-none border rounded-md px-3 py-2 w-[70%]  "
                  />
                </div>
                <ErrorMessage name="optionValue" component={ErrorMessageUI} />
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
            onClick={() => {
              const isCommonFieldsValid =
                buttonLabel !== "" &&
                buttonAction !== "" &&
                inputName !== "" &&
                inputPlaceholder !== "";

              // Check if additional fields are required for select, radio, or checkbox
              const isAdditionalFieldsValid =
                inputParameterOption === "select" ||
                inputParameterOption === "radio" ||
                inputParameterOption === "checkbox"
                  ? optionLabel !== "" && optionValue !== ""
                  : true; // No additional fields needed for other options

              if (isCommonFieldsValid && isAdditionalFieldsValid) {
                addInputButtonAction(
                  buttonLabel,
                  buttonAction,
                  inputName,
                  inputPlaceholder,
                  optionLabel,
                  optionValue
                );
              } else {
                toast.error("Complete Action details");
              }
            }}
          />
        )}
        {inputValue?.parameters.length > 0 && (
          <Button
            value={`Add new ${inputParameterOption} input`}
            type="button"
            disabled={
              (lastValues && lastValues[0]?.name === values.inputName) ||
              (lastValues &&
                lastValues[0]?.label === values.inputPlaceholder) ||
              newValue.links?.actions.length == 10
            }
            onClick={() => {
              const isCommonFieldsValid =
                buttonLabel !== "" &&
                buttonAction !== "" &&
                inputName !== "" &&
                inputPlaceholder !== "";

              // Check if additional fields are required for select, radio, or checkbox
              const isAdditionalFieldsValid =
                inputParameterOption === "select" ||
                inputParameterOption === "radio" ||
                inputParameterOption === "checkbox"
                  ? optionLabel !== "" && optionValue !== ""
                  : true; // No additional fields needed for other options

              if (isCommonFieldsValid && isAdditionalFieldsValid) {
                addNewInputAction(
                  inputName,
                  inputPlaceholder,
                  optionLabel,
                  optionValue
                );
              } else {
                toast.error("complete input details before adding new input");
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MultiInputUi;
