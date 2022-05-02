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
const totalAnswersEl = document.getElementById('total-answers');
const footer = document.getElementById('footer');
const scoreWrapper = document.getElementById('score-wrapper');
const endGameWrapper = document.getElementById('end-game-wrapper');
const newTestBtn = document.getElementById('new-test-btn');
const endGameLabel = document.getElementById('end-game-label');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const imageEl = document.getElementById('image');

allQuestionsBtn.addEventListener('click', handleAllQuestionsClick);
randomQuestionsBtn.addEventListener('click', handleRandomQuestionsClick);
nextQuestionBtn.addEventListener('click', handleNextQuestionClick);
backBtn.addEventListener('click', handleBackClick);
newTestBtn.addEventListener('click', handleNewTestClick);
closeModalBtn.addEventListener('click', handleCloseModalClick);
openModalBtn.addEventListener('click', handleOpenModalClick);

const APP = {
  questionsArr: [],
  answersArr: [],
  topicsArr: [],
  currentTopic: null,
  selectedQuestions: [],
  selectedAnswers: [],
  currentQuestionIdx: 0,
  selectedTopic: null,
  correctAnswers: 0,
  totalAnswers: 0,
  currentImage: null,
  nextQuestionDisabled: true,
  disableAnswersButtons: false
};

function loadJsonData () {
  fetch('/data.json').then(res => res.json()).then(data => {
    // console.log('IMALI DATA???', data);
    APP.questionsArr = data.questions;
    APP.answersArr = data.answers;
    APP.topicsArr = data.topics;
    addTopicsToDom(APP.topicsArr);
  });
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

function handleAllQuestionsClick () {
  APP.selectedQuestions = getQuestionsForTopic(APP.currentTopic, 0);
  prepareQuestions();
}

function handleRandomQuestionsClick () {
  APP.selectedQuestions = getQuestionsForTopic(APP.currentTopic, 20);
  prepareQuestions();
}

function prepareQuestions () {
  hideTopics();
  showQuestionAndAnswers();
  showFooter();
  updateQuestion();
}

function handleCloseModalClick () {
  modal.style.display = 'none';
}

function handleOpenModalClick () {
  imageEl.src = '/images/' + APP.currentImage;
  modal.style.display = 'flex';
}

function handleTopicClick (e) {
  console.log(this.dataset.topic);
  APP.currentTopic = this.dataset.topic;
  subTitleEl.innerHTML = 'Tema: ' + this.innerHTML;
  topicButtonsContainer.style.display = 'flex';
  topicsList.style.display = 'none';
}

function handleAnswerClick (e) {
  if (APP.disableAnswersButtons) {
    return;
  }

  APP.nextQuestionDisabled = false;
  const answerId = this.id;
  const correct = this.dataset.correct;

  if (correct === '1') {
    this.classList.add('answer-correct');
    APP.correctAnswers++;
    correctAnswersEl.innerHTML = APP.correctAnswers;
  } else {
    this.classList.add('answer-wrong');
    const correctAnswer = APP.selectedAnswers.filter(a => a.correct === '1')[0];
    const answerEl = answersContainer.querySelector('#answer-' + correctAnswer.id);
    answerEl.classList.add('answer-correct');
  }

  APP.totalAnswers++;
  totalAnswersEl.innerHTML = APP.totalAnswers;
  APP.disableAnswersButtons = true;

  if (APP.currentQuestionIdx === APP.selectedQuestions.length - 1) {
    showQuizFinished();
    return;
  }
}

function handleBackClick () {
  APP.currentTopic = null;
  subTitleEl.innerHTML = 'IZABERITE TEMU';
  topicButtonsContainer.style.display = 'none';
  topicsList.style.display = 'flex';
}

function handleNewTestClick () {
  APP.currentTopic = null;
  APP.selectedQuestions = [];
  APP.currentQuestionIdx = 0;
  APP.selectedAnswers = [];
  APP.correctAnswers = 0;
  APP.totalAnswers = 0;
  APP.nextQuestionDisabled = true;
  correctAnswersEl.innerHTML = 0;
  totalAnswersEl.innerHTML = 0;
  scoreWrapper.style.display = 'flex';
  endGameWrapper.style.display = 'none';
  questionsContainer.style.display = 'none';
  footer.style.display = 'none';
  topicsContainer.style.display = 'flex';
  topicsList.style.display = 'flex';
  topicButtonsContainer.style.display = 'none';
  subTitleEl.innerHTML = 'IZABERITE TEMU';
}

function showFooter () {
  footer.style.display = 'flex';
}

function hideTopics () {
  topicsContainer.style.display = 'none';
}

function showQuestionAndAnswers () {
  questionsContainer.style.display = 'flex';
}

function getQuestionsForTopic (topicId, randomNum = 0) {
  if (!topicId || topicId === '') {
    return false;
  }

  const questions = APP.questionsArr.filter(q => q.topicId === topicId);
  if (randomNum === 0) {
    return questions;
  }

  let count = 0;
  const randomIndecies = [];
  const randomQuestions = [];

  while (count < randomNum) {
    const idx = randomInt(0, questions.length - 1);
    if (!randomIndecies.includes(idx)) {
      randomIndecies.push(idx);
      randomQuestions.push(questions[idx]);
      count++;
    }
  }

  return randomQuestions;
}

function showQuizFinished () {
  const score = Math.floor(APP.correctAnswers / APP.totalAnswers * 100);
  scoreWrapper.style.display = 'none';
  endGameWrapper.style.display = 'flex';
  endGameLabel.innerHTML = `KRAJ TESTA: ${score}% (${APP.correctAnswers}/${APP.totalAnswers}) TACNIH ODGOVORA.`;
  endGameLabel.classList.add(score >= 80 ? 'success' : 'fail');
}

function updateQuestion () {
  const question = APP.selectedQuestions[APP.currentQuestionIdx];
  const answers = shuffle(getAnswersForQuestion(question.id));
  currentQuestionText.innerHTML = question.question;

  if (question.image) {
    APP.currentImage = question.image;
    openModalBtn.style.display = 'flex';
  } else {
    openModalBtn.style.display = 'none';
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
}

function shuffle (arr) {
  // Create an array of the same size as `arr` filled with false
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


loadJsonData();
