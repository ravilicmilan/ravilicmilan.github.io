const topicsContainer = document.getElementById('topics-container');
const topicsList = document.getElementById('topics-list');
const questionsContainer = document.getElementById('questions-container');
const subTitleEl = document.getElementById('sub-title');
const currentQuestionEl = document.getElementById('current-question');
const currentQuestionText = document.getElementById('current-question-text');
const openModalBtn = document.getElementById('open-modal-btn');
const topicButtonsContainer = document.getElementById('topic-buttons-container');
const backBtn = document.getElementById('back-btn');
const allQuestionsBtn = document.getElementById('all-questions-btn');
const randomQuestionsBtn = document.getElementById('random-questions-btn');
const answersContainer = document.getElementById('answers-container');
const nextQuestionBtn = document.getElementById('next-question-btn');
const correctAnswersEl = document.getElementById('correct-answers');
const footer = document.getElementById('footer');
const scoreWrapper = document.getElementById('score-wrapper');
const endGameWrapper = document.getElementById('end-game-wrapper');
const newTestBtn = document.getElementById('new-test-btn');
const endGameLabel = document.getElementById('end-game-label');
const modal = document.getElementById('modal');
const modalInner = document.getElementById('modal-inner');
const closeModalBtn = document.getElementById('close-modal-btn');
const imageWrapper = document.getElementById('image-wrapper');
const indicator = document.getElementById('indicator');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const currentQuestionNumber = document.getElementById('current-question-number');
const currentQuestionSortNumber = document.getElementById('current-question-sort-number');
const cancelTestBtn = document.getElementById('cancel-test-btn');
const alertEl = document.getElementById('alert');
const alertYesBtn = document.getElementById('alert-yes-btn');
const alertNoBtn = document.getElementById('alert-no-btn');
const historyBtn = document.getElementById('history-btn');
const historyPage = document.getElementById('history-page');
const closeHistoryPageBtn = document.getElementById('close-history-page-btn');
const historyList = document.getElementById('history-list');
const testDetailsPage = document.getElementById('test-details-page');
const closeTestDetailsPageBtn = document.getElementById('close-test-details-page-btn');
const testDetailsList = document.getElementById('test-details-list');
const deleteHistoryBtn = document.getElementById('delete-history-btn');

allQuestionsBtn.addEventListener('click', handleAllQuestionsClick);
randomQuestionsBtn.addEventListener('click', handleRandomQuestionsClick);
nextQuestionBtn.addEventListener('click', handleNextQuestionClick);
backBtn.addEventListener('click', handleBackClick);
newTestBtn.addEventListener('click', handleNewTestClick);
closeModalBtn.addEventListener('click', handleCloseModalClick);
openModalBtn.addEventListener('click', handleOpenModalClick);
zoomInBtn.addEventListener('click', handleZoomIn);
zoomOutBtn.addEventListener('click', handleZoomOut);
cancelTestBtn.addEventListener('click', showAlert);
alertYesBtn.addEventListener('click', handleCancelTest);
alertNoBtn.addEventListener('click', hideAlert);
historyBtn.addEventListener('click', handleHistoryClick);
closeHistoryPageBtn.addEventListener('click', handleHistoryCloseClick);
closeTestDetailsPageBtn.addEventListener('click', handleTestDetailsCloseClick);
deleteHistoryBtn.addEventListener('click', handleDeleteHistoryClick);

const APP = {
  questionsArr: [],
  answersArr: [],
  topicsArr: [],
  currentTopic: null,
  currentTopicQuestionGroups: [],
  selectedQuestions: [],
  selectedAnswers: [],
  currentQuestionIdx: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  currentImage: null,
  nextQuestionDisabled: true,
  disableAnswersButtons: false,
  images: [],
  mouseX: null,
  mouseY: null,
  imageScale: 1,
  imageWidth: null,
  imageHeight: null,
  testHistory: [],
  currentTestId: null,
  previousTestArr: []
};

const images = [
  'Slika-PPL-Kom-1.jpg', 'Slika-PPL-Nav-1.jpg', 'Slika-PPL-Nav-2.jpg', 'Slika-PPL-Nav-3.jpg', 'Slika-PPL-Nav-4.jpg',
  'Slika-PPL-Nav-10.jpg', 'Slika-PPL-Nav-11.jpg', 'Slika-PPL-Nav-12.jpg', 'Slika-PPL-Nav-13.jpg', 'Slika-PPL-AKG-1.jpg',
  'Slika-PPL-AKG-2.jpg', 'Slika-PPL-AKG-3.jpg', 'Slika-PPL-FPP-2.jpg', 'Slika-PPL-FPP-7.jpg',
  'Slika-PPL-FPP-8.jpg', 'Slika-PPL-FPP-9.jpg', 'Slika-PPL-FPP-10.jpg', 'Slika-PPL-FPP-13.jpg', 'Slika-PPL-FPP-14.jpg',
  'Slika-PPL-FPP-15.jpg', 'Slika-PPL-FPP-16.jpg', 'Slika-PPL-FPP-17.jpg', 'Slika-PPL-Meteo-1.jpg', 'Slika-PPL-Meteo-2.jpg',
  'Slika-PPL-Meteo-4.jpg', 'Slika-PPL-Meteo-5.jpg', 'Slika-PPL-Meteo-6.jpg', 'Slika-PPL-Meteo-10.jpg', 'Slika-PPL-Meteo-15.jpg',
  'Slika-PPL-OP-1.jpg', 'Slika-PPL-OP-2.jpg', 'Slika-PPL-OP-3.jpg', 'Slika-PPL-OP-4.jpg', 'Slika-PPL-PoF-1.jpg',
  'Slika-PPL-PoF-2.jpg'
];
let imgCount = 0;

function loadAllImages () {
  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = '/images/' + images[i];
    img.onload = function () {
      imgCount++;

      if (imgCount === images.length) {
        // console.log('ALL IMAGES LOADED:::');
        indicator.style.background = '#2c2';
      }

    };

    APP.images.push({ image: images[i], el: img });
  }
}

function loadData () {
  APP.questionsArr = DATA.questions;
  APP.answersArr = DATA.answers;
  APP.topicsArr = DATA.topics;
  addTopicsToDom(APP.topicsArr);
  loadAllImages();
  loadState();
}

function addTopicsToDom (topicsArr) {
  for (let i = 0; i < topicsArr.length; i++) {
    const topic = document.createElement('div');
    topic.classList.add('topic');
    topic.classList.add('flex-col');
    topic.innerHTML = topicsArr[i].topicName;
    topic.id = 'topic-' + topicsArr[i].topicId;
    topic.setAttribute('data-topic', topicsArr[i].topicId);
    topic.addEventListener('click', handleTopicClick);
    topicsList.appendChild(topic);
  }
}

function applyStyles (el, name, value) {
  if (Array.isArray(el)) {
    for (let i = 0; i < el.length; i++) {
      el[i].style[name] = value;
    }
  } else if (typeof el === 'object') {
    el.style[name] = value;
  }
}

function showEl (el) {
  applyStyles(el, 'display', 'flex');
}

function hideEl (el) {
  applyStyles(el, 'display', 'none');
}

function showAlert () {
  showEl(alertEl);
}

function hideAlert () {
  hideEl(alertEl);
}

function handleHistoryClick () {
  loadTestsHistory();
  showEl(historyPage);
}

function handleHistoryCloseClick () {
  hideEl(historyPage);
}

function handleTestDetailsCloseClick () {
  hideEl(testDetailsPage);
}

function handleCancelTest () {
  hideAlert();
  handleNewTestClick();
  deleteState();
}

function handleHistoryTestClick () {
  const test = APP.previousTestArr.find(t => t.id === this.dataset.testId);
  const questions = getQuestionsAndAnswers(test.questions);
  populateTestDetailsList(questions);
  showEl(testDetailsPage);
}

function handleDeleteHistoryClick () {
  localStorage.removeItem('_ARHIVA_TESTOVA_');
  APP.previousTestArr = [];
  APP.testHistory = [];
  historyList.innerHTML = `<h3>NEMA TESTOVA</h3>`;
}

function handleAllQuestionsClick () {
  APP.selectedQuestions = getQuestionsForTopic(APP.currentTopic, 0);
  prepareQuestions();
}

function handleRandomQuestionsClick () {
  APP.selectedQuestions = getQuestionsForTopic(APP.currentTopic, 20);
  prepareQuestions();
}

function prepareQuestions () {
  hideEl([topicsContainer, historyBtn]);
  showEl([questionsContainer, footer]);
  updateQuestion();
}

function handleCloseModalClick () {
  hideEl(modal)
  modalInner.style.position = 'relative';
  modalInner.style.left = ``;
  modalInner.style.top = ``;
  APP.imageScale = 1;
  modalInner.style.width = '';
  modalInner.style.height = '';
}

function handleOpenModalClick () {
  const imageToShow = APP.images.filter(image => image.image === APP.currentImage)[0];
  if (imageWrapper.childElementCount > 0) {
    imageWrapper.firstChild.remove();
  }

  imageWrapper.appendChild(imageToShow.el);
  showEl(modal)

  imageWrapper.addEventListener('mousedown', handleMouseDown);

  APP.imageWidth = imageToShow.el.naturalWidth;
  APP.imageHeight = imageToShow.el.naturalHeight;
}

function handleMouseDown (e) {
  APP.mouseX = e.clientX;
  APP.mouseY = e.clientY;
  imageWrapper.firstChild.draggable = false;
  APP.imageCss = modalInner.getBoundingClientRect();
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove (e) {
  const dx = e.clientX - APP.mouseX;
  const dy = e.clientY - APP.mouseY;
  const left = APP.imageCss.left + dx;
  const top = APP.imageCss.top + dy;
  modalInner.style.position = 'absolute';
  modalInner.style.left = `${left}px`;
  modalInner.style.top = `${top}px`;
}

function handleMouseUp () {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

function handleZoomIn () {
  if (APP.imageScale >= 5) {
    return false;
  }

  APP.imageScale += 0.5;
  zoomImage();
}

function handleZoomOut () {
  if (APP.imageScale <= 1) {
    return false;
  }

  APP.imageScale -= 0.5;
  zoomImage();
}

function zoomImage () {
  const newWidth = APP.imageWidth * APP.imageScale;
  const newHeight = APP.imageHeight * APP.imageScale;
  const newLeft = (window.innerWidth - newWidth) / 2;
  const newTop = (window.innerHeight - newHeight) / 2;
  modalInner.style.position = 'absolute';
  modalInner.style.left = `${newLeft}px`;
  modalInner.style.top = `${newTop}px`;
  modalInner.style.width = `${newWidth}px`;
  modalInner.style.height = `${newHeight}px`;
}


function handleTopicClick (e) {
  APP.currentTopic = this.dataset.topic;
  APP.currentTopicQuestionGroups = APP.topicsArr.filter(t => t.topicId === this.dataset.topic)[0].questionGroups;
  subTitleEl.innerHTML = 'Tema: ' + this.innerHTML;
  showEl(topicButtonsContainer);
  hideEl([topicsList, historyBtn]);
  APP.currentTestId = `test-${Date.now()}`;
  APP.testHistory = [];
}

function handleAnswerClick (e) {
  if (APP.disableAnswersButtons) {
    return;
  }

  APP.nextQuestionDisabled = false;
  const answerId = this.id.split('answer-')[1];
  const correct = this.dataset.correct;

  if (correct === '1') {
    this.classList.add('answer-correct');
    APP.correctAnswers++;
    correctAnswersEl.innerHTML = APP.correctAnswers;
    APP.testHistory[APP.currentQuestionIdx].correct = answerId;
    APP.testHistory[APP.currentQuestionIdx].wrong = false;
  } else {
    this.classList.add('answer-wrong');
    const correctAnswer = APP.selectedAnswers.filter(a => a.correct === '1')[0];
    const answerEl = answersContainer.querySelector('#answer-' + correctAnswer.id);
    answerEl.classList.add('answer-correct');
    APP.testHistory[APP.currentQuestionIdx].correct = correctAnswer.id;
    APP.testHistory[APP.currentQuestionIdx].wrong = answerId;
  }

  APP.totalAnswers++;
  APP.disableAnswersButtons = true;

  if (APP.currentQuestionIdx === APP.selectedQuestions.length - 1) {
    showQuizFinished();
    return;
  }
}

function handleBackClick () {
  APP.currentTopic = null;
  APP.currentTopicQuestionGroups = [];
  subTitleEl.innerHTML = 'IZABERITE TEMU';
  topicButtonsContainer.style.display = 'none';
  showEl([topicsList, historyBtn]);
}

function handleNewTestClick () {
  APP.currentTopic = null;
  APP.currentTopicQuestionGroups = [];
  APP.selectedQuestions = [];
  APP.currentQuestionIdx = 0;
  APP.selectedAnswers = [];
  APP.correctAnswers = 0;
  APP.totalAnswers = 0;
  APP.nextQuestionDisabled = true;
  APP.disableAnswersButtons = false;
  correctAnswersEl.innerHTML = 0;
  showEl([scoreWrapper, topicsContainer, topicsList, historyBtn]);
  hideEl([endGameWrapper, questionsContainer, footer, topicButtonsContainer]);
  endGameLabel.classList.remove('success', 'fail');
  subTitleEl.innerHTML = 'IZABERITE TEMU';
  APP.currentTestId = null;
  APP.testHistory = [];
  deleteState();
}

function populateTestDetailsList (questions) {
  testDetailsList.innerHTML = '';

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const el = document.createElement('div');
    el.classList.add('flex-col', 'test-details-item');
    el.innerHTML = `<div class="flex-row question">${q.questionNo}) ${q.question}</div>
      <div class="flex-row correct-answer">Tačan Odgovor: ${q.correct}</div>
    `;

    if (q.wrong) {
      el.children[1].insertAdjacentHTML('beforebegin', `<div class="flex-row wrong-answer">Netačan Odgovor: ${q.wrong}</div>`);
    }

    testDetailsList.appendChild(el);
  }
}

function getQuestionsAndAnswers (questions) {
  const arr = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const question = APP.questionsArr.find(question => question.id === q.questionId);
    const correctAnswer = APP.answersArr.find(answer => answer.id === q.correct);
    const obj = { questionNo: question.sortNo, question: question.question, correct: correctAnswer.answer };

    if (q.wrong) {
      const wrongAnswer = APP.answersArr.find(answer => answer.id === q.wrong);
      obj.wrong = wrongAnswer.answer;
    }

    arr.push(obj);
  }

  return arr;
}

function getQuestionsForTopic (topicId, randomNum = 0) {
  if (!topicId || topicId === '') {
    return false;
  }

  let questions = APP.questionsArr.filter(q => q.topicId === topicId && q.sortNo);
  questions = questions.sort((a, b) => a.sortNo < b.sortNo ? -1 : 1);

  if (randomNum === 0) {
    return questions;
  }

  let count = 0;
  const randomIndecies = [];
  let randomQuestions = [];

  for (let i = 0; i < APP.currentTopicQuestionGroups.length; i++) {
    const group = APP.currentTopicQuestionGroups[i];
    let counter = 0;

    while (counter < group.count) {
      const randomSortNo = randomInt(group.from, group.to);
      if (!randomIndecies.includes(randomSortNo)) {
        randomIndecies.push(randomSortNo);
        const randomQuestion = questions.filter(q => q.sortNo === randomSortNo)[0];
        randomQuestions.push(randomQuestion);
        counter++;
      }
    }
  }

  randomQuestions = randomQuestions.sort((a, b) => a.sortNo < b.sortNo ? -1 : 1);

  return randomQuestions;
}

function showQuizFinished () {
  const score = Math.floor(APP.correctAnswers / APP.totalAnswers * 100);
  showEl(endGameWrapper);
  hideEl(scoreWrapper);
  endGameLabel.innerHTML = `KRAJ TESTA: ${score}% (${APP.correctAnswers}/${APP.totalAnswers}) TAČNIH ODGOVORA.`;
  endGameLabel.classList.add(score >= 80 ? 'success' : 'fail');
  saveTestHistory(score);
  deleteState();
}

function updateQuestion () {
  const question = APP.selectedQuestions[APP.currentQuestionIdx];
  const answers = shuffle(getAnswersForQuestion(question.id));
  currentQuestionText.innerHTML = question.question;
  currentQuestionNumber.innerHTML = `Pitanje Br: ${APP.currentQuestionIdx + 1} / ${APP.selectedQuestions.length}`;
  currentQuestionSortNumber.innerHTML = `(${question.sortNo})`;


  const testExists = APP.testHistory.find(t => t.questionId === question.id);
  if (!testExists) {
    APP.testHistory.push({ questionId: question.id });
  }

  if (question.image) {
    APP.currentImage = question.image;
    showEl(openModalBtn);
  } else {
    hideEl(openModalBtn)
  }

  answersContainer.innerHTML = '';

  for (let i = 0; i < answers.length; i++) {
    const answer = document.createElement('div');
    answer.id = 'answer-' + answers[i].id;
    answer.classList.add('answer');
    answer.innerHTML = answers[i].answer;
    answer.setAttribute('data-correct', answers[i].correct);
    answer.setAttribute('data-id', answers[i].id);
    answersContainer.appendChild(answer);
    answer.addEventListener('click', handleAnswerClick);
  }

  APP.selectedAnswers = answers;
}

function getAnswersForQuestion (questionId) {
  return APP.answersArr.filter(a => a.questionId === questionId);
}

function handleNextQuestionClick () {
  if (APP.nextQuestionDisabled) {
    return false;
  }

  APP.disableAnswersButtons = false;
  APP.currentQuestionIdx++;
  APP.currentImage = null;
  APP.nextQuestionDisabled = true;
  updateQuestion();
  saveState();
}

function saveState () {
  const {
    correctAnswers,
    totalAnswers,
    currentQuestionIdx,
    currentTopic,
    currentTopicQuestionGroups,
    selectedQuestions,
    selectedAnswers,
    testHistory,
    currentTestId
  } = APP;
  localStorage.setItem('APP_STATE', JSON.stringify({
    correctAnswers,
    totalAnswers,
    currentQuestionIdx,
    currentTopic,
    currentTopicQuestionGroups,
    selectedQuestions,
    selectedAnswers,
    testHistory,
    currentTestId
  }));
}

function saveTestHistory (score) {
  let prevTests = getTestsHistory();
  const date = new Date();
  const obj = {
    id: APP.currentTestId,
    topic: APP.currentTopic,
    date: date.toISOString().split('T')[0],
    score: score,
    questions: APP.testHistory
  };

  if (!prevTests) {
    const arr = [obj];
    localStorage.setItem('_ARHIVA_TESTOVA_', JSON.stringify(arr));
  } else {
    prevTests.push(obj);
    localStorage.setItem('_ARHIVA_TESTOVA_', JSON.stringify(prevTests));
  }
}

function loadState () {
  const str = localStorage.getItem('APP_STATE');
  if (str) {
    try {
      const obj = JSON.parse(str);
      APP.correctAnswers = obj.correctAnswers;
      correctAnswersEl.innerHTML = obj.correctAnswers;
      APP.totalAnswers = obj.totalAnswers;
      APP.currentQuestionIdx = obj.currentQuestionIdx;
      APP.currentTopic = obj.currentTopic;
      subTitleEl.innerHTML = `TEMA: ${(APP.topicsArr.find(t => t.topicId === obj.currentTopic)).topicName}`;
      APP.currentTopicQuestionGroups = obj.currentTopicQuestionGroups;
      APP.selectedQuestions = obj.selectedQuestions;
      APP.selectedAnswers = obj.selectedAnswers;
      APP.testHistory = obj.testHistory;
      APP.currentTestId = obj.currentTestId;
      prepareQuestions();
    } catch (err) {
      console.log('NEMOZ DA UCITA STATE', err);
    }
  }
}

function deleteState () {
  localStorage.removeItem('APP_STATE');
}

function getTestsHistory () {
  const tests = localStorage.getItem('_ARHIVA_TESTOVA_');
  if (!tests) {
    return false;
  }

  return testsArr = JSON.parse(tests);
}

function loadTestsHistory () {
  const tests = getTestsHistory();

  if (!tests) {
    historyList.innerHTML = '<h3>NEMA TESTOVA</h3>';
  } else {
    historyList.innerHTML = '';

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const date = new Date(test.date);
      const topic = APP.topicsArr.find(t => t.topicId === test.topic);
      const el = document.createElement('div');
      el.dataset.testId = test.id;
      el.classList.add('flex-row', 'list-item');
      el.innerHTML = `<span class="flex-row date">${date.toLocaleDateString()}</span>
        <span class="flex-row topic">${topic.topicName}</span>
        <span class="flex-row score">${test.score}%</span>
      `;

      if (test.score >= 80) {
        el.classList.add('success');
      } else {
        el.classList.add('fail');
      }

      el.addEventListener('click', handleHistoryTestClick);
      historyList.appendChild(el);
    }

    APP.previousTestArr = tests;
  }

}

function shuffle (arr) {
  const shuffled = [];

  for (let i = 0; i < arr.length; ++i) {
    shuffled.push(false);
  }

  for (let i in arr) {
    let idx = randomInt(0, arr.length - 1);

    while (shuffled[idx]) {
      idx = (idx + 1) > (arr.length - 1) ? 0 : (idx + 1);
    }

    shuffled[idx] = arr[i];
  }

  return shuffled;
}

function randomInt (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}


loadData();
