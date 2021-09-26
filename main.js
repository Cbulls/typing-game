// 변수
const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score')
const timeDisplay = document.querySelector('.time')
const button = document.querySelector('.button')
const gameTime = 4; // 게임시간은 4초

let score = 0;
let time = gameTime;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

init(); // 화면이 rendering 됬을 때 바로 선언
function init(){
    getWords(); // 단어 불러오기
    wordInput.addEventListener('input',checkMatch)
}

function run(){
    if(isPlaying){
        return; // 게임 중에 Start를 눌러도 다시 게임이 실행 할 수 없게 
    }
    isPlaying = true; 
    time = gameTime; // 게임 시작할 때 항상 시간 초기화
    wordInput.focus(); // 마우스 포커스가 가게 만듬
    scoreDisplay.innerText = 0; // 점수를 0으로 초기화
    timeInterval= setInterval(countDown,1000); // 1초마다 카운트다운 실행
    checkInterval = setInterval(checkStatus, 25); // 0.025초마다 상태 체크
    buttonChange('Playing');
}

function checkStatus(){
    if(!isPlaying&&time===0){
        buttonChange('Start');
        clearInterval(checkInterval); 
    }
}

function getWords(){ // 단어 불러오기
    axios.get('https://random-word-api.herokuapp.com/word?number=200')
        .then(function (response) {
        // handle success
            response.data.forEach((word) => {
                if(word.length < 10){
                    words.push(word);
                }
            })
            // buttonChange('Start') // words가 다 잘 불러왔으면 버튼이 Start로 바뀜
            console.log(words) // words가 잘 불러왔는지 확인
            words = response.data;
        //console.log(response);
        })
        .catch(function (error) {
        // handle error
        console.log(error);
        })
}

function checkMatch(){ // 단어일치 체크
    if(wordInput.value === wordDisplay.innerText){
        wordInput.value = ''
        if(!isPlaying){
            return;//게임이 끝나고 typing해도 점수가 올라가는 것을 방지 
        }
        score++;
        scoreDisplay.innerText = score;
        time = gameTime;
        const randomIndex = Math.floor(Math.random()*words.length);
        wordDisplay.innerText = words[randomIndex]
    }
}

function countDown(){
    // 삼항연산자 : (조건) ? 참일 경우 : 거짓일 경우 
    time > 0 ? time-- : isPlaying = false;
    if(!isPlaying){
        clearInterval(timeInterval) // 게임하고 있지 않을 때는 interval을 실행하지 않음
    }
    timeDisplay.innerText = time;
}

wordInput.addEventListener('input',()=>{
    if(wordInput.value === wordDisplay.innerText){
        score++;
        scoreDisplay.innerText = score;
        wordInput.value = '' //꼼수 방지를 위해 value 초기화
    }
})

buttonChange('Start')

function buttonChange(text){
    button.innerText = text
    text === 'Start' ? button.classList.remove('loading') : button.classList.add('loading')
}