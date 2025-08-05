import re
import json

with open("future_simulator.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract module script
match = re.search(r'<script type="module">(.*?)</script>', content, re.DOTALL)
if match:
    script = match.group(1)
    lines = script.split("\n")
    
    print(f"Module script has {len(lines)} lines")
    
    # Try to compile the script in chunks to find error location
    chunk_size = 1000
    for i in range(0, len(lines), chunk_size):
        chunk = "\n".join(lines[:i+chunk_size])
        try:
            compile(chunk, f"chunk_{i}", "exec")
            print(f"✓ Lines 1-{i+chunk_size} compile OK")
        except SyntaxError as e:
            print(f"✗ Syntax error found in lines 1-{i+chunk_size}")
            print(f"  Error: {e}")
            
            # Narrow down further
            if i > 0:
                for j in range(i, min(i+chunk_size, len(lines)), 100):
                    chunk = "\n".join(lines[:j])
                    try:
                        compile(chunk, f"chunk_{j}", "exec")
                    except SyntaxError as e:
                        print(f"  ✗ Error starts around line {j} in module script")
                        print(f"    Line content: {lines[j-1] if j > 0 else 'N/A'}")
                        break
            break
    else:
        print("No syntax errors found in Python compilation check")
        
    # Check for specific JavaScript issues
    print("\nChecking for JavaScript-specific issues...")
    
    # Look for unclosed template literals
    in_template = False
    template_start = 0
    for i, line in enumerate(lines):
        backtick_count = line.count('`')
        if backtick_count % 2 == 1:
            if not in_template:
                in_template = True
                template_start = i + 1
            else:
                in_template = False
    
    if in_template:
        print(f"⚠️  Unclosed template literal starting at line {template_start}")
    
    # Check for async/await issues
    async_count = len(re.findall(r'\basync\s+function|\basync\s*\(', script))
    await_count = len(re.findall(r'\bawait\s+', script))
    print(f"\nAsync functions: {async_count}, Await calls: {await_count}")