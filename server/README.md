This is Bakery Backend that using Flask

## Getting Started

**1. Create a virtual environment**`env`

```bash
python3 -m venv env
```

**2. Activate the virtual environment**<br>
On macOS/Linux:

```bash
source env/bin/activate
```

On window:

```bash
env\Scripts\activate
```

**3. Install dependencies package with**`requirements.txt`

```bash
pip3 install -r requirements.txt
```

**4. Create a MySQL database and use** `Bakery_DB.dump`**file**

**5. Create a `cred.py` file**

```python
#SQLAlchemy
DB_URL = "mysql+pymysql://youruser:yourpassword@your_DB_URL/DB_name"
secretkey = "yoursecretkey"

#Flask_Mail
mail_server = 'smtp.gmail.com'
mail_port = 123
mail_use_tls = True
mail_username = 'youremail@email.com'
mail_password = 'yourmailpass'
email_recipient = 'youremail@email.com'
```

**6. Run application**

```bash
python3 server.py
```
