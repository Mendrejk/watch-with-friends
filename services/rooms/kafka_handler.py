import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from typing import Any

kafka_bootstrap_servers = os.environ.get('KAFKA_SERVER')
kafka_group_id = os.environ.get('KAFKA_GROUP_ID')

loop = asyncio.get_event_loop()


def kafka_serializer(value):
    return json.dumps(value).encode()


def encode_json(msg):
    to_load = msg.value.decode('utf-8')
    return json.loads(to_load)


async def send_one(topic: str, msg: Any):
    try:
        producer = AIOKafkaProducer(
            bootstrap_servers=kafka_bootstrap_servers
        )
        await producer.start()

        try:
            await producer.send_and_wait(topic, kafka_serializer(msg))
        finally:
            await producer.stop()

    except Exception as err:
        print(f'Some Kafka error: {err}')


async def consume(topic: str, on_message: callable):
    while True:
        try:
            consumer = AIOKafkaConsumer(
                topic,
                loop=loop,
                bootstrap_servers=kafka_bootstrap_servers,
                group_id=kafka_group_id,
            )

            await consumer.start()

            try:
                async for msg in consumer:
                    await on_message(encode_json(msg))

            finally:
                await consumer.stop()

        except Exception as err:
            print(f'Some Kafka error: {err}')
