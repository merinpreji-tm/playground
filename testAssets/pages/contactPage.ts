import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ContactPage extends Common {
    nameField: Locator;
    emailField: Locator;
    successMessage: Locator;

    constructor(public page: Page){
        super(page);
        this.nameField = this.page.locator(`//p[text()="Name"]/following-sibling::input`);
        this.emailField = this.page.locator(`//input[@type="email"]`);
        this.successMessage = this.page.locator('//p[contains(@class,"text-green-500")]');
    }

    async enterName(name: string) {
        await test.step("Enter name", async () => {
            await this.actions.typeText(this.nameField, name, "Name field");
        });
    };

    async enterEmailId(email: string) {
        await test.step("Enter email id", async () => {
            await this.actions.typeText(this.emailField, email, "Email Address field");
        });
    };

    async enterMessages(messages: string) {
        await test.step("Enter message", async () => {
            await this.actions.typeText(this.textarea, messages, "Messages field");
        });
    };

    async submitContactForm(name: string, email: string, messages: string, button: string){
        await test.step(`Enter 'Name', 'Email', 'Messages' and click on '${button}'`, async () => {
            await this.enterName(name);
            await this.enterEmailId(email);
            await this.enterMessages(messages);
            await this.clickButton(button);
        });
    }

    async verifySuccessMessage(name: string, email: string){
        return await test.step(`Verify that success messsage contains the name '${name}' and email '${email}'`, async () => {
            const successMessage = await this.successMessage.innerText();
            return successMessage.includes(name) && successMessage.includes(email);
        })
    }
    
}
export default ContactPage;