# #Tell the terminal what application to run
# export FLASK_APP=main.py
# #Tell the terminal what application to run for windows
# set FLASK_APP=main.py
# #Start debug mode
# export FLASK_DEBUG=1
# #Run the application
# flask run

# https://www.geeksforgeeks.org/retrieving-html-from-data-using-flask/
# https://roytuts.com/how-to-download-file-using-python-flask/
# https://stackoverflow.com/questions/22259847/application-not-picking-up-css-file-flask-python

from flask import Flask, request, render_template, send_file, flash
import web_scraper

app = Flask(__name__)
app.secret_key = 'topsecret'


comic_url = ""
@app.route('/', methods=["GET", "POST"])
def getURL():
    if request.method == "POST":
        # get url name input from html form
        comic_url = request.form.get("url")

        # Handle input that doesn't have http schema
        if "https://" not in comic_url:
            flash("Not a valid URL")
            comic_url = -1

        if(comic_url != -1):
            # Create text
            text = web_scraper.scrape(comic_url)
            # Handle URL that throws exception
            if text != -1:
                # Create "reading_list.txt" CSV file
                CSV_FILE_NAME = web_scraper.create_text_file(text)

                # Create EXCEL file
                EXCEL_FILE_NAME = web_scraper.create_excel(CSV_FILE_NAME)

                # Set path name depending on which submit button pressed
                if(request.form.get("CSV")):
                    path = CSV_FILE_NAME
                elif(request.form.get("Excel")):
                    path = EXCEL_FILE_NAME
                
                # Flask will get file with path name and give it to the user
                return send_file(path, as_attachment=True)
    return render_template('index.html')


# # @app.route('/reading_list.txt')
# # def downloadFile():
#         path = "reading_list.txt"
#         return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run()