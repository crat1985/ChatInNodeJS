const path = require("path");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates/base.html"));
  });
  app.get("/app", (req, res) => {
    res.sendFile(path.join(__dirname, "templates/app.html"));
  });
};
