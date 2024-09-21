"use client";
import Button from "@/components/button";
import Navbar from "@/components/navbar";
import { ActionGetResponse, LinkedAction } from "@solana/actions";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function Home() {
  const [optionValue, setOptionValue] = useState("input");
  const [newValue, setNewValue] = useState<ActionGetResponse>({
    title: "dddd",
    description: "",
    icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
    label: "hello world",
    links: {
      actions: [
        {
          label: "first param",
          href: `/api/action?campaign_id=$&fund_amount=0.1`,
          // parameters: [
          //   {
          //     name: "title 1111",
          //     label: "Enter title",
          //     required: true,
          //   },
          //   {
          //     name: "title 222222",
          //     label: "Enter title",
          //     required: true,
          //   },
          // ],
        },
        {
          label: "third param",
          href: `/api/action?campaign_id=$&fund_amount=0.1`,
          // parameters: [
          //   {
          //     name: "title",
          //     label: "Enter title",
          //     required: true,
          //   },
          // ],
        },
        {
          label: "fourth param",
          href: `/api/action?campaign_id=$&fund_amount=0.1`,
          // parameters: [
          //   {
          //     name: "title",
          //     label: "Enter title",
          //     required: true,
          //   },
          // ],
        },
        {
          label: "Fund 0.1 SOL",
          href: `/api/action?campaign_id=$&fund_amount=0.1`,
        },
        {
          label: "Fund 0.1 SOL",
          href: `/api/action?campaign_id=$&fund_amount=0.1`,
        },
      ] as LinkedAction[],
    },
  });

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
            {action?.parameters?.map((action, index) => (
              <Field
                key={index}
                type="number"
                name="todo"
                placeholder={`${action.name}*`}
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
        {action?.parameters?.map((action, index) => (
          <div
            key={index}
            className="border border-[#C1C1C1] flex justify-between items-center gap-2 p-1 rounded-lg mt-3 "
          >
            <Field
              type="number"
              name="todo"
              placeholder={`${action.name}*`}
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

  const initialValues: ActionGetResponse = {
    title: "",
    type: "action",
    description: "",
    label: "Hello world",
    icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
    links: {
      actions: [
        {
          label: "Fund 0.1 SOL",
          href: `/api/action?title={title}&description={description}&fund_goal={fund_goal}`,
        },
        {
          label: "Create New Campaign",
          href: `/api/action?title={title}&description={description}&fund_goal={fund_goal}`,
          // parameters: [
          //   {
          //     name: "title",
          //     label: "Enter title",
          //     required: true,
          //   },
          //   {
          //     name: "description",
          //     label: "Enter description",
          //     required: true,
          //   },
          //   {
          //     name: "fund_goal",
          //     label: "Enter funding goal",
          //     required: true,
          //     type: "number",
          //     pattern: "^\\d+(\\.\\d{0,2})?$",
          //   },
          // ],
        },
      ],
    },
  };

  const handlePost = async (values: ActionGetResponse) => {
    console.log(values);
    try {
      const response = await fetch("http://localhost:3000/api/blink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("POST request successful:", data);
    } catch (error) {
      console.error("POST request failed:", error);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: "BOX",
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    options: {
      dropEffect: "copy",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "BOX",
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;

  console.log(canDrop, isOver);

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {({ values }) => (
            <Form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  required
                  className="outline-none border rounded-lg px-5 py-3"
                />
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
              </div>
              <div>
                <p>Actions</p>
                <div className="flex justify-between items-center">
                  <p>Select between what type of action you want</p>
                  <select
                    className="border rounded-lg outline-none px-5 py-3 "
                    onChange={(e) => setOptionValue(e.target.value)}
                    defaultValue={"input"}
                  >
                    <option value="input">Input</option>
                    <option value="input_action">Input Action</option>
                    <option value="button">Button</option>
                  </select>
                </div>
                {optionValue === "input" && (
                  <div className="border p-2 mt-3">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="icon">Label</label>
                      <Field
                        type="text"
                        name="labels"
                        placeholder="Enter a label"
                        className="outline-none border rounded-lg px-5 py-3"
                      />
                    </div>
                    <Button value="add" />
                  </div>
                )}
                {optionValue === "button" && (
                  <div
                    ref={drag}
                    // className="border p-2 mt-3 flex justify-between items-center gap-5"
                    className={`${
                      isDragging
                        ? "border border-red-500"
                        : "border border-blue-500"
                    }`}
                  >
                    <div
                      className="flex flex-col gap-2 w-full"
                      // ref={drag}
                      role="drag"
                    >
                      {/* <label htmlFor="icon"></label> */}
                      <Field
                        type="text"
                        name="labels"
                        placeholder="Enter button label"
                        className="outline-none border rounded-lg px-5 py-3 "
                      />
                    </div>
                    <Button value="add" />
                  </div>
                )}
              </div>

              <div>
                <p>DropArea</p>
                <div ref={drop} className="flex justify-center  border">
                  <div className="border p-5 my-3 min-h-[300px] w-[500px] text-[15px] bg-white shadow-lg rounded-lg">
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
                        This Action has not yet been registered. Only use it if
                        you trust the source. This Action will not unfurl on X
                        until it is registered.
                      </p>
                    </div>
                    {!newValue?.links && (
                      <button className="bg-[#2a2a2b] w-full p-3 text-white rounded-lg font-semibold">
                        {values.label}
                      </button>
                    )}
                    {displayAction()}
                  </div>
                </div>
              </div>
              <Button
                value="Submit"
                onClick={() => handlePost(values)}
                type="submit"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

{
  /* {newValue?.links?.actions &&
                      newValue?.links?.actions.length > 0 && (
                        <div className="flex flex-row gap-3 flex-wrap">
                          {newValue.links?.actions
                            .slice(0, 3)
                            .map((item, index) => (
                              // <div key={index} className="w-[50%]">
                              <button
                                key={index}
                                // className="bg-[#2a2a2b] w-full p-3 text-white rounded-lg font-semibold"
                                // className={`bg-[#2a2a2b] p-3 text-white rounded-lg font-semibold ${
                                //   (index + 1) % 2 === 0 ? "w-[48%]" : "w-[100%]"
                                // }`}
                                className={`bg-[#2a2a2b] p-3 text-white rounded-lg font-semibold ${
                                  // Apply 48% width for all except the last odd button
                                  newValue?.links?.actions &&
                                  newValue?.links?.actions?.length % 2 !== 0 &&
                                  index === newValue.links?.actions.length - 1
                                    ? "w-[100%]" // Full width for the last button if the total number of buttons is odd
                                    : "w-[48%]" // Otherwise 48% width
                                }`}
                              >
                                {item.label}
                              </button>
                              // </div>
                            ))}
                        </div>
                      )} */
}
