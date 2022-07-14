const debugPage = document.getElementById('debug-page');
const closeDebugPageBtn = document.getElementById('close-degug-page-btn');
const debugList = document.getElementById('debug-list');

closeDebugPageBtn.addEventListener('click', handleCloseDebugClick);

function insertDebugBtn () {
  const btn = document.createElement('div');
  btn.classList.add('btn', 'flex-col');
  btn.id = 'show-debug-page-btn';
  btn.innerHTML = 'SHOW DEBUG';
  btn.addEventListener('click', handleShowDebugPageClick);
  historyPage.appendChild(btn);
}

function handleShowDebugPageClick () {
  showEl(debugPage);
}

function handleCloseDebugClick () {
  hideEl(debugPage);
}

function showInfoFromStorage () {
  const data = localStorage.getItem('_ARHIVA_TESTOVA_');
  // const arr = JSON.parse(data) || [];
  ///console.log('JEL NASO ARHIVU', data);
  debugList.innerHTML = data;
}

insertDebugBtn();
showInfoFromStorage();