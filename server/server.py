import bcrypt
from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS 
import MySQLdb.cursors
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

@app.route('/login', methods = ['POST'])
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
            return jsonify({'status':'success', 'message': 'Login successful!'})
        else:
            return jsonify({'status':'fail', 'message': 'Incorrect password!'})
    else:
        return jsonify({'status':'fail', 'message': 'Account not found!'})

if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)
    