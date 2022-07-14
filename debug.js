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
  const arr = JSON.parse(data) || [];

  if (arr.length === 0) {
    debugList.innerHTML = 'NEMA TESTOVA!';
  }

  for (let i = 0; i < arr.length; i++) {
    const div = document.createElement('div');
    div.innerHTML = `id: ${arr[i].id} - topic: ${arr[i].topic} - date: ${arr[i].date} - score: ${arr[i].score}`;
    const questions = arr[i].questions;
    for (let j = 0; j < questions.length; j++) {
      const p = document.createElement('p');
      const q = questions[j];
      p.innerHTML = `qid: ${q.questionId} - correct: ${q.correct} - wrong: ${q.wrong}`;
      div.appendChild(p);
    }
    debugList.appendChild(div);
  }
}

function showAPPState () {
  let data = localStorage.getItem('APP_STATE');

  if (!data) {
    debugList.innerHTML += 'NEMA STATE';
  }

  data = JSON.parse(data);
  debugList.innerHTML += '------------------------------------------------------';
  debugList.innerHTML += '------------------------------------------------------\n';

  Object.keys(data).forEach(key => {
    const div = document.createElement('div');

    if (Array.isArray(data[key])) {
      const arr = data[key];
      const p = document.createElement('p');
      p.classList.add('flex-col-start');
      p.innerHTML = `${key}::::`;

      for (const obj of arr) {
        const span = document.createElement('span');
        span.innerHTML = '>>>>';
        span.classList.add('flex-col-start');
        Object.keys(obj).forEach(k => {
          span.innerHTML += `${k}: ${obj[k]} - `;
        });
        p.appendChild(span);
      }
      div.appendChild(p);
    } else {
      div.innerHTML = `${key}: ${data[key]}`;
    }

    debugList.appendChild(div);
  });
}

insertDebugBtn(historyPage);
insertDebugBtn(questionsContainer);
