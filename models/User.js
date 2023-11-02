const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,

        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        joindedOn: {
            type: Date,
            default: Date.now()
        },
        forgetPassword:{
            time:Date,
            opt:String
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        collection: "User",
    }
);

module.exports = mongoose.model("User", userSchema);
