const fs = require('fs');
const path = require('path');


async function injectDepartment(page, buttonNames) {
    return await page.evaluate((buttonNames) => {
        return new Promise((resolve) => {
            // Function to create a custom confirm modal
            function createCustomConfirm(message, callback) {
                // Create modal background
                const modalBackground = document.createElement('div');
                modalBackground.style.position = 'fixed';
                modalBackground.style.top = '0';
                modalBackground.style.left = '0';
                modalBackground.style.width = '100%';
                modalBackground.style.height = '100%';
                modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                modalBackground.style.display = 'flex';
                modalBackground.style.alignItems = 'center';
                modalBackground.style.justifyContent = 'center';
                modalBackground.style.zIndex = '10000';

                // Create modal content
                const modalContent = document.createElement('div');
                modalContent.style.backgroundColor = 'white';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '10px';
                modalContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                modalContent.style.textAlign = 'center';
                modalContent.style.maxWidth = '300px'; // Optional: limit modal width

                // Add message with bold name
                modalContent.innerHTML = message;

                // Create buttons container
                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.marginTop = '20px';

                // Create Yes button
                const yesButton = document.createElement('button');
                yesButton.innerHTML = 'Yes';
                yesButton.style.margin = '0 10px';  // Space between buttons
                yesButton.style.padding = '10px 20px';
                yesButton.style.backgroundColor = '#266ab5';  // Less bright blue color
                yesButton.style.color = 'white';
                yesButton.style.border = 'none';
                yesButton.style.borderRadius = '8px';  // Rounded corners
                yesButton.style.cursor = 'pointer';
                yesButton.style.width = '100px'; // Set equal width
                yesButton.onclick = () => {
                    modalBackground.remove();
                    callback(true);
                };

                // Create Cancel button
                const cancelButton = document.createElement('button');
                cancelButton.innerHTML = 'Cancel';
                cancelButton.style.margin = '0 10px';  // Space between buttons
                cancelButton.style.padding = '10px 20px';
                cancelButton.style.backgroundColor = '#266ab5';  // Less bright blue color
                cancelButton.style.color = 'white';
                cancelButton.style.border = 'none';
                cancelButton.style.borderRadius = '8px';  // Rounded corners
                cancelButton.style.cursor = 'pointer';
                cancelButton.style.width = '100px'; // Set equal width
                cancelButton.onclick = () => {
                    modalBackground.remove();
                    callback(false);
                };

                // Append buttons to the buttons container
                buttonsContainer.appendChild(yesButton);
                buttonsContainer.appendChild(cancelButton);

                // Append buttons container to modal content
                modalContent.appendChild(buttonsContainer);

                // Append modal content to modal background
                modalBackground.appendChild(modalContent);

                // Append modal background to body
                document.body.appendChild(modalBackground);
            }

            // Check if the container already exists and remove it to prevent overlapping
            const existingContainer = document.getElementById('customButtonContainer');
            if (existingContainer) {
                existingContainer.remove();
            }

            // Create a container div for the buttons
            const container = document.createElement('div');
            container.id = 'customButtonContainer';

            // Variable to store the selected button name
            let selectedButtonName = '';

            // Loop through the names and create buttons
            buttonNames.forEach(name => {
                const button = document.createElement('button');
                button.innerHTML = name;
                button.style.margin = '10px auto';  // Center the buttons
                button.style.display = 'block';  // Ensure the button is on a new line
                button.style.width = '80%';  // Decrease button width to 80%

                // Add custom styles for buttons including rounded corners and yellowish-green color
                button.style.padding = '10px';
                button.style.backgroundColor = '#15db06';  // Yellowish-green
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '8px';  // Rounded corners
                button.style.cursor = 'pointer';
                button.style.fontSize = '14px';

                // Add click event to the button
                button.onclick = () => {
                    selectedButtonName = name; // Store the button name
                    const message = `You clicked on <strong>${name}</strong>`;
                    createCustomConfirm(message, confirmClick => {
                        if (confirmClick) {
                            container.remove(); // Remove the container after OK is clicked
                            resolve(selectedButtonName); // Resolve the promise with the selected button name
                        } else {
                            // If Cancel is clicked, do nothing (keep the container visible)
                        }
                    });
                };

                // Add the button to the container
                container.appendChild(button);
            });

            // Add the container at the end of the body
            document.body.appendChild(container);

            // Custom styles for the container
            container.style.position = 'fixed';  // Fixed position at the end
            container.style.bottom = '10px';  // Adjust according to preference
            container.style.right = '10px';   // Align to the right
            container.style.width = '150px';  // Adjust the width to match the 80% button width
            container.style.zIndex = '1000';  // Ensure it's on top of other elements
            container.style.backgroundColor = 'rgb(221,221,221)';  // More transparent background
            container.style.padding = '5px';  // Reduce padding to avoid extra space
            container.style.borderRadius = '8px';  // Rounded corners for the container
            container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        });
    }, buttonNames);
}


function timeWithDate(date) {
    const dis_hour = ['13', '14', '15', '16', '17', '18', '19'];
    const dis_minute = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    const hr = (dis_hour[(Math.floor(Math.random() * dis_hour.length))])
    const min = (dis_minute[(Math.floor(Math.random() * dis_minute.length))])
    return date + ' ' + hr + ':' + min
}



function uploadFiles(location_0, startsWith) {
    const extensions = ['jpg', 'jpeg', 'pdf'];
    const fullPath = location_0.replace(/"/g, '');
    const directory = path.dirname(fullPath);

    let matchedFiles = [];

    // Walk through the directory
    const walkDirectory = (dir) => {
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const fullFilePath = path.join(dir, file);
            const stats = fs.statSync(fullFilePath);

            if (stats.isDirectory()) {
                // Recursively search directories
                walkDirectory(fullFilePath);
            } else {
                // Check if filename starts with the desired string
                if (file.toLowerCase().startsWith(startsWith.toLowerCase())) {
                    const nameWithoutExtension = path.parse(file).name;
                    const extension = path.extname(file).slice(1); // Remove the leading dot

                    // Check if the name is alphanumeric and the extension is in the allowed list
                    if (/^[a-z0-9]+$/i.test(nameWithoutExtension) && extensions.includes(extension.toLowerCase())) {
                        matchedFiles.push(fullFilePath);
                    }
                }
            }
        });
    };

    walkDirectory(directory);

    // Return the matched files array
    return matchedFiles;
}

// const location = "G:\\My Drive\\GdrivePC\\2024\\OCTOBER\\03.10.2024\\PREM LATA\\DDDD.jpeg";
//
// // Example usage
// const result = uploadFiles(location, 'AA'); // Change 'AAAAAA' to 'DDDD' to match the file you have
// console.log(result);

function enhancementRemark() {
    const remarks = `enhancement required
files for enhancement
patient enhancement upload
file uploaded for enhancement
upload done successfully
treatment enhancement completed
enhancement requested for approval
for treatment
patient for enhancement
enhancement status updated
enhancement required
for enhancement
patient enhancement upload
file uploaded for enhancement
upload done
done
enhancement
for treatment
Enhancement req.`
    const remarksArray = remarks.split('\n')
    const indexIs = Math.floor(Math.random() * remarksArray.length);
    console.log(remarksArray[indexIs])
    return remarksArray[indexIs]
}


module.exports = { injectDepartment, timeWithDate,
    uploadFiles, enhancementRemark};

