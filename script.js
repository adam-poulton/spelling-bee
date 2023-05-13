const inputSpan = document.querySelector('.input-content');
const shuffleButton = document.querySelector('.action-shuffle');
const enterButton = document.querySelector('.action-enter');
let puzzle = "abcdefg"


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

const setUp = () => {
    const deleteButton = document.querySelector('.action-delete');
    deleteButton.addEventListener('click', removeInputChar);

    let tiles = document.querySelectorAll('.hexagon');
    let i = 0;
    tiles.forEach(el => {
        el.addEventListener('click', () => {
            addInputChar(el.children[0].innerText);
        });
        el.children[0].innerText = puzzle.charAt(i++);
    })

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


window.onload = setUp;
