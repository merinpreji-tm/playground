import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ComponentsPage extends Common {
    pageTitle: Locator;
    learnMoreLink: (value: any) => any;

    constructor(public page: Page){
        super(page);
        this.pageTitle = this.page.locator(`//h1`);
        this.learnMoreLink = (cardTitle) => this.page.locator(`//h2[text()="${cardTitle}"]/following-sibling::a[text()="Learn more"]`);
    }

    async clickLearnMore(cardTitle: string){
        await test.step(`Click on Learn more`, async () => {
            await this.actions.clickOn(this.learnMoreLink(cardTitle), `${cardTitle}`);
        });
        
    }

    async getPageTitle(){
        return await test.step("Get the title of the page", async () => {
            await this.actions.waitForPageToLoad();
            return await this.pageTitle.innerText();
        });
    }

    async isOpenPopWindowButtonVisible(text: string) {
        return await test.step(`Check whether ${text} button is visible`, async () => {
            await this.actions.waitForPageToLoad();
            return await this.button(text).isVisible();
        });
    }
}
export default ComponentsPage;