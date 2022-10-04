const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VectorSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    classID: Number,
    className: String,
    geometry: {
        type: {
            type: String
        },
        coordinates: [[[Number]]]
    },
    region: {
        type: mongoose.Types.ObjectId,
        ref: "region"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
});

VectorSchema.pre("findOne", function (next) {
    this.populate("owner");
    next();
});

const vector = mongoose.model("vector", VectorSchema);
module.exports = vector;