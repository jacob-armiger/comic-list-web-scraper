#! python3
import requests, bs4, lxml

# Gets url of reading order page and saves to page variable
REQUEST_URL = 'https://comicbookreadingorders.com/dc/characters/batman-reading-order/'
page = requests.get(REQUEST_URL)

# Parse HTML to find all <p> elements
soup = bs4.BeautifulSoup(page.text, 'lxml')
soup.prettify()
text = soup.find_all('p')



# Creates/opens text file to write to
file = open("reading_list.txt", 'w')

# Loops through every <p> element and writes text to file. Also appends comma to
# the end of each text element
for t in text:
    file.write(t.text)
    file.write(", ")

# Close File
file.close()


# Creates/opens text file to write to
file = open("reading_list.txt", 'r')

# Stores each line of file into comic_list
comic_list = []
while True:
    line = file.readline()
    comic_list.append(line)
    if not line: break

# Close File
file.close()



# Replaces new line character with a comma. This is needed to correctly
# format file to csv
for index in range(len(comic_list)):
    comic_list[index] = comic_list[index].replace('\n',',')

# Joins comic_list into one string, each entry separated by a comma
csv_formatted_string = ''.join(comic_list)

# Opens same file to overwrite with newly csv formatted data
file = open("reading_list.txt", 'w')

# Rewrites file with csv string
file.write(csv_formatted_string)

# Close File
file.close()