const Regions = require("../model/regionModel");

module.exports = {
    async checkRegion(req, res, next) {
        const regionUid = req.params.regionUid;
        // console.log("req.params",req.params);
        // console.log("regionUid",regionUid);
        let region;
        try {
            region = await Regions.findOne({ uid: regionUid });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
        if (region) {
            res.locals.region = region;
        } else {
            return res.status(404).json({ message: "Region not found" });
        }
        return next();
    }
}