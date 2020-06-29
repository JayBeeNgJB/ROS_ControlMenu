from flask import Flask, render_template, url_for

import os

app = Flask(__name__)

app._static_folder = os.path.abspath("templates/static/")

@app.route('/')
def auto():
    return render_template("views/auto.html", message="Manual")

@app.route('/auto')
def manual():
    return render_template("views/manual.html", message="Auto")

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=7000, debug=True)