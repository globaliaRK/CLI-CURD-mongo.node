const mongoose = require('mongoose');
const { hashSync } = require('bcryptjs');


const userSchema = mongoose.Schema({
    fullName: String,
    mobileNumber: Number,
    gender: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: /\S+@\S+\.\S+/
    },
    password: {
        type: String,
        set: function (password) {
            return hashSync(password, 10);
        }
    },
});

module.exports = mongoose.model('user', userSchema)