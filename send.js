const mqtt = require('mqtt');

//const mqttUri = 'mqtt://8913be21-1a18-482f-8def-1e6edfccca2b%3A74345237-d29e-43bc-9ccf-bf4cd86811c0:UAiKHPSybKvuhY1I0gkuhXTa4@40.81.26.31:1883'
//const mqttUri = 'mqtt://aa184ab6-92ad-4d5d-ba4a-dce8284f8dd8%3A05eccc2f-13fe-4bd2-9250-67b868fcf481:Lk6kDpgpLDkWGWyg5uIKTAC3b@40.81.26.31:1883'
const mqttUri = 'mqtt://d409dc8f-af4d-4d68-b586-3721df301816%3A28c17966-6340-4dcf-a345-b85d52420fd1:3KfQAwA3lsg9JuxIU3DNhTg6m@40.81.26.31:1883'
const client = mqtt.connect(mqttUri);

client.on('connect',(connack)=>{
    setInterval(()=>{
        publistMockTemp();
    },3000);

});

function publistMockTemp()
{
    const temp  =Math.floor((Math.random()* 7)+22);
    client.publish('/hello', temp.toString(), { qos: 2 }, (err, packet) => {
      if (!err) console.log('Data sent to /hello' + temp);
    });

    // client.publish('livingroom/temperature', temp.toString(), { qos: 2 }, (err, packet) => {
    //     if (!err) console.log('Data sent to livingroom/temperature -- ' + temp);
    // });
}