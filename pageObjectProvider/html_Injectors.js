



async function injectCustomForm(page) {  // initiate or discharge selection process
    return await page.evaluate(() => {
        // Define a unique ID for the form container
        const formContainerId = 'custom-form-container';

        // Check if a form with the same ID already exists
        const existingForm = document.getElementById(formContainerId);
        if (existingForm) {
            // Remove the existing form if it's already present
            existingForm.remove();
        }

        return new Promise((resolve) => {
            const inputsConfig = [
                { label: 'Initiate', placeholder: 'Card Number' },
                { label: 'Discharge', placeholder: 'Case Number' }
            ];

            // Create the form container with the unique ID
            const containerDiv = document.createElement('div');
            containerDiv.id = formContainerId; // Set the unique ID
            containerDiv.style.position = 'fixed';
            containerDiv.style.bottom = '20px';
            containerDiv.style.right = '20px';
            containerDiv.style.backgroundColor = 'rgba(211, 211, 211, 0.8)'; // Light grey with opacity
            containerDiv.style.padding = '10px';
            containerDiv.style.border = '1px solid black';
            containerDiv.style.zIndex = '1000';
            containerDiv.style.display = 'flex';
            containerDiv.style.flexDirection = 'column'; // Place textboxes vertically
            containerDiv.style.alignItems = 'center'; // Center the textboxes
            containerDiv.style.borderRadius = '10px';
            document.body.appendChild(containerDiv);

            const inputElements = inputsConfig.map(({ label, placeholder }) => {
                // Create label element
                const labelElement = document.createElement('label');
                labelElement.textContent = label; // Set the label text
                labelElement.style.marginBottom = '5px'; // Add some margin below the label
                labelElement.style.fontSize = '18px'; // Increase label size
                containerDiv.appendChild(labelElement); // Append label to the container

                // Create input element
                const inputBox = document.createElement('input');
                inputBox.placeholder = placeholder; // Set the placeholder text
                inputBox.style.margin = '5px 0'; // Add vertical margin between inputs
                inputBox.style.backgroundColor = 'yellow'; // Set input background to yellow
                inputBox.style.padding = '10px'; // Add padding for larger clickable area
                inputBox.style.border = 'none';
                inputBox.style.cursor = 'text';
                inputBox.style.fontSize = '16px'; // Make the text larger
                inputBox.style.width = '150px'; // Decrease width for the input

                containerDiv.appendChild(inputBox); // Append input to the container
                return { label: labelElement, input: inputBox }; // Return both label and input
            });

            // Create a play button with text
            const playButton = document.createElement('button');
            playButton.style.marginTop = '10px';
            playButton.style.backgroundColor = 'green'; // Set button background to green
            playButton.style.color = 'white'; // Set text color to white
            playButton.style.border = 'none'; // Remove default button border
            playButton.style.borderRadius = '5px'; // Round corners
            playButton.style.padding = '5px 15px'; // Add padding
            playButton.style.cursor = 'pointer'; // Change cursor to pointer
            playButton.style.fontSize = '16px'; // Set font size
            playButton.textContent = 'Continue'; // Set button text

            containerDiv.appendChild(playButton); // Append button to the container

            // Function to handle input submission
            function handleSubmit() {
                const values = inputElements.map(({ label, input }) => ({
                    [label.textContent]: input.value.trim(),
                }));

                // Check if any of the fields are filled
                if (values.some(item => Object.values(item)[0] !== '')) {
                    console.log('Input Values:', values); // Log values to console
                    containerDiv.remove(); // Remove the container
                    resolve(values); // Resolve the values in the desired format
                } else {
                    alert('Please fill out at least one field before submitting.');
                }
            }

            // Add event listener for button click
            playButton.addEventListener('click', handleSubmit);

            // Add keypress event to input fields to handle Enter key submission
            inputElements.forEach(({ input }) => {
                input.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        handleSubmit();
                    }
                });
            });

            // Focus on the first input
            inputElements[1].input.focus();
        });
    });
}

module.exports = {injectCustomForm}