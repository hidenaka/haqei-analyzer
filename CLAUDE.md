# Claude Code Configuration - HAQEI Project (Core)

## 🚨 VISUAL DEVELOPMENT RULES
**CRITICAL**: For HTML/CSS changes:
1. ALWAYS read existing styles first
2. ALWAYS use existing design tokens/variables
3. ALWAYS test with screenshots after changes
4. NEVER create duplicate CSS classes
5. NEVER use absolute positioning without reason

## 🚨 CRITICAL: CONCURRENT EXECUTION

**ABSOLUTE RULE**: ALL operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS:
1. **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
2. **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
3. **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
4. **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
5. **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

## 🚨 CRITICAL: TASK COMPLETION VERIFICATION

**MANDATORY RULE**: NEVER report task completion without MCP verification

### 🔴 COMPLETION VERIFICATION REQUIREMENTS:
1. **Implement First**: Complete all code/file changes
2. **MCP Testing**: Use playwright/browser automation to test user flows
3. **Behavior Validation**: Verify actual user-facing functionality works
4. **Screenshot Evidence**: Capture visual proof of working features
5. **Report Only After Verification**: Only report completion after MCP confirms functionality

### ⚠️ FORBIDDEN COMPLETION PATTERNS:
- ❌ "Implementation complete - please verify"
- ❌ "Changes made - ready for testing"  
- ❌ "Feature implemented - needs user confirmation"

### ✅ REQUIRED COMPLETION PATTERN:
- ✅ "Feature verified via MCP - user flow confirmed working"
- ✅ "Tested with playwright - screenshots show functionality"
- ✅ "Browser automation confirms user experience works"

## Project Overview
HAQEI analyzer using SPARC methodology with HaQei philosophy, I Ching integration, and PDCA automation.

## 🎯 CRITICAL: AGENT SELECTION STRATEGY

### 🧠 USE HAQEI DOMAIN AGENTS FOR:
- **HaQei philosophy** implementation and validation
- **I Ching (易経)** hexagram interpretation and logic
- **Triple OS Architecture** (Engine/Interface/Safe Mode)
- **7-Stage Navigation System** design and flow
- **Freemium strategy** with philosophical alignment

**HAQEI Domain Agents:**
- `haqei-cto` - High-level HAQEI project decisions
- `haqei-programmer` - HaQei-compliant coding + **MANDATORY MCP validation**
- `haqei-requirements-analyst` - I Ching-aware specifications
- `haqei-qa-tester` - Philosophy-aligned testing + **MANDATORY MCP verification**  
- `haqei-reporter` - HAQEI progress communication + **Only after MCP proof**
- `haqei-iching-expert` - 易経 validation and interpretation
- `haqei-strategy-navigator` - Philosophy framework implementation + **MCP validation required**

### ⚡ USE MCP SWARM FOR:
- **General coding** (REST APIs, databases, UI components)
- **System architecture** without philosophical constraints
- **Performance optimization** and benchmarking
- **CI/CD pipelines** and DevOps automation
- **Standard testing** and quality assurance

## 🚀 Claude AI Natural Language Interface

Use the Claude AI interface for natural language commands:

```bash
# PDCA Operations
npm run claude "PDCA評価を実行して"
npm run claude "OSアナライザーを20人でテストして"
npm run claude "Claudeと相談して"
npm run claude "改善を実装して"
npm run claude "効果を検証して"

# Virtual Users
npm run claude "仮想ユーザーを15人生成して"

# Server Operations  
npm run claude "サーバーを起動して"
npm run claude "ポート8080でサーバーを起動して"

# Testing
npm run claude "テストを実行して"
npm run claude "動作確認して"

# Claude Code
npm run claude "Claude Codeを起動して"

# Figma Integration  
npm run claude "Figmaファイルを読み込んで"
npm run claude "デザインシステムを確認して"
```

## 🔄 HAQEI PDCA System

Complete automated PDCA cycle for continuous improvement:

### Available Commands
```bash
# Basic evaluation (15 users)
npm run pdca:evaluate

# Custom user count
npm run pdca:evaluate:15  # 15 users
npm run pdca:evaluate:20  # 20 users  
npm run pdca:evaluate:30  # 30 users (recommended)

# Full PDCA cycle
npm run pdca:discuss --session=<session-id>
npm run pdca:implement --session=<session-id>
npm run pdca:verify --session=<session-id>
```

### PDCA Process
1. **Plan (評価)**: Virtual users evaluate sites → generate feedback
2. **Do (相談)**: Claude consultation → improvement planning  
3. **Check (実装)**: Parallel agent implementation → code changes
4. **Act (検証)**: Before/After validation → effect measurement

## Standard Build Commands
- `npm run build`: Build the project
- `npm run test`: Run the test suite
- `npm run lint`: Run linter and format checks
- `npm run typecheck`: Run TypeScript type checking

## 🧠 MEMORY PERSISTENCE SYSTEM

### 🚨 MANDATORY MEMORY CHECK PROTOCOL

**ABSOLUTE RULE**: NEVER start implementation without memory consultation

#### 🔍 PRE-IMPLEMENTATION CHECKLIST:
1. **READ .serena/memories first** - MANDATORY before any code changes
2. **CHECK cipher-memory** - Contains compressed project knowledge
3. **UNDERSTAND current implementation** - What already exists?
4. **IDENTIFY root causes** - Why did the problem occur?
5. **PLAN based on context** - Avoid breaking existing functionality

#### 📚 CRITICAL MEMORY LOCATIONS
**ALWAYS READ THESE FILES FIRST** to maintain context:
1. **`.serena/memories/HAQEI_Project_Master_Plan_Overview.md`** - Complete project status
2. **`cipher-memory/HAQEI_PROJECT_MEMORY_20250805.md`** - 3-day completion record
3. **`.serena/memories/HAQEI_Critical_Production_Errors_Analysis.md`** - Known error patterns
4. **`.serena/memories/HAQEI_Phase3_Issues_and_Visual_Development_Rules.md`** - Latest implementation

#### 🛠️ ERROR TROUBLESHOOTING WORKFLOW:
```
❌ FORBIDDEN: Immediate code changes
"I see an error, let me fix it right away..."

✅ REQUIRED: Memory-first investigation
1. "Let me check .serena/memories for similar issues..."
2. "Reading cipher-memory for implementation context..."
3. "Understanding why this error occurred..."
4. "Planning fix based on existing architecture..."
5. "Implementing with full context awareness..."
```

### 🔐 MEMORY PRESERVATION RULES
1. **NEVER ignore existing .serena memories** - These contain critical project context
2. **ALWAYS check cipher-memory/** - Contains compressed project knowledge
3. **READ BEFORE ACTING** - Understanding current state prevents regression
4. **PRESERVE CONTEXT** - Document all major decisions in .serena/memories/

### 💾 AUTO-RECOVERY COMMANDS
```bash
# Restore project context
npm run claude "記憶を復元して"
npm run claude "プロジェクトの現在状況を確認して"
npm run claude ".serenaとcipher-memoryを読み込んで"
```

### ⏱️ COMPRESSION STRATEGY
- **Recent (7日間)**: 圧縮率10% - ほぼ完全保持
- **Medium (7-30日)**: 圧縮率50% - 重要部分保持
- **Old (30日+)**: 圧縮率80% - 要約のみ保持
- **Never Compress**: HAQEI, Phase3, 記憶, 重要, Critical含む会話

### 🚫 TERMINOLOGY RULES
- **NEVER use "bunenjin"** - Always use "HaQei philosophy" instead
- **Agent Names**: Use `haqei-strategy-navigator` not `bunenjin-strategy-navigator`
- **Philosophy References**: "HaQei philosophy" for all philosophical contexts
- **Memory Preservation**: Maintain HaQei terminology in all compressed memories

### 🧪 MCP VALIDATION WORKFLOW

**MANDATORY for ALL implementation tasks:**

```bash
# 1. Implementation Phase
npm run claude "機能を実装して"

# 2. MCP Validation Phase (REQUIRED)
npm run claude "MCPでユーザー動作をテストして"
npm run claude "プレイライトで画面操作を確認して"
npm run claude "スクリーンショットで動作を証明して"

# 3. Only AFTER MCP validation
npm run claude "MCP検証完了 - 動作確認済み"
```

### 🔍 REQUIRED VALIDATION STEPS:
1. **Browser Launch**: Start actual browser via MCP
2. **User Flow Test**: Navigate through implemented features
3. **Screenshot Capture**: Visual proof of functionality
4. **Interaction Validation**: Click/type/scroll operations
5. **Error Detection**: Catch and report any failures
6. **Completion Confirmation**: Only after all tests pass

### 📋 MCP VALIDATION COMMANDS:
```bash
# Run MCP validation system
node scripts/mcp-validation.js [feature-name] [url]

# Available validation scripts
npm run test:behavior    # Behavior validation
npm run test:visual      # Visual regression testing
npm run test:e2e         # End-to-end user flows

# MCP Integration Commands  
npm run claude "MCPでテストして [feature-name]"
npm run claude "プレイライトで動作確認して"
npm run claude "ユーザー操作をシミュレートして"
```

### 🔧 PLAYWRIGHT ERROR HANDLING STRATEGY

**CRITICAL RULE**: NEVER give up on Playwright testing when encountering errors

#### ⚡ AUTOMATIC ERROR RECOVERY:
When encountering "Browser is already in use" error:
1. **IMMEDIATELY try --isolated option**: Use separate browser instance
2. **NEVER skip testing**: Always find alternative approach
3. **Retry with different parameters**: Adjust configuration as needed

#### 📋 ERROR RESPONSE PATTERNS:
```bash
# ❌ FORBIDDEN: Giving up on error
"Playwright is in use, skipping test..."

# ✅ REQUIRED: Automatic retry with --isolated
"Browser in use detected, retrying with --isolated option..."
npx playwright test --isolated
```

#### 🎯 THINKING PATTERN FOR ERRORS:
1. **Error Detection**: "Browser is already in use"
2. **Immediate Action**: Add --isolated flag
3. **Alternative Approach**: Try different browser profile
4. **Success Confirmation**: Continue with testing

Example commands:
```bash
# Primary attempt
npx @playwright/mcp navigate "http://localhost:8788"

# If error, automatic retry:
npx @playwright/mcp navigate "http://localhost:8788" --isolated

# Or use different profile:
npx @playwright/mcp navigate "http://localhost:8788" --profile=test-profile-2
```

### 📝 AUTOMATIC PROGRESS RECORDING PROTOCOL

**MANDATORY**: Save progress to memory BEFORE reporting to user

#### 🔄 CONTINUOUS MEMORY UPDATES:
1. **Start of task**: Record task initiation in .serena/memories
2. **During implementation**: Update progress at key milestones
3. **Before user report**: Save complete progress summary
4. **After completion**: Archive final implementation details

#### 📊 REQUIRED MEMORY ENTRIES:
```markdown
# .serena/memories/[TASK_NAME]_progress_20250806.md
## Task: [Brief Description]
Date: 20250806
Status: [In Progress/Completed]

### Progress Summary:
- [What was accomplished]
- [Current implementation state]
- [Next steps planned]

### Technical Details:
- Files modified: [list]
- Key functions implemented: [list]
- Test results: [summary]

### Context for Future:
- [Important decisions made]
- [Architecture changes]
- [Known issues/limitations]
```

#### ⏰ MEMORY SAVE TIMING:
- **Every major milestone** (25%, 50%, 75% completion)
- **Before asking user questions**
- **Before reporting completion**
- **When encountering significant issues**

#### 🎯 CIPHER-MEMORY COMPRESSION:
For completed tasks, save compressed summary:
```markdown
# cipher-memory/[TASK]_20250806.md
Task: [Name] | Status: Complete | Duration: [X hours]
Key Achievement: [1-2 sentences]
Files: [critical files only] | Tests: [pass rate]
Context: [essential context for future reference]
```

### ⚠️ AGENT COMPLETION RULES:
- **haqei-programmer**: MUST save progress to memory before reporting
- **haqei-qa-tester**: MUST record test results in memory first
- **haqei-reporter**: MUST update memory with final status
- **ALL agents**: NO user reports without memory documentation

## Important Notes
- Always run tests before committing: `npm run test`
- Use SPARC memory system to maintain context across sessions
- Follow Red-Green-Refactor cycle during TDD phases
- Document architectural decisions in memory
- Regular security reviews for authentication/data handling code
- **Date format**: ALWAYS use current date - **Today is 2025-08-06 (August 6th, 2025)**

## 📅 CRITICAL DATE HANDLING RULES

**MANDATORY**: Use correct current date - NOT January dates

### 🚨 DATE CORRECTION PROTOCOL:
- **Current Date**: 2025-08-06 (August 6th, 2025)
- **File Format**: YYYYMMDD = **20250806**
- **Display Format**: 2025-08-06
- **NEVER use**: 2025-01-XX or January dates

### 📋 DATE USAGE EXAMPLES:
```markdown
# ✅ CORRECT:
.serena/memories/task_progress_20250806.md
cipher-memory/implementation_20250806.md
Date: 20250806
Created: 2025-08-06

# ❌ FORBIDDEN:
task_progress_20250105.md  # Wrong month
implementation_20250101.md # Wrong date
Date: 20250105            # Incorrect
```

### 🔍 DATE VERIFICATION COMMAND:
```bash
# Always verify current date first:
date "+%Y%m%d"  # Should return: 20250806
date "+%Y-%m-%d"  # Should return: 2025-08-06
```

### ⚠️ AGENT DATE REQUIREMENTS:
- **ALWAYS check system date** before creating files
- **NEVER assume January dates**
- **USE 20250806 for all new files**
- **VERIFY date correctness** in all templates