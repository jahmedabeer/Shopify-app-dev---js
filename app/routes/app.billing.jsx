import { redirect, useLoaderData, useSubmit } from "react-router";
import { authenticate } from "../shopify.server";
import { updateSubscriptionMetafield } from "../utils/subscription-metafield.server";


export const loader = async (args) => {
    const { request } = args;
    const { billing, session, admin } = await authenticate.admin(request);
    const appHandle = "first-app-dev-js";

    // Check if merchant has an active subscription
    const { hasActivePayment, appSubscriptions } = await billing.check();

    // Update app-data metafield with subscription status
    // This makes the status available to theme extensions via Liquid
    await updateSubscriptionMetafield(admin, hasActivePayment);

    // Extract store handle from shop domain
    const shop = session.shop;
    const storeHandle = shop.replace('.myshopify.com', '');

    // Build the plan selection URL
    const planSelectionUrl = `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;

    return {
        hasActivePayment,
        appSubscriptions,
        planSelectionUrl
    };
}

export const action = async (args) => {
    const { request } = args;
    const { billing, admin } = await authenticate.admin(request);
    const { appSubscriptions } = await billing.check();

    await billing.cancel({
        subscriptionId: appSubscriptions[0]?.id,
        isTest: false, // Change to false in production
        prorate: true // Give merchant credit for unused time
    })

    // Update metafield to reflect cancelled subscription
    await updateSubscriptionMetafield(admin, false);

    return redirect("/app/billing");
}


export default function Billing() {
    const { hasActivePayment, appSubscriptions, planSelectionUrl } = useLoaderData();
    const submit = useSubmit();
    // const actionData = useActionData();

    // if (actionData?.success) {
    //     shopify.toast.show("Subscription cancelled successfully.");
    // }

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel your subscription?")) {
            submit({}, { method: "POST" });
        }
    };

    return (
        <s-page heading="Billing">
            <s-section>
                {hasActivePayment ? (
                    <>
                        <s-paragraph>
                            You have an active subscription: {appSubscriptions[0]?.name}
                        </s-paragraph>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <a href={planSelectionUrl} target="_top">
                                <s-button>Change Plan</s-button>
                            </a>

                            <s-button onClick={handleCancel}>Cancel Subscription</s-button>
                        </div>
                    </>
                ) : (
                    <>
                        <s-paragraph>
                            You don't have an active subscription. Please select a plan to continue.
                        </s-paragraph>
                        <a href={planSelectionUrl} target="_top">
                            <s-button>Select a Plan</s-button>
                        </a>
                    </>
                )}
            </s-section>
        </s-page>
    );
}