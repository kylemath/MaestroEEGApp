#!/usr/bin/env python
"""
Flask application that receives uploaded content from browser

"""
import sys
import os
import tempfile
import flask
# Python2
# import StringIO
from io import StringIO
from werkzeug.utils import secure_filename

# whitelist of file extensions
ALLOWED_EXTENSIONS = set(['csv'])

app = flask.Flask(__name__)

@app.errorhandler(OSError)
def handle_oserror(oserror):
    """ Flask framework hooks into this function is OSError not handled by routes """
    response = flask.jsonify({"message":StringIO(str(oserror)).getvalue()})
    response.status_code = 500
    return response

@app.route("/")
def entry_point():
    """ simple entry for test """
    return flask.render_template('index.html',  tempdir=tempfile.gettempdir())

@app.route('/upload_form')
def upload_form():
    """ show upload form with multiple scenarios """
    return flask.render_template('upload_form.html')

@app.route("/singleupload", methods=["POST", "PUT"])
def single_upload_chunked(filename=None):
    if "Content-Length" not in flask.request.headers:
        add_flash_message("did not sense Content-Length in headers")
        return flask.redirect(flask.url_for("upload_form"))

    #get file and save it
    uploaded_file = flask.request.files['file']
    if uploaded_file.filename != '':
        uploaded_file.save(os.path.join("./data", uploaded_file.filename))
    
    #return {"success" : True}
    response = flask.jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def add_flash_message(msg):
    """Provides message to end user in browser"""
    print(msg)
    flask.flash(msg)

# from console it is the standard '__main__', but from docker flask it is 'main'
if __name__ == "__main__" or __name__ == "main":

    # docker flask image
    if __name__ == "main":
        if not os.getenv("TEMP_DIR") is None:
            if os.path.isdir(os.getenv("TEMP_DIR")):
              print("Overriding tempdir for docker image")
              tempfile.tempdir = os.getenv("TEMP_DIR")
    print("tempdir: " + tempfile.gettempdir())
    app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

    # Below error if MAX_CONTENT_LENGTH is exceeded by upload
    # [error] 11#11: *1 readv() failed (104: Connection reset by peer) while reading upstream
    #app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB limit
    app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024 * 1024  # 2GB limit
    app.config['CHUNK_SIZE'] = 4096

    # secret key used for flask.flash messages
    app.secret_key = 'abc123'

    # docker flask uwsgi starts itself
    if __name__ == "__main__":
        port = int(os.getenv("PORT", 8080))
        app.run(host='0.0.0.0', port=port)
