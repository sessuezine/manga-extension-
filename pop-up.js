document.addEventListener('DOMContentLoaded', () => {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const list = document.getElementById('saved-words');
  
    savedWords.forEach((word) => {
      const li = document.createElement('li');
      li.textContent = word;
      list.appendChild(li);
    });
  });
  