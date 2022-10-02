const eyes = document.querySelectorAll('.eye');
const pupils = document.querySelectorAll('.pupil');
const cursor = document.getElementById('cursor');
const bee = cursor.firstElementChild;
const nugget = document.getElementById('nugget');
const audio = document.getElementById('audio');
const timers = {};

let mx = 0;
let my = 0;
let mdx = 0;
let mdy = 0;
let bx = 0;
let by = 0;
const event = 0;

cursor.style.transitionProperty = 'top, left';
cursor.style.transitionDelay = '0';
cursor.style.transitionDuration = '600ms';
cursor.style.transitionTimingFunction = 'linear';

// /* Events */
document.addEventListener('mouseenter', () => {
	audio.setAttribute('muted', 'false');
	audioFadeIn();
});

document.addEventListener('mouseleave', () => {
	audioFadeOut();
});

document.addEventListener('mousemove', (e) => {
	const curRect = cursor.getBoundingClientRect();
	bx = curRect.x;
	by = curRect.y;

	mx = e.clientX;
	my = e.clientY;
	mdx = e.movementX;
	mdy = e.movementY;
});

/* Handlers */
const cursorHandler = (e) => {
	window.requestAnimationFrame(cursorHandler);

  nugget.style.top = `${my}px`;
  nugget.style.left = `${mx}px`;
  
	cursor.style.top = `${my}px`;
	cursor.style.left = `${mx}px`;
	// cursor.style.transform = `translate(${mx}px, ${my}px)`;

	BeeMouse(mx, my, mdx, mdy);

	pupils.forEach((pupil) => {
		let { x: px, y: py } = pupil.getBoundingClientRect();
		const ang = angle(bx, by, px, py);
		pupil.parentNode.style.setProperty('--deg', `${90 + ang}deg`);
	});
};
cursorHandler();

/* Bee */
function BeeMouse(mx, my, mdx, mdy) {
	const dirX = mx < bx ? 'left' : 'right';
	cursor.className = dirX;

	const dist = distance(mx, my, bx, by);
	if (dist > 10) {
		const ang = angle(mx, my, bx, by);
		// cursor.style.transform = `rotate(${180 + ang}deg)`;
		if (dirX == 'right') {
			// cursor.style.transform = `rotate(${180 + ang}deg)`;
      cursor.style.setProperty('--deg', `${180 + ang}deg`);
		} else {
			// cursor.style.transform = `rotate(${ang}deg)`;
      cursor.style.setProperty('--deg', `${ang}deg`);
      
		}
	}
}

/* Utils */
function throttle(callback, limit) {
	let wait = false;
	let timer;
	return function () {
		if (!wait) {
			callback.call();
			wait = true;
			timer = setTimeout(function () {
				wait = false;
			}, limit);
		}
		return timer;
	};
}

function angle(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;

	const rad = Math.atan2(dy, dx);
	const deg = (rad * 180) / Math.PI;
	return deg;
}

function distance(x1, y1, x2, y2) {
	return Math.hypot(x2 - x1, y2 - y1);
}

function byTwos(...values) {
	return values.reduce((accumulator, currentValue, currentIndex, array) => {
		if (currentIndex % 2 === 0) accumulator.push(array.slice(currentIndex, currentIndex + 2));
		return accumulator;
	}, []);
}

function log(...values) {
	byTwos(...values).forEach((item) => {
		ledger[item[0]] = item[1];
	});

	const logItems = Array.from(Object.entries(ledger).map((item) => item[0] + ': ' + item[1]));
	const logElems = Array.from(logger.querySelectorAll('pre'));

	logItems.forEach((item, index) => {
		let logNode = logElems[index] ?? document.createElement('pre');
		logNode.innerHTML = item;
		logger.append(logNode);
	});
}


/* Audio */
async function audioFadeIn() {
	audio.volume = 0;
	audio.play();
	let volume = audio.volume;
  clearInterval(timers.FadeOut);
  
	await new Promise((resolve, reject) => {
		timers.FadeIn = setInterval(() => {
			if (volume <= 0.95) {
				volume = audio.volume + 0.05;
				audio.volume = Math.abs(Math.round(volume * 100) / 100);
				// console.log('Volume - ' + audio.volume);
			} else {
				clearInterval(timers.FadeIn);
				resolve(volume);
			}
		}, 80);
	});
  // console.log('Audio - playing');
}

async function audioFadeOut() {
	let volume = audio.volume;
  clearInterval(timers.FadeIn);
	await new Promise((resolve, reject) => {
		timers.FadeOut = setInterval(() => {
			if (volume >= 0.05) {
				volume = audio.volume - 0.05;
				audio.volume = Math.abs(Math.round(volume * 100) / 100);
				// console.log('Volume - ' + audio.volume);
			} else {
				clearInterval(timers.FadeOut);
				resolve(volume);
			}
		}, 80);
	});
	audio.pause();
  // console.log('Audio - paused');
}
