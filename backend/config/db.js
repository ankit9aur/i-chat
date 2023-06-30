const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
        const conn =await mongoose.connect("mongodb+srv://ankit:ankit@cluster0.oghigtf.mongodb.net/",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }
    catch(error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;