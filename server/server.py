import bcrypt
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from flask_cors import CORS 
import jwt
import datetime
import cred #credential file DO NOT push
from flask_mail import Mail, Message

#app instance
app = Flask(__name__)
app.secret_key = cred.secretkey

# Replace with your actual database credentials
app.config['SQLALCHEMY_DATABASE_URI'] = cred.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

app.config['MAIL_SERVER'] = cred.mail_server
app.config['MAIL_PORT'] = cred.mail_port
app.config['MAIL_USE_TLS'] = cred.mail_use_tls
app.config['MAIL_USERNAME'] = cred.mail_username
app.config['MAIL_PASSWORD'] = cred.mail_password
app.config['MAIL_DEFAULT_SENDER'] = cred.mail_username
mail = Mail(app)

CORS(app) #Cors policy so FE can fetch API 

# Start define a Model for SQLALchemy
class Menu(db.Model):
    __tablename__ = 'Menu'  # Match the existing table name
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    photo = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)

class User(db.Model):
    __tablename__ = 'User'  # Match the existing table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Orders(db.Model):
    __tablename__ = 'Orders'  # Match the existing table name
    id = db.Column(db.Integer, primary_key=True)
    user_ID = db.Column(db.String(100), nullable=False)
    order_date = db.Column(db.String(100), nullable=False)
    
class User_Past_Order(db.Model):
    __tablename__ = 'User_Past_Order'  # Match the existing table name
    user_ID = db.Column(db.Integer, primary_key=True)
    item_ID = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(100), nullable=False)
    order_ID = db.Column(db.String(100), nullable=False)
    
class User_Cart(db.Model):
    __tablename__ = 'User_Cart'  # Match the existing table name
    user_ID = db.Column(db.Integer, primary_key=True)
    item_ID = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(100), nullable=False)
# End define a Model for SQLALchemy

#Start Login mechanism
def encode_auth_token(user_id, user_email):
    try:
        payload = {
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=1),
            'iat': datetime.datetime.now(datetime.UTC),
            'ID': user_id,
            'email': user_email
        }
        return jwt.encode(payload, app.secret_key, algorithm='HS256')
    except Exception as e:
        return e

def decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, app.secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
#End Login mechanism

#Route
@app.route("/hello", methods=['GET'])
def home():
    return jsonify([{
        'name':"Kaisa",
        'age' :"20"
    },
    {
        'name':"Danh",
        'age' :"25"
    }])

@app.route('/menu', methods=['GET'])
def get_menu():
    menus = Menu.query.all()
    menu_list = [
        {
            "id": menu.id,
            "item_name": menu.item_name,
            "photo": menu.photo,
            "price": float(menu.price),  # Convert Decimal to float
            "category": menu.category,
            "description": menu.description
        }
        for menu in menus
    ]
    return jsonify(menu_list)
       
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
     # Check if the user already exists
    existing_user = User.query.filter_by(name=email).first()
    if existing_user:
        return jsonify({'status': 'fail', 'message': 'Account already exists!'}), 400
    
    # Create new user
    new_user = User(name=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'You have successfully registered!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(name=email).first()

    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            auth_token = encode_auth_token(user.id, email)
            if auth_token:
                return jsonify({'status': 'success', 'message': 'Login successful!', 'auth_token': auth_token, 'user_ID': user.id})
        else:
            return jsonify({'status': 'fail', 'message': 'Incorrect password!'}), 401
    else:
        return jsonify({'status': 'fail', 'message': 'Account not found!'}), 404

@app.route('/session', methods=['GET'])
def session_status():
    auth_token = request.headers.get('Authorization')
    print(f"Received Token: {auth_token}")
    
    if auth_token:
        payload = decode_auth_token(auth_token)
        print(f"Decoded Payload: {payload}")
        if isinstance(payload, str):
            return jsonify({'loggedIn': False, 'message': payload})
        else:
            return jsonify({'loggedIn': True, 'user_email': payload['email'], 'user_ID': payload['ID']})
    else:
        return jsonify({'loggedIn': False})

@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    user_ID = data.get('user_ID')
    item_ID = data.get('item_ID')
    quantity = data.get('quantity', 1)

    with db.engine.connect() as connection:
        # Check if the item already exists in the cart
        result = connection.execute(
            text('SELECT * FROM User_Cart WHERE user_ID = :user_ID AND item_ID = :item_ID'),
            {'user_ID': user_ID, 'item_ID': item_ID}
        ).fetchone()

        if result:
            # Update quantity if item exists
            connection.execute(
                text('UPDATE User_Cart SET quantity = quantity + :quantity WHERE user_ID = :user_ID AND item_ID = :item_ID'),
                {'quantity': quantity, 'user_ID': user_ID, 'item_ID': item_ID}
            )
        else:
            # Insert new item if it doesn't exist
            connection.execute(
                text('INSERT INTO User_Cart (user_ID, item_ID, quantity) VALUES (:user_ID, :item_ID, :quantity)'),
                {'user_ID': user_ID, 'item_ID': item_ID, 'quantity': quantity}
            )

        connection.commit()

    return jsonify({'status': 'success', 'message': 'Item added to cart!'})


@app.route('/cart/<int:user_ID>', methods=['GET'])
def get_cart_items(user_ID):
    # Join User_Cart and Menu using SQLAlchemy
    cart_items = db.session.query(
        User_Cart.item_ID.label('ID'),
        Menu.item_name,
        Menu.price,
        User_Cart.quantity
    ).join(Menu, User_Cart.item_ID == Menu.id).filter(User_Cart.user_ID == user_ID).all()

    # Convert the result into a list of dictionaries
    json_data = [
        {
            'ID': item.ID,
            'item_name': item.item_name,
            'price': item.price,
            'quantity': item.quantity
        }
        for item in cart_items
    ]

    return jsonify(json_data)

@app.route('/past-order/<int:user_ID>', methods=['GET'])
def get_past_order(user_ID):
    with db.engine.connect() as connection:
        result = connection.execute(
            text('''
                SELECT PO.item_ID AS ID, M.item_name, M.price, PO.quantity, O.order_date, PO.order_ID
                FROM User_Past_Order PO, Menu M, Orders O
                WHERE PO.item_ID = M.ID AND PO.user_ID = :user_ID AND PO.order_ID = O.ID
            '''), 
            {"user_ID": user_ID}
        )

        # Get column names from the result object
        column_names = result.keys()

        # Fetch all data as a list of dictionaries
        json_data = [dict(zip(column_names, row)) for row in result]

    return jsonify(json_data)

@app.route('/cart', methods=['DELETE'])
def delete_cart_item():
    user_ID = request.args.get('user_ID')
    item_ID = request.args.get('item_ID')

    print(f"Received user_ID: {user_ID}")
    print(f"Received item_ID: {item_ID}")

    with db.engine.connect() as connection:
        connection.execute(
            text('DELETE FROM User_Cart WHERE user_ID = :user_ID AND item_ID = :item_ID'),
            {"user_ID": user_ID, "item_ID": item_ID}
        )
        connection.commit()

    return jsonify({'status': 'success', 'message': 'Item removed from cart!'})

@app.route('/submit-order-pickup', methods=['POST'])
def submit_order_pickup():
    data = request.json
    cart_items = data.get('cartItems')
    pickup_details = data.get('pickupDetails')

    if not cart_items or len(cart_items) == 0:
        return jsonify({"status":"error","message":"Order invalid, your cart is empty!"})

    pickup_name = pickup_details.get('name')
    pickup_email = pickup_details.get('email')
    pickup_phone = pickup_details.get('phone')

    cart_details = "\n    ".join(
        [f"{item['quantity']} x {item['item_name']} at ${float(item['price']):.2f} each" for item in cart_items]
    )

    total_price = sum(item['quantity'] * float(item['price']) for item in cart_items)

    email_body = f"""
    Order Confirmation:

    Pickup Details:
    Name: {pickup_name}
    Email: {pickup_email}
    Phone: {pickup_phone}

    Items Ordered: 
    {cart_details}

    Total Price: ${total_price:.2f}
    """

    msg = Message(f"Pickup Order Confirmation - {pickup_name}", recipients = [cred.email_recipient])
    msg.body = email_body
    mail.send(msg)
    print(repr(cart_details))

    return jsonify({"status": "success", "message": "Order placed successfully!"})

@app.route('/submit-order-delivery', methods=['POST'])
def submit_order_delivery():
    data = request.json
    cart_items = data.get('cartItems')
    delivery_details = data.get('deliveryDetails')
    
    if not cart_items or len(cart_items) == 0:
        return jsonify({"status":"error","message":"Order invalid, your cart is empty!"})

    delivery_name = delivery_details.get('name')
    delivery_email = delivery_details.get('email')
    delivery_phone = delivery_details.get('phone')
    delivery_state = delivery_details.get('state')
    delivery_city = delivery_details.get('city')
    delivery_zip_code = delivery_details.get('zipCode')
    delivery_address = delivery_details.get('address')

    cart_details = "\n    ".join(
        [f"{item['quantity']} x {item['item_name']} at ${float(item['price']):.2f} each" for item in cart_items]
    )

    total_price = sum(item['quantity'] * float(item['price']) for item in cart_items)

    email_body = f"""
    Order Confirmation:

    Delivery Details:
    Name: {delivery_name}
    Email: {delivery_email}
    Phone: {delivery_phone}
    State: {delivery_state}
    City: {delivery_city}
    Zip Code: {delivery_zip_code}
    Address: {delivery_address}

    Items Ordered: 
    {cart_details}

    Total Price: ${total_price:.2f}
    """

    msg = Message(f"Delivery Order Confirmation - {delivery_name}", recipients = [cred.email_recipient])
    msg.body = email_body
    mail.send(msg)
    print(repr(cart_details))

    return jsonify({"status": "success", "message": "Order placed successfully!"})

@app.route('/fill-past-order', methods=['POST'])
def fill_past_order():
    data = request.json
    cart_items = data.get('cartItems')
    user_ID = data.get('user_ID')
    order_date = data.get('order_date')

    try:
        with db.engine.connect() as connection:
            # Insert into Orders table
            result = connection.execute(
                text('INSERT INTO Orders (user_ID, order_date) VALUES (:user_ID, :order_date)'),
                {"user_ID": user_ID, "order_date": order_date}
            )
            # Get the last inserted order_ID
            order_ID = result.lastrowid

            # Insert into User_Past_Order table for each item
            for item in cart_items:
                connection.execute(
                    text('''
                        INSERT INTO User_Past_Order (user_ID, item_ID, quantity, order_ID) 
                        VALUES (:user_ID, :item_ID, :quantity, :order_ID)
                    '''),
                    {"user_ID": user_ID, "item_ID": item['ID'], "quantity": item['quantity'], "order_ID": order_ID}
                )

            connection.commit()

        return jsonify({"status": "success", "message": "Order placed successfully!"})

    except Exception as e:
        print("Error processing order: ", str(e))
        return jsonify({"status": "error", "message": "There was an issue placing your order."})

@app.route('/cart-clear/<int:user_ID>', methods=['DELETE'])
def delete_cart(user_ID):
    with db.engine.connect() as connection:
        connection.execute(
            text('DELETE FROM User_Cart WHERE user_ID = :user_ID'),
            {"user_ID": user_ID}
        )
        connection.commit()
    return jsonify({'status': 'success', 'message': 'All items removed from cart!'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
