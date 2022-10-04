// const jwt = require('jsonwebtoken');
const turf = require('@turf/turf');
const uid = require('rand-token').uid;
const Vectors = require('../model/vectorModel');
const {mappingClass, parseVectors, getClassName} = require('../helper/turf');


module.exports = {
    async createVector(req, res) {
        const newVector = new Vectors();
        newVector.uid = uid(7);
        newVector.name = req.body.name;
        newVector.description = req.body.description ? req.body.description : newVector.description;
        newVector.classId = req.body.classId;
        newVector.className = getClassName(req.body.classId);
        newVector.geometry = req.body.geometry;
        newVector.region = res.locals.region;
        newVector.owner = req.user;

        try {
            await newVector.save();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        } finally {
            return res.status(201).json({ newVector });
        }
    },
    async getVector(req, res) {
        // console.log("in");
        let vectorFilter = [];
        let ownerFilter = [];
        let regionFilter = [];
        let classNameFilter = [];
        let polygonFilter = [];
        if (req.query.vectorUid) {
            vectorFilter = [{ "uid": { $eq: req.query.vectorUid } }];
            // console.log("vectorFilter");
            // console.log(vectorFilter);
        } else if (req.query.ownerUid) {
            // console.log("ownerFilter");
            ownerFilter = [{ "owner.uid": { $eq: req.query.ownerUid } }];
        } else if (req.query.regionUid) {
            // console.log("regionUid");
            regionFilter = [{ "region.uid": { $eq: req.query.regionUid } }];
        } else if (req.query.className) {
            classNameFilter = [{ "className": { $eq: req.query.className } }];        
        }

        let getVector;
        let polygon;
        let area;
        let perimeter;
        let centerOfMass;
        try {
            getVector = await Vectors.aggregate([
                {
                    $lookup: {
                        from: "regions",
                        localField: "region",
                        foreignField: "_id",
                        as: "region"
                    }
                },
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
                    $unwind: "$region"
                },
                {

                    $match: {
                        $and: [
                            { uid: { $ne: null } },
                            ...vectorFilter,
                            ...ownerFilter,
                            ...regionFilter,
                            ...classNameFilter,
                            // ...polygonFilter
                        ]
                    }
                }
            ])

            // console.log(JSON.stringify(getVector));
            // console.log(getVector[0].geometry.coordinates);
            if (getVector[0].geometry.coordinates != '') {
                
                polygon = turf.polygon(getVector[0].geometry.coordinates);
                area = turf.area(polygon);
                perimeter = turf.length(polygon, {units: 'miles'});
                centerOfMass = turf.centerOfMass(polygon);
           } else {            
               return res.status(404).json({ message: "coordinates are not present" });
           }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        } finally {
            return res.status(200).json({ getVector, polygon, area, perimeter, centerOfMass });
        }
    },
    async updateVector(req, res) {
        // if (req.user.uid == res.locals.vector.owner.uid) {
            
            res.locals.vector.name = req.body.name ? req.body.name : res.locals.vector.name;
            res.locals.vector.description = req.body.description ? req.body.description : res.locals.region.description;
            res.locals.vector.classId = req.body.classId ? req.body.classId : res.locals.vector.classId;
            res.locals.vector.className = req.body.classId ? getClassName(req.body.classId) : res.locals.vector.className;
            res.locals.vector.geometry = req.body.geometry ? req.body.geometry : res.locals.vector.geometry;
        
            try {
                await res.locals.vector.save();
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(201).json({ updatedVector: res.locals.vector });
        
        // } else {
        //     return res.status(401).json({ mesage: "unauthorised access" });
        // }
    },
    async deleteVector(req, res) {
        if (req.user.uid == res.locals.vector.owner.uid) {
            try {
                await Vectors.deleteOne({ uid: res.locals.vector.uid });
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
        } else {
            return res.status(401).json({ mesage: "unauthorised access" });
        }
        return res.status(203).send();
    }
    
}