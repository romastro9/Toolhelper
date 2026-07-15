function openImageConverter() {
  openModal(`<h2 class="modal-title">${t('imageConverter')}</h2><p class="modal-subtitle">Convert one image to PNG, JPG or WEBP.</p>${dropZone('convertFile','image/*')}
    <div class="form-grid"><div class="form-field"><label>Output format</label><select id="convertFormat"><option value="image/webp">WEBP</option><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></div><div class="form-field"><label>Quality</label><input id="convertQuality" type="range" min="10" max="100" value="90"></div></div>
    <div id="convertPreview" class="preview-area"><span class="muted">Preview</span></div><div class="action-row"><button id="convertBtn" class="primary-btn" disabled>Convert & Download</button></div>`, () => {
      let file;
      bindDropZone('convertFile', async files => { file = files[0]; if (!file) return; const img = await loadImage(file); $('#convertPreview').innerHTML=''; $('#convertPreview').append(img); $('#convertBtn').disabled=false; });
      $('#convertBtn').onclick = async () => {
        const img = $('#convertPreview img'), mime = $('#convertFormat').value, q = +$('#convertQuality').value/100;
        const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; c.getContext('2d').drawImage(img,0,0);
        const blob=await canvasToBlob(c,mime,q); const ext=mime.split('/')[1].replace('jpeg','jpg'); const name=`${safeBase(file.name)}.${ext}`;
        downloadBlob(blob,name); addHistory(t('imageConverter'),name,`${formatBytes(file.size)} → ${formatBytes(blob.size)}`);
      };
  });
}

function openImageCompressor() {
  openModal(`<h2 class="modal-title">${t('imageCompressor')}</h2><p class="modal-subtitle">Reduce image file size using browser canvas compression.</p>${dropZone('compressFile','image/*')}
    <div class="form-grid"><div class="form-field"><label>Quality: <b id="qualityValue">75%</b></label><input id="compressQuality" type="range" min="10" max="95" value="75"></div><div class="form-field"><label>Maximum width (px)</label><input id="maxWidth" type="number" value="1920" min="100"></div></div>
    <div id="compressPreview" class="preview-area"><span class="muted">Preview</span></div><div id="compressResult"></div><div class="action-row"><button id="compressBtn" class="primary-btn" disabled>Compress & Download</button></div>`, () => {
      let file; $('#compressQuality').oninput=e=>$('#qualityValue').textContent=e.target.value+'%';
      bindDropZone('compressFile', async files => { file=files[0]; if(!file)return; const img=await loadImage(file); $('#compressPreview').innerHTML=''; $('#compressPreview').append(img); $('#compressBtn').disabled=false; });
      $('#compressBtn').onclick=async()=>{ const img=$('#compressPreview img'); const maxW=+$(`#maxWidth`).value; const scale=Math.min(1,maxW/img.naturalWidth); const c=document.createElement('canvas'); c.width=Math.round(img.naturalWidth*scale); c.height=Math.round(img.naturalHeight*scale); c.getContext('2d').drawImage(img,0,0,c.width,c.height); const blob=await canvasToBlob(c,'image/webp',+$('#compressQuality').value/100); const name=`${safeBase(file.name)}_compressed.webp`; downloadBlob(blob,name); const saved=Math.max(0,100-(blob.size/file.size*100)); $('#compressResult').innerHTML=`<div class="result-card"><strong>${saved.toFixed(1)}% smaller</strong><br>${formatBytes(file.size)} → ${formatBytes(blob.size)}</div>`; addHistory(t('imageCompressor'),name,`${saved.toFixed(1)}% smaller`); };
  });
}

function openImageResizer() {
  openModal(`<h2 class="modal-title">${t('imageResizer')}</h2><p class="modal-subtitle">Resize exactly or use a social-media preset.</p>${dropZone('resizeFile','image/*')}
    <div class="form-grid"><div class="form-field"><label>Width</label><input id="resizeWidth" type="number" min="1"></div><div class="form-field"><label>Height</label><input id="resizeHeight" type="number" min="1"></div><label class="inline-check full"><input id="lockRatio" type="checkbox" checked> Keep aspect ratio</label><div class="form-field"><label>Preset</label><select id="resizePreset"><option value="">Custom</option><option value="1080x1080">Square 1080×1080</option><option value="1080x1350">Instagram 4:5</option><option value="1080x1920">Story/Reels 9:16</option><option value="1920x1080">Full HD 16:9</option><option value="1280x720">YouTube 1280×720</option></select></div><div class="form-field"><label>Fit mode</label><select id="fitMode"><option value="contain">Fit inside</option><option value="cover">Crop to fill</option><option value="stretch">Stretch</option></select></div></div>
    <div id="resizePreview" class="preview-area"><span class="muted">Preview</span></div><div class="action-row"><button id="resizeBtn" class="primary-btn" disabled>Resize & Download</button></div>`, () => {
      let file, sourceRatio=1;
      bindDropZone('resizeFile', async files=>{file=files[0];if(!file)return;const img=await loadImage(file); sourceRatio=img.naturalWidth/img.naturalHeight; $('#resizeWidth').value=img.naturalWidth; $('#resizeHeight').value=img.naturalHeight; $('#resizePreview').innerHTML='';$('#resizePreview').append(img);$('#resizeBtn').disabled=false;});
      $('#resizeWidth').oninput=e=>{if($('#lockRatio').checked)$('#resizeHeight').value=Math.round(+e.target.value/sourceRatio)};
      $('#resizeHeight').oninput=e=>{if($('#lockRatio').checked)$('#resizeWidth').value=Math.round(+e.target.value*sourceRatio)};
      $('#resizePreset').onchange=e=>{if(!e.target.value)return;const [w,h]=e.target.value.split('x');$('#resizeWidth').value=w;$('#resizeHeight').value=h;};
      $('#resizeBtn').onclick=async()=>{const img=$('#resizePreview img'),w=+$('#resizeWidth').value,h=+$('#resizeHeight').value,mode=$('#fitMode').value,c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.clearRect(0,0,w,h);if(mode==='stretch'){ctx.drawImage(img,0,0,w,h)}else{const scale=mode==='cover'?Math.max(w/img.naturalWidth,h/img.naturalHeight):Math.min(w/img.naturalWidth,h/img.naturalHeight);const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh)}const blob=await canvasToBlob(c,'image/png',1);const name=`${safeBase(file.name)}_${w}x${h}.png`;downloadBlob(blob,name);addHistory(t('imageResizer'),name,`${w}×${h}px`);};
  });
}

async function loadFFmpeg() {
  if (window.FFmpeg) return;
  await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
}
