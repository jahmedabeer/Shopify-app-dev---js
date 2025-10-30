import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    // Webhook requests can trigger multiple times and after an app has already been uninstalled.
    // If this webhook already ran, the session may have been deleted previously.
    if (session) {
      await db.session.deleteMany({ where: { shop } });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook authentication failed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Return 401 for authentication failures
    return new Response("Unauthorized", { status: 401 });
  }
};
