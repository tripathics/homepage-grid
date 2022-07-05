from flask import Flask, render_template, request, redirect

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/posts")
def posts():
    return render_template("posts.html")

@app.route("/gallery")
def galary():
    return render_template("gallery.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        firstname = request.form.get('first-name')
        lastname = request.form.get('last-name')
        email = request.form.get('email')
        msg = request.form.get('msg')
        
        return redirect("/contact")
    else:
        return render_template("contact.html")
