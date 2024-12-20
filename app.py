from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
from mods.db import get_all_todos, get_every_todos, init_todo_table, make_new_todo, remove_todo, update_todo, add_todo_to_folder, delete_folder, get_all_folders 


app = Flask(__name__)

CORS(app=app)

@app.route('/folder/<string:foldername>')
def index(foldername='Wracker'):
    return render_template('index.html', foldername=foldername)
@app.route('/')
def redr():
    return redirect('/folder/Wracker')

@app.route('/get/todos/<string:foldername>', methods=['GET'])
def send_todos(foldername='*'):
    if foldername == '*':
        return jsonify(get_every_todos())
    else:
        return jsonify(get_all_todos(foldername))


@app.route('/get/folders', methods=['GET'])
def send_folders():

    return jsonify(get_all_folders())


@app.route('/create/todo', methods=['POST'])
def handle_post():
    data = request.get_json()
    print(data)
    make_new_todo(content=data['content'], time=data['time'], foldername=data['foldername'])
    return jsonify({"message": "Data received"}), 200

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True, port=8080)