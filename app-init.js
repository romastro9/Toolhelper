const tools = {
  'image-converter': openImageConverter,
  'image-compressor': openImageCompressor,
  'image-resizer': openImageResizer,
  'video-mp3': openVideoMp3,
  'zip-compressor': openZip,
  'image-pdf': openImagePdf,
  'size-presets': openSizePresets,
  'palette-extractor': openPalette,
  'qr-generator': openQr,
  'coming-soon': () => toast(state.lang === 'kh' ? 'ឧបករណ៍នេះនឹងមាននៅ Version បន្ទាប់។' : 'This tool is planned for the next version.')
};

applyLanguage(); applyTheme(); renderHistory(); $('#processedCount').textContent=state.history.length;
$$('.tool-card').forEach(card=>{card.addEventListener('click',e=>{if(e.target.closest('.favorite-btn'))return;tools[card.dataset.tool]?.();});});
$$('.favorite-btn').forEach(btn=>{const card=btn.closest('.tool-card'),id=card.dataset.tool;btn.classList.toggle('active',state.favorites.includes(id));btn.textContent=state.favorites.includes(id)?'★':'☆';btn.onclick=e=>{e.stopPropagation();if(state.favorites.includes(id))state.favorites=state.favorites.filter(x=>x!==id);else state.favorites.push(id);localStorage.setItem('rct-favorites',JSON.stringify(state.favorites));btn.classList.toggle('active');btn.textContent=btn.classList.contains('active')?'★':'☆';filterTools();};});
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>filterTools(btn.dataset.filter)));
$('#toolSearch').addEventListener('input',()=>filterTools());
$('#favoritesOnly').onclick=()=>{state.favoritesOnly=!state.favoritesOnly;$('#favoritesOnly').textContent=state.favoritesOnly?'★':'☆';filterTools();};
$('#languageToggle').onclick=()=>{state.lang=state.lang==='en'?'kh':'en';applyLanguage();renderHistory();};
$('#themeToggle').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';applyTheme();};
$('#browseTools').onclick=()=>$('#toolsSection').scrollIntoView({behavior:'smooth'});
$$('[data-open-tool]').forEach(b=>b.onclick=()=>tools[b.dataset.openTool]?.());
$('#clearHistory').onclick=()=>{state.history=[];localStorage.setItem('rct-history','[]');renderHistory();$('#processedCount').textContent='0';};
$$('[data-close-modal]').forEach(el=>el.onclick=closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#toolSearch').focus();}});
$('#mobileMenu').onclick=()=>$('.sidebar').classList.toggle('open');
