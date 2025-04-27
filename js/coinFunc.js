var cdropsnd = new Audio("./assets/music/coin-drop.wav");
cdropsnd.volume = 0.02;
var sdropsnd = new Audio("./assets/music/striker-drop.wav");
sdropsnd.volume = 0.02;
var bgsnd = new Audio("./assets/music/walk.mp3");
// audio used from https://audionautix.com/free-music/acoustic
bgsnd.volume = 0.15;
bgsnd.loop = true;
bgsndMuted = false;
var firstHit = false;
var hitBlueCoin = false;

// play tick sound
var playTick = function () {
	var aud = new Audio();
	aud.src = "./assets/music/tick.wav";
	aud.volume = 0.05;
	aud.play();
}

// player definition
function player(x, y, rightBound, leftBound) {
	this.x = x;
	this.y = y;
	this.lb = leftBound;
	this.rb = rightBound;
	this.score = 0;
	this.coins = {white:0, black:0};
}

// show score on UI
function updateScore() {
	var score = document.getElementById(currPlayer);
	score.innerHTML = players[currPlayer].score;
}

// calculates distance between two points
function dist(x1, y1, x2, y2) {
	var dis = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
	dis = Math.sqrt(dis);
	return dis;
}

// returns whether all coins stopped or not
function allCoinStop() {
	for (var i = 0; i < hittingObjs.length; i++) {
		if (Math.abs(hittingObjs[i].vx) != 0 && Math.abs(hittingObjs[i].vy) != 0) {
			return false;
		}
	}
	if(hitBlueCoin) {
		if (players[currPlayer].coins.black > 0) {
			players[currPlayer].score -= 10;
			hittingObjs.push(new coin(260, 260, '#333333', 0, 0, 'black'));
			players[currPlayer].coins.black--;
		} else if (players[currPlayer].coins.white > 0) {
			players[currPlayer].score -= 20;
			hittingObjs.push(new coin(260, 260, '#f3e5ab', 0, 0, 'white'));
			players[currPlayer].coins.white--;
		}
		updateScore();
		hitBlueCoin = false;
		// currPlayer = (currPlayer + 1) % TotalplayerNo;
	}
	firstHit = false;
	return true;
}

// coin hits the pot
function coinPot(coin) {
	var potLeftUp = dist(coin.x, coin.y, 25, 25);
	var potRightUp = dist(coin.x, coin.y, 25, 495);
	var potLeftDown = dist(coin.x, coin.y, 495, 25);
	var potRightDown = dist(coin.x, coin.y, 495, 495);
	var radius = 20;
	if (potLeftUp < radius || potLeftDown < radius || potRightUp < radius || potRightDown < radius)
		return true;
	else
		return false;
}

// coin class
function coin(x, y, color, vx, vy, name, radius) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.name = name || 'coin';
	this.color = color;
	this.radius = radius ? radius : coinSize;
	this.rebound = function () {
		if ((this.x + coinSize + this.vx > 500) || (this.x - coinSize + this.vx < 20)) {
			if (this.vx > 0.3) playTick();
			this.vx = -this.vx;
		}
		if ((this.y + this.vy + coinSize > 500) || (this.y - coinSize + this.vy < 20)) {
			if (this.vx > 0.3) playTick();
			this.vy = -this.vy;
		}
	}
	this.update = function () {
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 0.97;
		this.vy *= 0.97;
	}
	this.crash = function (i, j) {
		var dis = dist(this.x + this.vx, this.y + this.vy, hittingObjs[i].x + hittingObjs[i].vx, hittingObjs[i].y + hittingObjs[i].vy);
		if (dis <= 20) {
			if(i == 0 && !firstHit) {
				if(blueCoins.indexOf(j) > -1) {
					hitBlueCoin = true;
				}
				firstHit = true;
			}
			if (this.vx > 0.3 || this.vy > 0.3 || hittingObjs[i].vx > 0.3 || hittingObjs[i].vy > 0.3 && dis >= 19.95) {
				playTick();
			}
			var dx = hittingObjs[j].x + hittingObjs[j].vx - hittingObjs[i].x + hittingObjs[i].vx;
			var dy = hittingObjs[j].y + hittingObjs[j].vy - hittingObjs[i].y + hittingObjs[i].vy;
			var collisionAngle = Math.atan2(dy, dx);

			var speed1 = Math.sqrt(hittingObjs[i].vx * hittingObjs[i].vx + hittingObjs[i].vy * hittingObjs[i].vy);
			var speed2 = Math.sqrt(hittingObjs[j].vx * hittingObjs[j].vx + hittingObjs[j].vy * hittingObjs[j].vy);

			var direction1 = Math.atan2(hittingObjs[i].vy, hittingObjs[i].vx);
			var direction2 = Math.atan2(hittingObjs[j].vy, hittingObjs[j].vx);

			var velocityx_1 = speed1 * Math.cos(direction1 - collisionAngle);
			var velocityy_1 = speed1 * Math.sin(direction1 - collisionAngle);
			var velocityx_2 = speed2 * Math.cos(direction2 - collisionAngle);
			var velocityy_2 = speed2 * Math.sin(direction2 - collisionAngle);

			var final_velocityx_1 = velocityx_2;
			var final_velocityx_2 = velocityx_1;
			var final_velocityy_1 = velocityy_1;
			var final_velocityy_2 = velocityy_2;

			ball1_velocityx = Math.cos(collisionAngle) * final_velocityx_1 +
				Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_1;
			ball1_velocityy = Math.sin(collisionAngle) * final_velocityx_1 +
				Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_1;
			ball2_velocityx = Math.cos(collisionAngle) * final_velocityx_2 +
				Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_2;
			ball2_velocityy = Math.sin(collisionAngle) * final_velocityx_2 +
				Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_2;

			hittingObjs[i].vx = ball1_velocityx;
			hittingObjs[i].vy = ball1_velocityy;
			hittingObjs[j].vx = ball2_velocityx;
			hittingObjs[j].vy = ball2_velocityy;
			return;
		}
	}
}