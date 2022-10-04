const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uid = require('rand-token').uid;
const turf = require('@turf/turf');
const Users = require('../model/userModel');
const SECRECT_KEY = process.env.SECRET;

module.exports = {
    async userCreate(req, res) {
        const { userName, password } = req.body;
        if (!userName && !password) return res.status(400).json({ message: "Please provide email and password" })
        let newUser;
        let hashPassword = bcrypt.hashSync(password, 7);            
        try {
            newUser = new Users({
                userName: userName,
                password: hashPassword,
                uid: uid(7)
            });

            await newUser.save();  //store data        
        } catch (error) {
            return res.status(500).json({ message: error.message });            
        } finally {
            return res.status(200).json({ message: "User created" });
        }
    },
    async userLogin(req, res) {
        const { userName, password } = req.body;
        if (!userName && !password) return res.status(400).json({ message: "Please provide email and password" })
        let user;
        let token;
        try {
            user = await Users.findOne({ userName: userName });
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    //to authorisation
                    token = jwt.sign({ userName: user.userName, uid: user.uid}, SECRECT_KEY, { expiresIn: process.env.JWT_EXP });
                } else {
                    return res.status(401).json({ message: "Incorrect password" });
                }
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        } finally {
            return res.status(201).json({ message: "User loggedin", token: token });
        }
    },
    async test(req, res) {
        // console.log("test");
        // var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
        var polygon = turf.polygon([
            [
                [
                    72.82476425170898,
                    19.43243859897176
                ],
                [
                    72.81051635742188,
                    19.424506158260414
                ],
                [
                    72.81944274902344,
                    19.41657333025628
                ],
                [
                    72.84072875976562,
                    19.422725353028667
                ],
                [
                    72.82476425170898,
                    19.43243859897176
                ]
            ]
        ]);
        var area = turf.area(polygon);
        var perimeter = turf.length(polygon, {units: 'miles'});
        var centerOfMass = turf.centerOfMass(polygon);
        return res.status(200).json({ area, perimeter, centerOfMass});
    }
}