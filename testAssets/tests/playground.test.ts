import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {

  let popWindowContent = "";
  let searchedProductTitle = "";
  let newArrivalProductTitle = "";
  let cartItemsCount = 0;
  let wishlistItemsCount = 0;
  let productQuantity = 0;
  let laptopTitle = "";
  let mobileTitle = "";
  let laptopPrice = 0;
  let mobilePrice = 0;
  let laptopQuantity = 0;
  let mobileQuantity = 0;
  let sumOfPrices = 0;

  test.beforeEach(async ({ page, common, homePage }) => {
    await test.step("Launch the website and verify that home page is displayed", async () => {
      await common.launchUrl(env.baseUrl);
      await expect(page).toHaveTitle(playgroundData.titles.homePage);
    });

    await test.step("Login to the e-commerce by clicking on profile icon dropdown on top right side of the screen", async () => {
      await homePage.logIn(env.userName, env.password, playgroundData.buttons.login);
      const isProfileShorcutVisible = await homePage.verifyProfileShortcutIsVisible(playgroundData.texts.profile);
      expect(isProfileShorcutVisible, "Profile shortcut should be visible").toBe(true);
    });
  });

  test("@smoke TC01 - Verify user is able to filter product by brand", async ({ homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the brand'${playgroundData.filters.brand.brandToSelect}' under brand filters`, async () => {
      await shopPage.applyFilter(playgroundData.filters.brand.sectionTitle, playgroundData.filters.brand.brandToSelect);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.brand.sectionTitle} '${playgroundData.filters.brand.brandToSelect}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.brand.sectionTitle, playgroundData.filters.brand.brandToSelect);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.brand.sectionTitle} '${playgroundData.filters.brand.brandToSelect}'`).toBe(true);
    });
  });

  test("TC02 - Verify pop up window is displayed", async ({ common, homePage, componentsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.components}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.components);
      const pageTitle = await componentsPage.getPageTitle();
      expect(pageTitle, `Page title should be ${playgroundData.titles.componentsPage}`).toBe(playgroundData.titles.componentsPage);
    });

    await test.step(`Click in the 'Learn more' link on the '${playgroundData.cardTitles.popWindow}' tile`, async () => {
      await componentsPage.clickLearnMore(playgroundData.cardTitles.popWindow);
      const isPopWindowButtonVisible = await componentsPage.isOpenPopWindowButtonVisible(playgroundData.buttons.openPopWindow);
      expect(isPopWindowButtonVisible, `'${playgroundData.buttons.openPopWindow}' should be displayed`).toBe(true);
    });

    await test.step(`Click on the 'Open Pop Window' button and verify the pop up window is opened`, async () => {
      await common.clickButton(playgroundData.buttons.openPopWindow);
      popWindowContent = await common.getPTagText();
      expect(popWindowContent, `Pop Window Content should be ${playgroundData.texts.popWindowContent}`).toBe(playgroundData.texts.popWindowContent);
    });

    await test.step(`Click on the Close button and ensure the pop window is closed`, async () => {
      await common.clickButton(playgroundData.buttons.close);
      const isPopWindowButtonVisible = await componentsPage.isOpenPopWindowButtonVisible(playgroundData.buttons.openPopWindow);
      expect(isPopWindowButtonVisible, `'${playgroundData.buttons.openPopWindow}' should be displayed`).toBe(true);
    });
  });

  test("TC03 - Verify  user is able to shop by category", async ({ homePage, shopPage }) => {
    await test.step(`Click on  "Shop by Category" menu and select category ${playgroundData.filters.category.brandToSelect.mobiles}`, async () => {
      await homePage.selectCategory(playgroundData.sideMenu.shopByCategory, playgroundData.filters.category.brandToSelect.mobiles);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });
  });

  test("TC04 - Verify if the user is able to search the product using the search bar", async ({ homePage, productDetailsPage }) => {
    await test.step(`Search for '${playgroundData.searchTerm.laptop}' in the search bar`, async () => {
      searchedProductTitle = await homePage.searchProduct(playgroundData.searchTerm.laptop);
    });

    await test.step("Verify that product page displays the searched product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(searchedProductTitle, "Searched product title should be same as title displayed in product details page").toBe(productTitle);
    });
  });

  test("TC05 - Verify if the user is able to select a product by clicking the shop now button or clicking on the product", async ({ homePage, shopPage }) => {
    await test.step(`Click on Shop Now button in '${playgroundData.filters.category.brandToSelect.laptops}' card`, async () => {
      await homePage.clickShopNow(playgroundData.filters.category.brandToSelect.laptops);
      const isChecked = await shopPage.verifyAppliedFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops)
      expect(isChecked, `'${playgroundData.filters.category.brandToSelect.laptops}' should be selected under 'Shop by ${playgroundData.filters.category.sectionTitle}' section`).toBe(true);
    });
  });

  test("TC06 - Verify if the user is able to  select a product by clicking on the product", async ({ homePage, productDetailsPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });
  });

  test("TC07 - Verify if the user is able to add the product to the cart", async ({ common, homePage, productDetailsPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });
  });

  test("TC08 - Verify if the user can add multiple quantity of the same product to the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step(`Increase the product quantity by ${playgroundData.cart.countToIncrease} by clicking the '+' button`, async () => {
      productQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      await cartPage.increaseItemCount(playgroundData.cart.countToIncrease, newArrivalProductTitle);
    });

    await test.step(`Verfy that product quantity is increased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToIncrease}`).toBe(productQuantity + Number(playgroundData.cart.countToIncrease));
    });
  });

  test("TC09 - Verify if the user can reduce quantity of the same product from the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step(`Increase the product quantity by ${playgroundData.cart.countToIncrease} by clicking the '+' button`, async () => {
      productQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      await cartPage.increaseItemCount(playgroundData.cart.countToIncrease, newArrivalProductTitle);
    });

    await test.step(`Verfy that product quantity is increased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToIncrease}`).toBe(productQuantity + Number(playgroundData.cart.countToIncrease));
    });

    await test.step(`Decrease the product quantity by ${playgroundData.cart.countToDecrease} by clicking the '-' button`, async () => {
      productQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      await cartPage.decreaseItemCount(playgroundData.cart.countToDecrease, newArrivalProductTitle);
    });

    await test.step(`Verfy that product quantity is decreased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToDecrease}`).toBe(productQuantity - Number(playgroundData.cart.countToDecrease));
    });
  });

  test("TC10 - Verify if the user can add multiple products to the cart", async ({ common, homePage, shopPage, productDetailsPage, cartPage }) => {
    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`).toBe(true);
      });

      await test.step(`Click on the first product`, async () => {
        const title = await shopPage.clickProduct();

        await test.step("Verify that product page displays the selected product", async () => {
          laptopTitle = await productDetailsPage.getProductTitle();
          expect(title, "Selected product title should be same as title displayed in product details page").toBe(laptopTitle);
        });
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
      });

      await test.step(`Click on the first product`, async () => {
        const title = await shopPage.clickProduct();

        await test.step("Verify that product page displays the selected product", async () => {
          mobileTitle = await productDetailsPage.getProductTitle();
          expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
        });
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Verify that the products added to cart from the category '${playgroundData.filters.category.brandToSelect.laptops}' and '${playgroundData.filters.category.brandToSelect.mobiles}' are present in the cart`, async () => {
      await test.step("Navigate to cart page", async () => {
        await homePage.goToCart();
        const pageTitle = await cartPage.getPageTitle();
        expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
      });

      await test.step(`Check that cart contains products '${laptopTitle}' and '${mobileTitle}`, async () => {
        const cartItems = await cartPage.verfyCartItems(laptopTitle, mobileTitle);
        expect(cartItems, `Cart should contain the products '${laptopTitle}' and '${mobileTitle}`).toBe(true);
      });
    });
  });

  test("TC11 - Verify if the user can reset the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCartCountBecomeZero();
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });
  });

  // Couldn't perform manually
  test.skip("TC12 - Verify  user is able to apply a valid coupon ", async () => {
  });

  test("TC13 - Verify the Proceed to checkout button", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
    });
  });

  test("TC14 - Verify the Contact tab", async ({ common, homePage, contactPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.contact}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.contact);
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page heading should be ${playgroundData.titles.contact}`).toBe(playgroundData.titles.contact);
    });

    await test.step(`Verify that the user is able to fill details like name, email and message and submit the details`, async () => {
      await contactPage.submitContactForm(playgroundData.contact.name, playgroundData.contact.email, playgroundData.contact.messages, playgroundData.buttons.post);
      const isMessageCorrect = await contactPage.verifySuccessMessage(playgroundData.contact.name, playgroundData.contact.email);
      expect(isMessageCorrect, `Success messsage should contain the name '${playgroundData.contact.name}' and email '${playgroundData.contact.email}'`).toBe(true);
    });
  });

  test("@e2e TC15 - Verify that a user is able to purchase and order_ETE flow", async ({ common, homePage, shopPage, productDetailsPage, cartPage, paymentPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product`, async () => {
      const title = await shopPage.clickProduct();

      await test.step("Verify that product page displays the selected product", async () => {
        mobileTitle = await productDetailsPage.getProductTitle();
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
      });
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step(`Check that cart contain the product '${mobileTitle}`, async () => {
      const cartItems = await cartPage.verfyCartItems(mobileTitle);
      expect(cartItems, `Cart should contain the product '${mobileTitle}`).toBe(true);
    });

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
    });

    await test.step("Verify that 'Cash on Delivery' payment option is checked and disabled as it is the only payment option available", async () => {
      const isCheckedAndDisabled = await paymentPage.verifyPaymentOption();
      expect(isCheckedAndDisabled, `'Cash on Delivery' payment option is checked and disabled`).toBe(true);
    });

    await test.step("Verify that user can place order", async () => {
      await paymentPage.placeOrder(playgroundData.contact.name, playgroundData.contact.email, playgroundData.contact.address, playgroundData.contact.phone, playgroundData.buttons.placeOrder);
      const successMessage = await paymentPage.getSuccessMessage();
      expect(successMessage, `Success  message should be displayed as ${playgroundData.messages.orderSucces}`).toBe(playgroundData.messages.orderSucces);
    });

  });

  test("TC16 - Validate the Subtotal amount", async ({ common, homePage, shopPage, productDetailsPage, cartPage, paymentPage }) => {
    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`).toBe(true);
      });

      await test.step(`Click on the first product`, async () => {
        const title = await shopPage.clickProduct();

        await test.step("Verify that product page displays the selected product", async () => {
          laptopTitle = await productDetailsPage.getProductTitle();
          expect(title, "Selected product title should be same as title displayed in product details page").toBe(laptopTitle);
        });
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
      });

      await test.step(`Click on the first product`, async () => {
        const title = await shopPage.clickProduct();

        await test.step("Verify that product page displays the selected product", async () => {
          mobileTitle = await productDetailsPage.getProductTitle();
          expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
        });
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Verify that the products added to cart from the category '${playgroundData.filters.category.brandToSelect.laptops}' and '${playgroundData.filters.category.brandToSelect.mobiles}' are present in the cart`, async () => {
      await test.step("Navigate to cart page", async () => {
        await homePage.goToCart();
        const pageTitle = await cartPage.getPageTitle();
        expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
      });

      await test.step(`Check that cart contains products '${laptopTitle}' and '${mobileTitle}`, async () => {
        laptopPrice = await cartPage.getProductPrice(laptopTitle);
        laptopQuantity = await cartPage.getProductQuantity(laptopTitle);
        mobilePrice = await cartPage.getProductPrice(mobileTitle);
        mobileQuantity = await cartPage.getProductQuantity(mobileTitle);
        sumOfPrices = laptopPrice * laptopQuantity + mobilePrice * mobileQuantity;
        const cartItems = await cartPage.verfyCartItems(laptopTitle, mobileTitle);
        expect(cartItems, `Cart should contain the products '${laptopTitle}' and '${mobileTitle}`).toBe(true);
      });
    });

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
    });

    await test.step(`Verify that Subtotal amount is equal to the total price of price of '${laptopTitle}' and '${mobileTitle}'`, async () => {
      const subtotal = await paymentPage.getSubtotal();
      console.log("Laptop price:", laptopPrice);
      console.log("Mobile price:", mobilePrice);
      console.log("Expected subtotal:", sumOfPrices);
      console.log("Actual subtotal:", subtotal);

      expect(subtotal, `The Subtotal amount should be equal to the total price of '${laptopTitle}' and '${mobileTitle}'`).toBe(sumOfPrices);
    });
  });

  test("TC17 - Verify the continue shopping button after resetting the cart", async ({ common, homePage, shopPage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCartItemsCount();
      newArrivalProductTitle = await homePage.clickFirstNewArrivalProduct();
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await productDetailsPage.getProductTitle();
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await cartPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCartCountBecomeZero();
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });

    await test.step("Click on 'Continue Shopping' button", async () => {
      await common.clickButton(playgroundData.buttons.continueShopping);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });
  });

  test("TC18 - Verify the continue shopping button in about tab", async ({ common, homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.about}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.about);
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page heading should be ${playgroundData.titles.about}`).toBe(playgroundData.titles.about);
    });

    await test.step("Click on 'Continue Shopping' button", async () => {
      await common.clickButton(playgroundData.buttons.continueShopping);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });
  });

  test("TC19 - Verify if the user is able to add the product to the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product`, async () => {
      const title = await shopPage.clickProduct();

      await test.step("Verify that product page displays the selected product", async () => {
        mobileTitle = await productDetailsPage.getProductTitle();
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
      });
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await homePage.getWishlistItemsCount();
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasWishlistCountIncreased(wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });
  });

  test("TC20 - Verify if the user is able to add the product to the cart which is in wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product`, async () => {
      const title = await shopPage.clickProduct();

      await test.step("Verify that product page displays the selected product", async () => {
        mobileTitle = await productDetailsPage.getProductTitle();
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
      });
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await homePage.getWishlistItemsCount();
      cartItemsCount = await homePage.getCartItemsCount();
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasWishlistCountIncreased(wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });

    await test.step("Navigate to wishlist", async () => {
      await homePage.goToWishlist();
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.wishlist}'`).toBe(playgroundData.titles.wishlist);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCartCountIncreased(cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });
  });

  test("TC21 - Verify if the user can reset the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product`, async () => {
      const title = await shopPage.clickProduct();

      await test.step("Verify that product page displays the selected product", async () => {
        mobileTitle = await productDetailsPage.getProductTitle();
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
      });
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await homePage.getWishlistItemsCount();
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasWishlistCountIncreased(wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });

    await test.step("Navigate to wishlist", async () => {
      await homePage.goToWishlist();
      const pageTitle = await common.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.wishlist}'`).toBe(playgroundData.titles.wishlist);
    });

    await test.step("Click on 'Reset Wishlist' button", async () => {
      await common.clickButton(playgroundData.buttons.resetWishlist);
      const wishlistItemCount = await homePage.hasWishlistCountBecomeZero();
      expect(wishlistItemCount, "Number of items in the wishlist should be zero").toBe(true);
    });
  });

  test("TC22 - Verify user is able to update their profile", async ({ common, homePage, productDetailsPage, profilePage }) => {
    await test.step(`Go to ${playgroundData.texts.profile} page`, async () => {
      await homePage.gotoProfile(playgroundData.texts.profile);
      const pageTitle = await profilePage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.userProfile}'`).toBe(playgroundData.titles.userProfile);
    });

    await test.step("Click on 'Edit' button", async () => {
      await common.clickButton(playgroundData.buttons.edit);
      const pageTitle = await profilePage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.editProfile}'`).toBe(playgroundData.titles.editProfile);
    });

    await test.step(`Verify that the user is able to update full name, gender, country, bio in profile`, async () => {
      await profilePage.editProfile(playgroundData.contact.name, playgroundData.gender.female, playgroundData.country.us, playgroundData.contact.bio, playgroundData.buttons.save);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.success}'`).toBe(playgroundData.messages.success);
    });
  });

  test("TC23 - Verify user is able to logout", async ({ homePage, productDetailsPage }) => {
    await test.step(`Click on profile icon > Click on ${playgroundData.texts.logout} > Verify the success message displayed`, async () => {
      await homePage.logOut(playgroundData.texts.logout, playgroundData.messages.logoutAlert);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.logoutSuccess}'`).toBe(playgroundData.messages.logoutSuccess);
    });
  });

  // Couldn't perform manually
  test.skip("TC24 - Verify new user is able to sign up and login with newly created credentials", async ({ homePage, signUpPage }) => {
    await test.step(`Go to Sign up page by clicking on profile icon dropdown on top right side of the screen`, async () => {
      await homePage.goToSignUp(playgroundData.texts.signUp);
      const pageTitle = await signUpPage.getPageTitle();
      expect(pageTitle, `Page title should be '${playgroundData.titles.signUp}'`).toBe(playgroundData.titles.signUp);
    });

    // await test.step(`Sign up to the e-commerce application`, async () => {
    //     await homePage.signUp(playgroundData.signUp.fullName, playgroundData.signUp.email, playgroundData.signUp.password, playgroundData.buttons.next);
    // });

  });

  test("TC25 - Verify that the default view (either list or grid) is displayed when the user navigates to the product page", async ({ homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Verify that the default view (grid) is displayed`, async () => {
      const isDefaultViewGrid = await shopPage.isGridViewDisplayed();
      expect(isDefaultViewGrid, "Default view mode of products should be Grid").toBe(true);
    });

    await test.step(`Switch to List View and verify that list view is displayed`, async () => {
      await shopPage.changeProductView();
      const isListViewDisplayed = await shopPage.isListViewDisplayed();
      expect(isListViewDisplayed, "Products should be displayed in List View").toBe(true);
    });

    await test.step(`Switch to Grid View and verify that list view is displayed`, async () => {
      await shopPage.changeProductView();
      const isGridViewDisplayed = await shopPage.isGridViewDisplayed();
      expect(isGridViewDisplayed, "Products should be displayed in Grid View").toBe(true);
    });
  });

  test("TC26 - Verify users are able to view the ordered products in my orders page", async ({ common, homePage }) => {
    await test.step(`Go to '${playgroundData.texts.myOrders}' page`, async () => {
      await homePage.goToMyOrders(playgroundData.texts.myOrders);
      const pageTitle = await common.getH1TagText();
      expect(pageTitle, `Page title should be '${playgroundData.titles.myOrders}'`).toBe(playgroundData.titles.myOrders);
    });
  });
});