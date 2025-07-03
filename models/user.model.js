const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
    {
        fullname: String,
        slug: {
            type: String,
            slug: "fullname",
            unique: true
        },
        email: String,
        password: String,
        token: String,
        avatar: String,
        background: String,
        status: String,
        acceptFriends: Array, // Danh sách những người cần chấp nhận
        requestFriends: Array, // Danh sách những người đã gửi yêu cầu đi
        friendsList: Array, // Danh sách bạn bè
        statusOnline: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema, "users");
module.exports = User;