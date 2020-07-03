const express = require('express');
const path = require('path');

const router = express.Router();
const app = express();

app.use('/', router);
app.use(express.static(__dirname + '/templates'));

router.get('/', function(req,res) {
    res.sendFile(path.join(__dirname + '/templates/views/index.html'));
})

app.listen(4000, "0.0.0.0");

console.log("DX Server is running at Port 4000");