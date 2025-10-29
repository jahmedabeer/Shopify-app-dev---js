import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server"; // (https://shopify.dev/docs/api/admin-graphql/latest/queries/shop?example=retrieve-information-about-a-shop)

// Fetch Data from Graphql with Loader Function (https://reactrouter.com/start/framework/route-module#loader)
export const loader = async (args) => {
    const { request } = args;
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
        `#graphql
        query {
            shop {
                id
                name
                currencyCode
                contactEmail
                myshopifyDomain
                plan{
                    partnerDevelopment
                }
            }
        }`,
    );
    const json = await response.json();
    const shop = json.data.shop;
    // console.log("\n\nShop Data: ", shop)

    return { shop };
}


export default function shopDetails() {

    // import data from loader - "Closest route" = the route file you're currently in
    const { shop } = useLoaderData(); // (https://reactrouter.com/api/hooks/useLoaderData#useloaderdata)

    console.log(shop)

    return (
        <s-page heading="Extra Page">

            <s-section heading="Shop Details">
                <s-unordered-list>
                    <s-list-item>Shop id: <s-stack><s-badge>{shop.id}</s-badge></s-stack></s-list-item>
                    <s-list-item>Shop id: <s-stack><s-badge>{shop.name}</s-badge></s-stack></s-list-item>
                    <s-list-item>Contact email: <s-stack><s-badge>{shop.contactEmail}</s-badge></s-stack></s-list-item>
                    <s-list-item>Domain: <s-stack><s-badge>{shop.myshopifyDomain}</s-badge></s-stack></s-list-item>
                    <s-list-item>Currency: <s-stack><s-badge>{shop.currencyCode}</s-badge></s-stack></s-list-item>
                    <s-list-item>Development store: <s-stack><s-badge>{shop.plan.partnerDevelopment ? "Yes" : "No"}</s-badge></s-stack></s-list-item>
                </s-unordered-list>
            </s-section>

        </s-page>
    )
}