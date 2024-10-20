const API_URL = 'http://localhost:8000';

//call backend to get the letters
async function fetchLetters() {
    try {
        const response = await fetch(`${API_URL}/api/letters`);
        const data = await response.json();
        console.log(data);
        return {
            letters: data.letters,
            numValidWords: data.num_valid_words,
            validWords: data.valid_words
        };
    } catch (error) {
        console.error('Error fetching letters:', error);
    }
}

let currentLetters = []; //current letters
let wordsLeft; 

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { letters, numValidWords } = await fetchLetters();
        wordsLeft = numValidWords;
        currentLetters = letters;
        document.getElementById('word-count').textContent = `There are ${numValidWords} valid pangrams left!`;
        updateHexagons(letters);

        const form = document.getElementById('word-form');
        form.addEventListener('submit', handleWordSubmit);
    } catch (error) {
        console.error('Error in fetchLetters()', error);
        document.getElementById('word-count').textContent = 'Error loading game data';
    }
});

async function handleWordSubmit(event) {
    event.preventDefault(); 
    const wordInput = document.getElementById('word-input');
    const word = wordInput.value.trim().toUpperCase();
    const validationResult = document.getElementById('validation-result');

    if (word) {
        try {
            const isValid = await validateWord(word, currentLetters);
            if (isValid) {
                validationResult.textContent = `"${word}" is a valid pangram!`;
                validationResult.style.color = 'green';
                wordsLeft = Math.max(wordsLeft - 1, 0);
                document.getElementById('word-count').textContent = `There are ${wordsLeft} valid pangrams left!`;
            } else {
                validationResult.textContent = `"${word}" is not a valid pangram.`;
                validationResult.style.color = 'red';
            }
        } catch (error) {
            console.error('Error in validateWord()', error);
            validationResult.textContent = 'Error validating word.';
            validationResult.style.color = 'red';
        }
    } else {
        validationResult.textContent = 'Please enter a word.';
        validationResult.style.color = 'red';
    }

    wordInput.value = ''; // Clear the input field
}

async function validateWord(word, letters) {
    try {
        const response = await fetch(`${API_URL}/api/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word, letters }),
        });
        const result = await response.json();
        return result.valid;
    } catch (error) {
        console.error('Error validating word:', error);
        return false;
    }
}

function updateHexagons(letters) {
    const hexagons = document.querySelectorAll('.hex');
    letters.forEach((letter, index) => {
        if (hexagons[index]) {
            hexagons[index].textContent = letter;
        }
    });
}