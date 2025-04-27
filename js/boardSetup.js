var c = document.getElementById("Carrom");
var ctx = c.getContext("2d");
var striker = null;

// loading images
function loadImages(sources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	// get num of sources
	for (var src in sources) {
		numImages++;
	}
	for (var src in sources) {
		images[src] = new Image();
		images[src].onload = function () {
			if (++loadedImages >= numImages) {
				callback(images);
				createBoard();
			}
		};
		images[src].src = sources[src];
	}
}
var canvas0 = document.getElementById('bg');
var context0 = canvas0.getContext('2d');

var canvas = document.getElementById('Carrom');
var context = canvas.getContext('2d');

var canvas1 = document.getElementById('Striker');
var context1 = canvas.getContext('2d');

// image sources
var sources = {
	image1: './assets/images/b1.jpg',
	image1_2: './assets/images/b2.jpg',
	image2: './assets/images/windRose.svg',
	image2_1: './assets/images/windRose1.svg',
	image3: './assets/images/corner1.png',
	image4: './assets/images/corner2.png',
	image5: './assets/images/corner3.png',
	image6: './assets/images/corner4.png',
};

// after images loaded, access images and draw them on board
loadImages(sources, function (images) {
	context0.drawImage(images.image1, 20, 20, 480, 480);
	context.drawImage(images.image2, 220, 220, 80, 80);
	setTimeout(function () {
		context1.drawImage(images.image3, 17, 17, 20, 20);
		context1.drawImage(images.image4, 483, 17, 20, 20);
		context1.drawImage(images.image6, 17, 483, 20, 20);
		context1.drawImage(images.image5, 483, 483, 20, 20);
	}, 300);

	document.querySelector('.b1').addEventListener('click', function () {
		context0.clearRect(20, 20, 480, 480);
		context0.drawImage(images.image1, 20, 20, 480, 480);
	});
	document.querySelector('.b2').addEventListener('click', function () {
		context0.clearRect(20, 20, 480, 480);
		context0.drawImage(images.image1_2, 20, 20, 480, 480);
	});
	document.querySelector('.b3').addEventListener('click', function () {
		context0.clearRect(20, 20, 480, 480);
		drawRect(20, 20, 480, 480, '#ebdfc3', context0);
	});

	document.querySelector('.g1').addEventListener('click', function () {
		context.clearRect(222, 222, 76, 76);
		context.drawImage(images.image2, 220, 220, 80, 80);
	});
	document.querySelector('.g2').addEventListener('click', function () {
		context.clearRect(222, 222, 76, 76);
		context.drawImage(images.image2_1, 220, 220, 80, 80);
	});

});

// create the board
function createBoard() {
	var c = document.getElementById("Carrom");
	var ctx = c.getContext("2d");
	//inner rectangle
	//Corner Circles
	drawCircle(30, 30, 16, 'black', ctx);
	drawCircle(490, 30, 16, 'black', ctx);
	drawCircle(490, 490, 16, 'black', ctx);
	drawCircle(30, 490, 16, 'black', ctx);
	//Central Circles
	drawCircleS(260, 260, 55, ctx);
	//demo rect
	//top Left Design
	//Circles
	drawCircleS(100, 100, 5, ctx);
	drawDCircle(100 + coinSize, 100 - coinSize, coinSize, '#800000', ctx);
	drawDCircle(100 - coinSize, 100 + coinSize, coinSize, '#800000', ctx);
	//Lines Connecting Circles
	drawLine(100 + coinSize, 100, 420 - coinSize, 100, 'black', ctx);
	drawLineDark(100 + coinSize, 100 - 20, 420 - coinSize, 100 - 20, 'black', ctx);
	//Line and Arc
	drawLine(75, 75, 175, 175, 'black', ctx);
	drawArc(160, 160, 20, 1.5 * Math.PI, 1 * Math.PI, ctx);

	//top Right Design
	//Circles
	drawCircleS(420, 100, 5, ctx);
	drawDCircle(420 - coinSize, 100 - coinSize, coinSize, '#800000', ctx);
	drawDCircle(420 + coinSize, 100 + coinSize, coinSize, '#800000', ctx);
	//Lines Connecting Circles
	drawLine(420, 100 + coinSize, 420, 420 - coinSize, 'black', ctx);
	drawLineDark(420 + 20, 100 + coinSize, 420 + 20, 420 - coinSize, 'black', ctx);
	//Line and Arc
	drawLine(445, 75, 345, 175, 'black', ctx);
	drawArc(360, 160, 20, 0 * Math.PI, 1.5 * Math.PI, ctx);

	//bottom Right Design
	//Circles
	drawCircleS(420, 420, 5, ctx);
	drawDCircle(420 - coinSize, 420 + coinSize, coinSize, '#800000', ctx);
	drawDCircle(420 + coinSize, 420 - coinSize, coinSize, '#800000', ctx);
	//Lines Connecting Circles
	drawLine(420 - coinSize, 420, 100 + coinSize, 420, 'black', ctx);
	drawLineDark(420 - coinSize, 420 + 20, 100 + coinSize, 420 + 20, 'black', ctx);
	//Line and Arc
	drawLine(445, 445, 345, 345, 'black', ctx);
	drawArc(360, 360, 20, 0.5 * Math.PI, 0 * Math.PI, ctx);

	//bottom Left Design
	//Circles
	drawCircleS(100, 420, 5, ctx);
	drawDCircle(100 + coinSize, 420 + coinSize, coinSize, '#800000', ctx);
	drawDCircle(100 - coinSize, 420 - coinSize, coinSize, '#800000', ctx);
	//Lines Connecting Circles
	drawLine(100, 420 - coinSize, 100, 100 + coinSize, 'black', ctx);
	drawLineDark(100 - 20, 420 - coinSize, 100 - 20, 100 + coinSize, 'black', ctx);
	//Line and Arc
	drawLine(75, 445, 175, 345, 'black', ctx);
	drawArc(160, 360, 20, 1 * Math.PI, 0.5 * Math.PI, ctx);

	//coins
	coins = [];
	striker = new coin(0, 0, 'white', 100, 450, 'striker', 11);
	createCoins();
}

// create and place the coins
function createCoins() {
	coins.push(new coin(260, 260 + 22, '#333333', 0, 0, 'black')); // black
	coins.push(new coin(260 + 20, 260 - 11, '#333333', 0, 0, 'black')); //
	coins.push(new coin(260 - 20, 260 - 11, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 + 20, 260 + 33, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 - 20, 260 + 33, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 + 40, 260, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 - 40, 260, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 + 20, 260 - 33, '#333333', 0, 0, 'black'));
	coins.push(new coin(260 - 20, 260 - 33, '#333333', 0, 0, 'black'));
	coins.push(new coin(260, 260, '#ff002b', 0, 0, 'red')); //red
	coins.push(new coin(260, 260 - 22, '#f3e5ab', 0, 0, 'white')); // white
	coins.push(new coin(260, 260 - 44, '#f3e5ab', 0, 0, 'white')); //
	coins.push(new coin(260, 260 + 44, '#f3e5ab', 0, 0, 'white')); //
	coins.push(new coin(260 + 20, 260 + 11, '#f3e5ab', 0, 0, 'white'));//
	coins.push(new coin(260 + 40, 260 + 22, '#f3e5ab', 0, 0, 'white'));//
	coins.push(new coin(260 - 20, 260 + 11, '#f3e5ab', 0, 0, 'white'));//
	coins.push(new coin(260 - 40, 260 + 22, '#f3e5ab', 0, 0, 'white'));//
	coins.push(new coin(260 - 40, 260 - 22, '#f3e5ab', 0, 0, 'white'));
	coins.push(new coin(260 + 40, 260 - 22, '#f3e5ab', 0, 0, 'white'));

	hittingObjs = coins.slice();
	hittingObjs.unshift(striker);

	drawCoins();
}

// draw coins on the board
function drawCoins() {
	var ct = document.getElementById("Striker");
	var ctxt = ct.getContext("2d");
	for (var i = 0; i < hittingObjs.length; i++) {
		drawCircle(hittingObjs[i].x, hittingObjs[i].y, coinSize, hittingObjs[i].color, ctxt);
	}
}

// initiate players
function initializePlayers(no) {
	TotalplayerNo = no;
	currPlayer = 0;
	players = [];
	players.push(new player(420 - coinSize - 230, 420 + coinSize, 420 - coinSize, 100 + coinSize));
	players.push(new player(420 - coinSize - 230, 100 - coinSize, 420 - coinSize, 100 + coinSize));
	// players.push(new player(420-coinSize-230,420+coinSize,420-coinSize,100+coinSize));
	// players.push(new player(420-coinSize-230,100-coinSize,420-coinSize,100+coinSize));
	// if want a 4 player game one can extend from here
}