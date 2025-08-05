import re

with open('future_simulator.html', 'r') as f:
    content = f.read()

# モジュールスクリプト全体を抽出
match = re.search(r'<script type="module">(.*?)</script>', content, re.DOTALL)
if match:
    script = match.group(1)
    
    # より詳細な括弧バランスチェック
    stack = []
    line_no = 1
    col_no = 1
    
    for i, char in enumerate(script):
        if char == '\n':
            line_no += 1
            col_no = 1
        else:
            col_no += 1
            
        if char in '({[':
            stack.append((char, line_no, col_no, i))
        elif char in ')}]':
            if not stack:
                print(f'Extra closing bracket {char} at line {line_no}, col {col_no}')
                # Show context
                start = max(0, i - 50)
                end = min(len(script), i + 50)
                context = script[start:end]
                print(f'Context: ...{context}...')
                break
            opener, open_line, open_col, open_pos = stack.pop()
            expected = {'(': ')', '{': '}', '[': ']'}
            if expected[opener] != char:
                print(f'Mismatched brackets: {opener} at line {open_line} matched with {char} at line {line_no}')
                break
    
    if stack:
        print(f'\nUnclosed brackets:')
        for opener, line, col, pos in stack[-5:]:  # Show last 5
            print(f'  {opener} at line {line}, col {col}')
            # Show context
            start = max(0, pos - 20)
            end = min(len(script), pos + 50)
            context = script[start:end].replace('\n', '\\n')
            print(f'    Context: {context}')