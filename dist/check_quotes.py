import re

with open("future_simulator.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract module script
match = re.search(r'<script type="module">(.*?)</script>', content, re.DOTALL)
if match:
    script = match.group(1)
    
    # Check for unterminated strings
    single_quotes = script.count("'")
    double_quotes = script.count('"')
    backticks = script.count("`")
    
    print(f"Single quotes: {single_quotes} ({'odd' if single_quotes % 2 else 'even'})")
    print(f"Double quotes: {double_quotes} ({'odd' if double_quotes % 2 else 'even'})")
    print(f"Backticks: {backticks} ({'odd' if backticks % 2 else 'even'})")
    
    # Check last few lines
    lines = script.strip().split("\n")
    print(f"\nTotal lines in module script: {len(lines)}")
    print(f"\nLast 10 lines of module script:")
    for i, line in enumerate(lines[-10:]):
        print(f"  Line {len(lines)-10+i+1}: {line[:100]}")