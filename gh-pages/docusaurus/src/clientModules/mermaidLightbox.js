/**
 * Torna todo diagrama Mermaid clicável: abre um modal com o diagrama ampliado
 * (zoom via scroll/botões + pan arrastando). Mermaid renderiza de forma
 * assíncrona e o site é uma SPA, então usamos um MutationObserver em vez de
 * depender de um único evento de "load" ou de troca de rota.
 */

const MODAL_ID = 'crianex-mermaid-modal';

let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

function resetTransform() {
  scale = 1;
  translateX = 0;
  translateY = 0;
}

function applyTransform(content) {
  content.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function closeModal() {
  const overlay = document.getElementById(MODAL_ID);
  if (overlay) overlay.classList.remove('crianex-mermaid-modal--open');
  document.body.style.overflow = '';
}

function buildModal() {
  const existing = document.getElementById(MODAL_ID);
  if (existing) return existing;

  const overlay = document.createElement('div');
  overlay.id = MODAL_ID;
  overlay.className = 'crianex-mermaid-modal';
  overlay.innerHTML = `
    <div class="crianex-mermaid-modal__toolbar">
      <button type="button" class="crianex-mermaid-modal__btn" data-action="zoom-out" aria-label="Diminuir zoom">−</button>
      <button type="button" class="crianex-mermaid-modal__btn" data-action="zoom-reset" aria-label="Restaurar zoom">100%</button>
      <button type="button" class="crianex-mermaid-modal__btn" data-action="zoom-in" aria-label="Aumentar zoom">+</button>
      <button type="button" class="crianex-mermaid-modal__btn crianex-mermaid-modal__close" data-action="close" aria-label="Fechar">✕</button>
    </div>
    <div class="crianex-mermaid-modal__viewport">
      <div class="crianex-mermaid-modal__content"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const content = overlay.querySelector('.crianex-mermaid-modal__content');
  const viewport = overlay.querySelector('.crianex-mermaid-modal__viewport');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === viewport) closeModal();
  });
  overlay.querySelector('[data-action="close"]').addEventListener('click', closeModal);
  overlay.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
    scale = Math.min(scale + 0.25, 4);
    applyTransform(content);
  });
  overlay.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
    scale = Math.max(scale - 0.25, 0.4);
    applyTransform(content);
  });
  overlay.querySelector('[data-action="zoom-reset"]').addEventListener('click', () => {
    resetTransform();
    applyTransform(content);
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale = Math.min(Math.max(scale + delta, 0.4), 4);
    applyTransform(content);
  }, { passive: false });

  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.crianex-mermaid-modal__toolbar')) return;
    isPanning = true;
    panStartX = e.clientX - translateX;
    panStartY = e.clientY - translateY;
    viewport.classList.add('crianex-mermaid-modal__viewport--panning');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    translateX = e.clientX - panStartX;
    translateY = e.clientY - panStartY;
    applyTransform(content);
  });
  window.addEventListener('mouseup', () => {
    isPanning = false;
    viewport.classList.remove('crianex-mermaid-modal__viewport--panning');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('crianex-mermaid-modal--open')) {
      closeModal();
    }
  });

  return overlay;
}

function openModal(svgEl) {
  const overlay = buildModal();
  const content = overlay.querySelector('.crianex-mermaid-modal__content');
  resetTransform();
  content.style.transform = 'none';
  content.innerHTML = '';
  const clone = svgEl.cloneNode(true);
  clone.removeAttribute('style');
  clone.style.width = '100%';
  clone.style.height = 'auto';
  content.appendChild(clone);
  overlay.classList.add('crianex-mermaid-modal--open');
  document.body.style.overflow = 'hidden';
}

function wireUpDiagrams() {
  const svgs = document.querySelectorAll('.docusaurus-mermaid-container svg:not([data-crianex-wired])');
  svgs.forEach((svg) => {
    svg.setAttribute('data-crianex-wired', 'true');
    svg.style.cursor = 'zoom-in';
    svg.setAttribute('title', 'Clique para ampliar');
    svg.addEventListener('click', () => openModal(svg));
  });
}

function startObserving() {
  wireUpDiagrams();
  const observer = new MutationObserver(() => wireUpDiagrams());
  observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startObserving();
  } else {
    document.addEventListener('DOMContentLoaded', startObserving);
  }
}
