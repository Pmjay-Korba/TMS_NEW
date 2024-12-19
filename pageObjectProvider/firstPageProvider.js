
const {chromium, Page, errors} = require('playwright');
const fs = require('fs');

const selectors = require('../selectors.json');


// newLoginCDP()
async function loginOrAlreadyLoggedNew() {
    // Connect to the running Chrome instance on the debugging port
    const browser = await chromium.connectOverCDP('http://localhost:9222');

    // Get the active browser context and page (tab)
    const context = browser.contexts()[0]; // Assuming you want the first context
    const page = context.pages()[0];       // Assuming you want the first tab

    // // Get the current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    // console.log('Current URL:', typeof currentUrl);
    // // const x = await rough2.inputValue(page)
    // // console.log('inputValue', x)
    //

    // getting the collage name to check already logged in
    try {
        const isLoggedIn = await page.waitForSelector(selectors.tmsProviderText)
        const providerTmsText = await isLoggedIn.textContent()
        console.log(providerTmsText);
        if(providerTmsText === 'Transaction Management System - Provider') {
            // console.log('Logged in', collegeName);
            console.log('Logged in', true);
            console.log('Logged in', true);
            }
    }catch {
        console.log('\x1b[31m%s\x1b[0m', 'PLEASE LOG ON FIRST');
    }
    return page
}

//
// async function loginOrAlreadyLoggedNew() {
//     try {
//         // Connect to the running Chrome instance on the debugging port
//         const browser = await chromium.connectOverCDP('http://localhost:9222');
//
//         // Ensure there is at least one browser context
//         const contexts = browser.contexts();
//         if (contexts.length === 0) {
//             throw new Error('No browser contexts available. Is the browser instance running with --remote-debugging-port?');
//         }
//
//         // Get the first browser context and ensure it has at least one page
//         const context = contexts[0];
//         const pages = context.pages();
//         if (pages.length === 0) {
//             throw new Error('No pages found in the context. Is there an active tab in the browser?');
//         }
//
//         // Use the first page (tab) from the context
//         const page = pages[0];
//
//         // Get the current URL
//         const currentUrl = page.url();
//         console.log('Current URL:', currentUrl);
//
//         // Check if logged in by validating the presence of a specific element or text
//         const isLoggedIn = await page.waitForSelector(selectors.tmsProviderText, { timeout: 5000 }).catch(() => null);
//         if (isLoggedIn) {
//             const providerTmsText = await isLoggedIn.textContent();
//             console.log('Provider Text:', providerTmsText);
//
//             // Validate the text content to confirm login
//             if (providerTmsText.trim() === 'Transaction Management System - Provider') {
//                 console.log('\x1b[32m%s\x1b[0m', 'Logged in successfully'); // Green log
//                 return page; // Return the page object for further use
//             }
//         }
//
//         // If the validation fails, log a message
//         console.log('\x1b[31m%s\x1b[0m', 'PLEASE LOG ON FIRST'); // Red log
//         return null; // Return null to indicate not logged in
//     } catch (error) {
//         console.error('\x1b[31m%s\x1b[0m', 'Error during login check:', error.message); // Red error log
//         throw error; // Re-throw the error for upstream handling
//     }
// }

module.exports = {loginOrAlreadyLoggedNew};