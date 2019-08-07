const express = require("express");
const mqtt = require("mqtt"); // Using MQTT.js npm
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// Typically in the hosting environment for node application, there's an env variable called 'PORT'
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

//mongodb config

let vcap_services = JSON.parse(process.env.VCAP_SERVICES);
mongodb_service_name = "mongodb-innoworks";

let replicaSetName =
  vcap_services[mongodb_service_name][0].credentials.replicaSetName;
let db =
  vcap_services[mongodb_service_name][0].credentials.uri +
  "?replicaSet=" +
  replicaSetName;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to the MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB...", err));

const bookSchema = new mongoose.Schema(
  {
    date: Date,
    topic: String,
    data: Number
  },
  { versionKey: false }
);

const Bookmq = mongoose.model("Bookmq", bookSchema);

// Start Config
var config = {};
config.mqtt = {};

/** Modify this config ***/
// SYS
config.timeout = 120 * 1000;

config.mqtt.serviceName = "p-rabbitmq"; // 'p-rabbitmq'

if (process.env.VCAP_SERVICES != null) {
  console.log("Using VCAP_SERVICES");
  vcap_services = JSON.parse(process.env.VCAP_SERVICES);
}

// Parsing credentials from VCAP_SERVICES for binding service
if (vcap_services[config.mqtt.serviceName]) {
  console.log("Parsing " + config.mqtt.serviceName);
  config.mqtt.broker =
    "mqtt://" +
    vcap_services[config.mqtt.serviceName][0].credentials.protocols.mqtt.host;
  config.mqtt.username = vcap_services[
    config.mqtt.serviceName
  ][0].credentials.protocols.mqtt.username.trim();
  config.mqtt.password = vcap_services[
    config.mqtt.serviceName
  ][0].credentials.protocols.mqtt.password.trim();
  config.mqtt.port =
    vcap_services[config.mqtt.serviceName][0].credentials.protocols.mqtt.port;
}

config.mqtt.options = {
  broker: config.mqtt.broker,
  reconnectPeriod: 1000,
  port: config.mqtt.port,
  username: config.mqtt.username,
  password: config.mqtt.password
};

console.log(config.mqtt.options);

config.mqtt.topic = "/hello";
config.mqtt.retain = true; // MQTT Publish Retain

// Start MQTT
var client = mqtt.connect(config.mqtt.broker, config.mqtt.options);

client.on("connect", function() {
  client.subscribe(config.mqtt.topic);
  console.log("[MQTT]:", "Connected.");
});

client.on("message", function(topic, message) {
  console.log("[" + topic + "]:" + message.toString());

  var d = new Date();
  var n = d.getTime();
  console.log("n", n);
  console.log("topic", topic);
  console.log("data", message.toString());
  const bookmq = new Bookmq({
    date: n,
    topic: topic,
    data: message
  });

  bookmq.save();
});

client.on("error", function(err) {
  console.log(err);
});

client.on("close", function() {
  console.log("[MQTT]: close");
});

client.on("offline", function() {
  console.log("[MQTT]: offline");
});

//router
app.get("/", (req, res) => {
  res.send("Hello WISE-PaaS!");
});
app.get("/book", (req, res) => {
  Bookmq.find({}).then((err, books) => {
    if (err) res.send(err);
    else {
      res.json(books);
    }
  });
});

app.post("/api/book", (req, res) => {
  const bookmq = new Bookmq({
    date: Date.now(),
    topic: req.body.topic,
    data: req.body.data
  });

  bookmq.save();
  res.send(bookmq);
});
