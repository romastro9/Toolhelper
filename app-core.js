const state = {
  lang: localStorage.getItem('rct-lang') || 'en',
  theme: localStorage.getItem('rct-theme-v2') || 'light',
  filter: 'all',
  favoritesOnly: false,
  favorites: JSON.parse(localStorage.getItem('rct-favorites') || '[]'),
  history: JSON.parse(localStorage.getItem('rct-history') || '[]'),
};

const i18n = {
  en: {
    toolkit: 'Toolkit', dashboard: 'Dashboard', imageTools: 'Image Tools', videoTools: 'Video Tools', audioTools: 'Audio Tools', fileTools: 'File & PDF', designHelpers: 'Design Helpers', theme: 'Theme', searchTools: 'Search tools...', creativeWorkspace: 'YOUR CREATIVE WORKSPACE', heroTitle: 'Finish design and video tasks faster.', heroText: 'Convert, resize, compress and prepare files directly in your browser. Your files stay on your device.', startConverting: 'Start converting', browseTools: 'Browse tools', availableTools: 'Available tools', processedToday: 'Processed this session', privacy: 'Privacy', localOnly: 'Local only', quickAccess: 'QUICK ACCESS', allTools: 'All creative tools', all: 'All', images: 'Images', video: 'Video', audio: 'Audio', files: 'Files', design: 'Design', activity: 'ACTIVITY', recentHistory: 'Recent history', clear: 'Clear', noHistory: 'No files processed yet.', noTools: 'No matching tools found.',
    imageConverter: 'Image Converter', imageConverterDesc: 'Convert JPG, PNG and WEBP files.', imageCompressor: 'Image Compressor', imageCompressorDesc: 'Reduce image size with quality control.', imageResizer: 'Resize & Crop', imageResizerDesc: 'Resize for Facebook, TikTok and print.', videoToMp3: 'Video to MP3', videoToMp3Desc: 'Extract MP3 audio from a video.', fileCompressor: 'File Compressor', fileCompressorDesc: 'Pack multiple files into one ZIP.', imageToPdf: 'Image to PDF', imageToPdfDesc: 'Create a PDF from one or more images.', sizePresets: 'Social Size Presets', sizePresetsDesc: 'Copy common design dimensions instantly.', paletteExtractor: 'Color Palette', paletteExtractorDesc: 'Extract useful colors from an image.', qrGenerator: 'QR Code Generator', qrGeneratorDesc: 'Create a downloadable QR code.', videoCompressor: 'Video Compressor', trimMerge: 'Trim & Merge Video', noiseRemover: 'Noise Remover', comingSoonDesc: 'Planned for the next version.', comingSoon: 'SOON'
  },
  kh: {
    toolkit: 'ឧបករណ៍ច្នៃប្រឌិត', dashboard: 'ផ្ទាំងគ្រប់គ្រង', imageTools: 'ឧបករណ៍រូបភាព', videoTools: 'ឧបករណ៍វីដេអូ', audioTools: 'ឧបករណ៍សំឡេង', fileTools: 'ឯកសារ និង PDF', designHelpers: 'ជំនួយការរចនា', theme: 'ពណ៌ផ្ទៃ', searchTools: 'ស្វែងរកឧបករណ៍...', creativeWorkspace: 'កន្លែងធ្វើការច្នៃប្រឌិត', heroTitle: 'ធ្វើការរចនា និងកាត់តវីដេអូលឿនជាងមុន។', heroText: 'បម្លែង ប្ដូរទំហំ បង្រួម និងរៀបចំឯកសារនៅក្នុង Browser។ ឯកសាររបស់អ្នកនៅលើឧបករណ៍របស់អ្នក។', startConverting: 'ចាប់ផ្ដើមបម្លែង', browseTools: 'មើលឧបករណ៍', availableTools: 'ឧបករណ៍មាន', processedToday: 'បានដំណើរការក្នុង Session', privacy: 'ឯកជនភាព', localOnly: 'នៅលើឧបករណ៍', quickAccess: 'ចូលប្រើរហ័ស', allTools: 'ឧបករណ៍ច្នៃប្រឌិតទាំងអស់', all: 'ទាំងអស់', images: 'រូបភាព', video: 'វីដេអូ', audio: 'សំឡេង', files: 'ឯកសារ', design: 'រចនា', activity: 'សកម្មភាព', recentHistory: 'ប្រវត្តិថ្មីៗ', clear: 'សម្អាត', noHistory: 'មិនទាន់មានឯកសារដែលបានដំណើរការ។', noTools: 'រកមិនឃើញឧបករណ៍។',
    imageConverter: 'បម្លែងរូបភាព', imageConverterDesc: 'បម្លែង JPG, PNG និង WEBP។', imageCompressor: 'បង្រួមរូបភាព', imageCompressorDesc: 'កាត់បន្ថយទំហំដោយកំណត់គុណភាព។', imageResizer: 'ប្ដូរទំហំ និងកាត់', imageResizerDesc: 'ទំហំសម្រាប់ Facebook, TikTok និងបោះពុម្ព។', videoToMp3: 'វីដេអូទៅ MP3', videoToMp3Desc: 'ទាញសំឡេង MP3 ចេញពីវីដេអូ។', fileCompressor: 'បង្រួមឯកសារ', fileCompressorDesc: 'ដាក់ឯកសារច្រើនក្នុង ZIP មួយ។', imageToPdf: 'រូបភាពទៅ PDF', imageToPdfDesc: 'បង្កើត PDF ពីរូបភាពមួយ ឬច្រើន។', sizePresets: 'ទំហំបណ្ដាញសង្គម', sizePresetsDesc: 'ចម្លងទំហំរចនាដែលប្រើញឹកញាប់។', paletteExtractor: 'ពណ៌ពីរូបភាព', paletteExtractorDesc: 'ទាញពណ៌សំខាន់ៗពីរូបភាព។', qrGenerator: 'បង្កើត QR Code', qrGeneratorDesc: 'បង្កើត QR Code សម្រាប់ទាញយក។', videoCompressor: 'បង្រួមវីដេអូ', trimMerge: 'កាត់ និងភ្ជាប់វីដេអូ', noiseRemover: 'កាត់សំឡេងរំខាន', comingSoonDesc: 'គ្រោងសម្រាប់ Version បន្ទាប់។', comingSoon: 'ឆាប់ៗ'
  }
};

const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const modal = $('#modal');
const modalContent = $('#modalContent');

function t(key) { return i18n[state.lang][key] || key; }
function applyLanguage() {
  document.documentElement.lang = state.lang === 'kh' ? 'km' : 'en';
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  localStorage.setItem('rct-lang', state.lang);
}
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('#themeToggle').firstChild.textContent = state.theme === 'dark' ? '☀ ' : '☾ ';
  localStorage.setItem('rct-theme-v2', state.theme);
}
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
}
function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i ? 2 : 0)} ${sizes[i]}`;
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function safeBase(name) { return name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-_]+/gi, '_'); }
function addHistory(tool, filename, detail) {
  state.history.unshift({ tool, filename, detail, time: new Date().toISOString() });
  state.history = state.history.slice(0, 20);
  localStorage.setItem('rct-history', JSON.stringify(state.history));
  renderHistory();
  $('#processedCount').textContent = state.history.length;
}
function renderHistory() {
  const list = $('#historyList');
  if (!state.history.length) { list.innerHTML = `<p class="muted">${t('noHistory')}</p>`; return; }
  list.innerHTML = state.history.map(item => `
    <div class="history-row"><div class="history-badge">✓</div><div><strong>${escapeHtml(item.filename)}</strong><span>${escapeHtml(item.tool)} · ${escapeHtml(item.detail)}</span></div><time class="muted">${new Date(item.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</time></div>
  `).join('');
}
function escapeHtml(str='') { return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function filterTools(filter = state.filter) {
  state.filter = filter;
  const search = $('#toolSearch').value.trim().toLowerCase();
  let visible = 0;
  $$('.tool-card').forEach(card => {
    const matchFilter = filter === 'all' || card.dataset.category.split(' ').includes(filter);
    const matchSearch = !search || card.dataset.name.includes(search) || card.textContent.toLowerCase().includes(search);
    const matchFavorite = !state.favoritesOnly || state.favorites.includes(card.dataset.tool);
    const show = matchFilter && matchSearch && matchFavorite;
    card.classList.toggle('hidden', !show); if (show) visible++;
  });
  $('#emptyState').classList.toggle('hidden', visible > 0);
  $$('.pill').forEach(p => p.classList.toggle('active', p.dataset.filter === filter));
  $$('.nav-item').forEach(p => p.classList.toggle('active', p.dataset.filter === filter));
}

function openModal(html, onReady) {
  modalContent.innerHTML = html; modal.classList.remove('hidden'); document.body.style.overflow = 'hidden';
  if (onReady) onReady();
}
function closeModal() { modal.classList.add('hidden'); document.body.style.overflow = ''; modalContent.innerHTML = ''; }

function dropZone(id, accept, multiple = false, text = 'Click or drop files here') {
  return `<label class="drop-zone" id="${id}-zone"><input id="${id}" type="file" accept="${accept}" ${multiple ? 'multiple' : ''}><strong>${text}</strong><span>Your files are processed locally in this browser.</span></label>`;
}
function bindDropZone(inputId, callback) {
  const input = $(`#${inputId}`), zone = $(`#${inputId}-zone`);
  input.addEventListener('change', () => callback(input.files));
  ['dragenter','dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('dragover'); }));
  zone.addEventListener('drop', ev => { input.files = ev.dataTransfer.files; callback(input.files); });
}
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = URL.createObjectURL(file);
  });
}
function canvasToBlob(canvas, mime, quality) { return new Promise(resolve => canvas.toBlob(resolve, mime, quality)); }
