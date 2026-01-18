
const arrColor = [
    ' #ff007b',
    ' #ff5100',
    ' #ffb700',
    ' #00d9b5',
    ' #00b3aa',
    ' #6a00ff',
    ' #4a00b3',
    ' #8b1c9c',
    ' #b00084',
    ' #d6006f',
    ' #ff5100',
    ' #F16A5B',
    ' #ffb700',
    ' #FBD53C',
    ' #A3D75F',
    ' #7ED6B4',
    ' #1DA1F2',
    ' #C96CF5',
    ' #EC2CA9',
    ' #FF6F1A',
];
let level = localStorage.getItem('LEVEL');
document.getElementById('level').innerHTML=level;
let best = localStorage.getItem('BEST');
let bestDiv =document.getElementById('besttxt');
bestDiv.innerHTML=best;
let score = document.getElementById('scoretxt');
let scoreNum =0;
let matrix=[];
let matCheckEmpty=[];
let newCardflag=true;
let arrCell=[];
document.getElementById('new_geme').addEventListener('click',NewGame);
document.getElementById('exit').addEventListener('click',Exit)
document.addEventListener('keydown',Direction);
document.getElementById('Try_again').addEventListener('click',NewGame);
let size=4;
Game();

// craete the Game_board
function Game(){

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let gridCell = document.createElement('div')
            gridCell.classList.add('grid_cell');
            gameBoard = document.getElementById('Game_board');
            gameBoard.appendChild(gridCell);
        }
        
    }
    Start();
}

function NewGame(){
    RemoveDiv(false);
    arrCell=document.querySelectorAll('div.grid_cell');
    for (let i = 0; i < 16; i++) { 
        if(arrCell[i].querySelector('div')!=null)
            arrCell[i].querySelector('div').remove();
    }
    scoreNum=0;
    score.innerHTML=scoreNum;
    newCardflag=true;
    Start();
}

function Exit(){
    localStorage.removeItem('LEVEL');
    window.location.href = 'home_page.html';
}

function Start(){
    arrCell = document.querySelectorAll('div.grid_cell');
    let randnum;
    let numStart;
    let t;
    for(let i = 0 ; i < size ; i++){
        matrix[i] = [];
        matCheckEmpty[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j]=arrCell[4*i+j];
            matCheckEmpty[i][j]=0;
        }
    }
    NewCard();
    NewCard();
    newCardflag=true;
}

function Direction(e) {
    switch (e.key) {
        case 'ArrowDown':
            ConnectionCardRD('down');
            break;
        case 'ArrowUp':
            ConnectionCardUL('up');
            break;
        case 'ArrowRight':
            ConnectionCardRD('right');
            break;
        case 'ArrowLeft':
            ConnectionCardUL('left');
            break;
    }
}

function NewCard()
{
    newCardflag = false;
    do{
        randnum=Math.floor(Math.random() * size*size);
    }while( matCheckEmpty[Math.floor(randnum / size)][randnum % size] != 0);
    numStart = Math.floor(Math.random() * 8);
    if(numStart == 3)
        numStart=4;
    else
    numStart=2;
    let newCard=document.createElement('div');
    newCard.classList.add('new_card');
    newCard.classList.add('animation_newCard');
    newCard.style.backgroundColor=arrColor[numStart/2-1];
    newCard.innerHTML=numStart;
    arrCell[randnum].appendChild(newCard);
    matCheckEmpty[Math.floor(randnum / size)][randnum % size]=1;
}

function canMerge(card1, card2) {
    if (!card1 || !card2) return false;
    return card1.innerHTML === card2.innerHTML;
}

function mergeCards(card1, card2) {
    const newValue = Number(card1.innerHTML) * 2;
    card1.innerHTML = newValue;
    card1.style.backgroundColor = arrColor[Math.log2(newValue)-1];
    card1.classList.add('animation_replace');
    if (newValue == level) {
        Win();
    }
    card2.remove();
}

let pos ,nextCard , currentCard;
function ConnectionCardUL(direction){
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            direction === 'left' ? pos = j : pos = i;
            currentCard = matrix[i][j].querySelector('div');
            while(pos < size-1){
                direction === 'left' ? ConnectionCardLR(i,j,1) :ConnectionCardUD(i,j,1);
                if(currentCard && nextCard){
                    break;
                }
            }
        }
    }
    MoveUL(direction);
}

function ConnectionCardRD(direction){
    for (let i = size-1; i >= 0; i--) {
        for (let j = size-1; j >= 0; j--) {
            direction === 'right' ? pos = j : pos = i;
            currentCard = matrix[i][j].querySelector('div');
            while(pos > 0){
                direction === 'right' ? ConnectionCardLR(i,j,-1) : ConnectionCardUD(i,j,-1);
                if(currentCard && nextCard){
                    break;
                }
            }
        }
    }
    MoveDR(direction);
}

function ConnectionCardLR(i,j,direction){
    pos+=direction;
    nextCard = matrix[i][pos].querySelector('div');
    if(canMerge(currentCard,nextCard)){
        newCardflag = true;
        Score(Number(currentCard.innerHTML));
        Best(Number(currentCard.innerHTML)*2);
        mergeCards(currentCard, nextCard);
        matCheckEmpty[i][pos]=0;
    }
}

function ConnectionCardUD(i,j,direction){ 
    pos+=direction;
    nextCard = matrix[pos][j].querySelector('div');
    if(canMerge(currentCard,nextCard)){
        newCardflag = true;
        Score(Number(currentCard.innerHTML));
        Best(Number(currentCard.innerHTML)*2);
        mergeCards(currentCard, nextCard);
        matCheckEmpty[pos][j]=0;
    }
}

let  age,  flagMove;
function MoveUL(direction){
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            flagMove = false;
            currentCard = matrix[i][j].querySelector('div');
            if(currentCard!=null){
                direction === 'left' ? MoveLR(i,j,-1) : MoveUD(i,j,-1);
            }
        }
    }
    if(newCardflag)
        NewCard();
    else
        CheckGameOver();
}

function MoveDR(direction){
    for (let i = size-1; i >=0; i--) {
        for (let j = size-1; j >=0; j--) {
            flagMove =false;
            currentCard = matrix[i][j].querySelector('div');
            if(currentCard!=null){
                direction === 'right' ? MoveLR(i,j,1) : MoveUD(i,j,1);
            }
        }
    }
    if(newCardflag)
        NewCard();
    else
        CheckGameOver();
}

function compWhile(age,direction){
    if(direction == 1 && age <= size-1 || direction == -1 && age >= 0)
        return true ;
    return false;
}

function MoveLR(i,j,direction){
    age = j+direction;
    while(compWhile(age,direction)){ 
        if(matrix[i][age].querySelector('div') != null)
            break;
        else{
            age+=direction;
            flagMove = true;
        }
    }
    if(flagMove){
        newCardflag = true;
        currentCard.classList.remove('animation_newCard');
        age-=direction;
        matrix[i][age].appendChild(currentCard);
        matCheckEmpty[i][j] = 0;
        matCheckEmpty[i][age] = 1;

    }
}

function MoveUD(i,j,direction){
    age = i+direction;
    while(compWhile(age,direction)){ // בודק אם יש לאיפה לזוז
        if(matrix[age][j].querySelector('div') != null)
            break;
        else{
            age+=direction;
            flagMove = true;
        }
    }
    if(flagMove){
        newCardflag = true;
        currentCard.classList.remove('animation_newCard');
        age-=direction;
        matrix[age][j].appendChild(currentCard);
        matCheckEmpty[i][j] = 0;
        matCheckEmpty[age][j] = 1;
    }
}

function CheckGameOver(){
    let isfull=true
    let gameOverFlag=true
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if(matCheckEmpty[i][j]==0){
                isfull=false;
                break;
            }
        }
    } 
    if (isfull) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) { 
                let currentCard = matrix[i][j].querySelector('div');
                if(j < size-1){
                    if(canMerge(currentCard,matrix[i][j+1].querySelector('div'))){
                        gameOverFlag=false;
                        break; 
                    }
                }
                if(i < size-1)
                    if(canMerge(currentCard,matrix[i+1][j].querySelector('div'))){
                        gameOverFlag=false;
                        break;
                }
            }
        }
        if(gameOverFlag)
            GameOver();
    }
}

function Best(Value){
    if (Value > best) {
        localStorage.setItem('BEST', Value); 
        best=Value;
        bestDiv.innerHTML = Value;
    }
}

function Score(Value){
    scoreNum += Value;
    score.innerHTML=scoreNum;
}

function Win(){
    GameOver();
    let gameOverdiv = document.getElementById('gameOver');
    gameOverdiv.style.border = ' #00b3aa 3px solid';
    let con = document.createElement('button');
    con.innerHTML = 'continue';
    con.classList.add('btn_option');
    con.id = 'Try_again';
    con.addEventListener('click',function() {RemoveDiv(true);});
    gameOverdiv.innerHTML = 'YOU WIN!!!';
    gameOverdiv.appendChild(con);
}

function GameOver(){
    document.getElementById('gameOver').style.visibility='visible'
    document.getElementById('gameOver').style.border = 'transparent 3px solid'
    document.getElementById('div_opacity').style.visibility='visible';
    document.removeEventListener('keydown', Direction);
}

function RemoveDiv(flag){
    document.addEventListener('keydown',Direction);
    document.getElementById('div_opacity').style.visibility='hidden'
    document.getElementById('gameOver').style.visibility='hidden';
    if(flag){
        level = level*4;
        document.getElementById('level').innerHTML=level;
    }
}