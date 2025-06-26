import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class PaymentPage extends Common {
    checkbox: Locator;
    nameField: Locator;
    emailField: Locator;
    addressField: Locator;
    phoneNumberField: Locator;
    successMessage: Locator;
    subtotal: Locator;

    constructor(public page: Page){
        super(page);
        this.checkbox = this.page.locator(`//input[@type="checkbox"]`);
        this.nameField = this.page.locator(`//input[@name="fullName"]`);
        this.emailField = this.page.locator(`//input[@name="email"]`);
        this.phoneNumberField = this.page.locator('//input[@name="phone"]');
        this.successMessage = this.page.locator('//div[contains(@class, "text-green-700")]/span');
        this.subtotal = this.page.locator(`//span[text()="Subtotal:"]/following-sibling::span`);
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

    async enterAddress(address: string) {
        await test.step("Enter address", async () => {
            await this.actions.typeText(this.textarea, address, "Address field");
        });
    };

    async enterPhoneNumber(phone: string) {
        await test.step("Enter phone number", async () => {
            await this.actions.typeText(this.phoneNumberField, phone, "Phone Number field");
        });
    };

    async placeOrder(name: string, email: string, address: string, phone: string, button: string){
        await test.step(`Enter 'Name', 'Email', 'Address', 'Phone' and click on '${button}'`, async () => {
            await this.enterName(name);
            await this.enterEmailId(email);
            await this.enterAddress(address);
            await this.enterPhoneNumber(phone);
            await this.clickButton(button);
        });
    }

    async verifyPaymentOption() {
        return await test.step(`Check whether the 'Cash on Delivery' payment option in Payment Gateway is checked and disabled`, async () => {
            const isChecked = await this.checkbox.isChecked();
            const isDisabled = await this.checkbox.isDisabled();
            return isChecked && isDisabled;
        });
    }


    async getSuccessMessage(){
        return await test.step(`Get the success message displayed after placing order`, async () => {
            await this.actions.waitForPageToLoad();
            const successMessage = await this.successMessage.innerText();
            return successMessage;
        });
    }

    async getSubtotal(){
        return await test.step(`Get the subtotal of cart items`, async () => {
            await this.actions.waitForPageToLoad();
            const subtotalText = await this.subtotal.innerText();
            const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ""));
            return subtotal;
        })
    }
    
}
export default PaymentPage;