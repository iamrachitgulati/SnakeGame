$(document).ready(function(){
	//Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	var cw = 10; //cell width
	var d;		// direction
	var food;
	var score;
	var start=0;
	
	var snake_array;
	var back=new Image();
    back.src="assets/greengrass.jpg";
	
	function init()
	{
		d = "right"; //default direc
		create_snake();
		create_food(); 
		score = 0;
		
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();
	
	function create_snake()
	{
		var length = 5;
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			snake_array.push({x: i, y:0});
		}
	}
	
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
	}
	
	function paint()
	{
		ctx.drawImage(back,0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//Pop out the tail cell and place it in front of the head cell
		var hx = snake_array[0].x;
		var hy = snake_array[0].y;
		//These were the position of the head cell.

		if(d == "right") hx++;
		else if(d == "left") hx--;
		else if(d == "up") hy--;
		else if(d == "down") hy++;
		
		//This will restart the game.
		if(hx == -1 || hx == w/cw || hy == -1 || hy == h/cw || check_collision(hx, hy, snake_array))
		{
			alert("Game Over :( \nYour Score:" + score);
			init();
			return;
		}
		
		//If head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(hx == food.x && hy == food.y)
		{
			var tail = {x: hx, y: hy};
			score++;
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = hx; tail.y = hy;
		}
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		paint_cell(food.x, food.y);

		ctx.fillStyle = "white";
		ctx.font="18px Georgia";
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-8);
	}

	function paint_cell(x, y)
	{
		ctx.fillStyle = "black";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{

		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//keyboard controls
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
	
})