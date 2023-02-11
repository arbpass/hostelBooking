const express= require("express");
const app= express();
const hbs= require("hbs");
const router= require("./routes/routes");
const port= process.env.PORT || 3000;

//template engine
app.use(express.static("public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", router);


app.listen(port);