const inputSpan = document.querySelector('.input-content');
const shuffleButton = document.querySelector('.action-shuffle');
const enterButton = document.querySelector('.action-enter');


const addInputChar = (char) => {
    inputSpan.classList.add('non-empty');
    const child = document.createElement('span');
    child.classList.add('letter');
    child.innerText = char;
    inputSpan.appendChild(child);
}


const removeInputChar = () => {
    if (inputSpan.hasChildNodes()) {
        inputSpan.removeChild(inputSpan.lastChild);
    }
    if (!inputSpan.hasChildNodes()) {
        inputSpan.classList.remove('non-empty')
    }
}

const setUp = () => {
    const deleteButton = document.querySelector('.action-delete');
    deleteButton.addEventListener('click', removeInputChar);

    let tiles = document.querySelectorAll('.hexagon');
    tiles.forEach(el => {
        el.addEventListener('click', () => {
            addInputChar(el.children[0].innerText);
        })
    })
}


window.onload = setUp();
