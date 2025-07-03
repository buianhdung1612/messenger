const User = require("../../models/user.model");
const RoomChat = require("../../models/roomChat.model");

module.exports = (req, res) => {
    const userIdA = res.locals.user.id;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            // Lưu id của A vào acceptFriends của B
            const existAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            });
            if (!existAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: { acceptFriends: userIdA }
                })
            }

            // Lưu id của B vào requestFriends của A
            const existBInA = await User.findOne({
                _id: userIdA,
                requestFriends: userIdB
            });
            if (!existBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $push: { requestFriends: userIdB }
                })
            }

            // Trả về số lượng lời mời đã nhận cho B
            const userB = await User.findOne({
                _id: userIdB,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userIdB: userIdB,
                length: userB.acceptFriends.length
            })

            // Trả về số lượng lời mời đã gửi cho A
            const userA = await User.findOne({
                _id: userIdA,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
                userIdA: userIdA,
                length: userA.requestFriends.length
            })

            // Trả về thông tin của A cho B trong Lời mòi đã nhận
            _io.emit("SERVER_RETURN_INFO_ACCEPT_FRIENDS", {
                userIdA: userIdA,
                fullnameA: res.locals.user.fullname,
                avatarA: userA.avatar || "",
                userIdB: userIdB
            });

            // Trả vể thông tin của B cho A trong Lời mời đã gửi
            _io.emit("SERVER_RETURN_INFO_REQUEST_FRIENDS", {
                userIdA: userIdA,
                userIdB: userIdB,
                fullnameB: userB.fullname,
                avatarB: userB.avatar || ""
            });
        })

        socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
            // Xóa id của A trong acceptFriends của B
            const existAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            });
            if (existAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $pull: { acceptFriends: userIdA }
                })
            }

            // Xóa id của B trong requestFriends của A
            const existBInA = await User.findOne({
                _id: userIdA,
                requestFriends: userIdB
            });
            if (existBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $pull: { requestFriends: userIdB }
                })
            }

            // Trả về số lượng lời mời đã nhận cho B
            const userB = await User.findOne({
                _id: userIdB,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userIdB: userIdB,
                length: userB.acceptFriends.length
            })

            // Trả về số lượng lời mời đã gửi cho A
            const userA = await User.findOne({
                _id: userIdA,
                deleted: false,
                status: "active"
            });

            _io.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
                userIdA: userIdA,
                length: userA.requestFriends.length
            })

            // Trả cho B userIdA để xóa A ra khỏi giao diện lời mời đã nhận và Trả cho A userIdB để xóa B ra khổi giao diện lời mời đã gửi
            _io.emit("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", {
                userIdA: userIdA,
                fullnameA: res.locals.user.fullname,
                avatarA: res.locals.user.avatar || "",
                fullnameB: userB.fullname,
                avatarB: userB.avatar || "",
                userIdB: userIdB
            });
        })

        socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
            // Xóa id của B trong acceptFriends của A
            const existBInA = await User.findOne({
                _id: userIdA,
                acceptFriends: userIdB
            });
            if (existBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $pull: { acceptFriends: userIdB }
                })
            }

            // Xóa id của A trong requestFriends của B
            const existAInB = await User.findOne({
                _id: userIdB,
                requestFriends: userIdA
            });
            if (existAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $pull: { requestFriends: userIdA }
                })
            }

            // Trả về số lượng lời mời đã gửi cho B           
            const userB = await User.findOne({
                _id: userIdB,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
                userIdA: userIdB,
                length: userB.requestFriends.length
            });

            // Trả về số lượng lời mời đã nhận cho A
            const userA = await User.findOne({
                _id: userIdA,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userIdB: userIdA,
                length: userA.acceptFriends.length
            });

            // Trả thông tin của B cho A để hiển thị B vào Danh sách người dùng
            _io.emit("SERVER_RETURN_INFO_REFUSE_FRIENDS", {
                userIdB: userIdB,
                fullnameB: userB.fullname,
                avatarB: userB.avatar || "",
                userIdA: userIdA
            })
        })

        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
            const existBInA = await User.findOne({
                _id: userIdA,
                acceptFriends: userIdB
            });
            const existAInB = await User.findOne({
                _id: userIdB,
                requestFriends: userIdA
            });

            let roomChatId = "";

            if (existBInA && existAInB) {
                // Tạo mới phòng Chat
                const roomChat = new RoomChat({
                    typeRoom: "friends",
                    users: [
                        {
                            userId: userIdA,
                            role: "superAdmin"
                        },
                        {
                            userId: userIdB,
                            role: "superAdmin"
                        }
                    ]
                });

                await roomChat.save();
                roomChatId = roomChat.id;

                // Thêm userId B và roomChatId vào friendList của A
                // Xóa B trong acceptFriends của A
                if (existBInA) {
                    await User.updateOne({
                        _id: userIdA
                    }, {
                        $pull: { acceptFriends: userIdB },
                        $push: {
                            friendsList: {
                                userId: userIdB,
                                roomChatId: roomChat.id
                            }
                        }
                    })
                }

                // Thêm userId A và roomChatId vào friendList của B
                // Xóa A trong requestFriends của B

                if (existAInB) {
                    await User.updateOne({
                        _id: userIdB
                    }, {
                        $pull: { requestFriends: userIdA },
                        $push: {
                            friendsList: {
                                userId: userIdA,
                                roomChatId: roomChat.id
                            }
                        }
                    })
                };
            }

            // Trả về số lượng bạn bè cho A và B
            const userA = await User.findOne({
                _id: userIdA,
                status: "active",
                deleted: false
            });

            const userB = await User.findOne({
                _id: userIdB,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_INFO_AND_LENGTH_ACCEPT_FRIEND_LIST", {
                userIdA: userIdA,
                fullnameA: userA.fullname,
                avatarA: userA.avatar || "",
                lengthA: userA.friendsList.length,
                userIdB: userIdB,
                fullnameB: userB.fullname,
                avatarB: userB.avatar || "",
                lengthB: userB.friendsList.length,
                roomChatId: roomChatId
            });

            // Trả về số lượng lời mời đã gửi cho B
            _io.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
                userIdA: userIdB,
                length: userB.requestFriends.length
            });

            // Trả về số lượng lời mời đã nhận cho A
            _io.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userIdB: userIdA,
                length: userA.acceptFriends.length
            });
        })

        socket.on("CLIENT_DELETE_FRIEND", async (userIdB) => {
            // Xóa id của B trong friendsList của A
            await User.updateOne({
                _id: userIdA
            }, {
                $pull: { friendsList: { userId: userIdB } }
            })

            // Xóa id của A trong friendsList của B
            await User.updateOne({
                _id: userIdB
            }, {
                $pull: { friendsList: { userId: userIdA } }
            });

            // Trả về số lượng bạn bè cho A và B
            const userA = await User.findOne({
                _id: userIdA,
                status: "active",
                deleted: false
            });

            const userB = await User.findOne({
                _id: userIdB,
                status: "active",
                deleted: false
            });

            _io.emit("SERVER_RETURN_INFO_AND_LENGTH_DELETE_FRIEND_LIST", {
                userIdA: userIdA,
                fullnameA: userA.fullname,
                avatarA: userA.avatar || "",
                lengthA: userA.friendsList.length,
                userIdB: userIdB,
                fullnameB: userB.fullname,
                avatarB: userB.avatar || "",
                lengthB: userB.friendsList.length
            });
        });
    })
}