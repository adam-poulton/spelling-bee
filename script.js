const inputSpan = document.querySelector('.input-content');
const shuffleButton = document.querySelector('.action-shuffle');
const enterButton = document.querySelector('.action-enter');
const initialDate = '2023-04-01';
let elapsed;
let puzzle;
let guesses = [];
let answer;
let seeds;
let words;


const addInputChar = (char) => {
    char = char.toLowerCase();
    inputSpan.classList.add('non-empty');
    const child = document.createElement('span');
    child.classList.add('letter');
    child.innerText = char;
    inputSpan.appendChild(child);
    if (puzzle.charAt(3) === char) {
        child.classList.add('input-bright');
    }
    if (!puzzle.includes(char)) {
        child.classList.add('input-invalid')
    }
}


const removeInputChar = () => {
    if (inputSpan.hasChildNodes()) {
        inputSpan.removeChild(inputSpan.lastChild);
    }
    if (!inputSpan.hasChildNodes()) {
        inputSpan.classList.remove('non-empty');
    }
} 


const clearInput = () => {
    const inputContent = document.querySelector('.input-content');
    inputContent.innerHTML = '';
    inputContent.classList.remove('non-empty');
}

const getInputList = () => {
    const inputContent = document.querySelector('.input-content');
    let guess = [];
    [...inputContent.children].forEach((child) => guess.push(child.innerText.toLowerCase()));
    return guess
}

const tryGuess = () => {
    let guess = getInputList();
    let valid = guess.length > 0
    guess.forEach(element => {
        if (!puzzle.includes(element)){
            valid = false
        }
    });
    let word = guess.join('');
    if (!word.includes(puzzle.charAt(3))) {
        valid = false;
    }
    if (guesses.includes(word)) {
        valid = false;
    }
    if (!words.includes(word)) {
        valid = false;
    }
    if (valid) {
        guesses.push(word);
        setSavedGuesses(guesses);
        addWordToList(word);
        clearInput();
    }
}

const addWordToList = (word) => {
    const list = document.querySelector('.wordlist-items-page');
    const newItem = document.createElement('li');
    const newSpan = document.createElement('span');
    newSpan.className = 'anagram';
    newSpan.textContent = word;
    newItem.appendChild(newSpan);
    list.appendChild(newItem);
}

const loadGuesses = (guesses) => {
    guesses.forEach(element => {
        addWordToList(element)
    });
}

const processPuzzleSeed = (str) => {
    var charArray = str.split('');
    var uniqueChars = [...new Set(charArray)];
    return uniqueChars.join('');
}
  
const shuffle = (arr) => {
    var currentIndex = arr.length;
    var temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;
}

const generatePuzzle = () => {
    const lastElapsed = localStorage.getItem('lastElapsed');
    elapsed = getDaysElapsed(initialDate).toString();
    if (lastElapsed === elapsed) {
        let savedGuesses = getSavedGuesses();
        if (savedGuesses !== null) {
            guesses = savedGuesses;
            loadGuesses(guesses);
        }
    } else {
        setSavedGuesses([]);
        localStorage.setItem('lastElapsed', elapsed);
    }

    const index = elapsed % seeds.length;
    answer = seeds[index];
    puzzle = processPuzzleSeed(answer);
    puzzle = reshuffle(puzzle.split(""), elapsed % puzzle.length).join("");

}

const getDaysElapsed = (arbitraryDate) => {
    const currentDate = new Date();
    const pastDate = new Date(arbitraryDate);
    const timeDifference = currentDate.getTime() - pastDate.getTime();
    const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysElapsed;
}

const getSavedGuesses = () => {
    const savedGuesses = JSON.parse(localStorage.getItem('savedGuesses'));
    return savedGuesses
}

const setSavedGuesses = (guesses) => {
    localStorage.setItem('savedGuesses', JSON.stringify(guesses));
}

const reshuffle = (guesses, index) => {
    const saved = guesses[index]; // Store the element at the specified index
    const remaining = guesses.filter((_, i) => i !== index); // Get the remaining elements
    const shuffled = remaining.sort(() => Math.random() - 0.5); // Shuffle the remaining elements
    const middleIndex = Math.floor(shuffled.length / 2); // Calculate the middle index
  
    // Insert the saved element in the middle of the shuffled array
    const result = [
      ...shuffled.slice(0, middleIndex),
      saved,
      ...shuffled.slice(middleIndex)
    ];
  
    return result;
}

const shufflePuzzle = () => {
    puzzle = reshuffle(puzzle.split(""), elapsed % puzzle.length).join("");
    updatePuzzleChars();
}

const insertPuzzleChars = () => {
    let tiles = document.querySelectorAll('.hexagon');
    let i = 0;
    tiles.forEach(el => {
        el.addEventListener('click', () => {
            addInputChar(el.children[0].innerText);
        });
        el.children[0].innerText = puzzle.charAt(i++);
    })
}

const updatePuzzleChars = () => {
    let tiles = document.querySelectorAll('.hexagon');
    let i = 0;
    tiles.forEach(el => {
        el.children[0].innerText = puzzle.charAt(i++);
    })
}

const setKBDHooks = () => {
    document.addEventListener('keydown', (e) => {
        let key = String(e.key);
        if (key === 'Enter') {
            // Hook to enter button when guess checking is implemented
            return;
        } 
        else if (key === 'Backspace') {
            removeInputChar();
            return;
        }

        // Check if the key is a alphabetical character
        if (key.length === 1 && /[a-zA-Z]/.test(key)){
            addInputChar(key);
            return;
        }
    });
}

const setUp = async () => {
    const deleteButton = document.querySelector('.action-delete');
    const enterButton = document.querySelector('.action-enter');
    const shuffleButton = document.querySelector('.action-shuffle')
    deleteButton.addEventListener('click', removeInputChar);
    enterButton.addEventListener('click', tryGuess);
    shuffleButton.addEventListener('click', shufflePuzzle);
    let response;
    try {
        response = await fetch('seeds.json');
        seeds = await response.json();
        response = await fetch('words.json');
        words = await response.json();
        generatePuzzle();
        insertPuzzleChars();
    } catch (error) {
        console.error('Error:', error);
    }
    setKBDHooks();
}


window.onload = setUp;
