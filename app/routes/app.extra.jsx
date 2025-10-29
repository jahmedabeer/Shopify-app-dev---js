export default function ExtraPage() {
    return (
        <s-page heading="Extra Page">

            <s-section heading="Extra Page Content">
                <s-paragraph>
                    This is the extra page content.
                </s-paragraph>

                <s-button variant="primary" onClick={() => console.log('button clicked!')}>Add Product</s-button>
            </s-section>

        </s-page>
    )
}