const md5 = require('md5');
const unidecode = require("unidecode");
const generate = require("../../helpers/generate.helper");
const userSocket = require("../../sockets/client/user.socket");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const RoomChat = require('../../models/roomChat.model');
const streamUploadHelper = require("../../helpers/streamUpload.helper");
const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper")

module.exports.register = (req, res) => {
    res.render('client/pages/user/register.pug', {
        pageTitle: "Tạo tài khoản mới"
    })
}

module.exports.registerPost = async (req, res) => {
    const user = req.body;

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    })

    if (existUser) {
        req.flash("error", "Email đã tồn tại trong hệ thống");
        res.redirect("/user/register");
        return;
    }

    const dataUser = {
        fullname: user.fullname,
        email: user.email,
        password: md5(user.password),
        token: generate.generateRandomString(30),
        status: "active",
        avatar: "https://res.cloudinary.com/dxyuuul0q/image/upload/v1749694082/zowgq3zrnh8vybqsvwuf.png",
        background: "http://res.cloudinary.com/dxyuuul0q/image/upload/v1749696028/tzva2nkj7szvpyrqmihr.jpg"
    }

    const newUser = new User(dataUser);
    await newUser.save();

    res.cookie("tokenUser", newUser.token);
    req.flash("success", "Đăng ký tài khoản thành công");
    res.redirect("/");
}

module.exports.login = (req, res) => {
    res.render('client/pages/user/login.pug', {
        pageTitle: "Trang đăng nhập"
    })
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const existUser = await User.findOne({
        email: email,
        deleted: false
    });

    if (!existUser) {
        req.flash("error", "Email không tồn tại trong hệ thống");
        res.redirect("/user/login");
        return;
    }

    if (md5(password) !== existUser.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("/user/login");
        return;
    }

    if (existUser.status !== "active") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect("/user/login");
        return;
    }

    res.cookie("tokenUser", existUser.token);

    await User.updateOne({
        email: email
    }, {
        statusOnline: "online"
    });

    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
        userId: existUser.id,
        statusOnline: "online"
    })

    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    await User.updateOne({
        token: req.cookies.tokenUser
    }, {
        statusOnline: "offline"
    });

    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
        userId: res.locals.user.id,
        statusOnline: "offline"
    })

    res.clearCookie("tokenUser");
    req.flash("success", "Đã đăng xuất!");
    res.redirect("/chat");
}

module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot-password.pug', {
        pageTitle: "Trang quên mật khẩu"
    });
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const existUser = await User.findOne({
        email: email,
        status: "active",
        deleted: false
    });

    if (!existUser) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("/user/password/forgot");
        return;
    }

    const existUserInForgotPassword = await ForgotPassword.findOne({
        email: email
    });

    if (!existUserInForgotPassword) {
        const otp = generateHelper.generateRandomNumber(6);

        const data = {
            otp: otp,
            email: email,
            expireAt: Date.now() + 5 * 60 * 1000
        };

        const record = new ForgotPassword(data);
        await record.save();

        // Gửi mail
        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`
        sendMailHelper.sendMail(email, subject, text)
    }

    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) => {
    res.render('client/pages/user/otp-password', {
        pageTitle: "Xác thực OTP",
        email: req.query.email
    });
}

module.exports.otpPasswordPost = async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;

    const existRecord = await ForgotPassword.findOne({
        otp,
        email
    });

    if (!existRecord) {
        req.flash("error", "Mã OTP không hợp lệ!");
        res.redirect(`/user/password/otp?email=${email}`);
        return;
    }

    const user = await User.findOne({
        email
    });

    res.cookie("tokenUser", user.token);
    res.redirect("/user/password/reset");
}

module.exports.resetPasswordPost = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const password = req.body.password;

    await User.updateOne({
        token: tokenUser,
        status: 'active',
        deleted: false
    }, {
        password: md5(password)
    });

    req.flash("success", "Khôi phục mật khẩu thành công!");

    res.redirect('/')
}

module.exports.resetPassword = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({
        token: tokenUser
    });

    res.render('client/pages/user/reset-password', {
        pageTitle: "Khôi phục mật khẩu",
        avatar: user.avatar,
        email: user.email,
        fullname: user.fullname
    });
}

module.exports.notFriend = async (req, res) => {
    userSocket(req, res);

    const friendsList = res.locals.user.friendsList;
    const friendListId = friendsList.map(item => item.userId);

    const users = await User.find({
        $and: [
            { _id: { $ne: res.locals.user.id } },
            { _id: { $nin: res.locals.user.acceptFriends } },
            { _id: { $nin: res.locals.user.requestFriends } },
            { _id: { $nin: friendListId } }
        ],
        status: "active",
        deleted: false
    }).select("id fullname avatar slug");

    res.render('client/pages/user/not-friend.pug', {
        pageTitle: "Users",
        users: users
    })
}

module.exports.request = async (req, res) => {
    userSocket(req, res);

    const users = await User.find({
        _id: { $in: res.locals.user.requestFriends },
        status: "active",
        deleted: false
    }).select("id fullname avatar slug");

    res.render('client/pages/user/request.pug', {
        pageTitle: "Sent Requests",
        users: users
    })
}

module.exports.accept = async (req, res) => {
    userSocket(req, res);

    const users = await User.find({
        _id: { $in: res.locals.user.acceptFriends },
        status: "active",
        deleted: false
    }).select("id fullname avatar slug");

    res.render('client/pages/user/accept.pug', {
        pageTitle: "Friend Requests",
        users: users
    })
}

module.exports.friends = async (req, res) => {
    userSocket(req, res);

    const friendsList = res.locals.user.friendsList;
    const users = [];

    for (const user of friendsList) {
        const infoUser = await User.findOne({
            _id: user.userId,
            status: "active",
            deleted: false
        });

        users.push({
            id: infoUser.id,
            fullname: infoUser.fullname,
            avatar: infoUser.avatar,
            statusOnline: infoUser.statusOnline,
            roomChatId: user.roomChatId,
            slug: infoUser.slug
        });
    }

    res.render('client/pages/user/friends.pug', {
        pageTitle: "Friends",
        users: users
    })
}

module.exports.rooms = async (req, res) => {
    const listRoomChat = await RoomChat.find({
        "users.userId": res.locals.user.id,
        typeRoom: "group",
        deleted: false
    });

    res.render('client/pages/user/rooms.pug', {
        pageTitle: "Phòng chat",
        listRoomChat: listRoomChat
    })
}

module.exports.createRoom = async (req, res) => {
    const friendList = res.locals.user.friendsList;

    const friendListFinal = [];

    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.userId,
            deleted: false,
            status: "active"
        });

        if (infoFriend) {
            friendListFinal.push({
                userId: friend.userId,
                fullname: infoFriend.fullname,
                avatar: infoFriend.avatar
            })
        }
    }

    res.render('client/pages/user/create-room.pug', {
        pageTitle: "Tạo phòng chat",
        friendList: friendListFinal
    })
}

module.exports.createRoomPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;
    const avatar = req.body.avatar;

    if (!title) {
        req.flash("error", "Tên phòng không được để trống!");
        res.redirect(req.get("referer"));
        return;
    }

    if (!usersId) {
        req.flash("error", "Vui lòng chọn thành viên cho nhóm!");
        res.redirect(req.get("referer"));
        return;
    }

    if (usersId.length < 2) {
        req.flash("error", "Ít nhất phải 2 bạn bè trong nhóm!");
        res.redirect(req.get("referer"));
        return;
    }

    const dataRoomChat = {
        title: title,
        avatar: avatar,
        typeRoom: "group",
        users: []
    };

    dataRoomChat.users.push({
        userId: res.locals.user.id,
        role: "superAdmin"
    });

    for (const userId of usersId) {
        dataRoomChat.users.push({
            userId: userId,
            role: "user"
        })
    }

    const room = new RoomChat(dataRoomChat);
    await room.save();

    res.redirect(`/chat/${room.id}`)
}

module.exports.profile = async (req, res) => {
    const user = await User.findOne({
        _id: res.locals.user.id
    }).select("_id fullname statusOnline friendsList background avatar");

    for (const friend of user.friendsList) {
        const infoFriend = await User.findOne({
            _id: friend.userId
        });

        friend.avatar = infoFriend.avatar;
        friend.fullname = infoFriend.fullname;
    }

    _io.once('connection', (socket) => {
        socket.on("CLIENT_UPLOAD_BACKGROUND", async (data) => {
            const result = await streamUploadHelper.streamUpload(data);

            await User.updateOne({
                _id: res.locals.user.id
            }, {
                background: result.url
            });

            socket.emit("SERVER_RETURN_UPLOAD_BACKGROUND", {
                code: "success"
            })
        });

        socket.on("CLIENT_UPLOAD_AVATAR", async (data) => {
            const result = await streamUploadHelper.streamUpload(data);

            await User.updateOne({
                _id: res.locals.user.id
            }, {
                avatar: result.url
            });

            socket.emit("SERVER_RETURN_UPLOAD_AVATAR", {
                code: "success"
            })
        })
    })

    res.render('client/pages/user/profile.pug', {
        user: user
    })
}

module.exports.infoUser = async (req, res) => {
    userSocket(req, res);

    const slug = req.params.slug;

    const user = await User.findOne({
        slug: slug
    }).select("_id fullname statusOnline friendsList background avatar").lean();

    const id = user._id;

    let statusWithMe = "not-friend";
    let roomChatIdWithMe = "";

    if (res.locals.user.acceptFriends.includes(id)) {
        statusWithMe = "accept";
    }

    if (res.locals.user.requestFriends.includes(id)) {
        statusWithMe = "request"
    }

    const friend = res.locals.user.friendsList.find(friend => friend.userId === id);
    if (friend) {
        statusWithMe = "friend";
        roomChatIdWithMe = friend.roomChatId
    }

    user.statusWithMe = statusWithMe;
    user.roomChatIdWithMe = roomChatIdWithMe;

    for (const friend of user.friendsList) {
        const infoFriend = await User.findOne({
            _id: friend.userId
        });

        friend.avatar = infoFriend.avatar || "";
        friend.fullname = infoFriend.fullname;
    }

    res.render('client/pages/user/info.pug', {
        userInfo: user
    })
}

module.exports.search = async (req, res) => {
    const type = req.params.type;

    const keyword = `${req.query.keyword}`;

    let keywordRegex = keyword.trim();
    keywordRegex = keyword.replace(/\s+/g, '-');
    keywordRegex = unidecode(keyword);

    const arrayKeywordRegex = keywordRegex.split("-");

    const slugRegex = new RegExp(arrayKeywordRegex[0], "i");

    const usersByFirstWord = await User.find({
        slug: slugRegex,
        status: "active",
        deleted: false
    }).select("_id fullname slug avatar friendsList").lean();

    const usersResult = [];

    for (const user of usersByFirstWord) {
        let check = true;

        for (const word of arrayKeywordRegex) {
            if (!user.slug.includes(word.toLocaleLowerCase())) {
                check = false;
                break;
            }
        }

        if (check) {
            usersResult.push(user);
        }
    }

    for (const user of usersResult) {
        let statusWithMe = "not-friend";
        let roomChatIdWithMe = "";

        if (user._id.toString() === res.locals.user._id.toString()) {
            statusWithMe = "me"
        }
        else {
            const friend = res.locals.user.friendsList.find(friend => friend.userId === user._id.toString());
            if (friend) {
                statusWithMe = "friend";
                roomChatIdWithMe = friend.roomChatId
            }
        }

        user.statusWithMe = statusWithMe;
        user.roomChatIdWithMe = roomChatIdWithMe;

        const mutualFriends = [];

        for (const friend of user.friendsList) {
            if (res.locals.user.friendsList.find(user => user.userId === friend.userId)) {
                const infoFriend = await User.findOne({
                    _id: friend.userId
                });

                mutualFriends.push({
                    _id: infoFriend._id,
                    fullname: infoFriend.fullname,
                    avatar: infoFriend.avatar,
                })
            }
        }

        user.mutualLength = mutualFriends.length;

        user.friendsList = mutualFriends.slice(0, 3);
    }

    if (type == "result") {
        res.render("client/pages/user/search", {
            pageTitle: "Search results",
            users: usersResult
        })
    }
}