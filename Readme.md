# Example-JS-Docker-Iothub-MongoDB

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message use Mongodb save it，we use docker package our application。

#### Environment Prepare

node.js(need include npm)

[https://nodejs.org/en/](https://nodejs.org/en/)

cf-cli

[https://docs.cloudfoundry.org/cf-cli/install-go-cli.html](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

docker

[https://www.docker.com/](https://www.docker.com/)

MongoDB && Robo 3T

https://www.mongodb.com/download-center/community
(MongoDB Server)

https://robomongo.org/download
(Robo 3T)

#### Download this repository

    git clone https://github.com/WISE-PaaS/example-js-docker-iothub/
    
#### Check our the service name in `index.js`

The service name need same as WISE-PaaS platform service name

![Imgur](https://i.imgur.com/6777rmg.png)

![Imgur](https://i.imgur.com/Q6W8Z0S.png)

![Imgur](https://i.imgur.com/5fMbEiX.png)

#### Build docker image in local
 
    docker build -t {image name} .
    docker build -t example-js-docker-iot-mongo .

#### Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

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

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/manifest.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/manifest.PNG)

#### Use cf(cloud foundry) push to WISE-PaaS

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iot-mongo
    

#### successful push

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successful.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successful.PNG)


Get application environment in WISE-PaaS

    cf env example-js-docker-iot-mongo > env.json



#### Edit the **publisher.py** `mqttUri` to mqtt=>uri you can find in env.json 

when you get it you need to change the host to  externalHosts

![https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/externalhost.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/externalhost.PNG)

* uri :"VCAP_SERVICES => p-rabbitmq => mqtt => uri"
* exnternalhost : "VCAP_SERVICES" => p-rabbitmq => externalHosts



open two terminal
    
    #cf logs {application name}
    cf logs example-js-docker-iothub 

.

    node publisher.js

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/send_data_successful.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/send_data_successful.PNG)

#### you can watch the row data use Robo 3T，and the config can find in WISE-PaaS Application Environment(WISE-PaaS/EnSaaS => application List => click application => environment)

Robo 3T create server(File => connect => Create)

* address => VCAP_SERVICES => mongodb-innoworks => 0 => external_host
* Database => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => database
* Username => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => username
* Password => VCAP_SERVICES => mongodb-innoworks => 0 => credentials => password

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successs_save.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/successs_save.PNG)
