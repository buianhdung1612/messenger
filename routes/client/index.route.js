const chatRoute = require("./chat.route");
const userRoute = require("./user.route");
const homeRoute = require("./home.route");

const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/user", userRoute);
    app.use("/", userMiddleware.requireAuth, homeRoute);
    app.use("/chat", userMiddleware.requireAuth, chatRoute);
}