const debugPage = document.getElementById('debug-page');
const closeDebugPageBtn = document.getElementById('close-degug-page-btn');
const debugList = document.getElementById('debug-list');

closeDebugPageBtn.addEventListener('click', handleCloseDebugClick);

function insertDebugBtn (el) {
  const btn = document.createElement('div');
  btn.classList.add('btn', 'flex-col');
  btn.id = 'show-debug-page-btn';
  btn.innerHTML = 'SHOW DEBUG';
  btn.addEventListener('click', handleShowDebugPageClick);
  el.appendChild(btn);
}

function handleShowDebugPageClick () {
  showEl(debugPage);
  debugList.innerHTML = '';
  showInfoFromStorage();
  showAPPState();
}

function handleCloseDebugClick () {
  hideEl(debugPage);
}

function showInfoFromStorage () {
  const data = localStorage.getItem('_ARHIVA_TESTOVA_');
  // const arr = JSON.parse(data) || [];
  ///console.log('JEL NASO ARHIVU', data);
  debugList.innerHTML = JSON.stringify(JSON.parse(data), null, 2);
}

function showAPPState () {
  const data = localStorage.getItem('APP_STATE');
  console.log('DATA', JSON.stringify(JSON.parse(data), null, 2));
  debugList.innerHTML += '------------------------------------------------------';
  debugList.innerHTML += '------------------------------------------------------\n';
  debugList.innerHTML += JSON.stringify(JSON.parse(data), null, 2);
}

insertDebugBtn(historyPage);
insertDebugBtn(questionsContainer);
