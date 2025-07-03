const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        otp: String,
        email: String,
        expireAt: {
            type: Date,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, 'forgot-passowrd');
module.exports = ForgotPassword;