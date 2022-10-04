const uid = require('rand-token').uid;
const Regions = require('../model/regionModel');

module.exports = {
    async createRegion(req, res) {
        // {
        //     "name": "shubrata111",
        //     "description": "subrata",
        //     "location": {
        //       "type": "Point",
        //       "geometry": {
        //         "type": "Point",
        //         "coordinates": [ 
        //             -110.8571443, 32.4586858
        //         ]
        //       }
        //     }
        // }
        const newRegion = new Regions();
        newRegion.uid = uid(7);
        newRegion.name = req.body.name;
        newRegion.description = req.body.description;
        newRegion.geometry = req.body.geometry;
        newRegion.owner = req.user;
        try {
            await newRegion.save();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(201).json({ newRegion });
    },
    async updateRegion(req, res) {
        if (req.user.uid == res.locals.region.owner.uid) {
            res.locals.region.name = req.body.name ? req.body.name : res.locals.region.name;

            res.locals.region.description = req.body.description ? req.body.description : res.locals.region.description;

            res.locals.region.location = req.body.location ? req.body.location : res.locals.region.location;
            try {
                await res.locals.region.save();
            } catch (err) {
                return res.status(500).json({ message: err.message });
            } finally {
                return res.status(201).json({ updatedRegion: res.locals.region });
            }
        } else {
            return res.status(401).json({ mesage: "unAuthorised access" });
        }
    },
    async getRegion(req, res) {
        if(res.locals.region){
            return res.status(200).json(res.locals.region);
        }
    
        let regionFilter = [];
        let ownerFilter = [];
        if (req.query.regionUid) {
            // console.log("region  Uid");
            regionFilter = [{ "uid": { $eq: req.query.regionUid } }];
        }
        if (req.query.ownerUid) {
            // console.log("ownerUid");
            ownerFilter = [{ "owner.uid": { $eq: req.query.ownerUid } }];
        }
        let getRegion;
        try {
            getRegion = await Regions.aggregate(
                [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        $unwind: "$owner"
                        
                    },
                    {
    
                        $match: {
                            $and: [
                                { uid: { $ne: null } },
                                ...regionFilter,
                                ...ownerFilter
                            ]
                        }
    
                    }
                ]
            )
        } catch (err) {
            return res.status(500).json({ message: err.message });
        } finally {
            return res.status(200).json(getRegion);
        }
    },
    async deleteRegion(req, res) {
        // console.log(res.locals);
        if (req.user.uid == res.locals.region.owner.uid) {
            try {
                await Regions.deleteOne({ uid: res.locals.region.uid });
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
        } else {
            return res.status(401).json({ mesage: "unAuthorised access" });
        }
        return res.status(203).send();
    }
}
