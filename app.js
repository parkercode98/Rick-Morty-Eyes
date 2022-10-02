const eyes = document.querySelectorAll('.eye');
const pupils = document.querySelectorAll('.pupil');
const cursor = document.getElementById('cursor');
const bee = cursor.firstElementChild;
const audio = new Audio('./assets/Funny Song.mp3');

let mx = 0;
let my = 0;
let mdx = 0;
let mdy = 0;
let bx = 0;
let by = 0;
const event = 0

const logger = document.getElementById('log');
const ledger = [];

// log('mx', 0, 'my', 0, 'm△x', 0, 'm△y', 0, 'bx', 0, 'by', 0, 'bπ', 0, '--deg', `0deg`, 'cursor-to', null);

cursor.style.transitionProperty = 'top, left'
cursor.style.transitionDelay = '0';
cursor.style.transitionDuration = '600ms';
cursor.style.transitionTimingFunction = 'linear';

/* Events */
document.addEventListener('mousemove', (e) => {
  const curRect = cursor.getBoundingClientRect();
  bx = curRect.x;
  by = curRect.y;
  
  mx = e.clientX;
  my = e.clientY;
  mdx = e.movementX;
  mdy = e.movementY;
  
});

document.addEventListener('mouseenter', () => {
  audio.play(); 
});

document.addEventListener('mouseleave' , () => {
  audio.pause();
});



/* Handlers */
const cursorHandler = (e) => {
  window.requestAnimationFrame(cursorHandler);

  cursor.style.top = `${my}px`;
  cursor.style.left = `${mx}px`;
  // cursor.style.transform = `translate(${mx}px, ${my}px)`;

  BeeMouse(mx, my, mdx, mdy)

	pupils.forEach((pupil) => {
		let {x: px, y: py} = pupil.getBoundingClientRect();
		const ang = angle(bx, by, px, py);
		pupil.parentNode.style.setProperty('--deg', `${90 + ang}deg`);
	});
  
}
cursorHandler();

/* Bee */
function BeeMouse(mx, my, mdx, mdy) {
  
  const dirX = (mx < bx) ? 'left' : 'right';
  cursor.className = dirX;
  
  const dist = distance(mx, my, bx, by);
  if (dist > 60) {
    const ang = angle(mx, my, bx, by);
    // cursor.style.setProperty('--deg', `${(180) + ang}deg`);
    // cursor.style.transform = `rotate(${180 + ang}deg)`;
    if (dirX == 'right') {
      cursor.style.transform = `rotate(${180 + ang}deg)`;
    } else {
      cursor.style.transform = `rotate(${ang}deg)`;
    }
  }
}


function BeeMouseMeh(mx, my, mdx, mdy) {
  cursor.style.top = `${my}px`;
	cursor.style.left = `${mx}px`;
  
  if (Math.abs(mdx) >= 2) {
		const dirX = mdx.toString().includes('-') ? 'left' : 'right';

		let isMovingUp = mdy.toString().includes('-') ? true : false;
		let wH_third = window.innerHeight / 3;
		let up = my < wH_third && isMovingUp ? '-up' : '';
		let down = my > wH_third * 2 && !isMovingUp ? '-down' : '';
		let center = !up && !down ? '-center' : '';
		const dirY = up + down + center;

		const cursorClass = dirX + dirY;
		cursor.className = cursorClass;
		log('cursor', cursorClass);
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
  return Math.hypot(x2-x1, y2-y1)
}


function byTwos(...values) {
	return values.reduce((accumulator, currentValue, currentIndex, array) => {
		if (currentIndex % 2 === 0) accumulator.push(array.slice(currentIndex, currentIndex + 2));
		return accumulator;
	}, []);
}


function log(...values) {
  byTwos(...values).forEach(item => {
    ledger[item[0]] = item[1];
  })

	const logItems = Array.from(Object.entries(ledger).map((item) => item[0] + ': ' + item[1]));
	const logElems = Array.from(logger.querySelectorAll('pre'));

	logItems.forEach((item, index) => {
		let logNode = logElems[index] ?? document.createElement('pre');
		logNode.innerHTML = item;
		logger.append(logNode);
	});
}




/* - Notes
  === Group Array by 2s ===
  service = [blahm, blah, vblav, bldja, ..]
  services
  .reduce(function (accumulator, currentValue, currentIndex, array) {
    if (currentIndex % 2 === 0) accumulator.push(array.slice(currentIndex, currentIndex + 2));
    return accumulator;
  }, [])
  .map((p) => console.log(p[0], p[1]));
  
  
  === Merge Arrays without duplicates ===
  const array1 = ['a','b','c'];
  const array2 = ['c','c','d','e'];
  const array3 = [...new Set([...array1,...array2])];
  console.log(array3); // ["a", "b", "c", "d", "e"]
*/
