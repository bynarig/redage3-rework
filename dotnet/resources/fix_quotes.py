import re
import os
import glob
def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find words ending in " but not starting with " and not preceded by "
    # Regex explanation:
    # (?<!") : Not preceded by a quote
    # \b : Word boundary (so we don't insert quote in the middle of a string)
    # ([A-Za-z0-9_@]+) : The word characters
    # " : The trailing quote
    new_content = re.sub(r'(?<!")\b([A-Za-z0-9_@]+")', r'"\1', content)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
for root, _, files in os.walk('/Users/bynarig/dev/redage_v3/dotnet/resources/'):
    for file in files:
        if file.endswith('.cs'):
            process_file(os.path.join(root, file))
