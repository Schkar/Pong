document.addEventListener('DOMContentLoaded',function(){

    // DOM Variables
        const instructionsTitle = document.querySelector(".instructionsTitle");
        const instructionsContainer = document.querySelector(".instructionsContainer");
        const ball = document.querySelector(".ball");
        const leftPalette = document.querySelector(".leftPalette");
        const rightPalette = document.querySelector(".rightPalette");
        const arena = document.querySelector(".arena");
        const startScreen = document.querySelector(".startScreen");
        const points = document.querySelector(".points");
        const computer = document.querySelector(".computer");
        const player = document.querySelector(".player");
        const playerPickerContainer = document.querySelector(".playerPickerContainer");

    // RAF variable

        let moveRaf;
        let iteration = 0;

    // Game values variables
    
        let currentBallLeftValue = window.getComputedStyle(ball,null).getPropertyValue("left");
        let currentBallTopValue = window.getComputedStyle(ball,null).getPropertyValue("top");

        let currentLeftPaletteTopValue = window.getComputedStyle(leftPalette,null).getPropertyValue("top");
        let currentRightPaletteTopValue = window.getComputedStyle(rightPalette,null).getPropertyValue("top");

        let playerActive = true;

        let playerLeftPoints = 0;
        let playerRightPoints = 0;

        let movementSpeedX;
        let movementSpeedY;

    // Ball starting values function

        function startGame() {

            iteration++

            ball.style.display = "block";

            ball.style.left = currentBallLeftValue;
            ball.style.top = currentBallTopValue;

            leftPalette.style.top = currentLeftPaletteTopValue;
            rightPalette.style.top = currentRightPaletteTopValue;

            // movementSpeedX = 0;
            // movementSpeedY = 0;
            
            let randomStartNumber = Math.random();
            if (randomStartNumber === 0) {
                randomStartNumber += 0.5;
            }

            let randomDirectionX = Math.floor(Math.random()*2) - 1;
            let randomDirectionY = Math.floor(Math.random()*2) - 1;

            if (randomDirectionX === 0) {
                randomDirectionX = 1;
            }
            if (randomDirectionY === 0) {
                randomDirectionY = 1;
            }
            
            movementSpeedX = (1 + randomStartNumber);
            movementSpeedY = (2 - movementSpeedX);

            movementSpeedX = parseFloat((movementSpeedX * randomDirectionX).toFixed(2))/iteration;
            movementSpeedY = parseFloat((movementSpeedY * randomDirectionY).toFixed(2))/iteration;

            moveRaf = window.requestAnimationFrame(moveEngine);    
        }
    // Engine function

        function moveEngine() {
            moveBall();
            wallBouncing();
            paletteBouncing();
            if (!playerActive) {
                paletteControl();
            }
            window.requestAnimationFrame(moveEngine);
        }
    
    // Ball function

        function moveBall(){
            ball.style.left = parseFloat(ball.style.left) + (movementSpeedX) +"px";
            ball.style.top = parseFloat(ball.style.top) + (movementSpeedY) +"px";
        }

    // Points counting

        function countPoints(player) {
                window.cancelAnimationFrame(moveRaf);
                
                ball.style.left = currentBallLeftValue;
                ball.style.top = currentBallTopValue;
                movementSpeedX = 0;
                movementSpeedY = 0;

                if (player === "right"){
                    playerRightPoints++;
                }
                else {
                    playerLeftPoints++;
                }

                points.innerText = playerLeftPoints + " : " + playerRightPoints;

                if (playerRightPoints === 10) {
                    startScreen.style.display = "block";
                    startScreen.innerText = "Player 2 wins!";
                    return;
                }

                if (playerLeftPoints === 10) {
                    startScreen.style.display = "block";
                    startScreen.innerText = "Player 1 wins!";
                    return;
                }

                // ball.style.display = "none";

                nextRound();
        }
    
    // Bouncing functions

        function wallBouncing(){
            
            if (parseFloat(ball.style.top) <= 0 || parseFloat(ball.style.top) + 20 >= 360) {
                movementSpeedY = -movementSpeedY;
                return;
            }

            if (parseFloat(ball.style.left) <= 0){
                countPoints("right");
                return;
            }

            if (parseFloat(ball.style.left) + 20 >= 600){
                countPoints("left");
                return;
            }
        }

        function paletteBouncing(){
            
            if (( (parseFloat(ball.style.top) + 10) > parseFloat(rightPalette.style.top) && (parseFloat(ball.style.top) + 10) < (parseFloat(rightPalette.style.top) + 120) && parseFloat(ball.style.left) + 20 >= 555 ) || ( (parseFloat(ball.style.top) + 10) > parseFloat(leftPalette.style.top) && (parseFloat(ball.style.top) + 10) < (parseFloat(leftPalette.style.top) + 120) && parseFloat(ball.style.left) <= 45 )) {
                 movementSpeedX = -movementSpeedX;
            }
        }

    // Next round

        function nextRound() {

            startScreen.innerText = "Next round";
            let countdown = 3;
            startScreen.style.display = "block";

            let interval = setInterval(function() {
                startScreen.innerText = countdown;
                countdown--;
                if (countdown === 0) {
                    clearInterval(interval);
                }
            },1000)

            let timeout = setTimeout(function(){
                startScreen.style.display = "none";
                startGame()
            },4000);
        }
        
    // Palettes moving
        document.addEventListener("keydown",function (event) {

            switch (true) {

                case event.key==="ArrowUp" && parseFloat(leftPalette.style.top) > 0:
                    leftPalette.style.top = parseFloat(leftPalette.style.top) - 20 + "px"; 
                    break;

                case event.key==="ArrowDown" && parseFloat(leftPalette.style.top) + 120 < 360:
                    leftPalette.style.top = parseFloat(leftPalette.style.top) + 20 + "px";
                    break;
                
                case event.key==="w" && playerActive && parseFloat(rightPalette.style.top) > 0:
                    rightPalette.style.top = parseFloat(rightPalette.style.top) - 20 + "px"; 
                    break;

                case event.key==="s" && playerActive && parseFloat(rightPalette.style.top) + 120 < 360:
                    rightPalette.style.top = parseFloat(rightPalette.style.top) + 20 + "px";
                    break;

                default:
                    break;
            }
        })
            
    // "AI" Palette control
        function paletteControl(){
            if ((parseFloat(ball.style.top) + 10 >= parseFloat(rightPalette.style.top) + 60) && parseFloat(rightPalette.style.top) + 120 < 360){
                rightPalette.style.top = parseFloat(rightPalette.style.top) + 20 + "px";
            }
            if ((parseFloat(ball.style.top) + 10 < parseFloat(rightPalette.style.top) + 60) && parseFloat(rightPalette.style.top) > 0){
                rightPalette.style.top = parseFloat(rightPalette.style.top) - 20 + "px";
            }
        }
    
    // Misc DOM operating block

        instructionsTitle.addEventListener("click",function(){
            instructionsContainer.classList.toggle("open");
        });

        computer.addEventListener("click",function(e){
            e.preventDefault();
            playerActive = false;
            playerPickerContainer.style.display = "none";
            startScreen.style.display = "block";
        })


        player.addEventListener("click",function(e){
            e.preventDefault();
            playerActive = true;
            playerPickerContainer.style.display = "none";
            startScreen.style.display = "block";
        })

        startScreen.addEventListener("click",function(){
            let countdown = 3;
            let interval = setInterval(function() {
                startScreen.innerText = countdown;
                countdown--;
                if (countdown === 0) {
                    countdown = "Good Luck";
                    clearInterval(interval);
                }
            },1000)

            let timeout = setTimeout(function(){
                startScreen.style.display = "none";
                startGame()
            },5000);
        });


    
});