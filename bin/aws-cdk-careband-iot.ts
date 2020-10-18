#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkCarebandIotStack } from '../lib/aws-cdk-careband-iot-stack';

const app = new cdk.App();
// new AwsCdkCarebandIotStack(app, 'AwsCdkCarebandIotStackWest2', {
//     env: { region: "us-west-2" },
// });

new AwsCdkCarebandIotStack(app, 'AwsCdkCarebandIotStackEast1', {
    env: { region: "us-east-1" },
});
