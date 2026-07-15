async function readImages(files) {
const selected = [...files].filter(file => file.type.startsWith("image/"));
for (const file of selected) {
const src = await new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result);
reader.onerror = reject;
reader.readAsDataURL(file);
});
const fingerprint = src.slice(0, 120) + "|" + src.length;
const exists = toys.some(toy => toy.fingerprint === fingerprint) ||
winners.some(winner => winner.fingerprint === fingerprint);
if (exists) continue;
const name = (file.name || "Toy").replace(/\.[^.]+$/, "");
toys.push({
id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
nameEn: name,
nameKh: name,
fileName: file.name,
src,
fingerprint,
builtin: false
});
}
persist();
render();
$("#fileInput").value = "";
}
function secureRandomIndex(length) {
if (window.crypto?.getRandomValues) {
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
return array[0] % length;
}
return Math.floor(Math.random() * length);
}
function playTick() {
if (!soundEnabled) return;
audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gain = audioContext.createGain();
oscillator.frequency.value = 780;
gain.gain.setValueAtTime(.03, audioContext.currentTime);
gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .04);
oscillator.connect(gain);
gain.connect(audioContext.destination);
oscillator.start();
oscillator.stop(audioContext.currentTime + .05);
}
function playWinSound() {
if (!soundEnabled) return;
audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
[523,659,784,1047].forEach((frequency, index) => {
const oscillator = audioContext.createOscillator();
const gain = audioContext.createGain();
const time = audioContext.currentTime + index * .11;
oscillator.frequency.value = frequency;
gain.gain.setValueAtTime(.06, time);
gain.gain.exponentialRampToValueAtTime(.001, time + .32);
oscillator.connect(gain);
gain.connect(audioContext.destination);
oscillator.start(time);
oscillator.stop(time + .34);
});
}
function spinWheel() {
if (spinning || toys.length < 2) return;
spinning = true;
render();
const selectedIndex = secureRandomIndex(toys.length);
const arc = TWO_PI / toys.length;
const target = normalizeAngle(-(selectedIndex + .5) * arc);
const delta = normalizeAngle(target - normalizeAngle(rotation));
const start = rotation;
const end = rotation + TWO_PI * (7 + secureRandomIndex(3)) + delta;
const duration = 5400;
const startTime = performance.now();
let lastTickIndex = -1;
function animate(now) {
const progress = Math.min(1, (now - startTime) / duration);
const eased = 1 - Math.pow(1 - progress, 4);
rotation = start + (end - start) * eased;
drawWheel();
const tickIndex = Math.floor((rotation / TWO_PI) * Math.max(toys.length, 1) * 1.1);
if (tickIndex !== lastTickIndex) {
playTick();
lastTickIndex = tickIndex;
}
if (progress < 1) requestAnimationFrame(animate);
else finishSpin(selectedIndex);
}
requestAnimationFrame(animate);
}
function finishSpin(index) {
rotation = normalizeAngle(rotation);
const winner = toys[index];
lastRemoved = {...winner, index};
toys.splice(index, 1);
const winnerRecord = {
id: winner.id,
nameEn: winner.nameEn,
nameKh: winner.nameKh,
fileName: winner.fileName,
builtin: Boolean(winner.builtin),
src: winner.src,
fingerprint: winner.fingerprint || winner.id,
time: new Date().toLocaleString(lang === "kh" ? "km-KH" : "en-GB", {
dateStyle: "medium",
timeStyle: "short"
})
};
winners.unshift(winnerRecord);
spinning = false;
persist();
render();
showWinnerImage(winner);
$("#winnerName").textContent = currentName(winner);
$("#winnerModal").classList.remove("hidden");
launchConfetti();
playWinSound();
}
function undoWinner() {
if (!lastRemoved) return;
const restored = {...lastRemoved};
delete restored.index;
const restoreAt = Math.min(lastRemoved.index, toys.length);
if (!toys.some(toy => toy.id === restored.id)) toys.splice(restoreAt, 0, restored);
if (winners[0] && winners[0].id === restored.id) winners.shift();
lastRemoved = null;
persist();
render();
$("#winnerModal").classList.add("hidden");
}
function resetBuiltIns() {
const message = lang === "en"
? "Restore all 12 built-in toys and clear winner history?"
: "ស្តារតុក្កតា 12 រូប និងលុបប្រវត្តិអ្នកឈ្នះ?";
if (!confirm(message)) return;
toys = cloneBuiltIns();
winners = [];
lastRemoved = null;
rotation = 0;
persist();
render();
}
function exportWinners() {
if (!winners.length) return;
const rows = [
["No.","Toy","Date / Time"],
...winners.map((winner, index) => [
winners.length - index,
lang === "kh" ? (winner.nameKh || winner.nameEn) : (winner.nameEn || winner.nameKh),
winner.time
])
];
const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
const blob = new Blob(["\ufeff" + csv], {type:"text/csv;charset=utf-8"});
const anchor = document.createElement("a");
anchor.href = URL.createObjectURL(blob);
anchor.download = `mastercare-toy-winners-${new Date().toISOString().slice(0,10)}.csv`;
anchor.click();
URL.revokeObjectURL(anchor.href);
}
function launchConfetti() {
const palette = ["#E9568E","#30AD99","#F3A744","#6E8EEB","#A96EEB","#fff"];
for (let index = 0; index < 78; index++) {
const piece = document.createElement("i");
piece.className = "confetti";
piece.style.left = Math.random() * 100 + "vw";
piece.style.background = palette[index % palette.length];
piece.style.setProperty("--d", (2.5 + Math.random() * 2.8) + "s");
piece.style.setProperty("--x", (-140 + Math.random() * 280) + "px");
piece.style.setProperty("--r", (Math.random() * 360) + "deg");
piece.style.animationDelay = (Math.random() * .6) + "s";
document.body.append(piece);
setTimeout(() => piece.remove(), 6000);
}
}
$("#spinBtn").onclick = spinWheel;
$("#undoBtn").onclick = undoWinner;
$("#winnerUndoBtn").onclick = undoWinner;
$("#resetBtn").onclick = resetBuiltIns;
$("#continueBtn").onclick = () => $("#winnerModal").classList.add("hidden");
$(".backdrop").onclick = () => $("#winnerModal").classList.add("hidden");
$("#addImagesBtn").onclick = () => $("#fileInput").click();
$("#fileInput").onchange = event => readImages(event.target.files);
$("#clearBtn").onclick = () => {
const message = lang === "en" ? "Remove all toy images from the wheel?" : "លុបរូបតុក្កតាទាំងអស់ចេញពីកង់?";
if (!confirm(message)) return;
toys = [];
lastRemoved = null;
persist();
render();
};
$("#exportBtn").onclick = exportWinners;
$("#langBtn").onclick = () => {
lang = lang === "en" ? "kh" : "en";
applyLanguage();
};
$("#soundBtn").onclick = () => {
soundEnabled = !soundEnabled;
$("#soundBtn").textContent = soundEnabled ? "🔊" : "🔇";
};
$("#fullscreenBtn").onclick = () => {
if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
else document.exitFullscreen?.();
};
const dropZone = $("#dropZone");
["dragenter","dragover"].forEach(eventName => {
dropZone.addEventListener(eventName, event => {
event.preventDefault();
dropZone.classList.add("drag");
});
});
["dragleave","drop"].forEach(eventName => {
dropZone.addEventListener(eventName, event => {
event.preventDefault();
dropZone.classList.remove("drag");
});
});
dropZone.addEventListener("drop", event => readImages(event.dataTransfer.files));
window.addEventListener("resize", drawWheel);
applyLanguage();