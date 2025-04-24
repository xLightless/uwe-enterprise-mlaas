"""
This script detects the encoding of a file using the chardet library.

Run it directly in python to get the encoding of a file.
"""

import chardet


def detect_encoding(file_path):
    """Detects the encoding of a file and outputs the type."""
    with open(file_path, 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
    return result['encoding']


def convert_to_utf8(input_file, output_file, source_encoding):
    """Converts a file to UTF-8 encoding."""
    with open(input_file, 'r', encoding=source_encoding) as infile:
        content = infile.read()
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(content)


FILE_PATH = ''
OUTPUT_FILE = ''
encoding = detect_encoding(FILE_PATH)
print(f"Detected encoding: {encoding}")

if encoding != 'utf-8':
    convert_to_utf8(FILE_PATH, OUTPUT_FILE, encoding)
    print(f"File converted to UTF-8: {OUTPUT_FILE}")
else:
    print("File is already UTF-8 encoded.")
