from typing import Union
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from repository import Repository
import stripe

import postgress_handler

app = FastAPI(root_path='/api/users')
stripe.api_key = "sk_test_51PI7DGP8ndbnsTFPqpi6ijLXpXAT2Rz8HyeRUy3lLY2agXTFt6nKAVqUeWVAeHkNKsEbOQzIF8iCwo58ryi4KTRo00QGKiRZrY"

repository = Repository()

postgress_handler.init_db()
postgress_handler.add_demo_data()


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
            cur.execute("""SELECT * FROM TestTable""")
            return {'test': cur.fetchall()}
        
# # checking premium account
# premium_accounts = ['premium']

# @app.get("/check-premium/{user_name}")
# async def check_premium(user_name: str):
#     if user_name in premium_accounts:
#         return {'premium': True}
#     else:
#         return {'premium': False}


# # adding new premium account
# # ta wiem z tym get pojechałem, ale sorry improwizuję
# @app.get("/stripe-success/{user_name}")
# async def add_premium(user_name: str):
#     premium_accounts.append(user_name)
#     return {'premium': True}


# Lista do przechowywania informacji o sesjach i użytkownikach
sessions = []


class PaymentData(BaseModel):
    login: str
    price_id: str = "price_1PI7aqP8ndbnsTFP2hkb9Pgd"
    quantity: int = 1
    room_url: str


@app.post("/create-checkout-session/")
async def create_checkout_session(payment_data: PaymentData):
    try:
        # Tworzenie sesji Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': payment_data.price_id,
                'quantity': payment_data.quantity,
            }],
            mode='payment',
            success_url= payment_data.room_url,
            cancel_url=payment_data.room_url,
        )

        # Zapisywanie informacji o sesji i loginu w liście
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
    # Aktualizowanie statusu premium użytkownika
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