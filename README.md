# Comic List Reading Order Web Scraper
This project uses a web scraper to gather a comic book list from https://comicbookreadingorders.com/ and formats the data into a valid csv file.
You can upload the csv file to Excel and make a checklist of comics you've read.

## Goals
- Develop a no-hassle program to quickly put reading orders onto an excel file
- Learn and use good development practices
- Document learning

## How-To
1. Inside `webscraper.py`, change `REQUEST_URL` to the website you would like to scrape:
```
REQUEST_URL = 'https://comicbookreadingorders.com/dc/characters/batman-reading-order/'
page = requests.get(REQUEST_URL)
```

2. Once you execute the program, it will create a file called `reading_list.txt` within the same directory as the executable. To use this file, open Excel and go to the data tab. From here you can click on the "From Text/CVS" button and open `reading_list.txt` inside excel.

### Notes
- You may need to transform data in Excel, or more specifically transpose it from horizontal to vertical. There are options for this when uploading the CSV file to excel.
- There may be excess text at the beginning or end of the CSV file, but a text filter has been implemented to minimize this issue. However, if you still see this kind of text you can get rid of it by simply deleting the rows they are in within the Excel sheet.

### Links
Project Roadmap: https://www.notion.so/22b8dc0bab7f46c183e07cfa0e3ce44c?v=837177e6ad6145149178cc398942bd3d
Wiki: https://github.com/jacob-armiger/comic-list-web-scraper/wiki
