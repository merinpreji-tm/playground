import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ShopPage extends Common {
    menu: Locator;
    filter: (value: any) => any;
    filterOption: (value: any) => any;
    product: Locator;
    productTitle: Locator;
    productPrice: Locator;
    productViewIcon: Locator;
    productsDiv: Locator;

    constructor(public page: Page) {
        super(page);
        this.menu = this.page.locator(`//span[text()="shop"]`);
        this.filter = (value) => this.page.locator(`//span[contains(text(),"${value}")]`);
        this.filterOption = (option) => this.page.locator(`//label[text()="${option}"]`);
        this.product = this.page.locator(`//div[@class="w-full"]//img`);
        this.productTitle = this.page.locator(`//div[@class="w-full"]//h2`);
        this.productPrice = this.page.locator(`//div[@class="w-full"]//p[contains(@class,"text-xl")]`);
        this.productViewIcon = this.page.locator(`//button[contains(@class,"rounded-lg bg-gray-200")]`);
        this.productsDiv = this.page.locator(`//div[@class="w-full"]/parent::div[contains(@class,"grid")]`);
    }

    async clickFilter(filter: string) {
        await test.step(`Click on Shop by ${filter} filter`, async () => {
            await this.actions.clickDropdown(this.filter(filter), `Shop by ${filter}`);
        });
    }

    async clickProduct() {
        return await test.step(`Click on a product`, async () => {
            const title = await this.productTitle.nth(1).innerText();
            await this.actions.clickOn(this.product.nth(1), `Product: ${title}`);
            return title;
        });
    }

    async isGridViewDisplayed() {
        return await test.step("Verify that products are displayed in Grid view", async () => {
            const classAttribute = await this.productsDiv.getAttribute("class");

            if (!classAttribute) return false;

            const expectedClasses = ["md:grid-cols-2", "xl:grid-cols-3", "gap-6"];
            const isGridView = expectedClasses.every(cls => classAttribute.includes(cls));

            console.log(isGridView ? "Products are displayed in Grid View" : "Products are NOT displayed in Grid View");
            return isGridView;
        });
    }

    async isListViewDisplayed() {
        return await test.step("Verify that products are displayed in List view", async () => {
            const classAttribute = await this.productsDiv.getAttribute("class");

            if (!classAttribute) return false;

            const expectedClasses = ["gap-4"];
            const isListView = expectedClasses.every(cls => classAttribute.includes(cls));

            console.log(isListView ? "Products are displayed in List View" : "Products are NOT displayed in List View");
            return isListView;
        });
    }

    async changeProductView() {
        await test.step(`Change product view mode`, async () => {
            await this.actions.clickOn(this.productViewIcon, `List/Grid View Icon`);
        });
    }

    async applyFilter(filter: string, option: string) {
        await test.step(`Select '${option}' under ${filter} filter`, async () => {
            await this.clickFilter(filter);
            await this.actions.scrollDownToTargetLocator(this.filterOption(option));
            await this.actions.clickCheckBox(this.filterOption(option), `${option}`);
        });
    }

    async verifyAppliedFilter(filter: string, option: string) {
        return await test.step(`Select '${option}' under ${filter} filter`, async () => {
            await this.clickFilter(filter);
            await this.actions.scrollDownToTargetLocator(this.filterOption(option));
            const checkBox = await this.filterOption(option);
            return await checkBox.isChecked();
        });
    }

    async verifyMenuIsVisible() {
        return await test.step(`Check that Shop is displayed under page heading`, async () => {
            await this.actions.waitForPageToLoad();
            return await this.menu.isVisible();
        });
    }

    /**
     * Method to verify the products are displayed according to applied filter
     * @param {string} filter
     * @param {string} option
     * @returns true if tite of the product contains the selected filter option
    */
    async verifyFilterResults(filter: string, option: string) {
        return await test.step(`Verify that products are of ${filter} '${option}'`, async () => {
            const titleCount = await this.productTitle.count();

            for (let i = 0; i < titleCount; i++) {
                const titleText = await this.productTitle.nth(i).innerText();

                if (!titleText.includes(option)) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Method to verify the name and price of products displayed
     * @param {Array} files
     * @returns true if name and price of product matches
    */
    async verifyProductNameAndPrice(products: { [key: string]: string }[]) {
        let allMatch = true;
        let index = 0;
        for (const obj of products) {
            for (const [key, value] of Object.entries(obj)) {
                const actualName = await this.productTitle.nth(index).innerText();
                const actualPrice = await this.productPrice.nth(index).innerText();
                if (!actualName.includes(key) || !actualPrice.includes(value)) {
                    allMatch = false;
                }
                index++;
            }
        }
        return allMatch;
    }
}
export default ShopPage;