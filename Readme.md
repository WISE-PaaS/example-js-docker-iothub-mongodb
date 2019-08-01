# Example-JS-Docker-Iothub-MongoDB

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message use Mongodb save it，we use docker package our application。

[cf-introduce](https://advantech.wistia.com/medias/ll0ov3ce9e)

[IotHub](https://advantech.wistia.com/medias/up3q2vxvn3)

## Environment Prepare

#### node.js(need include npm)

[node](https://nodejs.org/en/)

#### cf-cli

[cf-cli](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

Use to push application to WISE-PaaS，if you want to know more you can see this video

#### Docker

[docker](https://www.docker.com/)

Use to packaged our application

MongoDB && Robo 3T

[MongoDB-Server](https://www.mongodb.com/download-center/community)

[Robo-3T](https://robomongo.org/download)

#### Download this repository

    git clone https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb.git
    
## Login to WISE-PaaS

![Imgur](https://i.imgur.com/JNJmxFy.png)

    #cf login -skip-ssl-validation -a {api.domain_name}  -u "account" -p "password"

    cf login –skip-ssl-validation -a api.wise-paas.io -u xxxxx@advtech.com.tw -p xxxxxx

    #check the cf status
    cf target



#### Check our the service name in `index.js`

The service name need same as WISE-PaaS platform service name

![Imgur](https://i.imgur.com/6777rmg.png)

The `vcapServices` can get the application environment on WISE-PaaS，so we can get our service config to connect it。

![Imgur](https://i.imgur.com/Q6W8Z0S.png)

![Imgur](https://i.imgur.com/5fMbEiX.png)

Notice:You can add service instance by yourself

![Imgur](https://i.imgur.com/ajqSsn1.png)

#### Application Introduce

This code can get the WISE-PaaS MongoDB service instance environment and connect it。

```js
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

```

This code can connect the rabbitmq service
and send data to MongoDB service

```js

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
```

#### SSO(Single Sign On)

This is the [sso](https://advantech.wistia.com/medias/vay5uug5q6) applicaition，open **`templates/index.html`** and editor the `ssoUrl` to your application name，

If you don't want it，you can ignore it。
  
    #change this **`python-demo-try`** to your **application name**
    var ssoUrl = myUrl.replace('python-demo-try', 'portal-sso');

## Docker build application

#### Build docker image in local

    docker build -t {image name} .
    docker build -t example-js-docker-iot-mongo .

#### Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

![Imgur](https://i.imgur.com/SxiLcOH.png)

    #docker tag {image name} {your account/dockerhub-resp name}
    docker tag example-js-docker-iot-mongo WISE-PaaS/example-js-docker-iot-mongo

#### Push it to docker hub

    #login to the docker hub
    docker login

    #docker push {your account/dockerhub-resp name}
    docker push WISE-PaaS/example-js-docker-iot-mongo

#### Change **manifest.yml** Config

change `name` in **mainfest.yml** it is your application name

check the `Service Instance name` in **manifest.yml** and **wise-paas service list**

![Imgur](https://i.imgur.com/VVMcYO8.png)

![Imgur](https://i.imgur.com/9KeaeJ8.png)

#### Use cf(cloud foundry) push to WISE-PaaS

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iot-mongo

#### successful push

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successful.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successful.PNG)

Get application environment in WISE-PaaS

    cf env example-js-docker-iot-mongo > env.json

#### Edit the **publisher.py** `mqttUri` to mqtt=>uri you can find in env.json

when you get it you need to change the host to externalHosts

![Imgur](https://i.imgur.com/xErDczu.png)

- uri :"VCAP_SERVICES => p-rabbitmq => mqtt => uri"
- exnternalhost : "VCAP_SERVICES" => p-rabbitmq => externalHosts

open two terminal

#cf logs {application name}
cf logs example-js-docker-iothub

.

    node publisher.js

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/send_data_successful.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/send_data_successful.PNG)

#### you can watch the row data use Robo 3T，and the config can find in WISE-PaaS Application Environment(WISE-PaaS/EnSaaS => application List => click application => environment)

Robo 3T create server(File => connect => Create)

- address => VCAP_SERVICES => mongodb-innoworks => 0 => external_host
- Database => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => database
- Username => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => username
- Password => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => password

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successs_save.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successs_save.PNG)
