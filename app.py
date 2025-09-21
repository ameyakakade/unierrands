from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Counter variable
counter = 0;

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

@app.post("/receive-string")
async def receive_string(msg: Message):
    print("Received from JS:", msg.message)
    return {"response": f"You sent: {msg.message}"}

