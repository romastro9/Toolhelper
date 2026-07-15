const BUILT_IN_TOYS = [{"id":"toy-01","nameEn":"Mermaid Doll","nameKh":"តុក្កតានាងមច្ឆា","fileName":"toy-01.webp","builtin":true,"src":"assets/toy-01.webp"},{"id":"toy-02","nameEn":"Hero Cat","nameKh":"ឆ្មាវីរបុរស","fileName":"toy-02.webp","builtin":true,"src":"assets/toy-02.webp"},{"id":"toy-03","nameEn":"Bear Hood Doll","nameKh":"តុក្កតាមួកខ្លាឃ្មុំ","fileName":"toy-03.webp","builtin":true,"src":"assets/toy-03.webp"},{"id":"toy-04","nameEn":"Pumpkin Bear","nameKh":"ខ្លាឃ្មុំល្ពៅ","fileName":"toy-04.webp","builtin":true,"src":"assets/toy-04.webp"},{"id":"toy-05","nameEn":"White Bunny","nameKh":"ទន្សាយស","fileName":"toy-05.webp","builtin":true,"src":"assets/toy-05.webp"},{"id":"toy-06","nameEn":"Red Panda","nameKh":"ផេនដាក្រហម","fileName":"toy-06.webp","builtin":true,"src":"assets/toy-06.webp"},{"id":"toy-07","nameEn":"Blue Bunny Doll","nameKh":"តុក្កតាទន្សាយខៀវ","fileName":"toy-07.webp","builtin":true,"src":"assets/toy-07.webp"},{"id":"toy-08","nameEn":"Corgi Puppy","nameKh":"កូនឆ្កែ Corgi","fileName":"toy-08.webp","builtin":true,"src":"assets/toy-08.webp"},{"id":"toy-09","nameEn":"Pink Pig","nameKh":"ជ្រូកពណ៌ផ្កាឈូក","fileName":"toy-09.webp","builtin":true,"src":"assets/toy-09.webp"},{"id":"toy-10","nameEn":"Yellow Dino","nameKh":"ដាយណូពណ៌លឿង","fileName":"toy-10.webp","builtin":true,"src":"assets/toy-10.webp"},{"id":"toy-11","nameEn":"White Bear","nameKh":"ខ្លាឃ្មុំស","fileName":"toy-11.webp","builtin":true,"src":"assets/toy-11.webp"},{"id":"toy-12","nameEn":"Green Frog Cat","nameKh":"ឆ្មាកង្កែបបៃតង","fileName":"toy-12.webp","builtin":true,"src":"assets/toy-12.webp"}];
const STORAGE = {
toys: "mastercare-toy-wheel-items-v3",
winners: "mastercare-toy-wheel-winners-v3",
lang: "mastercare-toy-wheel-lang-v3"
};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const canvas = $("#wheel");
const ctx = canvas.getContext("2d");
const TWO_PI = Math.PI * 2;
const COLORS = ["#E9568E","#30AD99","#6E8EEB","#F3A744","#A96EEB","#EF6C66","#45A8D8","#7CBF61","#E27AB6","#6674D8","#E7B73E","#39B9B0"];
const imageCache = new Map();
let toys = loadJson(STORAGE.toys, null);
let winners = loadJson(STORAGE.winners, []);
let lang = localStorage.getItem(STORAGE.lang) || "en";
let rotation = 0;
let spinning = false;
let soundEnabled = true;
let lastRemoved = null;
let audioContext;
if (!Array.isArray(toys)) {
toys = cloneBuiltIns();
persist();
}
function cloneBuiltIns() {
return BUILT_IN_TOYS.map(toy => ({...toy}));
}
function loadJson(key, fallback) {
try {
const value = localStorage.getItem(key);
return value ? JSON.parse(value) : fallback;
} catch {
return fallback;
}
}
function persist() {
localStorage.setItem(STORAGE.toys, JSON.stringify(toys));
localStorage.setItem(STORAGE.winners, JSON.stringify(winners));
}
function currentName(toy) {
return lang === "kh" ? (toy.nameKh || toy.nameEn || "រូបតុក្កតា") : (toy.nameEn || toy.nameKh || "Toy");
}
function escapeHtml(value) {
return String(value).replace(/[&<>"']/g, char => ({
"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[char]));
}
function getImage(src) {
if (imageCache.has(src)) return imageCache.get(src);
const image = new Image();
image.decoding = "async";
image.src = src;
image.onload = drawWheel;
imageCache.set(src, image);
return image;
}
function thumbnailMarkup(toy, className = "thumb") {
const label = escapeHtml(currentName(toy));
return `<img class="${className}" src="${toy.src}" alt="${label}">`;
}
function showWinnerImage(toy) {
const element = $("#winnerImage");
element.style.backgroundImage = `url("${toy.src}")`;
element.style.backgroundPosition = "center";
element.style.backgroundSize = "cover";
element.setAttribute("aria-label", currentName(toy));
}
function applyLanguage() {
document.documentElement.lang = lang === "kh" ? "km" : "en";
$$("[data-en][data-kh]").forEach(element => {
element.textContent = element.dataset[lang];
});
$("#langBtn").textContent = lang === "en" ? "ខ្មែរ" : "English";
localStorage.setItem(STORAGE.lang, lang);
render();
}
function normalizeAngle(angle) {
return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}
function drawRoundedRect(context, x, y, width, height, radius) {
context.beginPath();
context.moveTo(x + radius, y);
context.arcTo(x + width, y, x + width, y + height, radius);
context.arcTo(x + width, y + height, x, y + height, radius);
context.arcTo(x, y + height, x, y, radius);
context.arcTo(x, y, x + width, y, radius);
context.closePath();
}
function drawWheel() {
const width = canvas.width;
const center = width / 2;
const radius = width * .455;
ctx.clearRect(0, 0, width, width);
if (!toys.length) {
$("#emptyWheel").style.display = "grid";
return;
}
$("#emptyWheel").style.display = "none";
const arc = TWO_PI / toys.length;
const base = -Math.PI / 2 + rotation;
toys.forEach((toy, index) => {
const start = base + index * arc;
const end = start + arc;
ctx.beginPath();
ctx.moveTo(center, center);
ctx.arc(center, center, radius, start, end);
ctx.closePath();
ctx.fillStyle = COLORS[index % COLORS.length];
ctx.fill();
ctx.lineWidth = toys.length > 30 ? 1.5 : 4;
ctx.strokeStyle = "rgba(255,255,255,.90)";
ctx.stroke();
const middle = start + arc / 2;
ctx.save();
ctx.translate(center, center);
ctx.rotate(middle);
const box = Math.max(45, Math.min(118, 650 / Math.max(toys.length, 6)));
const x = radius * .54;
const y = -box / 2;
ctx.shadowColor = "rgba(0,0,0,.14)";
ctx.shadowBlur = 10;
drawRoundedRect(ctx, x, y, box, box, 14);
ctx.fillStyle = "rgba(255,255,255,.94)";
ctx.fill();
ctx.save();
drawRoundedRect(ctx, x + 4, y + 4, box - 8, box - 8, 11);
ctx.clip();
const image = getImage(toy.src);
if (image.complete && image.naturalWidth) {
const scale = Math.max((box - 8) / image.naturalWidth, (box - 8) / image.naturalHeight);
const drawWidth = image.naturalWidth * scale;
const drawHeight = image.naturalHeight * scale;
ctx.drawImage(
image,
x + 4 + ((box - 8) - drawWidth) / 2,
y + 4 + ((box - 8) - drawHeight) / 2,
drawWidth,
drawHeight
);
}
ctx.restore();
ctx.shadowBlur = 0;
ctx.fillStyle = "#fff";
ctx.font = `800 ${Math.max(11, Math.min(16, box * .17))}px Inter, system-ui`;
ctx.textAlign = "center";
ctx.textBaseline = "top";
const fullName = currentName(toy);
const maxLength = toys.length > 18 ? 10 : 16;
const label = fullName.length > maxLength ? fullName.slice(0, maxLength - 1) + "…" : fullName;
ctx.fillText(label, x + box / 2, y + box + 8, box + 24);
ctx.restore();
});
ctx.beginPath();
ctx.arc(center, center, radius, 0, TWO_PI);
ctx.lineWidth = 12;
ctx.strokeStyle = "rgba(255,255,255,.94)";
ctx.stroke();
}
function statusText() {
if (toys.length < 2) {
return lang === "en"
? "Add or reset at least 2 toy images to spin."
: "បន្ថែម ឬស្តាររូបតុក្កតាយ៉ាងតិច 2 ដើម្បីបង្វិល។";
}
return lang === "en"
? `${toys.length} toy images are ready.`
: `រូបតុក្កតា ${toys.length} រូបត្រៀមរួចរាល់។`;
}
function render() {
toys.filter(toy => toy.src).forEach(toy => getImage(toy.src));
$("#toyCount").textContent = toys.length;
$("#listCount").textContent = lang === "en" ? `${toys.length} images` : `${toys.length} រូបភាព`;
$("#wheelStatus").textContent = statusText();
$("#spinBtn").disabled = spinning || toys.length < 2;
$("#undoBtn").disabled = !lastRemoved;
$("#clearBtn").disabled = spinning || !toys.length;
$("#exportBtn").disabled = !winners.length;
$("#toyList").innerHTML = toys.length
? toys.map((toy, index) => `
<div class="toy-item">
${thumbnailMarkup(toy)}
<div class="item-meta">
<strong>${escapeHtml(currentName(toy))}</strong>
<small>${toy.builtin ? (lang === "en" ? "Built-in toy" : "តុក្កតាដាក់ស្រាប់") : escapeHtml(toy.fileName || "Uploaded image")}</small>
</div>
<div class="mini-actions">
<button class="mini-btn" data-rename="${index}" title="Rename">✎</button>
<button class="mini-btn remove" data-remove="${index}" title="Remove">×</button>
</div>
</div>`).join("")
: `<div class="empty-list">${lang === "en" ? "No toy images on the wheel." : "មិនមានរូបតុក្កតាក្នុងកង់។"}</div>`;
$("#winnerList").innerHTML = winners.length
? winners.map((winner, index) => `
<div class="winner-item">
${thumbnailMarkup(winner)}
<div class="item-meta">
<strong>${escapeHtml(lang === "kh" ? (winner.nameKh || winner.nameEn) : (winner.nameEn || winner.nameKh))}</strong>
<small>#${winners.length - index} · ${escapeHtml(winner.time)}</small>
</div>
</div>`).join("")
: `<div class="empty-list">${lang === "en" ? "No winners yet." : "មិនទាន់មានអ្នកឈ្នះ។"}</div>`;
$$("[data-remove]").forEach(button => {
button.onclick = () => {
if (spinning) return;
toys.splice(Number(button.dataset.remove), 1);
persist();
render();
};
});
$$("[data-rename]").forEach(button => {
button.onclick = () => {
if (spinning) return;
const toy = toys[Number(button.dataset.rename)];
const promptText = lang === "en" ? "Enter a new name for this toy:" : "បញ្ចូលឈ្មោះថ្មីសម្រាប់តុក្កតានេះ៖";
const value = prompt(promptText, currentName(toy));
if (!value || !value.trim()) return;
if (lang === "kh") toy.nameKh = value.trim();
else toy.nameEn = value.trim();
persist();
render();
};
});
drawWheel();
}
