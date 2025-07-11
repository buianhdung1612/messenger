const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
    {
        title: String,
        typeRoom: String, // friends, groups
        users: Array, // userId, role(superAdmin, ),
        avatar: String,
        // background: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const RoomChat = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat');
module.exports = RoomChat;