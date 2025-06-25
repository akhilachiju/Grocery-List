// Select elements from the page
const alertBox = document.querySelector('.alert');
const form = document.querySelector('.form');
const input = document.querySelector('#item-input');
const submitButton = document.querySelector('.submit-btn');
const itemList = document.querySelector('#item-list');
const clearButton = document.querySelector('#clear-btn');

let editFlag = false;
let itemBeingEdited = null;

// Function to show an alert
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.classList.remove('hidden');
    //alertBox.style.fontWeight = 'bold';
    setTimeout(() => {
        alertBox.textContent = '';
        alertBox.className = 'alert hidden';
    }, 2000);
}

// Function to create a new item
function createItemBox(text) {
    const itemBox = document.createElement('div');
    itemBox.classList.add('item');

    itemBox.innerHTML = `
    <p class="title">${text}</p>
    <div class="actions">
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>
  `;

    // Edit button logic
    const editBtn = itemBox.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        const currentTitle = itemBox.querySelector('.title').textContent;
        input.value = currentTitle;

        editFlag = true;
        itemBeingEdited = itemBox;
        submitButton.textContent = 'Edit';
    });

    // Delete button logic
    const deleteBtn = itemBox.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        itemList.removeChild(itemBox);
        showAlert('Item deleted', 'danger');
        toggleClearButton();
        saveItemsToStorage();
    });

    return itemBox;
}

// Handle form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (value === '') {
        showAlert('Please enter an item', 'danger');
        return;
    }

    if (editFlag && itemBeingEdited) {
        itemBeingEdited.querySelector('.title').textContent = value;
        showAlert('Item updated', 'success');
        editFlag = false;
        itemBeingEdited = null;
        submitButton.textContent = 'Submit';
        saveItemsToStorage();
    } else {
        const newItem = createItemBox(value);
        itemList.insertBefore(newItem, clearButton);
        showAlert('Item added', 'success');
        saveItemsToStorage();
    }

    input.value = '';
    toggleClearButton();
});

// Clear all items
clearButton.addEventListener('click', () => {
    itemList.querySelectorAll('.item').forEach(item => item.remove());
    showAlert('All items cleared', 'danger');
    toggleClearButton();
    localStorage.removeItem('grocery-items');
});

// Show/hide Clear button based on items
function toggleClearButton() {
    const hasItems = itemList.querySelector('.item');
    clearButton.classList.toggle('hidden', !hasItems);
}

// Save items to localStorage
function saveItemsToStorage() {
    const items = Array.from(document.querySelectorAll('.item .title')).map(p => p.textContent);
    localStorage.setItem('grocery-items', JSON.stringify(items));
}

// Load items from localStorage
function loadItemsFromStorage() {
    const storedItems = JSON.parse(localStorage.getItem('grocery-items') || '[]');
    storedItems.forEach(text => {
        const itemBox = createItemBox(text);
        itemList.insertBefore(itemBox, clearButton);
    });
    toggleClearButton();
}

// Load stored items on page load
window.addEventListener('DOMContentLoaded', loadItemsFromStorage);
