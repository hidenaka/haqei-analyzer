import re

with open("future_simulator.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract module script
match = re.search(r'<script type="module">(.*?)</script>', content, re.DOTALL)
if match:
    script = match.group(1)
    
    # Count all bracket types
    parentheses_open = script.count("(")
    parentheses_close = script.count(")")
    brackets_open = script.count("[")
    brackets_close = script.count("]")
    braces_open = script.count("{")
    braces_close = script.count("}")
    
    print("Bracket Balance Check:")
    print(f"Parentheses: ( = {parentheses_open}, ) = {parentheses_close}, diff = {parentheses_open - parentheses_close}")
    print(f"Brackets:    [ = {brackets_open}, ] = {brackets_close}, diff = {brackets_open - brackets_close}")
    print(f"Braces:      {{ = {braces_open}, }} = {braces_close}, diff = {braces_open - braces_close}")
    
    # Track bracket levels through the script
    if braces_open != braces_close:
        print("\nAnalyzing brace imbalance...")
        lines = script.split("\n")
        brace_level = 0
        max_level = 0
        max_level_line = 0
        
        for i, line in enumerate(lines):
            opens = line.count("{")
            closes = line.count("}")
            brace_level += opens - closes
            
            if brace_level > max_level:
                max_level = brace_level
                max_level_line = i + 1
            
            # Print lines where level changes significantly
            if abs(opens - closes) > 2:
                print(f"  Line {i+1}: {opens} opens, {closes} closes, level={brace_level}")
                print(f"    Content: {line.strip()[:80]}...")
        
        print(f"\nMax brace level: {max_level} at line {max_level_line}")
        print(f"Final brace level: {brace_level}")
        
        # Show context around max level
        if max_level_line > 0:
            print(f"\nContext around max level (line {max_level_line}):")
            start = max(0, max_level_line - 3)
            end = min(len(lines), max_level_line + 2)
            for i in range(start, end):
                print(f"  {i+1}: {lines[i][:100]}")