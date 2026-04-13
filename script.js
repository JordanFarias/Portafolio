/* =============================================
   DOTS BACKGROUND CANVAS
   ============================================= */
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

/* =============================================
   SKILL CARDS — MOUSE GLOW EFFECT
   ============================================= */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

/* =============================================
   CONTACT FORM — FORMSPREE + FEEDBACK
   ============================================= */
const form = document.getElementById('contacto-form');
const feedback = document.getElementById('form-feedback');
const btnEnviar = document.getElementById('btn-enviar');
const btnTexto = document.getElementById('btn-texto');
const btnSpinner = document.getElementById('btn-spinner');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous feedback and errors
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

        // Basic client-side validation
        const nombre = form.querySelector('#nombre');
        const email = form.querySelector('#email');
        const mensaje = form.querySelector('#mensaje');
        let hasError = false;

        if (!nombre.value.trim()) {
            nombre.classList.add('input-error');
            hasError = true;
        }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.classList.add('input-error');
            hasError = true;
        }
        if (!mensaje.value.trim()) {
            mensaje.classList.add('input-error');
            hasError = true;
        }

        if (hasError) {
            feedback.textContent = 'Por favor, completa todos los campos correctamente.';
            feedback.className = 'form-feedback error';
            return;
        }

        // Show loading state
        btnEnviar.disabled = true;
        btnTexto.textContent = 'Enviando...';
        btnSpinner.style.display = 'inline-block';

        try {
            const data = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                feedback.textContent = '¡Mensaje enviado con éxito! Me pondré en contacto pronto.';
                feedback.className = 'form-feedback success';
                form.reset();
            } else {
                const json = await response.json().catch(() => ({}));
                const msg = json?.errors?.map(err => err.message).join(', ') || 'Error al enviar. Inténtalo de nuevo.';
                feedback.textContent = msg;
                feedback.className = 'form-feedback error';
            }
        } catch {
            feedback.textContent = 'Error de red. Revisa tu conexión e inténtalo de nuevo.';
            feedback.className = 'form-feedback error';
        } finally {
            btnEnviar.disabled = false;
            btnTexto.textContent = 'Enviar mensaje';
            btnSpinner.style.display = 'none';
        }
    });

    // Remove error style on input
    form.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('input-error'));
    });
}