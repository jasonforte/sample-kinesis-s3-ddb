import boto3
import random
import time
import json
import signal
import uuid

READINGS = 100
STREAM_NAME = ''


def record_producer(sensor, experiment_id):
    return {"sensor": sensor, "reading_diff": random.random() * 100 - 50, "experiment_id": experiment_id}


def create_reading(experiment_id):
    return [
        {
            'Data': '{}\n'.format(json.dumps(record_producer(i, experiment_id))).encode(),
            'PartitionKey': experiment_id
        } for i in range(READINGS)
    ]


def main():
    kin = boto3.client('kinesis', 'eu-west-1')
    count = 0
    experiment_id = str(uuid.uuid4())
    print(f'Experiment ID: {experiment_id}')
    for _ in range(10):
        kin.put_records(
            StreamName=STREAM_NAME,
            Records=create_reading(experiment_id)
        )
        count += READINGS
        print(f'Processed {count} records')
        time.sleep(5)


if __name__ == '__main__':
    main()
