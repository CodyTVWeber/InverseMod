#!/usr/bin/env python3
import os
import re
import sys

# Bible book name mappings (abbreviated to full names where needed)
BOOK_MAPPINGS = {
    '1kings': '1 Kings',
    '2kings': '2 Kings',
    '1corinthians': '1 Corinthians',
    '2corinthians': '2 Corinthians',
    '1timothy': '1 Timothy',
    '2timothy': '2 Timothy',
    '1john': '1 John',
    '2john': '2 John',
    '3john': '3 John',
    '1peter': '1 Peter',
    '2peter': '2 Peter',
    '1thessalonians': '1 Thessalonians',
    '2thessalonians': '2 Thessalonians',
}

def normalize_book_name(book):
    """Normalize book name to title case and handle abbreviations"""
    book = book.lower().strip()

    # Handle numbered books
    if book in BOOK_MAPPINGS:
        return BOOK_MAPPINGS[book]

    # Title case and handle special cases
    if book.startswith(('1 ', '2 ', '3 ')):
        parts = book.split(' ', 1)
        return f"{parts[0]} {parts[1].title()}"
    else:
        return book.title()

def extract_bible_reference(filename):
    """Extract Bible book and chapter from filename"""
    # Common patterns for Bible references
    patterns = [
        # Psalm/John/Genesis followed by number
        r'\b(Psalm|Psalms|John|Matthew|Mark|Luke|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Proverbs|Ecclesiastes|Song of Solomon|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)\s+(\d+)(?=\D|$)',
        # Book with chapter_verse format
        r'\b([12]?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)[_:](\d+(?:[–\-]\d+)?)',
        # Simple book chapter format
        r'\b([12]?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?=\D|$)',
    ]

    for pattern in patterns:
        matches = re.findall(pattern, filename, re.IGNORECASE)
        if matches:
            for match in matches:
                if len(match) == 2:  # Book and chapter
                    book, chapter = match
                    return normalize_book_name(book), chapter
                elif len(match) == 3:  # Book, chapter, verse
                    book, chapter, verse = match
                    return normalize_book_name(book), chapter

    return None, None

def clean_filename(filename):
    """Remove Bible reference from filename for the 'other parts'"""
    # Remove common Bible reference patterns
    patterns_to_remove = [
        r'\s*\|\s*[A-Za-z\s\d_:\-–]+(?:\d+[_\-\–]\d+)*',  # | Psalm 90 format
        r'\s*\([^)]*[A-Za-z\s\d_:\-–]+(?:\d+[_\-\–]\d+)*\)',  # (Psalm 90) format
        r'\s*[–\-]\s*(?:A\s+)?(?:Blues\s+)?(?:Song\s+)?(?:Inspired\s+by\s+)?[A-Za-z\s\d_:\-–]+(?:\d+[_\-\–]\d+)*',  # - Psalm 90 format
        r'\s*：\s*[A-Za-z\s\d_:\-–]+(?:\d+[_\-\–]\d+)*',  # : Psalm 90 format
        r'\s*｜\s*[A-Za-z\s\d_:\-–]+(?:\d+[_\-\–]\d+)*',  # ｜ Psalm 90 format
    ]

    cleaned = filename
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)

    # Clean up extra spaces and punctuation
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = re.sub(r'\s*-\s*$', '', cleaned)  # Remove trailing -
    cleaned = re.sub(r'^\s*-\s*', '', cleaned)  # Remove leading -

    return cleaned.strip()

def rename_file(directory, old_name, new_name):
    """Rename a file safely"""
    old_path = os.path.join(directory, old_name)
    new_path = os.path.join(directory, new_name)

    if old_path == new_path:
        return False

    if os.path.exists(new_path):
        print(f"Warning: {new_path} already exists, skipping")
        return False

    try:
        os.rename(old_path, new_path)
        print(f"Renamed: {old_name} -> {new_name}")
        return True
    except Exception as e:
        print(f"Error renaming {old_name}: {e}")
        return False

def main():
    directory = "~/Downloads/DavidSangTheBlues"

    # Expand user path
    directory = os.path.expanduser(directory)

    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist")
        return

    # Get all .opus files
    files = [f for f in os.listdir(directory) if f.endswith('.opus')]

    renamed_count = 0

    for filename in files:
        # Extract Bible reference
        book, chapter = extract_bible_reference(filename)

        if book and chapter:
            # Clean the filename to get other parts
            other_parts = clean_filename(filename.replace('.opus', ''))

            # Remove the Bible reference from other_parts if it's still there
            other_parts = re.sub(r'\b' + re.escape(book) + r'\s+' + re.escape(chapter) + r'\b', '',
                               other_parts, flags=re.IGNORECASE)
            other_parts = re.sub(r'\b' + re.escape(book.split()[-1]) + r'\s+' + re.escape(chapter) + r'\b', '',
                               other_parts, flags=re.IGNORECASE)

            other_parts = other_parts.strip()

            # Create new filename
            if other_parts:
                new_name = f"{book} {chapter} - {other_parts}.opus"
            else:
                new_name = f"{book} {chapter}.opus"

            if rename_file(directory, filename, new_name):
                renamed_count += 1
        else:
            print(f"Could not parse Bible reference from: {filename}")

    print(f"\nRenamed {renamed_count} files successfully")

if __name__ == "__main__":
    main()

