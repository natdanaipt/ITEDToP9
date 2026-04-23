const Service = require("node-windows").Service;

const svc = new Service({
  name: "KlaiTuengYang-API",
  description: "for KlaiTuengYang",
  script: "C:\\Users\\natha\\Documents\\Nine\\nine-core\\index.js",
});
svc.on("install", function () {
  svc.start();
});
svc.install();
