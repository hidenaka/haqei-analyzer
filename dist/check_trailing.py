with open('future_simulator.html', 'r') as f:
    content = f.read()
    
# Find module script
import re
match = re.search(r'<script type="module">(.*?)</script>', content, re.DOTALL)
if match:
    script = match.group(1)
    # Check the very end of the script
    print('Last 50 characters of module script:')
    print(repr(script[-50:]))
    print()
    print('Checking for trailing whitespace...')
    if script.endswith('\n'):
        print('Script ends with newline')
    if script.endswith(' '):
        print('Script ends with space')
    if script.rstrip() != script:
        print(f'Script has {len(script) - len(script.rstrip())} trailing whitespace characters')