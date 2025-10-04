// --- IMPORTANT SETUP ---
// Replace this link with the one you get from Google Sheets after publishing to the web as a CSV.
const aiozSyndicateCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSvs3Ckg9LHfXu6z2K1au0b6DNaKFl4nFCp0H8fi_lws8AaPI2v52ZVgHzODHRm903CfLmAOPgTDAar/pub?output=csv'; // Replace with YOUR link

// --- DOM Elements ---
const form = document.getElementById('username-form');
const inputSection = document.getElementById('input-section');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const resultLink = document.getElementById('result-username');
const checkAgainBtn = document.getElementById('check-again-btn');
const shareBtn = document.getElementById('share-btn');

let usernames = [];
let lastShownUsername = '';

// --- Functions ---

// Fetch and parse usernames from the CSV link
async function fetchUsernames() {
    try {
        const response = await fetch(aiozSyndicateCSV);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        // Split by newline, trim whitespace, and filter out empty or invalid lines
        usernames = data.split('\n')
                        .map(u => u.trim().replace('@', ''))
                        .filter(u => u.length > 0);
        
        if (usernames.length === 0) {
            alert('Could not load any usernames. Please check the data source.');
        }
    } catch (error) {
        console.error('Failed to fetch usernames:', error);
        alert('There was a problem fetching the username list. Please check the console for details.');
    }
}

// Display a random username
function displayRandomUser() {
    if (usernames.length === 0) {
        resultLink.textContent = 'No users found!';
        resultLink.href = '#';
        return;
    }

    let randomUser = '';
    // Make sure we don't show the same user twice in a row if possible
    do {
        const randomIndex = Math.floor(Math.random() * usernames.length);
        randomUser = usernames[randomIndex];
    } while (usernames.length > 1 && randomUser === lastShownUsername);

    lastShownUsername = randomUser;

    resultLink.textContent = `@${randomUser}`;
    resultLink.href = `https://x.com/${randomUser}`;
}

// Handle the main form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent page reload
    
    // Check if username data is available
    if (usernames.length === 0) {
        alert('User data is not loaded yet or failed to load. Please try again in a moment.');
        return;
    }

    inputSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    // Simulate a short delay for a better user experience
    setTimeout(() => {
        displayRandomUser();
        loadingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    }, 1500); // 1.5 second delay
}

// Handle the "Share on Twitter" button click
function handleShare() {
    const toolLink = window.location.href; // Or a custom link to the tool
    const generatedUsername = resultLink.textContent; // This will be like "@username"

    const tweetText = `I just checked who should follow me today with this fun tool: ${toolLink}\nAnd it looks like it’s you, ${generatedUsername} 💜\n\nMonad Community Follow Monad Community 💜`;
    
    const twitterIntentURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    window.open(twitterIntentURL, '_blank');
}

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
checkAgainBtn.addEventListener('click', () => {
    // Re-run the process without requiring user to re-enter name
    // We create a dummy event object for the handler
    handleFormSubmit({ preventDefault: () => {} });
});
shareBtn.addEventListener('click', handleShare);

// --- Initial Load ---
// Fetch the usernames as soon as the page loads
fetchUsernames();
