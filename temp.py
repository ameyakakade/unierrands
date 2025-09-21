import sqlite3

conn = sqlite3.connect("data/users.db")
cursor = conn.cursor()

# Delete all users
cursor.execute("DELETE FROM users")

# Reset the auto-increment counter
cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")

conn.commit()
conn.close()

print("Users deleted and ID counter reset.")
