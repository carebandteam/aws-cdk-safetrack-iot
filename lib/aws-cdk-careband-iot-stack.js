"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCdkCarebandIotStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_apigatewayv2_1 = require("@aws-cdk/aws-apigatewayv2");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_apigatewayv2_2 = require("@aws-cdk/aws-apigatewayv2");
const aws_apigatewayv2_3 = require("@aws-cdk/aws-apigatewayv2");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const core_1 = require("@aws-cdk/core");
class AwsCdkCarebandIotStack extends cdk.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        // DynamoDB Table
        const tableName = 'safetrack-data';
        const dynamoDBTable = new aws_dynamodb_1.Table(this, 'SafeTrackDataTable', {
            tableName,
            partitionKey: { name: 'dev_eui', type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: 'server_time', type: aws_dynamodb_1.AttributeType.STRING },
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        // SafeTrackApiFunction
        const safeTrackApiLambda = new aws_lambda_1.Function(this, 'SafeTrackApiFunction', {
            code: aws_lambda_1.Code.fromAsset('./src'),
            functionName: 'safeTrackApiFunction',
            handler: 'api.handler',
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
        });
        // SafeTrackDataFunction
        const safeTrackDataLmabda = new aws_lambda_1.Function(this, 'SafeTrackDataFunction', {
            code: aws_lambda_1.Code.fromAsset('./src'),
            functionName: 'safeTrackDataFunction',
            handler: 'data.handler',
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
        });
        // SafeTrackApiProxyIntegration
        const safeTrackApiLambdaProxyIntegration = new aws_apigatewayv2_2.LambdaProxyIntegration({
            handler: safeTrackApiLambda,
        });
        // SafeTrackHttpApi
        const orderSafeTrackHttpApi = new aws_apigatewayv2_1.HttpApi(this, 'OrderSafeTrackHttpApi', {
            apiName: 'order-safetrack-lite',
        });
        // SafeTrackHttpApi Route
        orderSafeTrackHttpApi.addRoutes({
            integration: safeTrackApiLambdaProxyIntegration,
            methods: [aws_apigatewayv2_3.HttpMethod.ANY],
            path: '/',
        });
        //Grant ReadWrite access of DynamoDB Table to Lambda Functions
        dynamoDBTable.grantReadWriteData(safeTrackApiLambda);
        dynamoDBTable.grantReadWriteData(safeTrackDataLmabda);
        // new cdk.CfnOutput(this, 'HTTP API: ', { value : orderSafeTrackHttpApi.url });
        new cdk.CfnOutput(this, 'HTTP API Url', {
            value: (_a = orderSafeTrackHttpApi.url) !== null && _a !== void 0 ? _a : 'Something went wrong with the deploy'
        });
    }
}
exports.AwsCdkCarebandIotStack = AwsCdkCarebandIotStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWNkay1jYXJlYmFuZC1pb3Qtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtY2RrLWNhcmViYW5kLWlvdC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsZ0VBQW9EO0FBQ3BELG9EQUFnRjtBQUNoRixnRUFBbUU7QUFDbkUsZ0VBQXVEO0FBQ3ZELHdEQUE2RDtBQUM3RCx3Q0FBOEM7QUFFOUMsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCOztRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixpQkFBaUI7UUFFakIsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7UUFFbkMsTUFBTSxhQUFhLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUMxRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDN0QsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDNUQsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCx1QkFBdUI7UUFFdkIsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQzFFLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFDN0IsWUFBWSxFQUFFLHNCQUFzQjtZQUNwQyxPQUFPLEVBQUUsYUFBYTtZQUN0QixPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1NBQzdCLENBQUMsQ0FBQztRQUVILHdCQUF3QjtRQUV4QixNQUFNLG1CQUFtQixHQUFHLElBQUkscUJBQWMsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDNUUsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUM3QixZQUFZLEVBQUUsdUJBQXVCO1lBQ3JDLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsK0JBQStCO1FBRS9CLE1BQU0sa0NBQWtDLEdBQUcsSUFBSSx5Q0FBc0IsQ0FBQztZQUNwRSxPQUFPLEVBQUUsa0JBQWtCO1NBQzVCLENBQUMsQ0FBQztRQUVILG1CQUFtQjtRQUVuQixNQUFNLHFCQUFxQixHQUFHLElBQUksMEJBQU8sQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDdkUsT0FBTyxFQUFFLHNCQUFzQjtTQUNoQyxDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFFekIscUJBQXFCLENBQUMsU0FBUyxDQUFDO1lBQzlCLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0MsT0FBTyxFQUFFLENBQUMsNkJBQVUsQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7UUFFSCw4REFBOEQ7UUFFOUQsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFckQsYUFBYSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFdEQsZ0ZBQWdGO1FBRWhGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLEtBQUssUUFBRSxxQkFBcUIsQ0FBQyxHQUFHLG1DQUFJLHNDQUFzQztTQUMzRSxDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUFsRUQsd0RBa0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSHR0cEFwaSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5djInO1xuaW1wb3J0IHsgQ29kZSwgRnVuY3Rpb24gYXMgTGFtYmRhRnVuY3Rpb24sIFJ1bnRpbWUgfSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IExhbWJkYVByb3h5SW50ZWdyYXRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyJztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIFRhYmxlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEF3c0Nka0NhcmViYW5kSW90U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gRHluYW1vREIgVGFibGVcblxuICAgIGNvbnN0IHRhYmxlTmFtZSA9ICdzYWZldHJhY2stZGF0YSc7XG5cbiAgICBjb25zdCBkeW5hbW9EQlRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdTYWZlVHJhY2tEYXRhVGFibGUnLCB7XG4gICAgICB0YWJsZU5hbWUsXG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2Rldl9ldWknLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgc29ydEtleTogeyBuYW1lOiAnc2VydmVyX3RpbWUnLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgLy8gU2FmZVRyYWNrQXBpRnVuY3Rpb25cblxuICAgIGNvbnN0IHNhZmVUcmFja0FwaUxhbWJkYSA9IG5ldyBMYW1iZGFGdW5jdGlvbih0aGlzLCAnU2FmZVRyYWNrQXBpRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldCgnLi9zcmMnKSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ3NhZmVUcmFja0FwaUZ1bmN0aW9uJyxcbiAgICAgIGhhbmRsZXI6ICdhcGkuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xMl9YLFxuICAgIH0pO1xuXG4gICAgLy8gU2FmZVRyYWNrRGF0YUZ1bmN0aW9uXG5cbiAgICBjb25zdCBzYWZlVHJhY2tEYXRhTG1hYmRhID0gbmV3IExhbWJkYUZ1bmN0aW9uKHRoaXMsICdTYWZlVHJhY2tEYXRhRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldCgnLi9zcmMnKSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ3NhZmVUcmFja0RhdGFGdW5jdGlvbicsXG4gICAgICBoYW5kbGVyOiAnZGF0YS5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgfSk7XG5cbiAgICAvLyBTYWZlVHJhY2tBcGlQcm94eUludGVncmF0aW9uXG5cbiAgICBjb25zdCBzYWZlVHJhY2tBcGlMYW1iZGFQcm94eUludGVncmF0aW9uID0gbmV3IExhbWJkYVByb3h5SW50ZWdyYXRpb24oe1xuICAgICAgaGFuZGxlcjogc2FmZVRyYWNrQXBpTGFtYmRhLFxuICAgIH0pO1xuXG4gICAgLy8gU2FmZVRyYWNrSHR0cEFwaVxuXG4gICAgY29uc3Qgb3JkZXJTYWZlVHJhY2tIdHRwQXBpID0gbmV3IEh0dHBBcGkodGhpcywgJ09yZGVyU2FmZVRyYWNrSHR0cEFwaScsIHtcbiAgICAgIGFwaU5hbWU6ICdvcmRlci1zYWZldHJhY2stbGl0ZScsXG4gICAgfSk7XG5cbiAgICAvLyBTYWZlVHJhY2tIdHRwQXBpIFJvdXRlXG5cbiAgICBvcmRlclNhZmVUcmFja0h0dHBBcGkuYWRkUm91dGVzKHtcbiAgICAgIGludGVncmF0aW9uOiBzYWZlVHJhY2tBcGlMYW1iZGFQcm94eUludGVncmF0aW9uLFxuICAgICAgbWV0aG9kczogW0h0dHBNZXRob2QuQU5ZXSxcbiAgICAgIHBhdGg6ICcvJyxcbiAgICB9KTtcblxuICAgIC8vR3JhbnQgUmVhZFdyaXRlIGFjY2VzcyBvZiBEeW5hbW9EQiBUYWJsZSB0byBMYW1iZGEgRnVuY3Rpb25zXG5cbiAgICBkeW5hbW9EQlRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShzYWZlVHJhY2tBcGlMYW1iZGEpO1xuXG4gICAgZHluYW1vREJUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoc2FmZVRyYWNrRGF0YUxtYWJkYSk7XG5cbiAgICAvLyBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnSFRUUCBBUEk6ICcsIHsgdmFsdWUgOiBvcmRlclNhZmVUcmFja0h0dHBBcGkudXJsIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0hUVFAgQVBJIFVybCcsIHtcbiAgICAgIHZhbHVlOiBvcmRlclNhZmVUcmFja0h0dHBBcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBkZXBsb3knXG4gICAgfSk7XG4gICAgXG4gIH1cbn1cbiJdfQ==