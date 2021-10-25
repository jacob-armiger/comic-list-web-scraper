#! python3
import requests, bs4, lxml

def scrape(url):
    # Gets url of reading order page and saves to page variable
    page = requests.get(url)

    # Parse HTML to find all <p> elements
    soup = bs4.BeautifulSoup(page.text, 'lxml')
    soup.prettify()
    text = soup.find_all('p')

    return text

def create_list(text):
    # This function writes all the data scraped from URL onto a text file. Then,
    # it stores each line in the text file into a list.

    # Creates/opens text file to write comic book list to
    file = open("reading_list.txt", 'w')

    # Loops through every <p> element and writes text to file. Also appends comma to
    # the end of each text element
    for t in text:
        file.write(t.text)
        file.write(",")
    # Close File
    file.close()


    # Opens text file to read from
    file = open("reading_list.txt", 'r')

    # Stores each line of file into comic_list
    comic_list = []
    while True:
        line = file.readline()
        comic_list.append(line.lstrip())
        if not line: break
    # Close File
    file.close()

    return comic_list

def clean(comic_list):
    # This function cleans up comic_list data and then overwrites reading_list.txt
    # with cleaned data.

    # Replaces new line character with a comma. This is needed to correctly
    # format all data entries to csv
    for index in range(len(comic_list)):
        comic_list[index] = comic_list[index].replace('\n',',')

    # Joins comic_list into one string
    comic_list_string = ''.join(comic_list)

    # Splits the string at every comma. Now almost all comic titles will be 
    # separated into individual elements into list.
    comic_list = comic_list_string.split(',')

    # Pass over five times due to skipping NEEDS FIX
    for num in range(15):
        for elem in comic_list:

            # Sets keep variable for entry
            for c in elem:
                if((c == '#') or (c == '(')):
                    keep = 'y'
                    break
                else:
                    keep = 'n'
            
            # Removes entry if:
            # keep is set to 'n' AND "here." is not found,
            # OR "First Appearance:" is found...
            if(((keep == 'n') and (elem.find("here.") == -1)) or (elem.find("First Appearance:") != -1) or (elem.find("everywhere. In his") != -1)):
                comic_list.remove(elem)

    # Re-join comic_list elements separated by a comma. This allows us to create
    # csv file.
    csv_formatted_string = ','.join(comic_list)

    # Opens file to overwrite with newly csv formatted data
    file = open("reading_list.txt", 'w')

    # Rewrites file with csv string
    file.write(csv_formatted_string)

    # Close File
    file.close()

# def main():
#     # URL to be scraped
#     REQUEST_URL = ''

#     # Get input from the user
#     print("Welcome! Copy and paste a reading order from \nhttps://comicbookreadingorders.com/ or click enter\n")
#     REQUEST_URL = input("URL: ");

#     # Use URL from the user or a default URL
#     if REQUEST_URL:
#         pass
#     elif not REQUEST_URL:
#         REQUEST_URL = 'https://comicbookreadingorders.com/dc/event-timeline/'

#     # Stores comic book titles listed on URL
#     text = scrape(REQUEST_URL)

#     # Writes text to a text file and creates a list from the entries in the text file
#     comic_list = create_list(text)

#     # Overwrites text file with more relevant and better formatted entries
#     clean(comic_list)

# if __name__ == "__main__":
#     main()






