import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as KinesisLambdaS3 from '../lib/kinesis_lambda_s3-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new KinesisLambdaS3.KinesisLambdaS3Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
