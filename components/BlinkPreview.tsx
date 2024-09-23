import { InitialBlinkValues } from "@/app/page";
import { ActionGetResponse, LinkedAction } from "@solana/actions";
import { Field } from "formik";
import Image from "next/image";
import React from "react";

interface Blink {
  values: InitialBlinkValues;
  newValue: ActionGetResponse;
}
const BlinkPreview = ({ values, newValue }: Blink) => {
  const displayOnlyButton = () => {
    const actionsWithoutParams = newValue.links?.actions
      .filter((action) => !action.parameters) // Filter out actions without parameters
      .slice(0, 10) // Limit to the first 10 actions
      .map((action, index, array) => {
        // 'array' refers to the filtered actions array
        return (
          <button
            key={index}
            className={`bg-[#2a2a2b] p-3 text-white rounded-lg font-semibold ${
              array.length % 2 !== 0 && index === array.length - 1
                ? "w-[100%]" // Full width for the last button if the number of buttons is odd
                : "w-[48%]" // Otherwise, 48% width
            }`}
          >
            {action.label}
          </button>
        );
      });

    return (
      <div className="flex flex-row gap-3 flex-wrap">
        {actionsWithoutParams}
      </div>
    );
  };

  const displayOnlyInputs = () => {
    const actionsWithParamsmorethan1: LinkedAction[] = [];
    const actionsWithParamslessthan1: LinkedAction[] = [];

    let foundMoreThanOne = false;

    newValue.links?.actions.forEach((action) => {
      if (
        action.parameters &&
        action.parameters.length > 1 &&
        !foundMoreThanOne
      ) {
        // If parameters.length > 1 and it's the first one, store it and stop
        actionsWithParamsmorethan1.push(action);
        foundMoreThanOne = true; // Stop looking for more actions with parameters > 1
      } else if (
        action.parameters &&
        action.parameters.length <= 1 &&
        actionsWithParamslessthan1.length < 3
      ) {
        // If parameters.length <= 1, push into the actionsWithParamslessthan1 array
        actionsWithParamslessthan1.push(action);
      }
    });

    // If found an action with parameters.length > 1, return it
    if (actionsWithParamsmorethan1.length > 0) {
      return actionsWithParamsmorethan1.map((action, index) => (
        <div key={index} className="w-full flex flex-col gap-3 ">
          <div className="flex flex-col gap-3">
            {action?.parameters?.slice(0, 10).map((input, index) => (
              <Field
                key={index}
                type="text"
                name="todo"
                placeholder={`${input.label}*`}
                required
                className="outline-none px-4 py-[10px] font-medium text-[16px] border border-[#C1C1C1] rounded-md"
              />
            ))}
          </div>
          <button className="bg-[#2a2a2b] w-full p-3 text-white rounded-lg font-semibold">
            {action.label}
          </button>
        </div>
      ));
    }

    // Otherwise, return the first 3 actions with parameters.length <= 1
    return actionsWithParamslessthan1.map((action, index) => (
      <div key={index}>
        {action?.parameters?.slice(0, 3).map((input, index) => (
          <div
            key={index}
            className="border border-[#C1C1C1] flex justify-between items-center gap-2 p-1 rounded-lg mt-3 "
          >
            <Field
              type="text"
              name="todo"
              placeholder={`${input.label}*`}
              required
              className="outline-none px-2 py-2 font-medium text-[16px] w-[70%]"
            />
            <button className="bg-[#2a2a2b] w-[30%] p-3 text-white rounded-lg font-semibold">
              {action.label}
            </button>
          </div>
        ))}
      </div>
    ));
  };

  const displayAction = () => {
    // Check if there are actions with parameters
    const hasParameters = newValue.links?.actions.some(
      (action) => action.parameters
    );

    // If no parameters are found, run displayOnlyButton()
    if (!hasParameters) {
      return displayOnlyButton();
    }

    // Check if any action has parameters with length > 1
    const hasMoreThanOneParameter = newValue.links?.actions.some(
      (action) => action.parameters && action.parameters.length > 1
    );

    // If any action has parameters with length > 1, run displayOnlyInputs()
    if (hasMoreThanOneParameter) {
      return displayOnlyInputs();
    }

    // If parameters exist and all have length <= 1, run both displayOnlyButton() and displayOnlyInputs()
    return (
      <div>
        {displayOnlyButton()}
        {displayOnlyInputs()}
      </div>
    );
  };

  return (
    <div>
      <p className="text-[25px] font-semibold">Preview</p>
      <div
        //  ref={drop}
        className="flex justify-center"
      >
        <div className="border p-5 my-3 min-h-[300px] w-[450px] text-[15px] bg-white shadow-lg rounded-lg">
          <Image
            src={values.icon}
            alt={values.title}
            width={500}
            height={500}
            className="rounded-md"
          />
          <p className="text-[10px] text-gray-500 my-3 font-medium">
            localhost:3000
          </p>
          <p className=" font-semibold">{values.title}</p>
          <p>{values.description}</p>
          <div>
            <p className="border border-[#ffdeb8] text-[#d86c1b] bg-[#fff8f0] px-4 py-2 rounded-md my-4">
              This Action has not yet been registered. Only use it if you trust
              the source. This Action will not unfurl on X until it is
              registered.
            </p>
          </div>
          {newValue?.links?.actions.length == 0 && values.label.length > 0 && (
            <button className="bg-[#2a2a2b] w-full p-3 text-white rounded-lg font-semibold">
              {values.label}
            </button>
          )}
          {displayAction()}
        </div>
      </div>
    </div>
  );
};

export default BlinkPreview;
