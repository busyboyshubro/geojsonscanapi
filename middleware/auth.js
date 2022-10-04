const jwt = require('jsonwebtoken');
const Users = require('../model/userModel');

module.exports = {
    async authUser(req, res, next) {
        // console.log(headerToken); return;
        if(req.headers.authorization){ 
            let headerToken = req.headers.authorization;
            headerToken = headerToken.slice(7); 
            const decoded = jwt.verify(headerToken, process.env.SECRET);
            // console.log(decoded);
            try{
               req.user =  await Users.findOne({ uid : decoded.uid});
            } catch(err){
                return res.status(500).json({message: err.message});
            }
           
        }else{
            return res.status(400).json({message: "token missing"});
        }
        return next();
    }
};