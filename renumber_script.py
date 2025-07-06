import re
import sys

def renumber_future_theme_map(file_path):
    """
    Reads the database.js file, finds the future_theme_map object,
    extracts all valid entries (numeric key + object value),
    and rewrites the object with sequential keys starting from 1,
    preserving comments and original formatting as much as possible.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}", file=sys.stderr)
        return

    start_marker = 'const future_theme_map = {'
    end_marker = '};'
    start_index = content.find(start_marker)
    end_index = content.rfind(end_marker, start_index)

    if start_index == -1 or end_index == -1:
        print("Error: Could not find the 'const future_theme_map = { ... };' block.", file=sys.stderr)
        return

    original_object_str = content[start_index : end_index + len(end_marker)]
    inner_content = original_object_str[len(start_marker):-len(end_marker)]

    entries_data = []
    current_pos = 0
    last_pos = 0

    # Find all top-level keys and their corresponding object values
    for match in re.finditer(r'(\d+)\s*:\s*({)', inner_content):
        key = match.group(1)
        
        # Find the end of the object
        start_brace_pos = match.end(2) -1
        brace_level = 1
        end_brace_pos = -1
        for i in range(start_brace_pos + 1, len(inner_content)):
            if inner_content[i] == '{':
                brace_level += 1
            elif inner_content[i] == '}':
                brace_level -= 1
                if brace_level == 0:
                    end_brace_pos = i
                    break
        
        if end_brace_pos != -1:
            # Extract the text from the end of the last entry to the start of this one (to preserve comments)
            leading_text = inner_content[last_pos:match.start(0)]
            value_text = inner_content[match.start(0):end_brace_pos + 1]
            entries_data.append((leading_text, value_text))
            last_pos = end_brace_pos + 1

    # Rebuild the inner content with new numbering
    new_inner_content = ""
    for i, (leading, entry) in enumerate(entries_data):
        new_key = i + 1
        # Replace the old key with the new key
        rebuilt_entry = re.sub(r'^\s*\d+', f'{new_key}', entry.strip(), count=1)
        new_inner_content += leading + rebuilt_entry + ','

    # Add any trailing text after the last entry
    new_inner_content += inner_content[last_pos:]

    # Remove the last comma if it exists before the closing brace
    if new_inner_content.strip().endswith(','):
        new_inner_content = new_inner_content.strip()[:-1]

    new_object_str = f"{start_marker}\n{new_inner_content}\n{end_marker}"
    new_file_content = content[:start_index] + new_object_str + content[end_index + len(end_marker):]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_file_content)

    print(f"Successfully renumbered {len(entries_data)} entries in {file_path}")

if __name__ == "__main__":
    file_to_fix = '/Users/nakanohideaki/Desktop/haqei-analyzer/functions/lib/database.js'
    renumber_future_theme_map(file_to_fix)
