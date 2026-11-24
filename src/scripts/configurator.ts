import { business } from '../config';

const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
const width = document.querySelector<HTMLInputElement>('#window-width');
const height = document.querySelector<HTMLInputElement>('#window-height');
const type = document.querySelector<HTMLSelectElement>('#window-type');
const finish = document.querySelector<HTMLSelectElement>('#window-finish');
const glass = document.querySelector<HTMLSelectElement>('#window-glass');
const widthLabel = document.querySelector<HTMLElement>('[data-width-label]');
const heightLabel = document.querySelector<HTMLElement>('[data-height-label]');
const widthValue = document.querySelector<HTMLOutputElement>('[data-width-value]');
const heightValue = document.querySelector<HTMLOutputElement>('[data-height-value]');
const typeLabel = document.querySelector<HTMLElement>('[data-type-label]');
const glassLabel = document.querySelector<HTMLElement>('[data-preview-glass]');
const summary = document.querySelector<HTMLElement>('[data-config-summary]');
const status = document.querySelector<HTMLElement>('[data-form-status]');
const windowShape = document.querySelector<SVGGElement>('[data-window-shape]');
const preview = document.querySelector<SVGSVGElement>('[aria-label="Vista previa dinámica de la ventana configurada"]');
const glassPane = document.querySelector<SVGElement>('[data-glass-pane]');
const glassTone = document.querySelector<SVGStopElement>('[data-glass-tone]');
const glassReflection = document.querySelector<SVGElement>('[data-glass-reflection]');
const glassLines = document.querySelector<SVGElement>('[data-glass-lines]');

const frameColors: Record<string, string> = {
  Blanco: '#f8f7f2',
  Grafito: '#535954',
  Negro: '#202522',
};

const glassStyles: Record<string, { tone: string; opacity: string; reflection: string; lines: string }> = {
  Termopanel: { tone: '#b7d2cf', opacity: '.9', reflection: '.32', lines: '.52' },
  'Vidrio simple': { tone: '#dcebe7', opacity: '.75', reflection: '.2', lines: '0' },
  'Vidrio laminado': { tone: '#9fbbb0', opacity: '.94', reflection: '.38', lines: '.18' },
};

function updateConfigurator() {
  if (!width || !height) return;

  const w = Number(width.value);
  const h = Number(height.value);
  const selectedType = type?.value ?? 'Corredera';
  const selectedFinish = finish?.value ?? 'Blanco';
  const selectedGlass = glass?.value ?? 'Termopanel';
  const frameColor = frameColors[selectedFinish] ?? frameColors.Blanco;
  const paneStyle = glassStyles[selectedGlass] ?? glassStyles.Termopanel;

  if (widthLabel) widthLabel.textContent = `${w} cm`;
  if (heightLabel) heightLabel.textContent = `${h} cm`;
  if (widthValue) widthValue.value = `${w} cm`;
  if (heightValue) heightValue.value = `${h} cm`;
  if (typeLabel) typeLabel.textContent = selectedType;
  if (glassLabel) glassLabel.textContent = selectedGlass;
  if (summary) summary.textContent = `${selectedType} · ${w} × ${h} cm · ${selectedFinish} · ${selectedGlass}`;

  // Mantiene la figura dentro del marco de vista y expresa el cambio relativo de medidas.
  const scaleX = 0.56 + ((w - 60) / (300 - 60)) * 0.52;
  const scaleY = 0.54 + ((h - 60) / (240 - 60)) * 0.5;
  windowShape?.setAttribute('transform', `translate(240 165) scale(${scaleX} ${scaleY}) translate(-240 -165)`);

  document.querySelectorAll<SVGElement>('[data-frame]').forEach((part) => {
    part.setAttribute('stroke', frameColor);
    if (part.hasAttribute('data-frame-fill')) part.setAttribute('fill', frameColor);
  });

  glassPane?.setAttribute('opacity', paneStyle.opacity);
  glassTone?.setAttribute('stop-color', paneStyle.tone);
  glassReflection?.setAttribute('opacity', paneStyle.reflection);
  glassLines?.setAttribute('opacity', paneStyle.lines);

  document.querySelectorAll<SVGGElement>('[data-sash-for]').forEach((sash) => {
    sash.style.display = sash.dataset.sashFor === selectedType ? '' : 'none';
  });

  preview?.setAttribute('aria-label', `Vista previa: ventana ${selectedType.toLowerCase()}, ${w} por ${h} centímetros, marco ${selectedFinish.toLowerCase()}, ${selectedGlass.toLowerCase()}`);
}

[width, height, type, finish, glass].forEach((control) => control?.addEventListener('input', updateConfigurator));
updateConfigurator();

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (!business.whatsappNumber) {
    if (status) status.textContent = 'Falta configurar el número de WhatsApp del negocio en src/config.ts para recibir cotizaciones.';
    return;
  }

  const data = new FormData(form);
  const message = [
    `Hola, quiero cotizar una ventana con ${business.name}.`,
    `Configuración: ${summary?.textContent ?? ''}.`,
    `Nombre: ${data.get('name')}.`,
    `Teléfono: ${data.get('phone')}.`,
    `Comuna: ${data.get('commune')}.`,
    `Comentario: ${data.get('notes') || 'Sin comentarios'}.`,
  ].join('\n');

  window.open(`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  if (status) status.textContent = 'Abrimos WhatsApp con los detalles de tu cotización. Solo falta enviarlos.';
});
