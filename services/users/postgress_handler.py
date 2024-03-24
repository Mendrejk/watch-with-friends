import os
import psycopg2
import psycopg2.extras
import uuid

psycopg2.extras.register_uuid()

postgress_password = os.environ.get('POSTGRES_PASSWORD')
postgress_user = os.environ.get('POSTGRES_USER')
postgress_host = os.environ.get('POSTGRES_HOST')
postgres_port = os.environ.get('POSTGRES_PORT')
postgres_database = os.environ.get('POSTGRES_DB')

def connect_to_db():
    return psycopg2.connect(database=postgres_database,
                          host=postgress_host,
                          user=postgress_user,
                          password=postgress_password,
                          port=postgres_port)

def init_db():
    with connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""CREATE TABLE IF NOT EXISTS TestTable(
            id uuid PRIMARY KEY,
            person VARCHAR(255) NOT NULL,
            not_person VARCHAR(255) NOT NULL)""")

def add_demo_data():
    with psycopg2.connect(database=postgres_database,
                          host=postgress_host,
                          user=postgress_user,
                          password=postgress_password,
                          port=postgres_port) as conn:
        with conn.cursor() as cur:
            id = uuid.uuid4()
            cur.execute("INSERT INTO TestTable(id, person, not_person) VALUES (%s, 'Seba', 'tutturu')", (id,))