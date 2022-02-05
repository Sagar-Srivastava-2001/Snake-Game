const foodSound = new Audio('Assets/food.mp3');
const gameOverSound = new Audio('Assets/gameover.mp3');
const moveSound = new Audio('Assets/move.mp3');
const musicSound = new Audio('Assets/music.mp3');


function init(){

	var canvas = document.getElementById('mycanvas');
	W = H = canvas.width = canvas.height = 1000;
	pen = canvas.getContext('2d');
	cs = 72;
	game_over = false;
	score = 0;

	// Create Image Object for Food
	food_img = new Image();
	food_img.src = "Assets/apple.png";

	trophy = new Image();
	trophy.src = "Assets/trophy.png";

	food = getRandomFood();

	snake = {
		init_len : 1,
		color : "#c64756",
		cells:[],
		direction:"right",
		prev_direc : "",

		createSnake:function(){
			for(var i=this.init_len;i>0;i--){
				this.cells.push({x:i,y:0});
			}
		},

		drawSnake:function(){
			for(var i=0;i<this.cells.length;i++){
				pen.fillStyle = this.color;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
			}
		},

		updateSnake:function(){
			//	console.log("Updating Snake");
			// check if snake has eaten the food, increase the length of the snake
			// generate new food object

			var headX = this.cells[0].x;
			var headY = this.cells[0].y;
 

			if(headX==food.x && headY==food.y){
				food = getRandomFood();
				foodSound.play();
				score++;
			}
			else{
				this.cells.pop();
			}
			
			// var headX = this.cells[0].x;
			// var headY = this.cells[0].y;
			var nextX,nextY;

			if(this.direction=="right" && this.prev_direc!="left"){
				nextX = headX+1;
				nextY = headY;
			}
			else if(this.direction=="right" && this.prev_direc=="left"){
				nextX = headX-1;
				nextY = headY;				
			}

			else if(this.direction=="left" && this.prev_direc!="right"){
				nextX = headX-1;
				nextY = headY;
			}

			else if(this.direction=="left" && this.prev_direc=="right"){
				nextX = headX+1;
				nextY = headY;	
			}

			else if(this.direction=="down" && this.prev_direc!="up"){
				nextX = headX;
				nextY = headY+1;
			}

			else if(this.direction=="down" && this.prev_direc=="up"){
				nextX = headX;
				nextY = headY-1;				
			}

			else if(this.direction=="up" && this.prev_direc!="down"){
				nextX = headX;
				nextY = headY-1;
			}
			else if(this.direction=="up" && this.prev_direc=="down"){
				nextX = headX;
				nextY = headY+1;	
			}

			this.cells.unshift({x:nextX,y:nextY});

			// Logic To Prevent the Snake From Going Out

			var last_x = Math.round(W/cs);
			var last_y = Math.round(H/cs);

			for(let i=1;i<this.cells.length;i++){
				if((this.cells[i].x)== this.cells[0].x && (this.cells[i].y) == this.cells[0].y){
					game_over = true;
				}
			}

			if(this.cells[0].y < -1 || this.cells[0].x < -1 || this.cells[0].x > last_x || this.cells[0].y > last_y){
				game_over = true;
			}
		}
	};

	snake.createSnake();

	function keyPressed(e){
		// Conditional Statements
		if(e.key=="ArrowRight"){
			snake.prev_direc = snake.direction;
			snake.direction = "right";
			moveSound.play();
		}
		else if(e.key=="ArrowLeft"){
			snake.prev_direc = snake.direction;
			snake.direction = "left";
			moveSound.play();
		}
		else if(e.key == "ArrowDown"){
			snake.prev_direc = snake.direction;
			snake.direction = "down";
			moveSound.play();
		}
		else{
			snake.prev_direc = snake.direction;
			snake.direction = "up";
			moveSound.play();
		}
		//console.log(snake.direction);
	}

	// Add a Event Listener on the Document Object
	document.addEventListener('keydown',keyPressed);
}

function draw(){
	pen.clearRect(0,0,W,H);
	snake.drawSnake();
	pen.fillStyle = food.color;
	pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);
	
	pen.drawImage(trophy,18,20,cs,cs);
	pen.fillStyle = "black";
	pen.font = "22px Roboto";
	pen.fillText(score,50,50);
}

function update(){
	snake.updateSnake();
}

function getRandomFood(){
	var foodX = Math.round(Math.random()*(W-cs)/cs);
	var foodY = Math.round(Math.random()*(H-cs)/cs);

	// var x1,y1,x2,y2;

	// x1 = HEADX();
	// console.log(x1);

	var food = {
		x:foodX,
		y:foodY,
		color:"red",
	}

	return food;
}

function gameloop(){
	draw();
	update();

	if(game_over==true){
		gameOverSound.play();
		musicSound.pause();
		clearInterval(f);
		// alert("Game Over\n Your Score is " + score);

		if(alert('Game Over\n Your Score is ' + score)){}
		else
			window.location.reload();		// Reloads the page after clicking OK on the alert box
	}
	else{
		musicSound.play();
	}
}

init();
var f = setInterval(gameloop,100);