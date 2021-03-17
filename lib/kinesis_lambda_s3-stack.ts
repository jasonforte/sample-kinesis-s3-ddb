import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
import { Code, Runtime, StartingPosition } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { KinesisStreamsToLambda } from '@aws-solutions-constructs/aws-kinesisstreams-lambda';

export class KinesisLambdaS3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'CaptureTable', { 
      tableName: 'CaptureData', 
      partitionKey: { name: 'id', type: AttributeType.STRING } 
    })

    const date = new Date()
    let version = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`
    version += `:${date.getUTCHours()}${date.getUTCMinutes()}`

    const kinesisStream = new KinesisStreamsToLambda(this, 'KinesisToLambdaPattern', {
      kinesisEventSourceProps: {
          startingPosition: StartingPosition.TRIM_HORIZON,
          batchSize: 1
      },
      lambdaFunctionProps: {
          runtime: Runtime.NODEJS_10_X,
          handler: 'index.handler',
          code: Code.fromAsset(`${__dirname}/lambda`),
          environment: { 'DDB_TABLE': table.tableName, 'VERSION': version }
      }
    });

    kinesisStream.lambdaFunction.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    )

    const role = new Role(this, 'FirehoseRole', { assumedBy: new ServicePrincipal('firehose.amazonaws.com') })
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'))

    new CfnDeliveryStream(this, 'StreamToS3', {
      deliveryStreamName: 'StreamToS3',
      s3DestinationConfiguration: { 
        bucketArn: 'arn:aws:s3:::fortejas-kinesis-business', 
        roleArn: role.roleArn,
        prefix: 'Test2'
      }
    })
    
  }
}
