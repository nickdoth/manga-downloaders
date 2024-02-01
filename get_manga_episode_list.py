import argparse

import requests
from bs4 import BeautifulSoup
import re

parser = argparse.ArgumentParser()
parser.add_argument("--manga_id", help="the manga id", type=int, default=35937) # default: "葬送者芙莉莲"
args = parser.parse_args()
target_manga_id = args.manga_id

url = f"https://tw.manhuagui.com/comic/{target_manga_id}/" 
response = requests.get(url)
html_content = response.content
soup = BeautifulSoup(html_content, 'html.parser')
div_element = soup.find('div', class_='chapter-list cf mt10')
a_elements = div_element.find_all('a')

for i in a_elements:
    print(i)

a_elements.sort(key=lambda x: int(re.search(r"第(\d+)", x.get('title')).group(1)))

# write to text file
with open('to-download.txt', 'w') as f:
    for a in a_elements:
        f.write(a.get('href') + '\n')