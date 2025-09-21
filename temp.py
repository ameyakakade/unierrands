import sqlite3, hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

conn = sqlite3.connect("data/users.db")
cursor = conn.cursor()
cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)",
               ("tyler123", hash_password("mypassword")))
conn.commit()
conn.close()
