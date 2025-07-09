// alert-message
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000)
}
// Hết alert-message
const roomOverlay = document.querySelector(".room-overlay");
const createBtnRoom = document.querySelector(".list-message-users__title-right");
if (createBtnRoom) {
    createBtnRoom.addEventListener("click", () => {
        roomOverlay.classList.add("show");
    })
}

const closeBtnRoom = document.querySelector(".close-room");
if (closeBtnRoom) {
    closeBtnRoom.addEventListener("click", () => {
        roomOverlay.classList.remove("show");
    })
};

const cancelBtnRoom = document.querySelector(".room-btn-cancel");
if (cancelBtnRoom) {
    cancelBtnRoom.addEventListener("click", () => {
        roomOverlay.classList.remove("show");
    })
}