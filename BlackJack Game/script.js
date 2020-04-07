
//MAIN OBJECT
const blackJack={
  "you":{'scoreSpan':'#yourCurrentScore', 'div':'#yourBoard', 'score':0},
  "dealer":{'scoreSpan':'#dealerCurrentScore', 'div':'#dealerBoard', 'score':0},
  "cardsMap":{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
  "wins":0,
  "losses":0,
  "draws":0,
  "isStand":false,
  "turnsOver":false,
} 

//CONSTANTs 
const YOU = blackJack['you']
const DEALER = blackJack['dealer']
const cards=[2,3,4,5,6,7,8,9,10,"K","Q","J","A"]

const hitSound=new Audio("assets/sounds/swish.m4a");
const winSound=new Audio("assets/sounds/cash.mp3");
const lossSound=new Audio("assets/sounds/aww.mp3");

//BUTTON EVENTS
document.querySelector("#hitBtn").addEventListener("click", blackjackHit);
document.querySelector("#dealBtn").addEventListener("click", blackjackDeal);
document.querySelector("#standBtn").addEventListener("click", dealerLogic);

//HIT FUNCTION
function blackjackHit(){
  if(blackJack["isStand"]===false){
  let card=randomCard();
  showCard(card,YOU);
  updateScore(card, YOU)
  showScore(YOU)
  }
}

//GENERATE RANDOM CARDS
function randomCard(){
  let randomIndex=Math.floor(Math.random()*13)
  return cards[randomIndex]
}

//SHOW CARD ON FRONTEND
function showCard(card, activePlayer){
  if(activePlayer['score'] <= 21){
    let cardImage=document.createElement("img")
    cardImage.src=`assets/images/${card}.png` 
    document.querySelector(activePlayer['div']).appendChild(cardImage)
    hitSound.play()
  }
}

//DEAL FUNCTION
function blackjackDeal(){

  if(blackJack["turnsOver"]===true){

    blackJack["isStand"]=false;

    yourImages=document.querySelector("#yourBoard").querySelectorAll("img");
    dealerImages=document.querySelector("#dealerBoard").querySelectorAll("img");

    for(j=0;j<yourImages.length;j++){
      yourImages[j].remove();
    }
    for(j=0;j<dealerImages.length;j++){
      dealerImages[j].remove();
    }

    YOU['score']=0;
    DEALER['score']=0;

    document.querySelector(YOU['scoreSpan']).innerHTML=0
    document.querySelector(YOU['scoreSpan']).style.color='white'
    document.querySelector(DEALER['scoreSpan']).innerHTML=0
    document.querySelector(DEALER['scoreSpan']).style.color='white'

    document.querySelector("#resultText").innerHTML= "Let's Play";
    document.querySelector("#resultText").style.color = "black";

    blackJack['turnsOver']=true;
  }
  
}

//UPDATE SCORES
function updateScore(card, activePlayer){
  //ACE CARD CONDITION
  if(card==="A"){

    if(activePlayer['score']+blackJack['cardsMap'][card][1] <= 21){
      activePlayer['score'] += blackJack['cardsMap'][card][1];
    }else{
      activePlayer['score'] += blackJack['cardsMap'][card][0];
    }
  //OTHER CARDS
  }else{
    activePlayer['score'] += blackJack['cardsMap'][card];
  }
}

//SHOW SCORES IN RESPECTIVE BOARDS
function showScore(activePlayer){
  if(activePlayer['score']>21){
    document.querySelector(activePlayer['scoreSpan']).innerHTML="BUST!";
    document.querySelector(activePlayer['scoreSpan']).style.color='red';
  }else{
  document.querySelector(activePlayer['scoreSpan']).innerHTML=activePlayer['score']
  }
}

//TIMEOUT FOR BOT TURN
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}

//ASYNCHRONOUS JS USED SO THAT THE PAGE DOESN'T CRASH && STAND LOGIC
    async function dealerLogic(){
      //STAND BTN IS CLICKED
      blackJack["isStand"]=true;

      //BOT PLAYS
      while(DEALER['score']<16 && blackJack['isStand']===true){
        let card=randomCard();
        showCard(card,DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500);
      }
      //ALL TURNS OVER
      blackJack["turnsOver"]=true;
      computeWinner();
}   

//DETERMINE THE WINNER
function computeWinner(){

  let winner;

  if(YOU['score'] <=21 ){

    if(YOU['score']>DEALER['score'] || DEALER['score']>21){
      winner=YOU;
      blackJack['wins']++; 
    }else if(YOU['score']<DEALER['score']){
      winner=DEALER;
      blackJack['losses']++;
    }else if(YOU['score'] === DEALER['score']){
      blackJack['draws']++;
    }

  }else if(YOU['score']>21 && DEALER['score'] <= 21){
    winner=DEALER;
    blackJack['losses']++;
  }else if(YOU['score']>21 && DEALER['score']>21){
    blackJack['draws']++;
  }

  showResult(winner)
  
}

//SHOW RESULTS IN RESULT SPAN AND SCORES TABLE
function showResult(winner){
   let message, messageColor;

  if(blackJack["turnsOver"]===true){

    if(winner===YOU){
      document.querySelector("#finalScoreWins").innerHTML=blackJack['wins']
      message="You Won!"
      messageColor="#28a745"
      winSound.play()
    }else if(winner===DEALER){
      document.querySelector("#finalScoreLosses").innerHTML=blackJack['losses']
      message="You Lost"
      messageColor="#dc3545"
      lossSound.play()
    }else{
      document.querySelector("#finalScoreDraws").innerHTML=blackJack['draws']
      message="Its a draw"
      messageColor="#bb6d1c"
    }

    document.querySelector("#resultText").innerHTML= message;
    document.querySelector("#resultText").style.color = messageColor;
  }
}
