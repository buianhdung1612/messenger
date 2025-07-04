import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'

window.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('img[upload-background-preview]');
    const fade = document.querySelector('.background-fade');
    const colorThief = new ColorThief();

    if (!img || !fade) return;

    if (img.complete) {
        applyGradient();
    } else {
        img.addEventListener('load', applyGradient);
    }

    function applyGradient() {
        try {
            const [r, g, b] = colorThief.getColor(img);
            fade.style.backgroundImage = `linear-gradient(to bottom, rgba(${r},${g},${b}, 1), white)`;
        } catch (e) {
            console.warn('Không thể lấy màu ảnh:', e);
        }
    }
});

// alert-message
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000)
}
// Hết alert-message