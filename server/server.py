import bcrypt
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS 
import MySQLdb.cursors
import jwt
import datetime
import cred #credential file DO NOT push

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

@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart_items(user_ID):


if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)
