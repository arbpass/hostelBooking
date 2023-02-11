//connect with DB and define schema
const mongoose= require("mongoose");
let url = "mongodb+srv://ayushrb:sunligh8@cluster0.k8yfxxm.mongodb.net/hostelBooking?retryWrites=true&w=majority";
// let url= "mongodb://localhost:27017/hostelBooking";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log("Students DB Connected Successfully");
}).catch((e)=> {
    console.log(e);
})

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    registration: {
        type: String,
        unique: true,
    }, 
    roomBooked: {
        type: Number,
    }
});

const Students= new mongoose.model("students", studentSchema);

module.exports= Students;