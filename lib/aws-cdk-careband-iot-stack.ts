import * as cdk from '@aws-cdk/core';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { RemovalPolicy } from '@aws-cdk/core';

export class AwsCdkCarebandIotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table

    const tableName = 'safetrack-data';

    const dynamoDBTable = new Table(this, 'SafeTrackDataTable', {
      tableName,
      partitionKey: { name: 'dev_eui', type: AttributeType.STRING },
      sortKey: { name: 'server_time', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // SafeTrackApiFunction

    const safeTrackApiLambda = new LambdaFunction(this, 'SafeTrackApiFunction', {
      code: Code.fromAsset('./src'),
      functionName: 'safeTrackApiFunction',
      handler: 'api.handler',
      runtime: Runtime.NODEJS_12_X,
    });

    // SafeTrackDataFunction

    const safeTrackDataLmabda = new LambdaFunction(this, 'SafeTrackDataFunction', {
      code: Code.fromAsset('./src'),
      functionName: 'safeTrackDataFunction',
      handler: 'data.handler',
      runtime: Runtime.NODEJS_12_X,
    });

    // SafeTrackApiProxyIntegration

    const safeTrackApiLambdaProxyIntegration = new LambdaProxyIntegration({
      handler: safeTrackApiLambda,
    });

    // SafeTrackHttpApi

    const orderSafeTrackHttpApi = new HttpApi(this, 'OrderSafeTrackHttpApi', {
      apiName: 'order-safetrack-lite',
    });

    // SafeTrackHttpApi Route

    orderSafeTrackHttpApi.addRoutes({
      integration: safeTrackApiLambdaProxyIntegration,
      methods: [HttpMethod.ANY],
      path: '/',
    });

    //Grant ReadWrite access of DynamoDB Table to Lambda Functions

    dynamoDBTable.grantReadWriteData(safeTrackApiLambda);

    dynamoDBTable.grantReadWriteData(safeTrackDataLmabda);

  }
}
