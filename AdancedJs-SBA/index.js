
const breedSelect = document.getElementById('breedSelect');
const dogGallery = document.getElementById('dogGallery');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const purchaseButton = document.getElementById('purchaseButton');
const initialImage = document.getElementById('dogImage'); 
const breedDetails = document.getElementById('breedDetails'); 

let allBreeds = [];
let breedImages = [];
let currentIndex = 0;
// Number of images to show in the carousel
const imagesToShow = 3; 

// Function to load dog breeds into the dropdown
async function loadBreeds() {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/list/all');
        allBreeds = Object.keys(response.data.message);
        updateBreedSelect(allBreeds);
        loadDogGallery(allBreeds[3]); 
        loadDetailsForBreed(allBreeds[3]); 
    } catch (error) {
        console.error('Error loading breeds:', error);
    }
}

// Update the breed dropdown based on the available breeds
function updateBreedSelect(breeds) {
    breedSelect.innerHTML = ''; 
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedSelect.appendChild(option);
    });
}

// Load details for the selected breed
async function loadDetailsForBreed(breed) {
    try {
        const detailsResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`);
        const info = detailsResponse.data[0];

        if (info) {
            breedDetails.innerHTML = `
                <h3>${info.name}</h3>
                <p>${info.breed_group || 'Group not specified.'}</p>
                <p>${info.temperament || 'Temperament not specified.'}</p>
                <p>${info.life_span || 'Life Span not specified.'}</p>
            `;
        } else {
            breedDetails.textContent = "Information not available.";
        }
    } catch (error) {
        console.error('Error fetching breed details:', error);
    }
}


// Function to load dog images for the selected breed
async function loadDogGallery(breed) {
    if (!breed) return;

    try {
        const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images`);
        breedImages = response.data.message;

        // Load the first image to display immediately
        initialImage.src = breedImages[0];
        initialImage.style.display = 'block';

        currentIndex = 0;
        displayImages(); 
        loadDetailsForBreed(breed); 
    } catch (error) {
        console.error('Error loading dog images:', error);
    }
}


// Display images in the carousel
function displayImages() {
    dogGallery.innerHTML = ''; 
    const endIndex = Math.min(currentIndex + imagesToShow, breedImages.length);
    for (let i = currentIndex; i < endIndex; i++) {
        const img = document.createElement('img');
        img.src = breedImages[i];
        img.style.width = '100px'; 
        // Spacing between images
        img.style.margin = '5px'; 
        dogGallery.appendChild(img);
    }

    // Disable/enable buttons based on current index
    prevButton.disabled = currentIndex === 0; 
    nextButton.disabled = currentIndex + imagesToShow >= breedImages.length; 
}

// Carousel button event listeners
prevButton.addEventListener('click', () => {
    // Move back by the number of images displayed
    currentIndex -= imagesToShow; 
    // Prevent going below zero
    if (currentIndex < 0) currentIndex = 0; 
    displayImages();
});

nextButton.addEventListener('click', () => {
    // Move forward by the number of images displayed
    currentIndex += imagesToShow; 
    // Prevent going out of bounds
    if (currentIndex >= breedImages.length) currentIndex = breedImages.length - imagesToShow; 
    displayImages();
});

// Event listeners for breed selection
breedSelect.addEventListener('change', () => {
    // Load images for the selected breed
    loadDogGallery(breedSelect.value); 
});

// Handle purchase request
purchaseButton.addEventListener('click', function() {
    const selectedBreed = breedSelect.value;
    const customerName = prompt("Please enter your name:");

    if (customerName) {
        const request = {
            customer: customerName,
            breed: selectedBreed
        };

        console.log("Purchase request submitted:", request);
        alert("Thank you for your request! We'll get back to you soon.");
        localStorage.setItem('purchaseRequest', JSON.stringify(request));
    } else {
        alert("Purchase request was canceled.");
    }
});

// Load breeds when the page loads
window.onload = loadBreeds;



// Get customer information
// ReqRes API( another free api)
const apiUrl = "https://reqres.in/api/users"; 

document.getElementById('enter-customer-infos').onclick = async () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        // Send name, phone, and email
            body: JSON.stringify({ name, phone, email }), 
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(' Customer infos:', data);
        document.getElementById('feedback').textContent = 'Customer infos entered successfully!'; 
    } catch (error) {
        console.error('Error entering customer infos:', error);
        document.getElementById('feedback').textContent = 'Failed to enter customer infos.'; 
    }
};
