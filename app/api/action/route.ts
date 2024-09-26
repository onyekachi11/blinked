import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

async function getAction() {
  const response = await fetch("http://localhost:3000/api/blink?blink_id=5");

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: ActionGetResponse = await response.json();
  console.log(data); // Log the parsed data

  return data;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log(url.toString());

  try {
    const response: ActionGetResponse = await getAction();
    return new Response(JSON.stringify(response), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch campaign" }), {
      status: 500,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
