const mongoose = require('mongoose');
require('dotenv').config();

const database = async () => {
    try {
        // await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, { //compass
        await mongoose.connect(process.env.MONGO_URI).then(() => {  //atlas
            console.log("database connected");
        })
        .catch((error) => {
            console.log(error);
        });

    } catch (error) {
        console.log(error);
    }
};
 

module.exports = {
    database
};