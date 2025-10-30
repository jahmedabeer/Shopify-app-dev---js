/**
 * Helper functions to manage subscription status via app-data metafields
 */

/**
 * Update app-data metafield with subscription status
 * @param {Object} admin - Admin GraphQL client
 * @param {boolean} hasActiveSubscription - Whether merchant has active subscription
 */
export async function updateSubscriptionMetafield(admin, hasActiveSubscription) {
  // First, get the current app installation ID
  const appInstallationQuery = await admin.graphql(`
    #graphql
    query GetAppInstallation {
      currentAppInstallation {
        id
      }
    }
  `);

  const appInstallationData = await appInstallationQuery.json();
  const appInstallationId = appInstallationData.data.currentAppInstallation.id;

  // Set the metafield on the app installation
  const mutation = await admin.graphql(`
    #graphql
    mutation SetSubscriptionStatus($ownerId: ID!, $namespace: String!, $key: String!, $value: String!) {
      metafieldsSet(metafields: [{
        ownerId: $ownerId
        namespace: $namespace
        key: $key
        type: "boolean"
        value: $value
      }]) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      ownerId: appInstallationId,
      namespace: "subscription",
      key: "has_active_plan",
      value: hasActiveSubscription.toString()
    }
  });

  const result = await mutation.json();

  if (result.data.metafieldsSet.userErrors.length > 0) {
    console.error("Error updating subscription metafield:", result.data.metafieldsSet.userErrors);
    throw new Error("Failed to update subscription status");
  }

  return result.data.metafieldsSet.metafields[0];
}
