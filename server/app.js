const express = require("express");
const app = express();

app.use(express.static('../client/public'));

app.listen(3000);