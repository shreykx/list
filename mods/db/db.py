import sqlite3

conn = sqlite3.connect("data.db", check_same_thread=False)
cursor = conn.cursor()


"""
Todo Table

todo_id | content | time | foldername
_________________________________________
1       | "I am so|      |
        |proud of |12:04 | "favorites, work, office"
        |   this" |      |

"""

# function to create a new todo table

def init_todo_table():

    cursor.execute("""CREATE TABLE IF NOT EXISTS todos(
                   todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                   content TEXT NOT NULL,
                   time TEXT NOT NULL,
                   foldername TEXT NOT NULL       
    )""")
    conn.commit()
    return


# function to make a new todo
def make_new_todo(content, time, foldername):
    cursor.execute("INSERT INTO todos (content, time, foldername) VALUES (?, ?, ?)", (content, time, foldername))
    conn.commit()
    return

# function to remove an existing todo
def remove_todo(todo_id):
    cursor.execute("DELETE FROM todos WHERE todo_id = ?", (todo_id,))
    conn.commit()

# function to update a given todo
def update_todo(todo_id, content=None, time=None, foldername=None):
    if content:
        cursor.execute("UPDATE todos SET content = ? WHERE todo_id = ?", (content, todo_id))
    if time:
        cursor.execute("UPDATE todos SET time = ? WHERE todo_id = ?", (time, todo_id))
    if foldername:
        cursor.execute("UPDATE todos SET foldername = ? WHERE todo_id = ?", (foldername, todo_id))
    conn.commit()
    return

# function to add todo to a folder
def add_todo_to_folder(todo_id, foldername):
    cursor.execute("UPDATE todos SET foldername = ? WHERE todo_id = ?", (foldername, todo_id))
    conn.commit()
    return

# function to get all todos from a folder
def get_all_todos(foldername):
    cursor.execute("SELECT * FROM todos WHERE foldername = ?", (foldername,))
    return cursor.fetchall()

# function to delete folder and all the todos within
def delete_folder(foldername):
    cursor.execute("DELETE FROM todos WHERE foldername = ?", (foldername,))
    conn.commit()
    return

def get_every_todos():
    conn.row_factory = sqlite3.Row  # Ensure this is set before cursor creation

    cursor.execute("SELECT * FROM todos")
    rows = cursor.fetchall()  # This gives a list of Row objects (dictionary-like)
    print(rows)  # No need to convert them to dict again
    return rows
def get_all_folders():
    cursor.execute("SELECT DISTINCT foldername FROM todos")
    folders = cursor.fetchall()
    return [folder[0] for folder in folders]  # Extract folder names from the result