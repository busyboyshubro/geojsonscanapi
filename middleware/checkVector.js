const Vectors = require("../model/vectorModel");

module.exports = {
    
    async checkVector(req, res, next) {
        const vectorUid = req.params.vectorUid;
        let vector;
        try {
            vector = await Vectors.findOne({ uid: vectorUid });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
        if (vector) {
            res.locals.vector = vector;
        } else {
            return res.status(404).json({ message: "Vector not found" });
        }
        return next();
    }

}