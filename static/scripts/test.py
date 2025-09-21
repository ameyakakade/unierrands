import sqlite3

# Connect to the database
conn = sqlite3.connect("data/users.db")
cursor = conn.cursor()

# The username you want to delete
username_to_delete = "asd"

# Delete the row(s)
cursor.execute("DELETE FROM users WHERE username = ?", (username_to_delete,))

# Commit the changes
conn.commit()

# Close the connection
conn.close()

print(f"Deleted user: {username_to_delete}")
