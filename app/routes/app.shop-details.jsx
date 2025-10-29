import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server"; // (https://shopify.dev/docs/api/admin-graphql/latest/queries/shop?example=retrieve-information-about-a-shop)

// Fetch Data from Graphql with Loader Function
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

    // import data from loader
    const { shop } = useLoaderData(); // (https://reactrouter.com/api/hooks/useLoaderData#useloaderdata)

    console.log(shop)

    return (
        <s-page heading="Extra Page">

            <s-section heading="Extra Page Content">
                <s-paragraph>
                    This is the extra page content.
                </s-paragraph>
            </s-section>

        </s-page>
    )
}