# Manga Downloaders

## Dependencies
- Node.js (above or equal v.16)
- Python3 
```plaintext
pip3 install requirement.txt
```

## How to use
### 1. Get the url of each episode of the manga 
Specify the manga id using argument
```plaintext
python3 get_manga_episode_list.py --manga_id <paste_id_here>
```
### 2. Download images of each episode of the manga 
```plaintext
node mhg.js
```
### 3. Generate PDF for each episode
Change `manga_name = "葬送者芙莉莲"` to the target manga name. 
```plaintext
python3 generate_manga_pdfs.py
```

