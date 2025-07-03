const streamUploadHelper = require("../../helpers/streamUpload.helper");
const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
    _io.once('connection', (socket) => {
        socket.join(req.params.roomChatId);

        // Người dùng gửi tin nhắn server
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = [];

            for (const item of data.images) {
                const result = await streamUploadHelper.streamUpload(item);
                images.push(result.url);
            }

            const dataChat = {
                userId: res.locals.user.id,
                roomChatId: req.params.roomChatId,
                content: data.content,
                images: images
            };

            // Tạo mới tin nhắn vào CSDL
            const chat = new Chat(dataChat);
            await chat.save();

            //SERVER_RETURN_MESSAGE
            _io.to(req.params.roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: res.locals.user.id,
                fullname: res.locals.user.fullname,
                content: data.content,
                images: images
            })
        });

        // CLIENT_SEND_TYPING
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(req.params.roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: res.locals.user.id,
                fullname: res.locals.user.fullname,
                type: type
            })
        })
    });

    const listFriendsMessage = [];

    for (const friend of res.locals.user.friendsList) {
        const latestMessage = await Chat.findOne({
            deleted: false,
            roomChatId: friend.roomChatId
        }).sort({ createdAt: "desc" });

        const infoFriend = await User.findOne({
            _id: friend.userId
        });

        if (!latestMessage) {
            listFriendsMessage.push({
                friendId: friend.userId,
                friendFullname: infoFriend.fullname,
                friendShortname: infoFriend.fullname.split(" ").pop(),
                friendAvatar: infoFriend.avatar,
                friendStatus: infoFriend.statusOnline,
                roomChatId: friend.roomChatId,
                message: `Bạn đã kết nối với ${infoFriend.fullname.split(" ").pop()}. Hãy gửi tin nhắn đầu tiên!`
            })
        }
        else {
            listFriendsMessage.push({
                friendId: friend.userId,
                friendFullname: infoFriend.fullname,
                friendShortname: infoFriend.fullname.split(" ").pop(),
                friendAvatar: infoFriend.avatar,
                friendStatus: infoFriend.statusOnline,
                roomChatId: friend.roomChatId,
                message: latestMessage.content,
                messageUserId: latestMessage.userId
            })
        }
    }

    const chats = await Chat.find({
        deleted: false,
        roomChatId: req.params.roomChatId
    })

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.userId
        });

        chat.fullname = infoUser.fullname
    }

    res.render('client/pages/chat/index.pug', {
        pageTitle: "Chat",
        chats: chats,
        listFriendsMessage: listFriendsMessage,
        roomChatId: req.params.roomChatId
    })
}
