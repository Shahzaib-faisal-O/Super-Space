//? Select the score display element
const score = document.querySelector('.score');

//? Select the start screen element
const startScreen = document.querySelector('.startScreen');

//? Select the game area element
const gameArea = document.querySelector('.gameArea');

//! Log the score element to the console to verify its selection
console.log(score);

// Object to store the state of arrow keys
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// Player object to hold properties related to the player
let player = { speed: 8, score: 0 }; // Initial speed is set to 8, score is initialized

// Function to handle keydown events
function keyDown(event) {
    event.preventDefault(); // Prevent default browser actions
    keys[event.key] = true; // Set the key to true when pressed
    // console.log(keys);
    // console.log(event.key);
}

// Function to handle keyup events
function keyUp(event) {
    event.preventDefault(); // Prevent default browser actions
    keys[event.key] = false; // Set the key to false when released
    // console.log(keys);
    // console.log(event.key);
}

// Add event listeners for keydown and keyup events
document.addEventListener('keydown', keyDown); //* Listen for key presses and invoke keyDown function
document.addEventListener('keyup', keyUp); //* Listen for key releases and invoke keyUp function

//! Function to detect collision between the player's car and other cars
function isCollide(actualCar, randomCar) {
    actualCarRect = actualCar.getBoundingClientRect();
    randomCarRect = randomCar.getBoundingClientRect();
    return !(
        (actualCarRect.bottom < randomCarRect.top) ||
        (actualCarRect.top > randomCarRect.bottom) ||
        (actualCarRect.right < randomCarRect.left) ||
        (actualCarRect.left > randomCarRect.right)
    );
}

//! Function to move the lines on the road for the animation effect
function moveLine() {
    let line = document.querySelectorAll('.line');

    line.forEach((item) => {
        if (item.y >= 700) { // If line goes off screen, reset its position
            item.y -= 750;
        }
        item.y += player.speed; // Move the line based on player speed
        item.style.top = item.y + 'px'; // Update the line's position
    });
}

//! Function to end the game when a collision occurs
function endGame() {
    player.start = false; // Stop the game loop
    startScreen.classList.remove('hide'); // Show the start screen
    startScreen.innerHTML = 'Game Over <br> Click to play again. Your Score: ' + player.score; // Display game over message with score
}

//! Function to place random cars on the game area and check for collisions
function randomCarPlacement(car) {
    let randomCar = document.querySelectorAll(".randomCar");

    randomCar.forEach((item) => {
        if (isCollide(car, item)) { // Check for collision with the player's car
            console.log("BOOM");
            endGame();
        }
        if (item.y >= 750) { // Reset position of cars that go off screen
            item.y -= 800;
            item.style.left = parseInt(Math.random() * 450) + "px"; // Place randomly on the x-axis
        }
        item.y += player.speed; // Move the car based on player speed
        item.style.top = item.y + 'px'; // Update car's position
    });
}

//! Function to handle the gameplay loop
function gamePlay() {
    let car = document.querySelector('.car'); // Select the player's car
    let road = gameArea.getBoundingClientRect(); // Get the game area dimensions

    if (player.start) { // If the game is started
        moveLine(); // Move the lines
        setTimeout(() => {
            randomCarPlacement(car); // Place random cars
        }, 1000);

        // Update car position based on key inputs
        if (keys.ArrowUp && player.y > 0) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < 530) { player.y += player.speed; }
        if (keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }
        if (keys.ArrowRight && player.x < 540) { player.x += player.speed; }

        // Update the car's position on the screen
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";
        window.requestAnimationFrame(gamePlay); // Request the next animation frame
        score.classList.remove('hide'); // Show the score
        player.score++; // Increment the player's score
        score.innerText = "Score: " + player.score; // Update the score display
    }
}

//! Function to start the game when the start screen is clicked
function start(event) {
    startScreen.classList.add('hide'); // Hide the start screen
    gameArea.innerHTML = ""; // Clear the game area
    player.start = true; // Set game start flag to true
    player.score = 0; // Reset the score
    window.requestAnimationFrame(gamePlay); // Start the game loop

    //? Create road lines for the game
    for (x = 0; x <= 4; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'line');
        roadLine.y = (x * 140);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine); // Add the line to the game area
    }

    //! Create the player's car element
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car); // Add the car to the game area

    // Set the initial position of the player's car
    player.x = car.offsetLeft;
    player.y = car.offsetTop;
    console.log("top position " + car.offsetTop);
    console.log("left position " + car.offsetLeft);

    //? Create 3 random cars for obstacles
    for (x = 0; x < 4; x++) {
        let randomCar = document.createElement('div');
        randomCar.setAttribute('class', 'randomCar');
        randomCar.y = (x * 320);
        randomCar.style.top = randomCar.y + "px";
        randomCar.style.left = Math.floor(Math.random() * 300) + "px"; // Random x-position
        gameArea.appendChild(randomCar); // Add the car to the game area
    }
}

// Add an event listener for the start screen to start the game on click
startScreen.addEventListener('click', start); 
