from typing import Union
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from repository import Repository
from passlib.context import CryptContext
import stripe
import uuid

import postgress_handler

from domain import User as DomainUser

# Constants
SECRET_KEY = "your_secret_key"  # Replace with your own secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(root_path='/api/users')
stripe.api_key = "sk_test_51PI7DGP8ndbnsTFPqpi6ijLXpXAT2Rz8HyeRUy3lLY2agXTFt6nKAVqUeWVAeHkNKsEbOQzIF8iCwo58ryi4KTRo00QGKiRZrY"

repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.get('/')
def read_root():
    return {'Hello': 'Users'}


@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None):
    return {'item_id': item_id, 'q': q}

@app.get("/testdb")
async def read_item():
    with postgress_handler.connect_to_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT * FROM users""")
            return {'test': cur.fetchall()}


# Class for User model
class User(BaseModel):
    username: str

# Class for creating a new user
class UserCreate(BaseModel):
    username: str
    password: str

class UserWithID(BaseModel):
    username: str
    user_id: str

# Function to verify the password hash
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to get the password hash
def get_password_hash(password):
    return pwd_context.hash(password)

# Function to authenticate a user
def authenticate_user(username: str, password: str):
    user = repository.get_user_by_name(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return True

# Route for user registration
@app.post("/register/", response_model=User)
async def register(user: UserCreate):
    existing_user = repository.get_user_by_name(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    user_id = str(uuid.uuid4())
    domain_user = DomainUser(id=user_id, name=user.username, hashed_password = hashed_password)
    repository.add_user(domain_user)
    return User(username=user.username)

# Route for user login and generating access token
@app.post("/login/", response_model=UserWithID)
async def login(form_data: UserCreate):
    is_user = authenticate_user(form_data.username, form_data.password)
    if not is_user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    user = repository.get_user_by_name(form_data.username)
    return UserWithID(username=form_data.username, user_id=str(user.id))


# Stripe payment related endpoints
sessions = []


class PaymentData(BaseModel):
    login: str
    price_id: str = "price_1PI7aqP8ndbnsTFP2hkb9Pgd"
    quantity: int = 1
    room_url: str


@app.post("/create-checkout-session/")
async def create_checkout_session(payment_data: PaymentData):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': payment_data.price_id,
                'quantity': payment_data.quantity,
            }],
            mode='payment',
            success_url=payment_data.room_url,
            cancel_url=payment_data.room_url,
        )

        sessions.append({"session_id": session.id, "login": payment_data.login, "premium": False})

        return JSONResponse(status_code=200, content={"id": session.id, "checkout_url": session.url})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/stripe-webhook/")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = "whsec_28dac94d11a5ee2e1ad7d90b6ed183e67a1c91fab25cb86e326aab7acc31271e"

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_checkout_session(session)

    return JSONResponse(status_code=200, content={"message": "Success"})


async def handle_checkout_session(session):
    for record in sessions:
        if record["session_id"] == session.id:
            record["premium"] = True
            print(f"Payment was successful for {record['login']}! Status premium granted.")


@app.get("/sessions/")
async def get_sessions():
    return JSONResponse(status_code=200, content=sessions)


@app.get("/sessions/premium/{login}")
async def check_premium_status(login: str):
    for record in sessions:
        if record["login"] == login:
            return JSONResponse(status_code=200, content={"premium": record["premium"]})

    return JSONResponse(status_code=404, content={"message": "User not found"})
