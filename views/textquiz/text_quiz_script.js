let currentQuestion = 0;
let score = 0;
let quizData =  [
    {
      question: "apple",
      choices: ["リンゴ", "東京", "札幌", "愛"],
      answer: 0
    },
    {
      question: "hello",
      choices: ["7", "12", "9", "こんにちは"],
      answer: 3
    },
    {
      question: "HTMLの意味は？",
      choices: ["HyperText Markup Language", "How To Make Links", "thank you", "everyone"],
      answer: 0
    }
  ];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const timerEl=document.getElementById("timer");

let timerInterval;
let timeLeft = 10.0; // 制限時間（秒）

function showQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    choicesEl.innerHTML = "";
    resultEl.textContent = "";
    nextBtn.style.display = "none";
  
    q.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.className = "btn";
      btn.onclick = () => {
        stopTimer(); // 回答したらタイマー止める
        selectAnswer(btn, index);
      };
      choicesEl.appendChild(btn);
    });
  
    // 問題表示後にタイマー開始
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval); // 既存タイマー解除
    timeLeft = 10; // 秒数リセット
    timerEl.textContent = `残り時間: ${timeLeft.toFixed(1)}秒`;
  
    timerInterval = setInterval(() => {
      timeLeft-=0.1;
      timerEl.textContent = `残り時間: ${timeLeft.toFixed(1)}秒`;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}
  
function handleTimeout() {
    resultEl.textContent = "時間切れ！";
    nextBtn.style.display = "block";
}
  
// 最初の問題を表示
showQuestion();

function selectAnswer(btn, choiceIndex) {
  const q = quizData[currentQuestion];
  const correct = q.answer === choiceIndex;
  document.querySelectorAll(".btn").forEach(b => b.disabled = true);

  if (correct) {
    btn.classList.add("correct");
    resultEl.textContent = "✅ 正解！";
    score++;
  } else {
    btn.classList.add("wrong");
    resultEl.textContent = "❌ 不正解…";
    document.querySelectorAll(".btn")[q.answer].classList.add("correct");
  }

  nextBtn.style.display = "inline-block";
  nextBtn.disabled=false;
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  questionEl.textContent = "🎉 終了！ 🎉";
  choicesEl.innerHTML = "";
  resultEl.textContent = `あなたのスコア：${score} / ${quizData.length}`;
  nextBtn.style.display = "none";
}
