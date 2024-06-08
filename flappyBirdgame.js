let board;
let boardWidth = 360;
let boardHeight = 640;

let context;

// Flappy Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage ;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes 
let pipeArray = [] ;
let pipeWidth = 64 ;  // here we have use aspect ratio of 1/8 
let pipeHeight = 512 ;
let pipeX = boardWidth ;
let pipeY = 0 ;

let topPipeImg ;
let bottomPipeImg  ;

// game physics
let velocityX =  -2 ;  // pipes are moving towards left side in the Gamee
let velocityY = 0 ;  // for flappy bird jumping speed
let gravity = 0.4 ;  // due to gravity bird goes downwards ;

let gameOver = false ;

let score  = 0 ;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");  // used for drawing on the board

    // Draw the bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image 
    birdImg = new Image() ;
    birdImg.src = "./flappybird.png" ;
    birdImg.onload = function() {
        context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height);
    }
   
topPipeImg = new Image() ;
topPipeImg.src = "./toppipe.png" ;


bottomPipeImg = new Image() ;
bottomPipeImg.src = "./bottompipe.png" ;

    requestAnimationFrame(update);
    setInterval(placePipes , 1500);  // every 1.5 sec 
    document.addEventListener("keydown" , moveBird) ;


};


function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    context.clearRect(0,0,board.width , board.height);

    //bird frame update
    velocityY += gravity ;
    bird.y = Math.max(bird.y + velocityY , 0) ; // apply gravity to current bird.y and apply the limit to the bird.y upto only top of the canvas 
    context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height);

    if(bird.y > board.height){
        gameOver = true ;
    }


    //pipes 
    for(let i=0 ; i < pipeArray.length ; i++)
        {
            let pipe = pipeArray[i] ;
            pipe.x += velocityX ;
            context.drawImage(pipe.img , pipe.x , pipe.y , pipe.width , pipe.height);

            if(!pipe.passed && bird.x > pipe.x + pipe.width )
                {
                    score += 0.5;  // 0.5 beacause there are two pipes in the single vertical line  

                    pipe.passed = true ;
                }
            
            if(detectCollision(bird , pipe)){
                gameOver = true ;
            }
        }

    //clear the pipes for memory optimization 
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ){
        pipeArray.shift(); // remove first element(pipe) from the PipeArray  
    }


    //score 
    context.fillStyle = "white" ;
    context.font = "20px sans-serif" ;
    context.fillText(score , 5 , 45 );

    if(gameOver){
        context.fillText("GAME OVER ! PLAY AGAIN !" , 5 , 90) ;
    }
}


function placePipes(){


    if(gameOver){
        return ;
    }
    //will generate toppipes of different Heigths
    let randomPipeY = pipeY - pipeHeight/4  - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4 ;


    let topPipe = {
        img : topPipeImg ,
        x : pipeX ,
        y : randomPipeY ,
        width : pipeWidth ,
        height : pipeHeight ,
        passed : false 
    }

    pipeArray.push(topPipe) ;

    let bottomPipe = {
        img : bottomPipeImg ,
        x : pipeX ,
        y : randomPipeY + pipeHeight + openingSpace ,
        width : pipeWidth ,
        height : pipeHeight ,
        passed : false 
    }

    pipeArray.push(bottomPipe) ;
}


function moveBird(e){
if(e.code == "Space" || e.code == "ArrowUp"){
    // jump 
    velocityY = -6 ;
    
    //reset the game 
    if(gameOver){
        bird.y = birdY ;
        pipeArray = [] ;
        score = 0 ; 
        gameOver = false ;
    }
}
}

function detectCollision(a , b){
        return a.x < b.x + b.width && 
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y ;

}