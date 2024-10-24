export const breed = 'Boxer'; 

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
