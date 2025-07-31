const BASE_URL = 'http://localhost:5000';

window.onload = async () => {
  const response = await fetch(`${BASE_URL}/lists`);
  const lists = await response.json();

  lists.forEach(list => {
    const container = document.getElementById(getContainerId(list.name));
    list.cards.forEach(card => {
      renderCard(card.text, container, card._id);
    });
  });

  setupDropZones(); // Setup drag-and-drop areas
};

// Map list name to container ID
function getContainerId(name) {
  if (name.toLowerCase().includes('progress')) return 'in-progress-cards';
  if (name.toLowerCase().includes('done')) return 'done-cards';
  return 'todo-cards';
}

// Add card button logic
document.querySelectorAll('.add-card-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const list = button.closest('.list');
    const input = list.querySelector('.card-input');
    const container = list.querySelector('.card-container');
    const text = input.value.trim();
    if (!text) return;

    const listName = list.querySelector('h2').innerText;
    const listId = await getListIdByName(listName);


    console.log('Sending to:', `${BASE_URL}/cards/${listId}/cards`, 'with text:', text);
    const res = await fetch(`${BASE_URL}/cards/${listId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const newCard = await res.json();
    renderCard(text, container, newCard._id);
    input.value = '';
  });
});

// Get listId from backend using list name
async function getListIdByName(name) {
  const res = await fetch(`${BASE_URL}/lists`);
  const lists = await res.json();
  const match = lists.find(l => l.name.toLowerCase() === name.toLowerCase());
  return match ? match._id : null;
}

// Render card with drag and delete
function renderCard(text, container, cardId) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.dataset.cardId = cardId;
  card.dataset.listId = container.id;

  const span = document.createElement('span');
  span.innerText = text;

  const delBtn = document.createElement('button');
  delBtn.innerText = '❌';
  delBtn.onclick = async () => {
    await fetch(`${BASE_URL}/cards/${cardId}`, { method: 'DELETE' });
    card.remove();
  };

  card.appendChild(span);
  card.appendChild(delBtn);

  // Drag
  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('card-id', cardId);
  });

  container.appendChild(card);
}

// Setup drop zones for drag and drop
function setupDropZones() {
  document.querySelectorAll('.card-container').forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      container.style.background = '#eee';
    });

    container.addEventListener('dragleave', () => {
      container.style.background = '';
    });

    container.addEventListener('drop', async e => {
      e.preventDefault();
      container.style.background = '';

      const cardId = e.dataTransfer.getData('card-id');
      const card = document.querySelector(`[data-card-id='${cardId}']`);

      // Prevent dropping into the same container
      if (card.parentElement.id === container.id) return;

      const newListName = container.closest('.list').querySelector('h2').innerText;
      const newListId = await getListIdByName(newListName);

      await fetch(`${BASE_URL}/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: newListId })
      });

      container.appendChild(card); // Move in UI
    });
  });
}
