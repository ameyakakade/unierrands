from fastapi import FastAPI, HTTPException, Request  # CHANGED: import Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
import hashlib
from starlette.middleware.sessions import SessionMiddleware  # ADDED

app = FastAPI()

# ADDED: Session middleware for cookies
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")  # ADDED

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Counter variable
counter = 0

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
    global counter
    counter += 1
    return {"value": counter}

class RequestModel(BaseModel):  # CHANGED: renamed to avoid conflict with FastAPI Request
    username: str
    password: str
class ErrandRequest(BaseModel):
    startLocation: str
# ---------------- LOGIN ----------------
@app.post("/api/login")
def login(req: RequestModel, request: Request):  # CHANGED: added 'request' parameter
    conn = sqlite3.connect("data/users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (req.username,))
    result = cursor.fetchone()
    conn.close()

    if not result or result[0] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # ADDED: store username in session cookie
    request.session["user"] = req.username  # ADDED

    return {"message": "Login successful", "username": req.username}

# ---------------- SIGNUP ----------------
@app.post("/api/signup")
def signup(req: RequestModel):
    conn = sqlite3.connect("data/users.db")
    cursor = conn.cursor()

    password_hashed = hash_password(req.password)

    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (req.username, password_hashed)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

    return {"message": "User created successfully"}

# ---------------- LOGOUT ----------------
@app.post("/api/logout")
def logout(request: Request):  # ADDED
    request.session.pop("user", None)  # ADDED: remove user from session
    return {"message": "Logged out successfully"}  # ADDED

# ---------------- CHECK LOGIN ----------------
@app.get("/api/me")
def me(request: Request):  # ADDED
    user = request.session.get("user")  # ADDED
    if not user:  # ADDED
        raise HTTPException(status_code=401, detail="Not logged in")  # ADDED
    return {"username": user}  # ADDED

@app.post("/api/errands")
def get_errands(req:ErrandRequest):
    startLoc=req.startLocation
    print(startLoc)
    conn = sqlite3.connect("data/users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM errands WHERE startLocation = ?", (startLoc,))
    errands = cursor.fetchall()
    conn.close()

    return [{"id": e[0], "user": e[1],"from":e[2],"to":e[3]} for e in errands]