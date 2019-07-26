# Example-JS-Docker-Iothub-MongoDB

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message use Mongodb save it，we use docker package our application。

#### Download this repository

    git clone https://github.com/WISE-PaaS/example-js-docker-iothub/
    
#### Check our the service name in `index.js`

The service name need same as WISE-PaaS platform service name

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/service_list_service_name.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/service_list_service_name.PNG)

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/mongo_service_name_in_node.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/mongo_service_name_in_node.PNG)

![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/rabbitmq_service_name_in_node.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/rabbitmq_service_name_in_node.PNG)

#### Build docker image in local
 
    docker build -t {image name} .
    docker build -t example-js-docker-iot-mongo .

#### Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

    #docker tag {image name} {your account/dockerhub-resp name}
    docker tag example-js-docker-iot-mongo WISE-PaaS/example-js-docker-iot-mongo


#### Push it to docker hub

    #docker push {your account/dockerhub-resp name}
    docker push WISE-PaaS/example-js-docker-iot-mongo

#### Change **manifest.yml** Config

change `name` in **mainfest.yml** it is your application name

check the `Service Instance name` in **manifest.yml** and **wise-paas service list**
![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/service_list_instance_name.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/service_list_instance_name.PNG)
![https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/manifest.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub-mongodb/blob/master/source/manifest.PNG)

#### Use cf(cloud foundry) push to WISE-PaaS

    #cf push --docker-image {your account/dockerhub-resp}
    cf push WISE-PaaS/example-js-docker-iot-mongo
    

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
