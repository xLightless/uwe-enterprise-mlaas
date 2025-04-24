"""
This script detects the encoding of a file using the chardet library.

Run it directly in python to get the encoding of a file.
"""

import chardet

def detect_encoding(file_path):
    with open(file_path, 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        return result['encoding']

def convert_to_utf8(input_file, output_file, source_encoding):
    with open(input_file, 'r', encoding=source_encoding) as infile:
        content = infile.read()
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(content)

# Example usage
file_path = 'C:\\Program Development\\UWE Bristol\\Year 3\\Enterprise AI Project\\project\\backend\\databases\\users\\Users.sql'
output_file = 'C:\\Program Development\\UWE Bristol\\Year 3\\Enterprise AI Project\\project\\backend\\databases\\users\\Users_utf8.sql'

# Detect encoding
encoding = detect_encoding(file_path)
print(f"Detected encoding: {encoding}")

# Convert to UTF-8 if necessary
if encoding != 'utf-8':
    convert_to_utf8(file_path, output_file, encoding)
    print(f"File converted to UTF-8: {output_file}")
else:
    print("File is already UTF-8 encoded.")