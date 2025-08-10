let currentQuestion = 0;
let score = 0;


const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const timerEl=document.getElementById("timer");

const quizImage = document.getElementById("quiz-image");

// 正解範囲（px）
let correctArea = { xMin: 0, yMin:0 };
let isAnsweringAllowed = true; // 回答可能フラグ
let correctAreaWidth=10;
const correctAreaHeight=60;

//correctArea.xMinのとる値は42, 73, ←黒鍵
const blackKeyXCoord=[42, 73, 122, 153, 184];
const blackKeyYCoord=50;
const whiteKeyXCoord=[30, 56,82,108,135,162,190];
const whiteKeyYCoord=120;
const blackKeyWidth=10;
const whiteKeyWidth=15;

// todo:画像相対座標、xyともに100分割のやつにする
// 変えるときは、showCorectAreaとquizImageのeventlistener(正解判定処理)を
// 常にそろえるよう注意
const imgW = quizImage.clientWidth;//
const imgH = quizImage.clientHeight;//

//////////////////////
// correctAreaの値をもとに長方形の描画を行う
//////////////////////
{
function showCorrectArea() {
  const rectDiv = document.getElementById("correctArea");
  rectDiv.style.display=true;

  rectDiv.style.left =  correctArea.xMin + "px";
  rectDiv.style.top =  correctArea.yMin + "px";
  rectDiv.style.width =  correctAreaWidth + "px";
  rectDiv.style.height =  correctAreaHeight + "px";
  rectDiv.style.display = "block";
}

function hideCorrectArea() {
  const rectDiv = document.getElementById("correctArea");
  rectDiv.style.display="none";
}
}

//////////////////////
// noteからcorrectArea設定
//////////////////////
function applynote(note){
  switch(note){
    case 'A':
      correctArea.xMin=whiteKeyXCoord[5];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'B':
      correctArea.xMin=whiteKeyXCoord[6];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'C':
      correctArea.xMin=whiteKeyXCoord[0];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'D':
      correctArea.xMin=whiteKeyXCoord[1];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'E':
      correctArea.xMin=whiteKeyXCoord[2];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'F':
      correctArea.xMin=whiteKeyXCoord[3];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'G':
      correctArea.xMin=whiteKeyXCoord[4];
      correctArea.yMin=whiteKeyYCoord;
      correctAreaWidth=whiteKeyWidth;
      break;
    case 'Ab':
      correctArea.xMin=blackKeyXCoord[3];
      correctArea.yMin=blackKeyYCoord;
      correctAreaWidth=blackKeyWidth;
      break;
    case 'Bb':
      correctArea.xMin=blackKeyXCoord[4];
      correctArea.yMin=blackKeyYCoord;
      correctAreaWidth=blackKeyWidth;
      break;
    case 'Db':
      correctArea.xMin=blackKeyXCoord[0];
      correctArea.yMin=blackKeyYCoord;
      correctAreaWidth=blackKeyWidth;
      break;
    case 'Eb':
      correctArea.xMin=blackKeyXCoord[1];
      correctArea.yMin=blackKeyYCoord;
      correctAreaWidth=blackKeyWidth;
      break;
    case 'Gb':
      correctArea.xMin=blackKeyXCoord[2];
      correctArea.yMin=blackKeyYCoord;
      correctAreaWidth=blackKeyWidth;
      break;
  }
}

// クリック発火時の処理
quizImage.addEventListener("click", (event) => {
  if (!isAnsweringAllowed) return; // 回答不可なら無視

  // 画像の位置とサイズを取得
  const rect = quizImage.getBoundingClientRect();
  // クリック位置を画像内の座標に変換
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log(`クリック座標: x=${x}, y=${y}`);

  if (x >= correctArea.xMin && x <= (correctArea.xMin + correctAreaWidth) &&
      y >= correctArea.yMin && y <= (correctArea.yMin + correctAreaHeight)) {
        //btn.classList.add("correct");
        resultEl.textContent = "✅ 正解！";
        showCorrectArea();
        score++;
  } else {
    //btn.classList.add("wrong");
    resultEl.textContent = "❌ 不正解…";
    showCorrectArea();
    //document.querySelectorAll(".btn")[q.answer].classList.add("correct");  
  }
  stopTimer();
  getTimer();
  console.log(`回答時間: ${solveTime}`);
  nextBtn.style.display = "inline-block";
  nextBtn.disabled=false;
  isAnsweringAllowed=false;
});

let timerInterval;
const timelimit=10.0;
let timeLeft = timelimit; // 制限時間（秒）

function showQuestion() {
  const q = quizData[currentQuestion];
  resultEl.textContent = "❔";
  nextBtn.style.display = "none";
  questionEl.textContent = q.question
  isAnsweringAllowed=true;
  // 問題表示後にタイマー開始
  startTimer();
  applynote(q.answer);
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

let solveTime=0;
function getTimer(){
  solveTime=timelimit-timeLeft;
}

function handleTimeout() {
    resultEl.textContent = "時間切れ！";
    isAnsweringAllowed=false;
    nextBtn.style.display = "block";
}



nextBtn.onclick = () => {
  currentQuestion++;
  hideCorrectArea();
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  questionEl.textContent = "🎉 終了！ 🎉";
  resultEl.textContent = `あなたのスコア：${score} / ${quizData.length}`;
  nextBtn.style.display = "none";
  isAnsweringAllowed=false;
}

////////////////////
// クイズをランダムで生成
////////////////////
const NotoNote=[
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
];
const NotoQual=["m7b5", "m7", "7","△7"];
const qnum=10;
let quizData=Array.from({length:qnum}, (_, index)=>({question:"", answer:""}));
function generateQuiz(){
  for(let i=0;i<qnum;i++){
    //ランダムに考える
    // 基音を決定
    let noteparam=Math.floor(Math.random()*12)
    let rootNote=NotoNote[noteparam];

    // コードクオリティを決定
    // Φ, m7, 7, △7のどれか
    let Qualparam=Math.floor(Math.random()*4);
    let chordQual=NotoQual[Qualparam];

    // 正解を算出
    let ansoft=0;
    if (Qualparam == 0 || Qualparam == 1){
      ansoft=3
    }else if(Qualparam==2||Qualparam==3){
      ansoft=4;
    }

    // 配列に詰める
    quizData[i].question=rootNote+chordQual;
    quizData[i].answer=NotoNote[(noteparam+ansoft)%12];
  }
}

generateQuiz();

// 最初の問題を表示
showQuestion();