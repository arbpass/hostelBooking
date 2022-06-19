const express = require("express");
const router = express.Router();
const Students = require("../models/studentsDB");
const Rooms = require("../models/roomDB");
const { get } = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: 'rzp_test_CMVdihSLEuPHnl',
    key_secret: 'eOwPULk2Y5GgEU075GTRH3ZV',
})

//mongoDB
// let url = "mongodb://localhost:27017/hostelBooking";
let url = "mongodb+srv://ayushrb:sunligh8@cluster0.k8yfxxm.mongodb.net/hostelBooking?retryWrites=true&w=majority";

//endpoints
router.get("/", (req, res) => {
    res.render("login");
})

router.get("/aboutus", (req, res) => {
    res.render("aboutus");
})

router.post("/booking", async (req, res) => {
    const registrationNo = req.body.registrationNo.toUpperCase();
    const getregno = await Students.findOne({ registration: registrationNo });

    if (getregno != null) {
        MongoClient.connect(url, function (err, client) {
            let db = client.db('hostelBooking'); //we are extracting data from DB then print it on screen
            db.collection("rooms").find({}).toArray(function (err, result) {
                let obj = result; //take data from DB in object and then loop it with HBS

                if (getregno.roomBooked == 0) {
                    res.render("booking", {
                        dynamicComment: obj, //this is an object & this will get print one by one in index.hbs
                        name: getregno.name,
                        registration: getregno.registration,
                        room: getregno.roomBooked,
                    });
                }
                else //if they already have a room, show them booking2 where they cant book
                {
                    res.render("booking2", {
                        dynamicComment: obj, //this is an object & this will get print one by one in index.hbs
                        name: getregno.name,
                        registration: getregno.registration,
                        room: getregno.roomBooked,
                    });
                }

                client.close();
            });
        });

    }
    else
        res.redirect("/");
})


router.post("/booknow", (req, res) => {
    let roomNo = req.query.roomNo;
    let hostel = req.query.hostel;
    let regno = req.query.regno;
    res.render("booknow", {
        roomNo: roomNo,
        hostel: hostel,
        regno: regno,
    })
})

router.post("/order", (req, res) => {
    let options = {
        amount: 1000000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    razorpay.orders.create(options, (err, order) => {
        //   console.log(order);
        res.json(order);
    })

})

router.post("/order-completed", (req, res) => {
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocumnet) => {
        let regno = req.query.regno;
        let roomNo = req.query.roomNo;
        let hostel = req.query.hostel;

        if (paymentDocumnet.status == 'captured') {
            //update students record
            MongoClient.connect(url, function (err, client) {
                let db = client.db('hostelBooking');
                db.collection("students").findOneAndUpdate({ registration: regno }, { $set: { roomBooked: parseInt(roomNo) } })
                if (err)
                    res.redirect("/");
            });

            //update rooms available
            MongoClient.connect(url, function (err, client) {
                let db = client.db('hostelBooking');
                db.collection("rooms").findOneAndUpdate({ roomNo: roomNo }, { $set: { status: false } })
                if (err)
                    res.redirect("/");
            });

            res.render("success", {
                regno: req.query.regno,
                roomNo: req.query.roomNo,
                hostel: req.query.hostel,
            });
        }
    })
})

module.exports = router;