const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {

    // Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { port, payload, reported_at, dev_eui } = event;
    const server_time = new Date(reported_at);
    const payloadMsg = Buffer.from(payload, "base64").toString("hex");

    switch (port) {

        case '14':
            console.log("Processing Contact Tracing Data");

            const delay = parseInt(payloadMsg.substr(0, 2), 16);
            const msgreported_atstamp = parseInt(payloadMsg.substr(2, 8), 16);
            const repeatArray = payloadMsg.substr(10).match(/.{1,16}/g);

            for (let i = 0; i < repeatArray.length; i++) {
                const contactreported_atstamp = parseInt(repeatArray[i].substr(0, 8), 16);
                const msgUpContactCalc = msgreported_atstamp - contactreported_atstamp;
                const contactreported_atCalc = new Date(server_time.setSeconds(server_time.getSeconds() - delay - msgUpContactCalc));

                const params = {
                    Item: {
                        "dev_eui": dev_eui.toUpperCase(),
                        "server_time": server_time,
                        "delay": delay,
                        "msg_reported_atstamp": msgreported_atstamp,
                        "contact_reported_atstamp": contactreported_atstamp,
                        "contact_occurred_reported_atstamp": contactreported_atCalc.toISOString(),
                        "contact_id": repeatArray[i].substr(8, 4),
                        "contact_distance": repeatArray[i].substr(12, 4).toString() / 10
                    },
                    ReturnConsumedCapacity: "NONE",
                    TableName: "safetrack-data"
                };

                dynamodb.put(params).promise().then(result => {
                    console.log("Data loaded successfully");
                }).catch((error) => {
                    console.log("DynamoDB Error: ", error);
                });
            }
            break;
        default:
            break;
    }
};
