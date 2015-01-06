var express = require("express"),
    app = express(),
    port     		= process.env.PORT || 8088;

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

console.log("Simple static server listening at " + port);
app.listen(port);