from flask import Flask, render_template, url_for, jsonify, request

import os
import json

app = Flask(__name__)

app._static_folder = os.path.abspath("templates/static/")

@app.route('/')
def index():
    return render_template("views/index.html", message="Manual")
@app.route('/get/time')
def get_times():
    with open("templates/static/data.json") as data_file:
        data = json.load(data_file)
        print (data['total_seconds'])
        return jsonify({"result" : data['total_seconds']})

@app.route('/save/time')
def save_times():
    total_seconds = request.args.get('total_seconds', 0, type=int)
    dictionary =  {
        "total_seconds" : total_seconds
    }
    with open("templates/static/data.json", "w") as outfile:
        json.dump(dictionary, outfile)

    return jsonify({"result": "success"})

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=7000, debug=True)