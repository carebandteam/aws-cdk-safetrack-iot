const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllData = async (params, allData = []) => {
  const data = await dynamodb.query(params).promise();

  if (data['Items'].length > 0) {
    allData = [...allData, ...data['Items']];
  }

  if (data.LastEvaluatedKey) {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    return await getAllData(params, allData);
  } else {
    return allData;
  }
};

exports.handler = async(event) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ "Items": [] }),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    };

    const { device, startDate, endDate } = event.queryStringParameters;

    switch (event.requestContext.http.method) {
        case 'GET':
            
            const dateExp = startDate && endDate ? ` and server_time between :st and :et` : '';
            const exp = "dev_eui = :v1" + dateExp;

            const params = {
                ExpressionAttributeValues: {
                    ":v1": device,
                    ":st": startDate,
                    ":et": endDate
                },
                KeyConditionExpression: exp,
                TableName: "safetrack-data"
            };

            try {
                const data = await getAllData(params);
                response.body = JSON.stringify(data);
            }
            catch (error) {
                response.body = JSON.stringify({ "status": error });
                response.statusCode = 400;
                console.log('An error occured querying DynamoDB: ', error);
            }

            return response;
        default:
            return response;
    }
};
