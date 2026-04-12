const canvas = document.getElementById('dots-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const spacing = 30;
const dotRadius = 1.5;
const glowRadius = 160;
const accentColor = '0, 71, 255';

let mouse = { x: -9999, y: -9999 };
let current = { x: -9999, y: -9999 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function draw() {
  current.x += (mouse.x - current.x) * 0.1;
  current.y += (mouse.y - current.y) * 0.1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {
      const dist = Math.hypot(x - current.x, y - current.y);
      const normalized = Math.max(0, 1 - dist / glowRadius);
      const opacity = Math.pow(normalized, 1.5) * 0.75;

      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

      if (opacity > 0) {
        ctx.fillStyle = `rgba(${accentColor}, ${opacity})`;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      }

      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

draw();

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});