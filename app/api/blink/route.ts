import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

interface Blink {
  id: string;
  blinks: ActionGetResponse;
}

const allBlinks: Blink[] = [
  {
    id: "1",
    blinks: {
      icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
      description:
        "Easy way to create a crowd funding campaign and reciveve donation with the help of solana blinks.",
      type: "action",
      label: "Fund Campaign",
      title: "Solana CrowdFunder1",
      links: {
        actions: [
          {
            label: "Create New Campaign",
            href: `/api/action?title={title}&description={description}&fund_goal={fund_goal}`,

            parameters: [
              {
                name: "title",
                label: "Enter title",
                required: true,
              },
              {
                name: "description",
                label: "Enter description",
                required: true,
              },
              {
                name: "fund_goal",
                label: "Enter funding goal",
                required: true,
                type: "number",
                pattern: "^\\d+(\\.\\d{0,2})?$",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "2",
    blinks: {
      icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
      description:
        "Easy way to create a crowd funding campaign and reciveve donation with the help of solana blinks.",
      type: "action",
      label: "Fund Campaign",
      title: "Solana CrowdFunder2",
      links: {
        actions: [
          {
            label: "Create New Campaign",
            href: `/api/action?title={title}&description={description}&fund_goal={fund_goal}`,

            parameters: [
              {
                name: "title",
                label: "Enter title",
                required: true,
              },
              {
                name: "description",
                label: "Enter description",
                required: true,
              },
              {
                name: "fund_goal",
                label: "Enter funding goal",
                required: true,
                type: "number",
                pattern: "^\\d+(\\.\\d{0,2})?$",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "3",
    blinks: {
      icon: "https://res.cloudinary.com/dukepqryi/image/upload/v1726437261/crowdfunder.jpg",
      description:
        "Easy way to create a crowd funding campaign and reciveve donation with the help of solana blinks.",
      type: "action",
      label: "Fund Campaign",
      title: "Solana CrowdFunder3",
      links: {
        actions: [
          {
            label: "Fund 0.1 SOL",
            href: `/api/action?campaign_id=&fund_amount=0.1`,
            parameters: [
              {
                name: "title1",
                label: "Enter title",
                type: "text",
                // type: "checkbox",
                // options: [{ label: "", value: "", selected: false }],
              },
              {
                name: "title2",
                label: "Enter title",
                type: "email",
                max: 1,
              },
              {
                name: "title3",
                label: "Enter title check",
                type: "checkbox",
                options: [{ label: "", value: "", selected: false }],
              },
              {
                name: "title4",
                label: "Enter title radio",
                type: "radio",
                options: [
                  { label: "", value: "" },
                  { label: "", value: "" },
                ],
              },
              {
                name: "title5",
                label: "Enter title",
                type: "date",
              },
              {
                name: "title6",
                label: "Enter title",
                type: "datetime-local",
              },
              {
                name: "title7",
                label: "Enter title",
                type: "number",
              },
              {
                name: "title8",
                label: "Enter title",
                type: "select",
                options: [{ label: "", value: "", selected: false }],
              },
              {
                name: "title9",
                label: "Enter title",
                type: "textarea",
              },
              {
                name: "title10",
                label: "Enter title",
                type: "url",
              },
            ],
          },
          // {
          //   label: "Fund 0.1 SOL",
          //   href: `/api/action?campaign_id=&fund_amount=0.1`,
          //   parameters: [
          //     {
          //       name: "title1",
          //       label: "Enter title",
          //       type: "radio",
          //       // type: "checkbox",
          //       options: [
          //         { label: "hdhjnsdj", value: "", selected: false },
          //         { label: "jndjnd", value: "", selected: false },
          //         { label: "jndjnsdj", value: "", selected: false },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   label: "Fund 11 SOL",
          //   href: `/api/action?campaign_id=&fund_amount=0.1`,
          //   parameters: [
          //     {
          //       name: "title8",
          //       label: "Enter title",
          //       type: "select",
          //       options: [
          //         { label: "ccccc", value: "", selected: false },
          //         { label: "ccccc", value: "", selected: false },
          //       ],
          //     },
          //   ],
          // },
        ],
      },
    },
  },
];

let currentId = 3;

console.log(allBlinks);

const getBlink = (id: string) => {
  const value = allBlinks.find((blink) => blink.id === id);
  return value?.blinks;
};

export async function GET(req: Request) {
  const url = new URL(req.url);

  const id = url.searchParams.get("blink_id") as string;

  const response = getBlink(id) as ActionGetResponse;

  return new Response(JSON.stringify(response), {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const POST = async (req: Request) => {
  try {
    // Parse the request body as JSON
    const value = (await req.json()) as ActionGetResponse;
    console.log("Received data:", value);

    currentId += 1;

    const data = {
      id: currentId.toString(),
      blinks: value,
    };

    // Add the received value to the array
    allBlinks.push(data);

    // Return the received value as a response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...ACTIONS_CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};
