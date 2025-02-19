const cont = document.getElementById("container");
const maze = document.getElementById("maze");
const thingie = document.getElementById("thingie");
const home = document.getElementById("home");
const emo = document.getElementById("emo");

const bu = document.getElementById("bu");
const bd = document.getElementById("bd");
const bl = document.getElementById("bl");
const br = document.getElementById("br");

const step = 20;
const size = 20;
const bwidth = 2;
const mazeHeight = 200;
const mazeWidth = 300;
let nogoX = [];
let nogoX2 = [];
let nogoY = [];
let nogoY2 = [];
let prevDist = mazeWidth * 2;

//tilt vars
let lastUD = 0;
let lastLR = 0;
const mThreshold = 15;
let firstMove = true;
let allowTilt = true;

//swipe vars
const sThreshold = 15;

//scroll vars
const scThreshold = 20;

//generate sides and starting position
genSides();

//define size
let my = mazeHeight / step;
let mx = mazeWidth / step;

//create full grid
let grid = [];
for (let i = 0; i < my; i++) {
	let sg = [];
	for (let a = 0; a < mx; a++) {
		sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
	}
	grid.push(sg);
}

//create direction arrays
let dirs = ["u", "d", "l", "r"];
let modDir = {
	u: { y: -1, x: 0, o: "d" },
	d: { y: 1, x: 0, o: "u" },
	l: { y: 0, x: -1, o: "r" },
	r: { y: 0, x: 1, o: "l" }
};

//generate maze
genMaze(0, 0, 0);
drawMaze();

//get all the barriers
const barriers = document.getElementsByClassName("barrier");
for (let b = 0; b < barriers.length; b++) {
	nogoX.push(barriers[b].offsetLeft);
	nogoX2.push(barriers[b].offsetLeft + barriers[b].clientWidth);
	nogoY.push(barriers[b].offsetTop);
	nogoY2.push(barriers[b].offsetTop + barriers[b].clientHeight);
}
//console.log(nogoX, nogoX2, nogoY, nogoY2);

document.addEventListener("keydown", keys);

function keys(e) {
	let code = e.code;
	switch (code) {
		//arrows
		case "ArrowUp":
			up();
			break;
		case "ArrowDown":
			down();
			break;
		case "ArrowLeft":
			left();
			break;
		case "ArrowRight":
			right();
			break;
		//wasd
		case "KeyW":
			up();
			break;
		case "KeyS":
			down();
			break;
		case "KeyA":
			left();
			break;
		case "KeyD":
			right();
			break;
	}
}

bu.addEventListener("click", (e) => {
	up();
	firstMove = true;
});
bd.addEventListener("click", (e) => {
	down();
	firstMove = true;
});
bl.addEventListener("click", (e) => {
	left();
	firstMove = true;
});
br.addEventListener("click", (e) => {
	right();
	firstMove = true;
});

function up() {
	animKeys(bu);
	if (checkYboundry("u")) {
		thingie.style.top = thingie.offsetTop - step + "px";
		updateEmo(false);
	}
}

function down() {
	animKeys(bd);
	if (checkYboundry("d")) {
		thingie.style.top = thingie.offsetTop + step + "px";
		updateEmo(false);
	}
}

function left() {
	animKeys(bl);
	if (checkXboundry("l")) {
		thingie.style.left = thingie.offsetLeft - step + "px";
	}
	updateEmo(true);
}

function right() {
	animKeys(br);
	if (checkXboundry("r")) {
		thingie.style.left = thingie.offsetLeft + step + "px";
	}
	updateEmo(true);
}

//check if one can move horizontally
function checkXboundry(dir) {
	let x = thingie.offsetLeft;
	let y = thingie.offsetTop;
	let ok = [];
	let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

	let check = 0;
	for (let i = 0; i < len; i++) {
		check = 0;
		if (y < nogoY[i] || y > nogoY2[i] - size) {
			check = 1;
		}
		if (dir === "r") {
			if (x < nogoX[i] - size || x > nogoX2[i] - size) {
				check = 1;
			}
		}
		if (dir === "l") {
			if (x < nogoX[i] || x > nogoX2[i]) {
				check = 1;
			}
		}
		ok.push(check);
	}
	//check what to return
	let res = ok.every(function (e) {
		return e > 0;
	});
	return res;
}

//check if one can move vertically
function checkYboundry(dir) {
	let x = thingie.offsetLeft;
	let y = thingie.offsetTop;
	let ok = [];
	let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

	let check = 0;
	for (let i = 0; i < len; i++) {
		check = 0;
		if (x < nogoX[i] || x > nogoX2[i] - size) {
			check = 1;
		}
		if (dir === "u") {
			if (y < nogoY[i] || y > nogoY2[i]) {
				check = 1;
			}
		}
		if (dir === "d") {
			if (y < nogoY[i] - size || y > nogoY2[i] - size) {
				check = 1;
			}
		}
		ok.push(check);
	}
	//check what to return
	let res = ok.every(function (e) {
		return e > 0;
	});
	return res;
}

//generate sides with random entry and exit points
function genSides() {
	let max = mazeHeight / step;
	let l1 = Math.floor(Math.random() * max) * step;
	//let l1 = 0;
	let l2 = mazeHeight - step - l1;
	//console.log(l1, l2);

	let lb1 = document.createElement("div");
	lb1.style.top = step + "px";
	lb1.style.left = step + "px";
	lb1.style.height = l1 + "px";

	let lb2 = document.createElement("div");
	lb2.style.top = l1 + step * 2 + "px";
	lb2.style.left = step + "px";
	lb2.style.height = l2 + "px";

	let rb1 = document.createElement("div");
	rb1.style.top = step + "px";
	rb1.style.left = mazeWidth + step + "px";
	rb1.style.height = l2 + "px";

	let rb2 = document.createElement("div");
	rb2.style.top = l2 + step * 2 + "px";
	rb2.style.left = mazeWidth + step + "px";
	rb2.style.height = l1 + "px";

	//create invisible barriers for start and end: vertical left, vertical right, left top, left bottom, right top, right bottom
	nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
	nogoX2.push(
		0 + bwidth,
		mazeWidth + 2 * step + bwidth,
		step,
		step,
		mazeWidth + 2 * step,
		mazeWidth + 2 * step
	);
	nogoY.push(
		l1 + step,
		l2 + step,
		l1 + step,
		l1 + 2 * step,
		l2 + step,
		l2 + 2 * step
	);
	nogoY2.push(
		l1 + 2 * step,
		l2 + 2 * step,
		l1 + step + bwidth,
		l1 + 2 * step + bwidth,
		l2 + step + bwidth,
		l2 + 2 * step + bwidth
	);
	//set start-pos
	thingie.style.top = l1 + step + "px";
	thingie.style.left = 0 + "px";
	//set end-pos & store height of end
	home.style.top = l2 + step + "px";
	home.style.left = mazeWidth + step + "px";

	//style & append
	let els = [lb1, lb2, rb1, rb2];
	for (let i = 0; i < els.length; i++) {
		confSideEl(els[i]);
		maze.appendChild(els[i]);
	}
}

function confSideEl(el) {
	el.setAttribute("class", "barrier");
	el.style.width = bwidth + "px";
}

//gen maze using Recursive Backtracking
function genMaze(cx, cy, s) {
	// shuffle unchecked directions
	let d = limShuffle(dirs, s);

	for (let i = 0; i < d.length; i++) {
		let nx = cx + modDir[d[i]].x;
		let ny = cy + modDir[d[i]].y;
		grid[cy][cx].v = 1;

		if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
			grid[cy][cx][d[i]] = 1;
			grid[ny][nx][modDir[d[i]].o] = 1;
			//avoid shuffling d if d's not exhausted.. hence the i
			genMaze(nx, ny, i);
		}
	}
}

//draw maze
function drawMaze() {
	for (let x = 0; x < mx; x++) {
		for (let y = 0; y < my; y++) {
			let l = grid[y][x].l;
			let r = grid[y][x].r;
			let u = grid[y][x].u;
			let d = grid[y][x].d;

			drawLines(x, y, l, r, u, d);
		}
	}
}

//draw the actual lines
function drawLines(x, y, l, r, u, d) {
	let top = (y + 1) * step;
	let left = (x + 1) * step;
	if (l === 0 && x > 0) {
		let el = document.createElement("div");
		el.style.left = left + "px";
		el.style.height = step + "px";
		el.style.top = top + "px";
		el.setAttribute("class", "barrier");
		el.style.width = bwidth + "px";
		maze.appendChild(el);
	}

	if (d === 0 && y < my - 1) {
		let el = document.createElement("div");
		el.style.left = left + "px";
		el.style.height = bwidth + "px";
		el.style.top = top + step + "px";
		el.setAttribute("class", "barrier");
		el.style.width = step + bwidth + "px";
		maze.appendChild(el);
	}
}

function limShuffle(array, s) {
	let con = array.slice(0, s);
	let ran = array.slice(s, array.length);

	for (let i = ran.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		//console.log(i, j);
		[ran[i], ran[j]] = [ran[j], ran[i]];
	}
	let comb = con.concat(ran);
	return comb;
}

function animKeys(key) {
	if (key.id === "bu") {
		key.style.border = "3px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "4px #fff solid";
		key.style.transform = "translateY(-2px)";
	}
	if (key.id === "bd") {
		key.style.border = "3px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.borderTop = "4px #fff solid";
		key.style.transform = "translateY(2px)";
	}
	if (key.id === "bl") {
		key.style.border = "3px #fff solid";
		key.style.borderLeft = "1px #fff solid";
		key.style.borderRight = "4px #fff solid";
		key.style.transform = "translateX(-2px)";
	}
	if (key.id === "br") {
		key.style.border = "3px #fff solid";
		key.style.borderRight = "1px #fff solid";
		key.style.borderLeft = "4px #fff solid";
		key.style.transform = "translateX(2px)";
	}

	//reset
	setTimeout(() => {
		key.style.border = "2px #fff solid";
		key.style.borderTop = "2px #fff solid";
		key.style.borderBottom = "2px #fff solid";
		key.style.borderLeft = "2px #fff solid";
		key.style.borderRight = "2px #fff solid";
		key.style.transform = "translateY(0px)";
		key.style.transform = "translateX(0px)";
	}, "150");
}

let maxl = 0;
let prevl = 0;
function updateEmo(lr) {
	//simple/manual emo-adjustment - old
	if (lr) {
		if (thingie.offsetLeft < maxl) {
			emo.innerHTML = "🙄";
		}
		if (thingie.offsetLeft < maxl - 2 * step) {
			emo.innerHTML = "😒";
		}
		if (thingie.offsetLeft < maxl - 4 * step) {
			emo.innerHTML = "😣";
		}
		if (thingie.offsetLeft < maxl - 6 * step) {
			emo.innerHTML = "🤬";
		}
		if (thingie.offsetLeft > prevl) {
			emo.innerHTML = "😐";
		}
		if (thingie.offsetLeft >= maxl) {
			if (thingie.offsetLeft > mazeWidth * 0.6) {
				emo.innerHTML = "😀";
			} else {
				emo.innerHTML = "🙂";
			}
			maxl = thingie.offsetLeft;
		}
		if (thingie.offsetLeft === 0) {
			emo.innerHTML = "😢";
		}
		if (
			thingie.offsetLeft > mazeWidth - step &&
			thingie.offsetTop === home.offsetTop
		) {
			emo.innerHTML = "🤗";
			home.innerHTML = "🏠";
		}
		if (thingie.offsetLeft > mazeWidth) {
			emo.innerHTML = "";
			home.innerHTML = "🥳";
		}
		prevl = thingie.offsetLeft;
	} else {
		if (thingie.offsetLeft > (mazeWidth - step) && thingie.offsetTop === home.offsetTop) {
			emo.innerHTML = "🤗";
		}else{
			if(thingie.offsetLeft > (mazeWidth - step) && thingie.offsetTop != home.offsetTo){
				emo.innerHTML = "🙄";
			}
		}
	}
}

//Navigate with swipe
let lasttouchpY = 0;
let lasttouchpX = 0;
cont.addEventListener("touchstart", (e) => {
	lasttouchpY = e.changedTouches[0].pageY;
	lasttouchpX = e.changedTouches[0].pageX;
});

cont.addEventListener("touchmove", (e) => {
	e.preventDefault();
	//console.log("touch " + e.changedTouches[0].pageY);
	let diffY = e.changedTouches[0].pageY - lasttouchpY;
	let diffX = e.changedTouches[0].pageX - lasttouchpX;
	if (diffY > sThreshold) {
		down();
		lasttouchpY = e.changedTouches[0].pageY;
	} else {
		if (diffY < -1 * sThreshold) {
			up();
			lasttouchpY = e.changedTouches[0].pageY;
		}
	}
	if (diffX > sThreshold) {
		right();
		lasttouchpX = e.changedTouches[0].pageX;
	} else {
		if (diffX < -1 * sThreshold) {
			left();
			lasttouchpX = e.changedTouches[0].pageX;
		}
	}
});

// Audio
const audio = document.getElementById("audio");
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon");

window.addEventListener("load", () => {
    audio.play().then(() => {
        audio.muted = false;
    }).catch(error => {
        console.log("Autoplay blocked. User interaction required.");
    });
});

function toggleMute() {
    audio.muted = !audio.muted;

    // Change the icon dynamically
    if (audio.muted) {
        muteIcon.classList.remove("fa-volume-high");
        muteIcon.classList.add("fa-volume-mute");
    } else {
        muteIcon.classList.remove("fa-volume-mute");
        muteIcon.classList.add("fa-volume-high");
    }
}


// Timer
let time = 60;
let timerInterval;
let overlay;

// Preloader
window.addEventListener("load", function () {
    setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        startTimer(); // Timer starts AFTER preloader disappears
    }, 2000);
});

// Lose and Winner Overlay
document.addEventListener("DOMContentLoaded", function () {
    overlay = document.getElementById("overlay"); 
    const playAgainButton = document.getElementById("playAgainButton");
    const playAgainWinButton = document.getElementById("playAgainWinButton");
    const thingie = document.getElementById("thingie");
    const home = document.getElementById("home");

    playAgainButton.addEventListener("click", function () {
        location.reload();
    });

    playAgainWinButton.addEventListener("click", function () {
        location.reload();
    });

    function checkWinCondition() {
        const thingieRect = thingie.getBoundingClientRect();
        const homeRect = home.getBoundingClientRect();

        if (
            thingieRect.left < homeRect.right &&
            thingieRect.right > homeRect.left &&
            thingieRect.top < homeRect.bottom &&
            thingieRect.bottom > homeRect.top
        ) {
            showWinOverlay();
        }
    }

    // Dynamically detect movement
    const observer = new MutationObserver(checkWinCondition);
    observer.observe(thingie, { attributes: true, attributeFilter: ["style"] });
});

// Loser Overlay Function
function showOverlay(message) {
    overlay.style.display = "flex";
    overlay.querySelector("h2").textContent = message;
}

// Winner Overlay Function
function showWinOverlay() {
    clearInterval(timerInterval);
    document.getElementById("winOverlay").style.display = "flex";
}

// Start Timer Function
function startTimer() {
    const timerElement = document.getElementById("timer");

    if (timerInterval) return; // Prevent multiple timers

    timerInterval = setInterval(function () {
        time--;
        if (time >= 0) {
            const minutes = Math.floor(time / 60).toString().padStart(2, "0");
            const seconds = (time % 60).toString().padStart(2, "0");
            timerElement.textContent = `${minutes}:${seconds}`;
        } else {
            clearInterval(timerInterval);
            console.log("Timer reached 0, triggering showOverlay...");
            showOverlay("You Lose");
        }
    }, 1000);
}



