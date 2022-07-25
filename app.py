from flask import Flask, redirect, render_template, request
from y_dl import get_video


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/get_video', methods=["POST", "GET"])
def get_video_page():
    if (request.method == "GET"):
        url = request.args.get("url")

        info = get_video(url)

        return info
    else:
        redirect('/')


@app.route('/get_url')
def get_url_page():
    if (request.method == "GET"):
        url = request.args.get("url")
        quality = request.args.get("quality")

        dl_url = get_video(url, quality=quality)

        return dl_url
    else:
        redirect('/')

if (__name__ == "__main__"): 
    app.run(debug=True)