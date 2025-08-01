import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ProductDetailsPage extends Common {
    productTitle: Locator;
    successMessage: Locator;

    constructor(public page: Page){
        super(page);
        this.productTitle = this.page.locator(`//h1[contains(@class,"font-extrabold")]`);
        this.successMessage = this.page.locator(`(//div[@role="alert"]/div)[2]`);
    }

    async getProductTitle(){
        return await test.step("Get the product title", async () => {
            return await this.productTitle.innerText();
        });
    }

    async getSuccessMessage(){
        return await test.step(`Get the success message displayed after adding a product to wishlist`, async () => {
            await this.actions.waitForPageToLoad();
            const successMessage = await this.successMessage.innerText();
            return successMessage;
        });
    }
}
export default ProductDetailsPage;