const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    geometry: {
        type: {
            type: String
        },
        coordinates: [Number]
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
});
RegionSchema.index({location : '2dsphere'});

RegionSchema.pre("findOne", function (next) {
    this.populate("owner");
    next();
});

const region = mongoose.model('regions', RegionSchema);

module.exports = region;