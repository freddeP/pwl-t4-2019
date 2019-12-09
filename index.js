const express = require("express");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

require("./pwless/pwl-routes")(app);

const port = process.env.PORT || 3456;
app.listen(port,()=>console.log("port "+port));