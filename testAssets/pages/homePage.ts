import { Locator, Page, test, expect } from "@playwright/test";
import { Common } from "./common";
import * as env from "../test-data/env-test.json";

class HomePage extends Common {
    profileIcon: Locator;
    searchBar: Locator;
    product: Locator;
    productTitle: Locator;
    shopNowButton: (value: any) => any;
    newArrivalProduct: Locator;
    newArrivalProductTitle: Locator;
    cartItemsCount: Locator;
    cartLocator: Locator;
    wishlistItemsCount: Locator;
    wishlistIcon: Locator;

    constructor(public page: Page){
        super(page);
        this.profileIcon = this.page.locator(`(//div[@class="relative"])[2]`);
        this.searchBar = this.page.locator(`//input[@placeholder="Search your products here"]`);
        this.product = this.page.locator(`(//div[contains(@class,"gap-8 p-10")])[1]`);
        this.productTitle = this.page.locator(`(//p[contains(@class,"font-semibold text-lg")])[1]`);
        this.shopNowButton = (category) => this.page.locator(`//h2[text()="${category}"]/..//button[text()="Shop Now"]`);
        this.newArrivalProduct = this.page.locator(`//div[text()="New Arrivals"]/..//div[@data-index="0"]`);
        this.newArrivalProductTitle = this.page.locator(`//div[text()="New Arrivals"]/..//div[@data-index="0"]//h2`);
        this.cartItemsCount = this.page.locator(`//a[@href="/cart"]//span`);
        // this.cartLocator = this.page.locator(`//a[@href="/cart"]`);
        this.wishlistItemsCount = this.page.locator(`//a[@href="/wishlist"]//span`);
        this.wishlistIcon = this.page.locator(`//a[@href="/wishlist"]`);
    }

    async clickProfileIcon() {
        await test.step("Click on profile icon in home page", async () => {
            await this.actions.clickOn(this.profileIcon, "Profile Icon");
        });
    }

    async clickShopNow(category: string) {
        await test.step("Click on 'Shop Now' button in Laptops Sale card'", async () => {
            await this.actions.clickButton(this.shopNowButton(category), "Shop Now");
        });
    }

    async clickFirstSearchProduct() {
        await test.step("Click on the first product that appears after searching", async () => {
            await this.actions.clickOn(this.product, "First product");
        });
    }

    async clickFirstNewArrivalProduct() {
        return await test.step("Click on the first product that appears under 'New Arrivals' section", async () => {
            const productTitle = await this.newArrivalProductTitle.innerText();
            await this.actions.clickOn(this.newArrivalProduct, `First product under 'New Arrivals' section: ${productTitle}`);
            return productTitle;
        });
    }

    async getCartItemsCount(){
        return await test.step("Get the count of items in the cart", async () => {
            const cartText = await this.cartItemsCount.innerText();
            return parseInt(cartText);
        });
    }

    async getWishlistItemsCount(){
        return await test.step("Get the count of items in the wishlist", async () => {
            const wishlistText = await this.wishlistItemsCount.innerText();
            return parseInt(wishlistText);
        });
    }

    async enterEmailId(email: string) {
        await test.step("Enter email id", async () => {
            await this.actions.waitForPageToLoad();
            await this.actions.typeText(this.inputField("email"), email, "Email Address field");
        });
    };

    async enterPassword(password: string) {
        await test.step("Enter password", async () => {
            await this.actions.typeText(this.inputField("password"), password, "Password field");
        });
    };

    async enterSearchTerm(searchTerm: string) {
        await test.step("Enter search term", async () => {
            await this.actions.typeText(this.searchBar, searchTerm, "Search Bar");
        });
    };

    async enterFullName(fullName: string) {
        await test.step("Enter Full Name", async () => {
            await this.actions.typeText(this.inputField("fullName"), fullName, "Full Name field");
        });
    };

    async acceptAlert(option: string, alertText: string) {
        await test.step(`Click on '${option}' and accept the alert`, async () => {
            this.page.once("dialog", async (dialog) => {
                const alertMessage = dialog.message();
                console.log(`Alert Text: ${alertMessage}`);

                expect(alertMessage).toBe(alertText);
                await dialog.accept();
            });

            await this.clickLiTag(option);
        });
    }

    async signUp(fullName: string, email: string, password: string, text: string) {
        await test.step("Sign Up to the Playground application", async () => {
            await this.clickProfileIcon();
            await this.clickLiTag(text);
            await this.enterFullName(fullName);
            await this.enterEmailId(email);
            await this.enterPassword(password);
            await this.clickButton(text);
            console.log("Signed up in successfully");
        });
    };

    async logIn(email: string, password: string, text: string) {
        await test.step("Log In to the Playground application", async () => {
            await this.clickProfileIcon();
            await this.clickLiTag(text);
            await this.enterEmailId(email);
            await this.enterPassword(password);
            await this.clickButton(text);
            console.log("Logged in successfully");
            await this.actions.waitForElementToBeDisappear(this.ptagText("Login to your account"));
        });
    };

    async logOut(option: string, alertText: string) {
        await test.step("Log Out from the Playground application", async () => {
            await this.clickProfileIcon();
            await this.acceptAlert(option, alertText);            
            console.log("Logged out successfully");
        });
    };

    async selectCategory(sideMenu: string, category: string){
        await test.step(`Click on  "Shop by Category" menu and select category '${category}'`, async () => {
            await this.clickPTag(sideMenu);
            await this.clickLiTag(category);
        });
    }

    async searchProduct(searchTerm: string){
        return await test.step(`Search for '${searchTerm}' in the search bar`, async () => {
            await this.enterSearchTerm(searchTerm);
            const productTitle = await this.productTitle.innerText();
            await this.clickFirstSearchProduct();
            return productTitle;
        });
    }

    async goToCart(){
        await test.step("Go to cart", async () => {
            await this.actions.clickOn(this.ptagText("Buy Now"), "Buy Now");
        });
    }

    async goToWishlist(){
        await test.step("Go to wishlist", async () => {
            await this.actions.clickOn(this.wishlistIcon, "Wishlist");
        });
    }

    async goToMyOrders(text: string) {
        await test.step("Go to 'My Orders'", async () => {
            await this.clickProfileIcon();
            await this.clickLiTag(text);
        });
    };

    async gotoProfile(text: string){
        await test.step("Go to Profile", async () => {
            await this.clickProfileIcon();
            await this.clickLiTag(text);
        });
    }

    async goToSignUp(text: string) {
        await test.step("Sign Up in the Playground application", async () => {
            await this.clickProfileIcon();
            await this.clickLiTag(text);
        });
    };

    async verifyProfileShortcutIsVisible(text: string){
        return await test.step("Verify that profile shortcut is displayed", async () => {
            await this.actions.waitForPageToLoad();
            return await this.ptagText(text).isVisible();
        });
    }

    async hasCartCountIncreased(previousCount: number) {
        return await test.step("Check if cart count has increased", async () => {
            try {
                await expect.poll(
                    async () => await this.getCartItemsCount(),
                    {
                        timeout: env.waitFor.HIGH,
                        message: "Waiting for cart count to increase"
                    }
                ).toBeGreaterThan(previousCount);
                return true;
            } catch (error) {
                return false;
            }
        });
    }

    async hasCartCountBecomeZero() {
        return await test.step("Check if cart count has become zero", async () => {
            try {
                await expect.poll(
                    async () => await this.getCartItemsCount(),
                    {
                        timeout: env.waitFor.HIGH,
                        message: "Waiting for cart count to become zero",
                    }
                ).toBe(0);
                return true;
            } catch (error) {
                return false;
            }
        });
    }

    async hasWishlistCountIncreased(previousCount: number) {
        return await test.step("Check if wishlist count has increased", async () => {
            try {
                await expect.poll(
                    async () => await this.getWishlistItemsCount(),
                    {
                        timeout: env.waitFor.HIGH,
                        message: "Waiting for wishlist count to increase"
                    }
                ).toBeGreaterThan(previousCount);
                return true;
            } catch (error) {
                return false;
            }
        });
    }

    async hasWishlistCountBecomeZero() {
        return await test.step("Check if wishlist count has become zero", async () => {
            try {
                await expect.poll(
                    async () => await this.getWishlistItemsCount(),
                    {
                        timeout: env.waitFor.HIGH,
                        message: "Waiting for wishlist count to become zero",
                    }
                ).toBe(0);
                return true;
            } catch (error) {
                return false;
            }
        });
    }
}
export default HomePage;