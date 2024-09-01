import bcrypt
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS 
import MySQLdb.cursors
import jwt
import datetime
import cred #credential file DO NOT push
from flask_mail import Mail, Message

#app instance
app = Flask(__name__)
app.secret_key = cred.secretkey
CORS(app) #Cors policy so FE can fetch API 

#DB connector
app.config['MYSQL_HOST'] = cred.host
app.config['MYSQL_PORT'] = cred.port
app.config['MYSQL_USER'] = cred.user
app.config['MYSQL_PASSWORD'] = cred.password
app.config['MYSQL_DB'] = cred.db
mysql = MySQL(app)

app.config['MAIL_SERVER'] = cred.mail_server
app.config['MAIL_PORT'] = cred.mail_port
app.config['MAIL_USE_TLS'] = cred.mail_use_tls
app.config['MAIL_USERNAME'] = cred.mail_username
app.config['MAIL_PASSWORD'] = cred.mail_password
app.config['MAIL_DEFAULT_SENDER'] = cred.mail_username
mail = Mail(app)

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
       
@app.route("/test", methods=['GET'])
def testSQL():
    #Creating a connection cursor
    cursor = mysql.connection.cursor()
    
    #Executing SQL Statements
    cursor.execute("SELECT * FROM students")
    column_names=[x[0] for x in cursor.description] # Get columns name
    data = cursor.fetchall()
    cursor.close()
    
    json_data = []
    for result in data:
        json_data.append(dict(zip(column_names,result)))
    return jsonify(json_data)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['email']
    password = data['password']

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM User WHERE name = %s', (name,))
    account = cursor.fetchone()
    if account:
        cursor.close()
        return jsonify({'status': 'fail', 'message': 'Account already exists!'})
    else:
        cursor.execute('INSERT INTO User (name, password) VALUES (%s, %s)', (name, hashed_password.decode('utf-8')))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'status': 'success', 'message': 'You have successfully registered!'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM User WHERE name = %s', (email,))
    account = cursor.fetchone()
    cursor.close()

    if account:
        stored_password = account[2]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            auth_token = encode_auth_token(account[0], email)
            if auth_token:
                return jsonify({'status': 'success', 'message': 'Login successful!', 'auth_token': auth_token, 'user_ID': account[0]})
        else:
            return jsonify({'status': 'fail', 'message': 'Incorrect password!'})
    else:
        return jsonify({'status': 'fail', 'message': 'Account not found!'})

#dont need?
@app.route('/logout', methods=['POST'])
def logout():
    # Clients can simply discard the token on logout
    return jsonify({'status': 'success', 'message': 'Logout successful!'})

@app.route('/session', methods=['GET'])
def session_status():
    auth_token = request.headers.get('Authorization')
    if auth_token:
        payload = decode_auth_token(auth_token)
        if isinstance(payload, str):
            return jsonify({'loggedIn': False, 'message': payload})
        else:
            return jsonify({'loggedIn': True, 'user_email': payload['email'], 'user_ID': payload['ID']})
    else:
        return jsonify({'loggedIn': False})
    
@app.route('/menu', methods=['GET'])
def get_menu_items():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Menu')
    column_names = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    cursor.close()

    json_data = []
    for result in data:
        json_data.append(dict(zip(column_names, result)))

    return jsonify(json_data)

@app.route('/cart', methods = ['POST'])
def add_to_cart():
    data = request.json
    user_ID = data.get('user_ID')
    item_ID = data.get('item_ID')
    quantity = data.get('quantity', 1)

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM User_Cart WHERE user_ID = %s AND item_ID = %s', (user_ID, item_ID))
    existing_item = cursor.fetchone()

    if existing_item:
        cursor.execute(
            'UPDATE User_Cart SET quantity = quantity + %s WHERE user_ID = %s and item_ID = %s',
            (quantity, user_ID, item_ID)
        )
    else:
        cursor.execute(
            'INSERT INTO User_Cart (user_ID, item_ID, quantity) VALUES (%s, %s, %s)',
            (user_ID, item_ID, quantity)
        )
    mysql.connection.commit()
    cursor.close()

    return jsonify({'status': 'success', 'message' : 'Item added to cart!'})

@app.route('/cart/<int:user_ID>', methods=['GET'])
def get_cart_items(user_ID):
    cursor = mysql.connection.cursor()
    cursor.execute('''
        SELECT UC.item_ID AS ID, M.item_name, M.price, UC.quantity
        FROM User_Cart UC, Menu M
        WHERE UC.item_ID = M.ID AND UC.user_ID = %s
    ''', (user_ID, ))
    column_names = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    cursor.close()

    json_data = []
    for result in data:
        json_data.append(dict(zip(column_names, result)))
    
    return jsonify(json_data)

@app.route('/cart', methods=['DELETE'])
def delete_cart_item():
    user_ID = request.args.get('user_ID')
    item_ID = request.args.get('item_ID')

    print(f"Received user_ID: {user_ID}")
    print(f"Received item_ID: {item_ID}")

    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM User_Cart WHERE user_ID = %s AND item_ID = %s', (user_ID, item_ID))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'status': 'success', 'message':'Item removed from cart!'})

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

@app.route('/cart-clear/<int:user_ID>', methods=['DELETE'])
def delete_cart(user_ID):
    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM User_Cart WHERE user_ID = %s', (user_ID,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'status':'success', 'message':'All items removed from cart!'})

if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)
