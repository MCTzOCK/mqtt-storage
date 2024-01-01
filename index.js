require("dotenv").config();
const mqtt = require("mqtt");
const app = require("express")();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const ROOT_DIR = path.resolve(__dirname, "data");

if (!fs.existsSync(ROOT_DIR)) {
  fs.mkdirSync(ROOT_DIR);
}

const url = "ws://" + process.env.MQTT_HOST + ":" + process.env.MQTT_PORT;

console.log(url);

const client = mqtt.connect(
  "ws://" + process.env.MQTT_HOST + ":" + process.env.MQTT_PORT
);

client.on("connect", () => {
  console.log("Connected");
  client.subscribe("#");
});

client.on("error", (err) => {
  console.log(err);
});

client.on("message", (topic, message) => {
  let o = [];
  if (!fs.existsSync(path.resolve(ROOT_DIR, topic + ".json"))) {
    fs.writeFileSync(path.resolve(ROOT_DIR, topic + ".json"), "[]");
  }
  o = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, topic + ".json")));

  o.push({
    timestamp: Date.now(),
    value: message.toString(),
  });

  fs.writeFileSync(path.resolve(ROOT_DIR, topic + ".json"), JSON.stringify(o));
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/:topic", (req, res) => {
  if (!fs.existsSync(path.resolve(ROOT_DIR, req.params.topic + ".json"))) {
    return res.json([]);
  }
  const o = JSON.parse(
    fs.readFileSync(path.resolve(ROOT_DIR, req.params.topic + ".json"))
  );
  return res.json(o);
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
