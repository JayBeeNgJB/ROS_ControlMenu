const express = require('express');
const path = require('path');

const router = express.Router();
const app = express();

app.use('/', router);
app.use(express.static(__dirname + '/templates'));

router.get('/', function(req,res) {
    res.sendFile(path.join(__dirname + '/templates/views/index.html'));
})

app.listen(process.env.port || 4000);

console.log("DX5 Server is running at Port 4000");