from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
import hashlib

app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Counter variable
counter = 0;

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


class Message(BaseModel):
    message: str

@app.get("/api/counter")  # GET route
async def get_counter():
    return {"value": counter}

@app.post("/api/counter/increment")
async def increment_counter():
    global counter   # tell Python we’re modifying the global variable
    counter += 1
    return {"value": counter}

class Request(BaseModel):
    username: str
    password: str

@app.post("/api/send_string")
def receive_string(req: Request):
    conn = sqlite3.connect("data/users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (req.username,))
    result = cursor.fetchone()
    conn.close()

    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if result[0] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "username": req.username}
