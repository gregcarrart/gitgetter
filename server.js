var express = require("express"),
    app = express(),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 3000;

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(express.static(__dirname + '/public'));

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port, hostname);