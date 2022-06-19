//connect with DB and define schema
const mongoose= require("mongoose");
let url = "mongodb+srv://ayushrb:sunligh8@cluster0.k8yfxxm.mongodb.net/hostelBooking?retryWrites=true&w=majority";
// let url= "mongodb://localhost:27017/hostelBooking";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("Rooms DB Connected Successfully");
}).catch((e)=> {
    console.log(e);
})

const hostelSchema = new mongoose.Schema({
    roomNo: {
        type: String,
        unique: true,
    },
    hostel: {
        type: String,
    },
    status: {
        type: Boolean,
    }, 
});

const Rooms= new mongoose.model("rooms", hostelSchema);

module.exports= Rooms;