# Comic List Reading Order Web Scraper
This project uses a web scraper to gather a comic book list from https://comicbookreadingorders.com/ and formats the data into a valid csv file.
You can upload the csv file to Excel and make a checklist of comics you've read.

## How-To
1. Inside `webscraper.py`, change `REQUEST_URL` to the website you would like to scrape:
```
REQUEST_URL = 'https://comicbookreadingorders.com/dc/characters/batman-reading-order/'
page = requests.get(REQUEST_URL)
```

2. Once you execute the program, it will create a file called `reading_list.txt` within the same directory as the executable. To use this file, open Excel and go to the data tab. From here you can click on the "From Text/CVS" button and open `reading_list.txt` inside excel.

### Notes
- You may need to transform data in Excel, or more specifically transpose it from horizontal to vertical. There are options for this when uploading the CSV file to excel.
- There is often excess text at the beginning or end of the CSV file. You can get rid of that by simply deleting the rows they are in within the Excel sheet.
