#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { KinesisLambdaS3Stack } from '../lib/kinesis_lambda_s3-stack';

const app = new cdk.App();
new KinesisLambdaS3Stack(app, 'KinesisLambdaS3Stack');
