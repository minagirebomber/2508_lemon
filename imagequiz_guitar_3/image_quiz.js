let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const timerEl=document.getElementById("timer");

const quizImage = document.getElementById("quiz-image");

// 正解範囲（px）
let correctArea = { xMin: 50, yMin:140 };
let isAnsweringAllowed = true; // 回答可能フラグ
const correctAreaWidth=40;
const correctAreaHeight=30;

const orgX=50;
const orgY=0;
const offsetunitX=60; // フレット数が1増えるあたりのずらし幅。
//correctArea.xMinのとる値は50, 110, 170, 230
const offsetunitY=28;// 弦が1本ずれるあたりのずらし幅。
//correctArea.yMinのとる値は0, 28, 56, 84, 112, 140

// todo:画像相対座標、xyともに100分割のやつにする
// 変えるときは、showCorectAreaとquizImageのeventlistener(正解判定処理)を
// 常にそろえるよう注意
const imgW = quizImage.clientWidth;//313
const imgH = quizImage.clientHeight;//181

// setAnsParam配下で決める変数
let fretnum=3;
let stringnum=0;

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

{
  // 内部的関数
//////////////////////
// string, fret→correctArea
//////////////////////
{
  function strfrettoCorrectArea(){
    correctArea.xMin= orgX  + offsetunitX * (fretnum - 3);
    correctArea.yMin= orgY  + offsetunitY * stringnum;
  }
}

//////////////////////
// note→string, fret
//////////////////////
//例:"G"からstringnum=0, fretnum=3を産出
const noteToNo={
  'A':0,
  'Bb':1,
  'B':2,
  'C':3,
  'Db':4,
  'D':5,
  'Eb':6,
  'E':7,
  'F':8,
  'Gb':9,
  'G':10,
  'Ab':11
}

const NotoFret=[
  [{string:0,fret:5},{string:1,fret:10},{string:2,fret:2},{string:3,fret:7},{string:4,fret:0},{string:5,fret:5},],//A
  [{string:0,fret:6},{string:1,fret:11},{string:2,fret:3},{string:3,fret:8},{string:4,fret:1},{string:5,fret:6},],//Bb
  [{string:0,fret:7},{string:1,fret:0},{string:2,fret:4},{string:3,fret:9},{string:4,fret:2},{string:5,fret:7},],//B
  [{string:0,fret:8},{string:1,fret:1},{string:2,fret:5},{string:3,fret:10},{string:4,fret:3},{string:5,fret:8},],//C
  [{string:0,fret:9},{string:1,fret:2},{string:2,fret:6},{string:3,fret:11},{string:4,fret:4},{string:5,fret:9},],//Db
  [{string:0,fret:10},{string:1,fret:3},{string:2,fret:7},{string:3,fret:0},{string:4,fret:5},{string:5,fret:10},],//D
  [{string:0,fret:11},{string:1,fret:4},{string:2,fret:8},{string:3,fret:1},{string:4,fret:6},{string:5,fret:11},],//Eb
  [{string:0,fret:0},{string:1,fret:5},{string:2,fret:9},{string:3,fret:2},{string:4,fret:7},{string:5,fret:0},],//E
  [{string:0,fret:1},{string:1,fret:6},{string:2,fret:10},{string:3,fret:3},{string:4,fret:8},{string:5,fret:1},],//F
  [{string:0,fret:2},{string:1,fret:7},{string:2,fret:11},{string:3,fret:4},{string:4,fret:9},{string:5,fret:2},],//Gb
  [{string:0,fret:3},{string:1,fret:8},{string:2,fret:0},{string:3,fret:5},{string:4,fret:10},{string:5,fret:3},],//G
  [{string:0,fret:4},{string:1,fret:9},{string:2,fret:1},{string:3,fret:6},{string:4,fret:11},{string:5,fret:4},],//Ab
];

// 該当するポジションの中で、一番上の弦のやつをfretnum, stringnumに詰める 
function getStrFret(note, lfret, rfret){
  for(let i=0;i<6;i++){
    let workfret=NotoFret[noteToNo[note]][i].fret;
    if(lfret <= workfret && workfret <= rfret){
      // 条件を満たす
      fretnum=workfret;
      stringnum=NotoFret[noteToNo[note]][i].string;
      break;
    }
  }
}
}

//////////////////////
// noteからcorrectArea設定
//////////////////////
function applynote(note){
  getStrFret(note, 3, 7);
  strfrettoCorrectArea();
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
  nextBtn.style.display = "inline-block";
  nextBtn.disabled=false;
  isAnsweringAllowed=false;
});

let timerInterval;
let timeLeft = 10.0; // 制限時間（秒）

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