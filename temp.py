import sqlite3

conn = sqlite3.connect("data/users.db")
cursor = conn.cursor()

# Add new column
cursor.execute("""
ALTER TABLE errands
ADD COLUMN startLocation TEXT
""")

conn.commit()
conn.close()

print("Column 'due_date' added to errands table!")