import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ProfilePage extends Common {
    pageHeading: Locator;
    nameField: Locator;
    genderDropdown: Locator;
    countryField: Locator;
    bioField: Locator;

    constructor(public page: Page){
        super(page);
        this.pageHeading = this.page.locator(`//h2[contains(@class,"font-bold")]`);
        this.nameField = this.page.locator(`//input[@name="fullName"]`);
        this.genderDropdown = this.page.locator(`//select[@name="gender"]`);
        this.countryField = this.page.locator(`//input[@name="country"]`);
        this.bioField = this.page.locator(`//textarea[@name="bio"]`);
    }

    async enterName(name: string) {
        await test.step("Enter name", async () => {
            await this.actions.clearAndType(this.nameField, name, "Name field");
        });
    };

    async enterCountry(country: string) {
        await test.step("Enter country", async () => {
            await this.actions.clearAndType(this.countryField, country, "Country field");
        });
    };

    async enterBio(bio: string) {
        await test.step("Enter Bio", async () => {
            await this.actions.clearAndType(this.bioField, bio, "Bio field");
        });
    };

    async getPageTitle(){
        return await test.step("Get the page title", async () => {
            await this.actions.waitForPageToLoad();
            return await this.pageHeading.innerText();
        });
    }

    async isPageTitleVisible() {
        return await test.step("Check if page title is visible", async () => {
            await this.actions.waitForPageToLoad();
            return await this.pageHeading.isVisible();
        });
    }

    async isGenderSelected(option: string) {
        return await test.step(`Verify '${option}' is selected in gender dropdown`, async () => {
            const selectedOption = await this.genderDropdown.inputValue();
            return selectedOption === option;
        });
    }

    async selectGender(gender: string) {
        await test.step(`Select '${gender}' from the gender dropdown`, async () => {
            const isGenderSelected = await this.isGenderSelected(gender);
            if(isGenderSelected === false){
                await this.genderDropdown.selectOption(gender);
            }
        });
    }

    async editProfile(name: string, gender: string, country: string, bio: string, button: string){
        await test.step(`Enter 'Name', 'Email', 'Messages' and click on '${button}'`, async () => {
            await this.enterName(name);
            await this.selectGender(gender)
            await this.enterCountry(country);
            await this.enterBio(bio);
            await this.clickButton(button);
        });
    }
}
export default ProfilePage;