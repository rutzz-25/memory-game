// game-script.js

const categories = {
  fruits: ['🍎','🍌','🍇','🍓','🍍','🥝','🍉','🍊'],
  vegetables: ['🥕','🌽','🥒','🧅','🍅','🫑','🧄','🥬'],
  vehicles: ['🚗','🚕','🚙','🚌','🚓','🚑','🚒','🚜'],
  flowers: ['🌹','🌻','🌷','🌼','🌸','💐','🏵️','🪻'],
  animals: ['🐶','🐱','🐭','🦊','🐻','🐼','🐨','🦁']
};

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'fruits';
}

function loadGame(categoryName) {
  let emojis = categories[categoryName] || categories['fruits'];
  let cards = [...emojis, ...emojis];
  cards.sort(() => 0.5 - Math.random());

  const board = document.getElementById('game-board');
  board.innerHTML = ''; // clear previous cards
  let firstCard, secondCard;
  let lock = false;

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerText = '';
    card.addEventListener('click', () => {
      if (lock || card.classList.contains('revealed')) return;
      card.innerText = emoji;
      card.classList.add('revealed');

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lock = true;
        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
          firstCard = secondCard = null;
          lock = false;
          checkForWin(); // ✅ check if game is won
        } else {
          setTimeout(() => {
            firstCard.innerText = '';
            secondCard.innerText = '';
            firstCard.classList.remove('revealed');
            secondCard.classList.remove('revealed');
            firstCard = secondCard = null;
            lock = false;
          }, 1000);
        }
      }
    });
    board.appendChild(card);
  });
}

// ✅ Function to check for win
function checkForWin() {
  const revealed = document.querySelectorAll('.card.revealed');
  const totalCards = document.querySelectorAll('.card').length;

  if (revealed.length === totalCards) {
    setTimeout(() => {
      alert("🎉 Congratulations! You won!");
      window.location.href = 'select_memory.html';
    }, 500);
  }
}

window.onload = () => {
  const category = getCategoryFromURL();
  loadGame(category);
};
