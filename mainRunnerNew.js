const {loginOrAlreadyLoggedNew} = require('./pageObjectProvider/firstPageProvider');
const {injectCustomForm} = require('./pageObjectProvider/html_Injectors');
const selectors = require('./selectors.json');
const {thirdPageProvider} = require("./pageObjectProvider/thirdPageNew");



async function main() {
    //first page use
    const page = await loginOrAlreadyLoggedNew()

    page.setDefaultTimeout(10000);

    // third page use

    await thirdPageProvider(page);


}

module.exports = {main}