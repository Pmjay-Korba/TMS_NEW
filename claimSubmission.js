const {loginOrAlreadyLoggedNew} = require('./pageObjectProvider/firstPageProvider');
const {injectCustomForm} = require('./pageObjectProvider/html_Injectors');
const selectors = require('./selectors.json');
const {thirdPageProvider} = require("./pageObjectProvider/thirdPageNew");



async function main() {
    //first page use
    const page = await loginOrAlreadyLoggedNew()

    page.setDefaultTimeout(10000);


    // checking the home page displayed or not
    // getting the "Your Hospital Dashboard" in body html
    const bodyTexts = await (await page.waitForSelector("//body")).textContent();
    // console.log(bodyTexts);

    // checking the body has text "Your Hospital Dashboard"
    if (!bodyTexts.includes("Your Hospital Dashboard")) {
        // console.log("ddddddddddddddddddddd")
        await( await page.waitForSelector(selectors.homeSVG)).click();
        await page.waitForSelector(selectors.yourHospitalDashboard)
    }

    // clicking the home icon
    // await (await page.waitForSelector(selectors.homeSVG)).click()

    await page.waitForTimeout(2500)
    //selecting the "ALL" in PATIENT STATUS
    await (await page.waitForSelector(selectors.patientStatusInput)).type('Claims to be Submitted');
    await page.keyboard.press("Enter");

    // click the proceed arrow
    await (await page.waitForSelector())


}

main()