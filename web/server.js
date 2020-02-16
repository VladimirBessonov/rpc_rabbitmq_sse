const app = require("./src/app");

app.listen(process.argv[2] || 3000, () => {
  console.log("running on port %s", process.argv[2]);
  console.log("--------------------------");
});
