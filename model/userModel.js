const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const users = mongoose.model('users', UserSchema);
module.exports = users;