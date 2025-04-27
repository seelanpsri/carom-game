var debug = true;
var powerc = 35;
var strikerPot = false;
var coinPoted = false;
var ableToHit = false;
var redPut = 0;
var overlap = false;
var checkNextCoin = false;
var redRound = 0;
var strikerLocation, polePoint;
var hittingObjs = [];
var aiMode = true;
var blueCoins = [];

// document.addEventListener('contextmenu', event => event.preventDefault());
$(document).ready(function () {
    function switchb() {
        $('.myButton.active').removeClass('active');
        $(this).addClass('active');
    }
    $("#tpc").on('click', switchb);
    $("#pc").on('click', switchb);

    function switchb1() {
        $('.b.active').removeClass('active');
        $(this).addClass('active');
    }

    $(".b1").on('click', switchb1);
    $(".b2").on('click', switchb1);
    $(".b3").on('click', switchb1);


    function switchb2() {
        $('.g.active').removeClass('active');
        $(this).addClass('active');
    }

    $(".g1").on('click', switchb2);
    $(".g2").on('click', switchb2);

    function switchbg() {
        $('.bg.active').removeClass('active');
        $(this).addClass('active');
        if ($(this).hasClass("blue")) {
            $("body").removeClass("bodybgimg").removeClass("bodybgblack").removeClass("bodybgimg1").addClass("bodybgblue");
        } else if ($(this).hasClass("black")) {
            $("body").removeClass("bodybgimg").removeClass("bodybgblue").removeClass("bodybgimg1").addClass("bodybgblack");
        } else if ($(this).hasClass("imgbg")) {
            $("body").removeClass("bodybgblue").removeClass("bodybgblack").removeClass("bodybgimg1").addClass("bodybgimg");
        } else if ($(this).hasClass("imgbg1")) {
            $("body").removeClass("bodybgblue").removeClass("bodybgblack").removeClass("bodybgimg").addClass("bodybgimg1");
        }
    }

    $(".bg1").on('click', switchbg);
    $(".bg2").on('click', switchbg);
    $(".bg3").on('click', switchbg);
    $(".bg4").on('click', switchbg);

    function showMsg(msg) {
        $('#msgbox').text(msg);
    }

    $('#s1').on('click', function () {
        if ($(this).attr('src') === './assets/images/s1.svg') {
            $(this).attr('src', './assets/images/s2.svg');
            bgsnd.pause();
            bgsndMuted = true;
        } else {
            $(this).attr('src', './assets/images/s1.svg');
            bgsnd.play();
            bgsndMuted = false;
        }
    })

    $("#playAgain").on('click', function () {
        playAgain();
    })

    function setPolePos(pp) {
        poleX = pp.x;
        poleY = pp.y;
    }

    function strikerPlace() {
        strikerPot = false;

        var c = document.getElementById("Striker");
        var ctx = c.getContext("2d");
        striker.x = players[currPlayer].x;
        striker.y = players[currPlayer].y;
        ctx.clearRect(0, 0, 520, 520);
        drawCoins();
        drawSCircle(striker.x, striker.y, coinSize + 1, 'white', ctx);
        if (currPlayer == 1 && aiMode && hittingObjs.length > 1) {
            $("#Striker").off("mousemove");
            var target = setTargetNearPot();
            var targetPot = getTargetPot(target);
            // checkOverlap();

            strikerLocation = getStrikerPlace(targetPot.x, targetPot.y, target.x, target.y, players[currPlayer].lb, 100, players[currPlayer].rb, 100)
            if (strikerLocation.x < 100 || strikerLocation.x > 420) {
                strikerLocation = { x: Math.floor(Math.random() * 280) + 110, y: 100 };
            }
            striker.x = strikerLocation.x;
            if (debug) {
                drawPoint1(strikerLocation.x, striker.y, 'green');
                drawLine1({ x: strikerLocation.x, y: striker.y, x1: target.x, y1: target.y }, 'black');
                console.log("Striker placed at ", striker.x, striker.y);
            }
            polePoint = getStrikerPlace(target.x, target.y, strikerLocation.x, striker.y, 50, 50, 470, 50)
            if (debug) {
                drawPoint1(polePoint.x, polePoint.y, 'blue');
                drawLine1({ x: strikerLocation.x, y: striker.y, x1: polePoint.x, y1: polePoint.y }, 'green');
            }
            setPolePos(polePoint);
            // advanced when coin is towards user side target reverse hit
            powerc = dist(striker.x, striker.y, poleX, poleY);
            slope = (poleX - striker.x) / (poleY - striker.y);
            hitStriker();
            ableToHit = false;
        } else {
            $("#Striker").on("mousemove", function (event) {
                checkOverlap();
                xCo = event.pageX - rect.x;
                yCo = event.pageY - rect.y;
                if (xCo < players[currPlayer].rb && xCo > players[currPlayer].lb)
                    striker.x = xCo;
                ctx.clearRect(0, 0, 520, 520);
                drawCoins();
                drawSCircle(striker.x, striker.y, coinSize + 1, 'white', ctx);
                drawHitAreas();
            });
            $("#Striker").on("click", function () {
                if (!bgsndMuted) {
                    bgsnd.play();
                }
                if (!overlap) {
                    $("#Striker").off("mousemove");
                    $("#Striker").off("click");
                    polePlace();
                    // return;
                }
            });
        }
    }

    function setTargetNearPot() {
        // clean this more. When both coins pot by AI, its trying to pot again
        if (hittingObjs.length == 3 && checkRedPresent()) {
            if (hittingObjs[1].name == 'red') {
                return hittingObjs[1];
            } else {
                return hittingObjs[2];
            }
        }
        return hittingObjs.reduce((a, b) => a.y > b.y ? a : b)
    }

    function getTargetPot(target) {
        if (target.x > (players[currPlayer].rb - players[currPlayer].lb) / 2) { //+ players[currPlayer].lb
            return { x: 495, y: 495 };
        } else {
            return { x: 25, y: 495 };
        }
    }

    function drawPoint1(x, y, color) {
        ctx.fillStyle = color || 'black';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();
    };

    function drawLine1(line, color) {
        color = color || 'black';
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x1, line.y1);
        ctx.stroke();
        drawPoint1(line.x, line.y, color);
        drawPoint1(line.x1, line.y1, color);
    };


    function getStrikerPlace(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    }

    function checkOverlap() {
        for (var i = 1; i < hittingObjs.length; i++) {
            var d = dist(striker.x, striker.y, hittingObjs[i].x, hittingObjs[i].y);
            if (d < 23) {
                showMsg('There is a coin.');
                overlap = true;
                return;
            }
        }
        showMsg('You can place.');
        overlap = false;
    }

    //calculating angle of impact of pole with striker
    function polePlace() {
        $(document).keyup(function (e) {
            if (e.key === "Escape") {
                $("#Striker").off("mousemove");
                $("#Striker").off("click");
                strikerPlace();
            }
        });
        $("#Striker").on("mousemove", function (event) {
            var x = event.pageX - rect.x;
            var y = event.pageY - rect.y;
            // showMsg('Game started.');
            if ((currPlayer == 0 && y > striker.y) || (currPlayer == 1 && y < striker.y)) {
                ableToHit = true;

                var c = document.getElementById("Striker");
                var ctx = c.getContext("2d");
                ctx.clearRect(0, 0, 520, 520);
                drawCoins();
                drawSCircle(striker.x, striker.y, coinSize + 1, 'white', ctx);
                drawLine(striker.x, striker.y, x, y, 'black', ctx);
                powerc = dist(striker.x, striker.y, x, y);//Math.sqrt(Math.pow(x - striker.x, 2) + Math.pow(y - striker.y, 2));
                poleX = x;
                poleY = y;
            } else {
                ableToHit = false;
            }
            drawHitAreas();
        });
        $("#Striker").on("click", function (event) {
            if (ableToHit) {
                slope = (poleX - striker.x) / (poleY - striker.y);
                $("#Striker").off("click");
                $("#Striker").off("mousemove");
                hitStriker();
                ableToHit = false;
                return;
            }
        });
    }

    function checkRedPresent() {
        for (var i = 0; i < hittingObjs.length; i++) {
            if (hittingObjs[i].name == 'red') {
                return true;
            }
        }

        return false;
    }
    //hitting Striker
    function hitStriker() {
        var canvas = document.getElementById("Striker");
        var c = canvas.getContext('2d');
        // var rangerq = document.getElementById("Ranger").value; // range value satya
        var ranger = powerc / 2;
        // console.log(ranger);
        ranger = ranger > 40 ? 40 : ranger;
        var vX = ranger * Math.sin(Math.atan(slope));
        var vY = ranger * Math.cos(Math.atan(slope));

        if (poleY > striker.y) {
            vX = -vX;
            vY = -vY;
        }
        striker.vx = vX;
        striker.vy = vY;

        function draw() {
            c.clearRect(0, 0, 520, 520);
            for (var i = 0; i < hittingObjs.length; i++) {
                for (var j = 0; j < hittingObjs.length; j++) {
                    if (j != i) {
                        hittingObjs[j].crash(i, j);
                    }
                }
            }
            for (var i = 0; i < hittingObjs.length; i++) {
                if (i == 0) {
                    drawSCircle(hittingObjs[i].x, hittingObjs[i].y, coinSize + 1, hittingObjs[i].color, c);
                } else {
                    drawCircle(hittingObjs[i].x, hittingObjs[i].y, coinSize, hittingObjs[i].color, c);
                }
                hittingObjs[i].rebound();
                hittingObjs[i].update();
                if (Math.abs(hittingObjs[i].vx) <= 0.3 && Math.abs(hittingObjs[i].vy) <= 0.3) {
                    hittingObjs[i].vx = 0;
                    hittingObjs[i].vy = 0;
                    if (allCoinStop() && striker.vx === 0 && striker.vy === 0) {
                        if (strikerPot || !coinPoted) {
                            currPlayer = (currPlayer + 1) % TotalplayerNo;
                        }
                        if (redPut == 2) {
                            redPut = 0;
                            hittingObjs.push(new coin(260, 260, '#ff002b', 0, 0, 'red'));
                            showMsg('Thats a miss.');
                        }

                        if (redPut == 1) {
                            redPut = 2; // 2 means red put and stopped all moves
                        }
                        coinPoted = false;
                        drawCoins();
                        window.cancelAnimationFrame(myreq);
                        strikerPlace();
                        return;
                    }
                }
                if (hittingObjs.length > 1 && coinPot(hittingObjs[i])) {
                    if (i == 0) {
                        //console.log("striker Pot");
                        striker.vx = 0;
                        striker.vy = 0;
                        strikerPot = true;
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
                        drawCoins();
                        window.cancelAnimationFrame(myreq);

                        strikerPlace();
                        sdropsnd.play();
                    }
                    else {
                        //console.log("coin Pot");
                        coinPoted = true;
                        if (hittingObjs[i].name === "white") {
                            if (hittingObjs.length === 3 && checkRedPresent()) {
                                showMsg('Foul');
                                if (players[currPlayer].coins.black > 0) {
                                    players[currPlayer].score -= 10;
                                    hittingObjs.push(new coin(260, 260, '#333333', 0, 0, 'black'));
                                    players[currPlayer].coins.black--;
                                } else if (players[currPlayer].coins.white > 0) {
                                    players[currPlayer].score -= 20;
                                    hittingObjs.push(new coin(260, 260, '#f3e5ab', 0, 0, 'white'));
                                    players[currPlayer].coins.white--;
                                }
                                currPlayer = (currPlayer + 1) % TotalplayerNo;
                                hittingObjs.push(new coin(260, 260, '#f3e5ab', 0, 0, 'white'));
                            } else {
                                players[currPlayer].score += 20;
                                players[currPlayer].coins.white++;
                                if (redPut == 2) {
                                    players[currPlayer].score += 50;
                                    redPut = 0;
                                    showMsg('Good shot');
                                } else {
                                    showMsg('Go on');
                                }
                            }
                        } else if (hittingObjs[i].name === "black") {
                            if (hittingObjs.length === 3 && checkRedPresent()) {
                                showMsg('Foul');
                                if (players[currPlayer].coins.black > 0) {
                                    players[currPlayer].score -= 10;
                                    hittingObjs.push(new coin(260, 260, '#333333', 0, 0, 'black'));
                                    players[currPlayer].coins.black--;
                                } else if (players[currPlayer].coins.white > 0) {
                                    players[currPlayer].score -= 20;
                                    hittingObjs.push(new coin(260, 260, '#f3e5ab', 0, 0, 'white'));
                                    players[currPlayer].coins.white--;
                                }
                                currPlayer = (currPlayer + 1) % TotalplayerNo;
                                hittingObjs.push(new coin(260, 260, '#333333', 0, 0, 'black'));

                            } else {
                                players[currPlayer].score += 10;
                                players[currPlayer].coins.black++;
                                if (redPut == 2) {
                                    players[currPlayer].score += 50;
                                    redPut = 0;
                                    showMsg('Nice play');
                                } else {
                                    showMsg('Good going');
                                }
                            }
                        } else if (hittingObjs[i].name === "red" && redPut == 0) {
                            showMsg('Please put one more coin.');
                            redPut = 1;
                        }

                        updateScore();
                        hittingObjs.splice(i, 1);
                        cdropsnd.play();
                    }

                }
                if (hittingObjs.length == 1) {
                    var won = players[0].score > players[1].score ? 1 : 2;
                    $("#w1").text(won);
                    showMsg("Player " + won + " Won the game.");
                    hittingObjs = [];
                    coins = [];
                    currPlayer = 0;
                    window.cancelAnimationFrame(myreq);
                    $("#popup").show();
                    // return;
                }
            }
            myreq = requestAnimationFrame(draw);
        }
        myreq = requestAnimationFrame(draw);
    }

    function playAgain() {
        $("#popup").hide();
        players[0].score = 0;
        players[1].score = 0;
        playersl[0].coins.black = 0;
        playersl[0].coins.white = 0;
        playersl[1].coins.black = 0;
        playersl[1].coins.white = 0;
        updateScore();
        createCoins();
    }

    $("#config").on('click', function () {
        $("#popup1").show();
    });

    $("#start").on('click', function () {
        $("#popup1").hide();
    });

    $("#start2").on('click', function () {
        $("#popup2").hide();
        setTimeout(function () { strikerPlace(); }, 20);
    });

    $("#u2simg").on('click', function () {
        aiMode = true;
        $("#u2uimg").removeClass('active');
        $(this).addClass('active');
    });

    $("#u2uimg").on('click', function () {
        aiMode = false;
        $("#u2simg").removeClass('active');
        $(this).addClass('active');
    });

    function drawHitAreas() {
        // this function is only for blue highlight coins
        var ct = document.getElementById("Striker");
        var ctx = ct.getContext("2d");
        blueCoins = [];
        for (var i = 1; i < hittingObjs.length; i++) {
            var c = hittingObjs[i];
            if (currPlayer == 1) {
                if (c.y < 190 && c.y > 65 && c.x < 455 && c.x > 65) {
                    if (dist(c.x, c.y, 160, 160) < 30 || dist(c.x, c.y, 360, 160) < 30) {
                        drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                        if(blueCoins.indexOf(i) < 0) {
                            blueCoins.push(i);
                        }
                    }
                    if (c.x < 180) {
                        // top left line
                        // get perpendicular point
                        // check distance for hit test
                        var p1 = getSpPoint({ x: 75, y: 75 }, { x: 175, y: 175 }, { x: c.x, y: c.y }, 141.422); // dist(75, 75, 175, 175)
                        if (p1.x !== 0 && dist(c.x, c.y, p1.x, p1.y) < 20) {
                            drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                            if(blueCoins.indexOf(i) < 0) {
                                blueCoins.push(i);
                            }
                        }
                    }
                    else if (c.x > 340) {
                        // top right line
                        var p1 = getSpPoint({ x: 445, y: 75 }, { x: 345, y: 175 }, { x: c.x, y: c.y }, 141.422); // dist(75, 75, 175, 175)
                        if (p1.x !== 0 && dist(c.x, c.y, p1.x, p1.y) < 20) {
                            drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                            if(blueCoins.indexOf(i) < 0) {
                                blueCoins.push(i);
                            }
                        }
                    }
                }
            }
            else if (currPlayer == 0) {
                if (c.y > 330 && c.y < 455 && c.x > 65 && c.x < 455) {
                    if (dist(c.x, c.y, 160, 360) < 30 || dist(c.x, c.y, 360, 360) < 30) {
                        drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                        if(blueCoins.indexOf(i) < 0) {
                            blueCoins.push(i);
                        }
                    }
                }
                if (c.x < 180) {
                    // top left line
                    // get perpendicular point
                    // check distance for hit test
                    var p1 = getSpPoint({ x: 75, y: 445 }, { x: 175, y: 345 }, { x: c.x, y: c.y }, 141.422); // dist(75, 75, 175, 175)
                    if (p1.x !== 0 && dist(c.x, c.y, p1.x, p1.y) < 20) {
                        drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                        if(blueCoins.indexOf(i) < 0) {
                            blueCoins.push(i);
                        }
                    }
                }
                else if (c.x > 340) {
                    // top right line
                    var p1 = getSpPoint({ x: 445, y: 445 }, { x: 345, y: 345 }, { x: c.x, y: c.y }, 141.422); // dist(75, 75, 175, 175)
                    if (p1.x !== 0 && dist(c.x, c.y, p1.x, p1.y) < 20) {
                        drawCircle(hittingObjs[i].x, hittingObjs[i].y, 10, 'blue', ctx);
                        if(blueCoins.indexOf(i) < 0) {
                            blueCoins.push(i);
                        }
                    }
                }
            }
        }
    }

    function getSpPoint(A, B, C, lineL) {
        var x1 = A.x, y1 = A.y, x2 = B.x, y2 = B.y, x3 = C.x, y3 = C.y;
        var px = x2 - x1, py = y2 - y1, dAB = px * px + py * py;
        var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
        var x = x1 + u * px, y = y1 + u * py;

        var dis = dist(C.x, C.y, x, y);
        var distFromP1 = dist(A.x, A.y, x, y);
        var distFromP2 = dist(B.x, B.y, x, y);
        if (distFromP1 < lineL + 10 && distFromP2 < lineL + 10) {
            if (dis < 10) {
                return { x: x, y: y }
            }
        }
        return { x: 0, y: 0 }; //this is D
    }

});