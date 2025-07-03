import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
    // Upload Images
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        multiple: true,
        maxFileCount: 6
    });
    // End Upload Images

    formChat.addEventListener("submit", (event) => {
        event.preventDefault();

        const content = formChat.content.value;
        const images = upload.cachedFileArray;

        if (content || images.length > 0) {
            const data = {
                content: content,
                images: images
            }

            socket.emit("CLIENT_SEND_MESSAGE", data);

            formChat.content.value = "";
            upload.resetPreviewPanel();
        }
    })
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const myId = document.querySelector(".chat").getAttribute("my-id");

    const div = document.createElement('div');

    let htmlFullName = "";
    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    }
    else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullname}</div>`
    }

    let htmlContent = "";
    if (data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`
    }

    let htmlImages = "";
    if (data.images.length > 0) {
        htmlImages += `<div class="inner-images">`;
        for (const image of data.images) {
            htmlImages += `<img src="${image}"/>`
        }
        htmlImages += `</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    // Không dùng appendChild nữa vì không sẽ hiện tin nhắn đằng sau listTyping
    const elementListTyping = document.querySelector(".chat .inner-list-typing");
    body.insertBefore(div, elementListTyping);

    socket.emit("CLIENT_SEND_TYPING", false);

    body.scrollTop = body.scrollHeight;

    // ViewerJS
    new Viewer(div);
    // End ViewerJS
})
// END SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;

    // ViewerJS
    new Viewer(bodyChat);
    // End ViewerJS
}
// End Scroll Chat To Bottom

// SHOW ICON
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    // Tooltip
    const buttonIcon = document.querySelector(".chat .inner-form .button-icon");
    const tooltip = document.querySelector(".tooltip");

    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    })
    // End Tooltip

    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener("emoji-click", event => {
        inputChat.value = inputChat.value + event.detail.unicode;
    })

    // CLIENT_SEND_TYPING
    var timeOutTyping;

    inputChat.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            return;
        }

        socket.emit("CLIENT_SEND_TYPING", true);

        clearTimeout(timeOutTyping);

        timeOutTyping = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", false);
        }, 3000)
    })
}
// END SHOW ICON

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type) {
            const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
            if (!existBoxTyping) {
                const boxTyping = document.createElement('div');
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML =
                    `
                        <div class="inner-name">${data.fullname}</div>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>   
                    `;

                elementListTyping.appendChild(boxTyping);

                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        }
        else {
            const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
            if (existBoxTyping) {
                elementListTyping.removeChild(existBoxTyping);
            }
        }
    })
}
// END SERVER_RETURN_TYPING

// CLIENT_ADD_FRIEND
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend) {
    listBtnAddFriend.forEach((button) => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-add-friend");

            if (button.closest(".box-user")) {
                button.closest(".box-user").classList.add("add");
            }

            if (button.closest(".profile__buttons")) {
                button.closest(".profile__buttons").classList.add("add");
            }

            socket.emit("CLIENT_ADD_FRIEND", userIdB);
        })
    })
}
// END CLIENT_ADD_FRIEND

// CLIENT_CANCEL_FRIEND
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach((button) => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-cancel-friend");

            if (button.closest(".box-user")) {
                button.closest(".box-user").classList.remove("add");
            }

            if (button.closest(".profile__buttons")) {
                button.closest(".profile__buttons").classList.remove("add");
            }

            socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
        })
    })
}
// END CLIENT_CANCEL_FRIEND

// CLIENT_REFUSE_FRIEND
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach((button) => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-refuse-friend");

            if (button.closest(".box-user")) {
                button.closest(".box-user").classList.add("refuse");
            }

            if (button.closest(".profile__buttons")) {
                button.closest(".profile__buttons").classList.add("refuse");
            }

            socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
        })
    })
}
// END CLIENT_REFUSE_FRIEND

// CLIENT_ACCEPT_FRIEND
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend) {
    listBtnAcceptFriend.forEach((button) => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-accept-friend");

            if (button.closest(".box-user")) {
                button.closest(".box-user").classList.add("accepted");
            }

            if (button.closest(".profile__buttons")) {
                button.closest(".profile__buttons").classList.add("accepted");
            }

            socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
        })
    })
}
// END CLIENT_ACCEPT_FRIEND

// CLIENT_DELETE_FRIEND
const listBtnDeleteFriend = document.querySelectorAll("[btn-delete-friend]");
if (listBtnDeleteFriend.length > 0) {
    listBtnDeleteFriend.forEach((button) => {
        button.addEventListener("click", () => {
            const userIdB = button.getAttribute("btn-delete-friend");

            button.closest(".box-user").classList.add("deleted");

            socket.emit("CLIENT_DELETE_FRIEND", userIdB);
        })
    })
}
// END CLIENT_DELETE_FRIEND

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    const badgeUserAccept = document.querySelector(`[badge-user-accept="${data.userIdB}"]`);
    if (badgeUserAccept) {
        badgeUserAccept.innerHTML = `${data.length} Friend Requests`;
    }
})
// END SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_LENGTH_REQUEST_FRIENDS
socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", (data) => {
    const badgeUserRequest = document.querySelector(`[badge-user-request="${data.userIdA}"]`);
    if (badgeUserRequest) {
        badgeUserRequest.innerHTML = `${data.length} Sent Requests`;
    }
})
// END SERVER_RETURN_LENGTH_REQUEST_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
    // Thêm A vào danh sách Lời mời đã nhận của B
    const listAcceptFriends = document.querySelector(`[list-accept-friends="${data.userIdB}"]`);
    if (listAcceptFriends) {
        const userA = listAcceptFriends.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            if (userA.classList.contains("refuse")) {
                userA.classList.remove("refuse");
            };
            if (userA.classList.contains("accepted")) {
                userA.classList.remove("accepted");
            }
        }
        else {
            const newUser = document.createElement("div");
            newUser.classList.add("box-user");
            newUser.setAttribute("user-id", data.userIdA);
            newUser.innerHTML = `
                <a href="/user/${data.userIdA}">
                    <div class="inner-avatar">
                        <img src=${data.avatarA} alt=${data.fullnameA}>
                    </div>
                </a>
                <div class="inner-info">
                    <div class="inner-name">${data.fullnameA}</div>
                    <div class="inner-buttons">
                        <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.userIdA}>Confirm</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.userIdA}>Delete</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">Request deleted</button>
                        <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Request accepted</button>
                    </div>
                </div>
            `;
            listAcceptFriends.appendChild(newUser);

            // Chấp nhận kết bạn
            const btnAcceptFriend = newUser.querySelector("[btn-accept-friend]");
            btnAcceptFriend.addEventListener("click", () => {
                btnAcceptFriend.closest(".box-user").classList.add("accepted");
                socket.emit("CLIENT_ACCEPT_FRIEND", data.userIdA);
            })

            // Từ chối kết bạn
            const btnRefuseFriend = newUser.querySelector("[btn-refuse-friend]");
            btnRefuseFriend.addEventListener("click", () => {
                btnRefuseFriend.closest(".box-user").classList.add("refuse");
                socket.emit("CLIENT_REFUSE_FRIEND", data.userIdA);
            })
        }
    }

    // Xóa A khỏi danh sách người dùng của B
    const listNotFriendsB = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
    if (listNotFriendsB) {
        const userA = listNotFriendsB.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listNotFriendsB.removeChild(userA);
        }
    }

    // Chuyển thành nút Cancel Friend trong info của B
    const profileB = document.querySelector(`[infoUser="${data.userIdB}"]`);
    if (profileB) {
        profileB.querySelector(".profile__buttons").classList.add("add");
    }

    // Chuyển thành nút Cancel Friend trong box-user của B
    const listNotFriendsA = document.querySelector(`[list-not-friends="${data.userIdA}"]`);
    if (listNotFriendsA) {
        const userB = listNotFriendsA.querySelector(`[user-id="${data.userIdB}"]`);
        if (userB) {
            userB.classList.add("add");
        }
    }

    // Chuyển thành nút Accept Friend và Delete Friend của info A của UserB
    const profileA = document.querySelector(`[infoUser="${data.userIdA}"]`);
    if (profileA) {
        profileA.querySelector(".profile__buttons").classList.add("request");
    }
})
// END SERVER_RETURN_INFO_ACCEPT_FRIENDS

// SERVER_RETURN_USER_ID_CANCEL_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", (data) => {
    // Xóa A ra khỏi Lời mời đã nhận của B
    const listAcceptFriends = document.querySelector(`[list-accept-friends="${data.userIdB}"]`);
    if (listAcceptFriends) {
        const userA = listAcceptFriends.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listAcceptFriends.removeChild(userA);
        }
    }

    // Xóa B ra khỏi Lời mời đã gửi của A
    const listRequestFriends = document.querySelector(`[list-request-friends="${data.userIdA}"]`);
    if (listRequestFriends) {
        const userB = listRequestFriends.querySelector(`[user-id="${data.userIdB}"]`);
        if (userB) {
            listRequestFriends.removeChild(userB);
        }
    }

    // Thêm A vào Danh sách người dùng của B
    const listNotFriendsB = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
    if (listNotFriendsB) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdA);
        newUser.innerHTML = `
            <a href="/user/${data.userIdA}">
                <div class="inner-avatar">
                    <img src=${data.avatarA} alt=${data.fullnameA}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameA}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdA}>Add friend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdA}>Cancel</button>
                </div>
            </div>
        `;
        listNotFriendsB.appendChild(newUser);

        // Kết bạn
        const btnAddFriend = newUser.querySelector("[btn-add-friend]");
        btnAddFriend.addEventListener("click", () => {
            btnAddFriend.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", data.userIdA);
        })

        // Hủy kết bạn
        const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
        btnCancelFriend.addEventListener("click", () => {
            btnCancelFriend.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", data.userIdA);
        })
    };

    // Thêm B vào Danh sách người dùng của A khi đã load lại trang mất B ở Trang Danh sách người dùng và Chuyển B thành nút Kết bạn trong Danh sách người dùng của A đồng bộ với Ấn Hủy ở Trang Lời mời đã gửi khi chưa load lại trang
    const listNotFriendsA = document.querySelector(`[list-not-friends="${data.userIdA}"]`);
    if (listNotFriendsA) {
        const userB = listNotFriendsA.querySelector(`[user-id="${data.userIdB}"]`);
        if (userB) {
            userB.classList.remove("add");
        }
        else {
            const newUser = document.createElement("div");
            newUser.classList.add("box-user");
            newUser.setAttribute("user-id", data.userIdB);
            newUser.innerHTML = `
                <a href="/user/${data.userIdB}">
                    <div class="inner-avatar">
                        <img src=${data.avatarB} alt=${data.fullnameB}>
                    </div>
                </a>
                <div class="inner-info">
                    <div class="inner-name">${data.fullnameB}</div>
                    <div class="inner-buttons">
                        <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdB}>Add friend</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdB}>Cancel</button>
                    </div>
                </div>
            `;
            listNotFriendsA.appendChild(newUser);

            // Kết bạn
            const btnAddFriend = newUser.querySelector("[btn-add-friend]");
            btnAddFriend.addEventListener("click", () => {
                btnAddFriend.closest(".box-user").classList.add("add");
                socket.emit("CLIENT_ADD_FRIEND", data.userIdB);
            })

            // Hủy Kết bạn
            const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
            btnCancelFriend.addEventListener("click", () => {
                btnCancelFriend.closest(".box-user").classList.remove("add");
                socket.emit("CLIENT_CANCEL_FRIEND", data.userIdB);
            })
        }
    }

    // Chuyển thành nút Add friend trong info của B
    const profileB = document.querySelector(`[infoUser="${data.userIdB}"]`);
    if (profileB) {
        profileB.querySelector(".profile__buttons").classList.remove("add");
    }

    // Chuyển thành nút Add friend trong info của A trong user của B
    const profileA = document.querySelector(`[infoUser="${data.userIdA}"]`);
    if (profileA) {
        profileA.querySelector(".profile__buttons").classList.remove("request");
    }
})
// END SERVER_RETURN_USER_ID_CANCEL_FRIENDS

// SERVER_RETURN_INFO_REQUEST_FRIENDS
socket.on("SERVER_RETURN_INFO_REQUEST_FRIENDS", (data) => {
    const listRequestFriends = document.querySelector(`[list-request-friends="${data.userIdA}"]`);
    if (listRequestFriends) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.classList.add("add");
        newUser.setAttribute("user-id", data.userIdB);
        newUser.innerHTML = `
            <a href="/user/${data.userIdB}">
                <div class="inner-avatar">
                    <img src=${data.avatarB} alt=${data.fullnameB}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameB}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdB}>Add friend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdB}>Cancel</button>
                </div>
            </div>
        `;
        listRequestFriends.appendChild(newUser);

        // Kết bạn
        const btnAddFriend = newUser.querySelector("[btn-add-friend]");
        btnAddFriend.addEventListener("click", () => {
            btnAddFriend.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", data.userIdB);
        })

        // Hủy Kết bạn
        const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
        btnCancelFriend.addEventListener("click", () => {
            btnCancelFriend.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", data.userIdB);
        })
    }
});

// END SERVER_RETURN_INFO_REQUEST_FRIENDS

// SERVER_RETURN_INFO_AND_LENGTH_ACCEPT_FRIEND_LIST
socket.on("SERVER_RETURN_INFO_AND_LENGTH_ACCEPT_FRIEND_LIST", (data) => {
    // Trả vệ số lượng bạn bè của A
    const badgeUserFriendsA = document.querySelector(`[badge-user-friends="${data.userIdA}"]`);
    if (badgeUserFriendsA) {
        badgeUserFriendsA.innerHTML = `${data.lengthA} Friends`;
    }

    // Thêm B vào Danh sách bạn bè của A
    const listFriendsA = document.querySelector(`[list-friends="${data.userIdA}"]`);
    if (listFriendsA) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdB);
        newUser.innerHTML = `
            <a href="/user/${data.userIdB}">
                <div class="inner-avatar">
                    <img src=${data.avatarB} alt=${data.fullnameB}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameB}</div>
                <div class="inner-buttons">
                    <a btn-message-friend=${data.userIdB} href="/chat/${data.roomChatId}">Message</a>
                    <button class="btn btn-sm btn-secondary mr-1" btn-delete-friend=${data.userIdB}>Unfriend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=${data.userIdB}>Unfriended</button>
                </div>
            </div>
        `;
        listFriendsA.appendChild(newUser);

        // Chức năng Xóa bạn bè
        const btnDeleteFriend = newUser.querySelector(`[btn-delete-friend]`);
        btnDeleteFriend.addEventListener("click", () => {
            btnDeleteFriend.closest(".box-user").classList.add("deleted");
            socket.emit("CLIENT_DELETE_FRIEND", data.userIdB);
        })
    };

    // Trả vệ số lượng bạn bè của B
    const badgeUserFriendsB = document.querySelector(`[badge-user-friends="${data.userIdB}"]`);
    if (badgeUserFriendsB) {
        badgeUserFriendsB.innerHTML = `${data.lengthB} Friends`;
    };

    // Thêm A vào Danh sách bạn bè của B
    const listFriendsB = document.querySelector(`[list-friends="${data.userIdB}"]`);
    if (listFriendsB) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdA);
        newUser.innerHTML = `
            <a href="/user/${data.userIdA}">
                <div class="inner-avatar">
                    <img src=${data.avatarA} alt=${data.fullnameA}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameA}</div>
                <div class="inner-buttons">
                    <a btn-message-friend=${data.userIdB} href="/chat/${data.roomChatId}">Message</a>
                    <button class="btn btn-sm btn-secondary mr-1" btn-delete-friend=${data.userIdA}>Unfriend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=${data.userIdA}>Unfriended</button>
                </div>
            </div>
        `;
        listFriendsB.appendChild(newUser);

        // Chức năng Xóa bạn bè
        const btnDeleteFriend = newUser.querySelector(`[btn-delete-friend]`);
        btnDeleteFriend.addEventListener("click", () => {
            btnDeleteFriend.closest(".box-user").classList.add("deleted");
            socket.emit("CLIENT_DELETE_FRIEND", data.userIdA);
        })
    };

    // Xóa A khỏi Danh sách người dùng của B
    const listNotFriendsB = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
    if (listNotFriendsB) {
        const userA = listNotFriendsB.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listNotFriendsB.removeChild(userA);
        }
    };

    // Xóa A khỏi Lời mời đã gửi của B
    const listRequestFriends = document.querySelector(`[list-request-friends="${data.userIdB}"]`);
    if (listRequestFriends) {
        const userA = listRequestFriends.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listRequestFriends.removeChild(userA);
        }
    }
})
// END SERVER_RETURN_INFO_AND_LENGTH_ACCEPT_FRIEND_LIST

// SERVER_RETURN_INFO_REFUSE_FRIENDS
socket.on("SERVER_RETURN_INFO_REFUSE_FRIENDS", (data) => {
    // Thêm A vào Danh sách người dùng của B (remove đi add là được, đổi nút Hủy thành Kết bạn)
    const listNotFriendsB = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
    if (listNotFriendsB) {
        const userA = listNotFriendsB.querySelector(`[user-id="${data.userIdA}"]`);
        userA.classList.remove("add");
    }

    // Xóa A khỏi Lời mời đã gửi của B
    const listRequestFriendsB = document.querySelector(`[list-request-friends="${data.userIdB}"]`);
    if (listRequestFriendsB) {
        const userA = listRequestFriendsB.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listRequestFriendsB.removeChild(userA);
        }
    }

    // Thêm B vào Danh sách người dùng của A
    const listNotFriendsA = document.querySelector(`[list-not-friends="${data.userIdA}"]`);
    if (listNotFriendsA) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdB);
        newUser.innerHTML = `
            <div class="inner-avatar">
                <img src=${data.avatarB} alt=${data.fullnameB}>
            </div>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameB}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdB}>Add friend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdB}>Cancel</button>
                </div>
            </div>
        `;
        listNotFriendsA.appendChild(newUser);

        // Chức năng kết bạn
        const btnAddFriend = newUser.querySelector("[btn-add-friend]");
        btnAddFriend.addEventListener("click", () => {
            btnAddFriend.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", data.userIdB);
        })

        // Chức năng hủy kết bạn
        const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
        btnCancelFriend.addEventListener("click", () => {
            btnCancelFriend.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", data.userIdB);
        })
    }

    // Chuyển thành nút Add friend trong info của B
    const profileB = document.querySelector(`[infoUser="${data.userIdB}"]`);
    if (profileB) {
        profileB.querySelector(".profile__buttons").classList.remove("request");
        profileB.querySelector(".profile__buttons").classList.remove("refuse");
    }

    // Chuyển thành nút Add friend trong info của B trong A 
    const profileA = document.querySelector(`[infoUser="${data.userIdA}"]`);
    if (profileA) {
        profileA.querySelector(".profile__buttons").classList.remove("add");
    }
})
// END SERVER_RETURN_INFO_REFUSE_FRIENDS

// SERVER_RETURN_INFO_AND_LENGTH_DELETE_FRIEND_LIST
socket.on("SERVER_RETURN_INFO_AND_LENGTH_DELETE_FRIEND_LIST", (data) => {
    // Trả về số lượng bạn bè của B
    const badgeUserFriendsB = document.querySelector(`[badge-user-friends="${data.userIdB}"]`)
    if (badgeUserFriendsB) {
        badgeUserFriendsB.innerHTML = `${data.lengthB} Friends`;
    }

    // Trả về số lượng bạn bè của A
    const badgeUserFriendsA = document.querySelector(`[badge-user-friends="${data.userIdA}"]`)
    if (badgeUserFriendsA) {
        badgeUserFriendsA.innerHTML = `${data.lengthA} Friends`;
    }

    // Xóa A trong Danh sách bạn bè của B
    const listFriendsB = document.querySelector(`[list-friends="${data.userIdB}"]`);
    if (listFriendsB) {
        const userA = listFriendsB.querySelector(`[user-id="${data.userIdA}"]`);
        if (userA) {
            listFriendsB.removeChild(userA);
        }
    }

    // Xóa B trong Danh sách bạn bè của A
    const listFriendsA = document.querySelector(`[list-friends="${data.userIdA}"]`);
    if (listFriendsA) {
        const userB = listFriendsA.querySelector(`[user-id="${data.userIdB}"]`);
        if (userB) {
            listFriendsA.removeChild(userB);
        }
    }

    // Thêm A vào Danh sách người dùng của B
    const listNotFriendsB = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
    if (listNotFriendsB) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdA);
        newUser.innerHTML = `
            <a href="/user/${data.userIdA}">
                <div class="inner-avatar">
                    <img src=${data.avatarA} alt=${data.fullnameA}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameA}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdA}>Add friend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdA}>Cancel</button>
                </div>
            </div>
        `;
        listNotFriendsB.appendChild(newUser);

        // Kết bạn
        const btnAddFriend = newUser.querySelector("[btn-add-friend]");
        btnAddFriend.addEventListener("click", () => {
            btnAddFriend.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", data.userIdA);
        })

        // Hủy kết bạn
        const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
        btnCancelFriend.addEventListener("click", () => {
            btnCancelFriend.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", data.userIdA);
        })
    };

    // Thêm B vào Danh sách người dùng của A
    const listNotFriendsA = document.querySelector(`[list-not-friends="${data.userIdA}"]`);
    if (listNotFriendsA) {
        const newUser = document.createElement("div");
        newUser.classList.add("box-user");
        newUser.setAttribute("user-id", data.userIdB);
        newUser.innerHTML = `
            <a href="/user/${data.userIdB}">
                <div class="inner-avatar">
                    <img src=${data.avatarB} alt=${data.fullnameB}>
                </div>
            </a>
            <div class="inner-info">
                <div class="inner-name">${data.fullnameB}</div>
                <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.userIdB}>Add friend</button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.userIdB}>Cancel</button>
                </div>
            </div>
        `;
        listNotFriendsA.appendChild(newUser);

        // Chức năng kết bạn
        const btnAddFriend = newUser.querySelector("[btn-add-friend]");
        btnAddFriend.addEventListener("click", () => {
            btnAddFriend.closest(".box-user").classList.add("add");
            socket.emit("CLIENT_ADD_FRIEND", data.userIdB);
        })

        // Chức năng hủy kết bạn
        const btnCancelFriend = newUser.querySelector("[btn-cancel-friend]");
        btnCancelFriend.addEventListener("click", () => {
            btnCancelFriend.closest(".box-user").classList.remove("add");
            socket.emit("CLIENT_CANCEL_FRIEND", data.userIdB);
        })
    }
})
// END SERVER_RETURN_INFO_AND_LENGTH_DELETE_FRIEND_LIST

// SERVER_RETURN_STATUS_ONLINE_USER
socket.on("SERVER_RETURN_STATUS_ONLINE_USER", (data) => {
    const listFriends = document.querySelector("[list-friends]");
    if (listFriends) {
        const user = listFriends.querySelector(`[user-id="${data.userId}"]`);
        if (user) {
            const status = user.querySelector("[status]");
            console.log(data);
            status.setAttribute("status", data.statusOnline);
        }
    }
})
// END SERVER_RETURN_STATUS_ONLINE_USER

// CLIENT_UPLOAD_BACKGROUND
const uploadBackground = document.querySelector("[upload-background]");
if (uploadBackground) {
    const uploadBackgroundInput = uploadBackground.querySelector("[upload-background-input]");
    const uploadBackgroundPreview = uploadBackground.querySelector("[upload-background-preview]");
    const uploadUploadConfirm = document.querySelector(".upload__confirm");

    let originalSrc = uploadBackgroundPreview.src;

    uploadBackgroundInput.addEventListener("change", () => {
        const file = uploadBackgroundInput.files[0];
        if (file) {
            uploadBackgroundPreview.src = URL.createObjectURL(file);
            uploadUploadConfirm.style.visibility = "visible"
        };

        const btnBgCancel = uploadUploadConfirm.querySelector("[btn-bg-cancel]");
        const btnBgSave = uploadUploadConfirm.querySelector("[btn-bg-save]");

        btnBgCancel.addEventListener("click", () => {
            uploadBackgroundPreview.src = originalSrc;
            uploadUploadConfirm.style.visibility = "hidden";
            uploadBackgroundInput.value = ""
        })

        btnBgSave.addEventListener("click", () => {
            socket.emit("CLIENT_UPLOAD_BACKGROUND", file);
            socket.on("SERVER_RETURN_UPLOAD_BACKGROUND", (data) => {
                if (data.code == "success") {
                    originalSrc = uploadBackgroundPreview.src;
                    uploadUploadConfirm.style.visibility = "hidden";
                }
            })
        })
    })
}
// END CLIENT_UPLOAD_BACKGROUND

// CLIENT_UPLOAD_AVATAR
const uploadAvatar = document.querySelector("[upload-avatar]");
if (uploadAvatar) {
    const uploadAvatarInput = uploadAvatar.querySelector("[upload-avatar-input]");
    const uploadAvatarPreview = uploadAvatar.querySelector("[upload-avatar-preview]");
    const uploadUploadConfirm = document.querySelector(".upload__confirm");

    let originalSrc = uploadAvatarPreview.src;

    uploadAvatarInput.addEventListener("change", () => {
        const file = uploadAvatarInput.files[0];
        if (file) {
            uploadAvatarPreview.src = URL.createObjectURL(file);
            uploadUploadConfirm.style.visibility = "visible"
        };

        const btnBgCancel = uploadUploadConfirm.querySelector("[btn-bg-cancel]");
        const btnBgSave = uploadUploadConfirm.querySelector("[btn-bg-save]");

        btnBgCancel.addEventListener("click", () => {
            uploadAvatarPreview.src = originalSrc;
            uploadUploadConfirm.style.visibility = "hidden";
            uploadAvatarInput.value = ""
        })

        btnBgSave.addEventListener("click", () => {
            socket.emit("CLIENT_UPLOAD_AVATAR", file);
            socket.on("SERVER_RETURN_UPLOAD_AVATAR", (data) => {
                if (data.code == "success") {
                    originalSrc = uploadAvatarPreview.src;
                    uploadUploadConfirm.style.visibility = "hidden";
                }
            })
        })
    })
}
// END CLIENT_UPLOAD_AVATAR

