const fs = require('fs');
const {injectCustomForm} = require("./html_Injectors");
const selectors = require("../selectors.json");
const calenderAndLocationObject = require("C:/Users/HP/Documents/jsProjectHP/DISC/pageObjects/calender")
const {singlePdfConverter} = require("C:/Users/HP/Documents/jsProjectHP/DISC/pageObjects/pdfForSingleFile");
const {enhancementRemark} = require("./utilitiesNew");
const pdfCreator = require("C:/Users/HP/Documents/jsProjectHP/DISC/pageObjects/pdfCreatorMain");


// Function to delete a file - pdf file
function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath); // Synchronously delete the file
        console.log(`File deleted: ${filePath}`);
    } catch (err) {
        console.error(`Error deleting file: ${err.message}`);
    }
}

async function thirdPageProvider(page) {

    // giving the choices of initiate or discharge
    const choiceForProcess = await injectCustomForm(page);
    // console.log("Card No.: ", choiceForProcess[0]["Initiate"])
    const cardNumberTyped = choiceForProcess[0]["Initiate"]
    const dischargeNumberType = choiceForProcess[1]["Discharge"]
    console.log('Card Number :', cardNumberTyped, 'Discharge Number: ', dischargeNumberType);


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
    await (await page.waitForSelector(selectors.patientStatusInput)).type('ALL');
    await page.keyboard.press("Enter");
    // clear the case number if present
    await (await page.waitForSelector(selectors.searchBox)).fill("");

    // // giving the choices of initiate or discharge
    // const choiceForProcess = await injectCustomForm(page);
    // // console.log("Card No.: ", choiceForProcess[0]["Initiate"])
    // const cardNumberTyped = choiceForProcess[0]["Initiate"]
    // const dischargeNumberType = choiceForProcess[1]["Discharge"]
    // console.log('Card Number :', cardNumberTyped, 'Discharge Number: ', dischargeNumberType);

    // clear and typing the case number
    await (await page.waitForSelector(selectors.searchBox)).fill("");
    await (await page.waitForSelector(selectors.searchBox)).fill(dischargeNumberType);

    // clicking the search icon
    await (await page.waitForSelector(selectors.searchIcon)).click();
    await page.waitForTimeout(1000)
    await (await page.waitForSelector(selectors.searchIcon)).click();

    // waiting for the discharged number typed to be searched => //strong[normalize-space()='1002653602'] 1002683850
    // waiting for the proceed arrow linked to discharge number => //strong[normalize-space()='1002653602']/parent::p/parent::div/following-sibling::div//*[name()='svg']
    const toBeSearchedXpathString =  `//strong[normalize-space()='${dischargeNumberType}']/parent::p/parent::div/following-sibling::div//*[name()='svg']`

    // clicking the proceed button icon
    await (await page.waitForSelector(toBeSearchedXpathString)).click();

    // // clicking TREATMENT SVG
    // await (await page.waitForSelector(selectors.treatmentSVG)).click();

    // GETTING THE PAKAGE NAME
    // clicking main treatment
    await (await page.waitForSelector(selectors.mainTreatment)).click()
    // clicking treatment plan
    await (await page.waitForSelector(selectors.treatmentPlanButton)).click()
    await (await page.waitForSelector(selectors.showMoreText)).click()
    const procedure = await (await page.waitForSelector(selectors.showLessTextAlongText)).textContent()
    // console.log(`Procedure: ${procedure}`)
    const procedureText = procedure.split("Show Less")[0]

    // getting the speciality
    const speciality = await (await page.waitForSelector(selectors.specialityMain)).textContent()
    console.log("Speciality Name: ", speciality)
    console.log("Procedure Name: ", procedureText)


    // initiate enhancement
    await (await page.waitForSelector(selectors.initiateEnhancement)).click();

    // clicking treatment plan of enhancement
    await (await page.waitForSelector(selectors.treatPlanOfEnhancement)).click();

    // // clicking and typing speciality
    await (await page.waitForSelector(selectors.specialityEnhancement)).fill(speciality);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500)

    // clicking and typing diagnosis
    await (await page.waitForSelector(selectors.diagnosisEnhancement)).fill(procedureText);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500)

    // clicking and typing stratification
    await (await page.waitForSelector(selectors.stratificationEnhancement)).fill("Routine Ward");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500)

    // clicking and typing enhancement
    await (await page.waitForSelector(selectors.daysForEnhancement)).fill("");
    await (await page.waitForSelector(selectors.daysForEnhancement)).fill("3");

    // clicking and typing enhancement reason
    await (await page.waitForSelector(selectors.enhancementReason)).fill("Others");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000)

    // getting file location
    const locationValue = await calenderAndLocationObject.inputLocationBox(page);
    console.log('Entered Location:', locationValue);

    // getting the single pdf
    const locationValueRemovedQuotes = locationValue.replace(/"/g, '')
    const singlePdfConvertedFilePath = await singlePdfConverter(locationValueRemovedQuotes, 'PP') // gives photo pdf

    // attaching files for enhancement -> photo
    await page.setInputFiles(selectors.enhancementFileButton,singlePdfConvertedFilePath)

    // clicking upload plus button
    await page.waitForTimeout(1000)
    await (await page.waitForSelector(selectors.uploadPlusButton)).click();

    // clicking investigation of enhancement
    await (await page.waitForSelector(selectors.investigationForEnhancementButton)).click();

    // clicking investigation of enhancement -> bed side photo
    await (await page.waitForSelector(selectors.addBedSidePhotoForEnhancementButton)).click();

    // attaching bedside photo
    await page.setInputFiles(selectors.uploadInvestigationDocsEnhance, singlePdfConvertedFilePath)

    // clicking the add button
    await (await page.waitForSelector(selectors.uploadAddButtonEnhance)).click();

    // delete the photo file
    deleteFile(singlePdfConvertedFilePath)

    // // add other document button click
    // await (await page.waitForSelector(selectors.addOtherDocumentButton)).click();

    // add name/remark for file upload
    const remark = enhancementRemark();
    // console.log(remark)

    // for loop to attach pdf files
    // creating pdfs list
    const pdfFilesList = await pdfCreator.pdfCreator(locationValue)
    console.log(pdfFilesList)
    for (const eachPdf of pdfFilesList) {
        await page.waitForTimeout(1000)
        // console.log('clicking add doc button')
        await (await page.waitForSelector(selectors.addOtherDocumentButton)).click(); // add button click
        await page.waitForTimeout(1000)
        // console.log('clicking add INPUT button')
        await (await page.waitForSelector(selectors.addOtherDocsInput)).fill(remark)  // adding remark
        await page.waitForTimeout(1000)
        // console.log('uploading')
        await page.setInputFiles(selectors.uploadInvestigationDocsEnhance, eachPdf)  // uploading the files
        await page.waitForTimeout(1000)
        // console.log('clicking ADD button')
        await (await page.waitForSelector(selectors.uploadAddButtonEnhance)).click();  // clicking the add button
        await page.waitForTimeout(1000)
        // console.log('clicking add doc button AGAIN')
        await (await page.waitForSelector(selectors.addOtherDocumentButton)).click(); // add button click again
        await page.waitForTimeout(1000)
    }

    // deleting the files after uploading
    pdfFilesList.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${filePath}:`, err);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
            }
        });
    });

   // validate and preview ENHANCEMENT SUBMIT PREVIEW
   await (await page.waitForSelector(selectors.validateAndPreview)).click();

   // enhancement submit pop up modal
   await (await page.waitForSelector(selectors.submitEnhancement)).click();

   // clicking YES button
   await (await page.waitForSelector(selectors.submitYesEnhancementButton)).click();

}

module.exports = {thirdPageProvider}