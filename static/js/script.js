const imageForm = document.getElementById('imageForm');
const detectedImage = document.getElementById('detectedImage');
const resultMessage = document.getElementById('resultMessage');
const downloadButton = document.getElementById('downloadButton');

imageForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading message
    resultMessage.textContent = "Processing image, please wait...";
    
    const formData = new FormData(imageForm);
    
    try {
        const response = await fetch('/detect_image', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            const detectionStatus = jsonResponse.status;

            // Add a cache-busting query parameter to the image URL
            const timestamp = new Date().getTime();
            detectedImage.src = `/static/detected_image.jpg?${timestamp}`;
            detectedImage.style.display = 'block'; // Show the image

            // Show the download button
            downloadButton.href = `/download_image`;
            downloadButton.style.display = 'inline-block';

            // Update result message based on the status
            switch (detectionStatus) {
                case 'uniform_or_tie_detected':
                    resultMessage.textContent = "Both school uniform and tie detected!";
                    break;
                case 'uniform_or_no_tie_detected':
                    resultMessage.textContent = "School uniform detected with no tie!";
                    break;
                 case 'non_uniform_or_no_tie_detected':
                    resultMessage.textContent = "Non-school uniform or no tie detected!";
                    break;
              
                case 'non_uniform_or_tie_detected':
                    resultMessage.textContent = "Non-school uniform with tie detected!";
                    break;
                case 'no_detection':
                    resultMessage.textContent = "No uniform or tie was detected!";
                    break;
                default:
                    resultMessage.textContent = "Unexpected status returned.";
            }
        } else {
            throw new Error('Image detection failed'); // Throw an error if response is not OK
        }
    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        resultMessage.textContent = "Image detection failed. Please try again.";
        downloadButton.style.display = 'none'; // Hide download button on failure
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Select all elements with the animated class
    const elements = document.querySelectorAll('.animated');
    elements.forEach(el => {
        observer.observe(el);
    });
});
