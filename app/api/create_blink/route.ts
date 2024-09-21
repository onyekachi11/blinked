import { ACTIONS_CORS_HEADERS } from "@solana/actions";

export const POST = async (req: Request) => {
  const value = req.body;
  try {
    return new Response(JSON.stringify(value), {
      status: 200,
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error preparing transaction:", error);
    return new Response(
      JSON.stringify({ error: "Failed to prepare transaction" }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};
