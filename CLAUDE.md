# Claude Code Configuration - HAQEI Project (Core)

## 🚨 CRITICAL: CONCURRENT EXECUTION

**ABSOLUTE RULE**: ALL operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS:
1. **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
2. **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
3. **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
4. **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
5. **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

## Project Overview
HAQEI analyzer using SPARC methodology with bunenjin philosophy, I Ching integration, and PDCA automation.

## 🎯 CRITICAL: AGENT SELECTION STRATEGY

### 🧠 USE HAQEI DOMAIN AGENTS FOR:
- **bunenjin philosophy** implementation and validation
- **I Ching (易経)** hexagram interpretation and logic
- **Triple OS Architecture** (Engine/Interface/Safe Mode)
- **7-Stage Navigation System** design and flow
- **Freemium strategy** with philosophical alignment

**HAQEI Domain Agents:**
- `haqei-cto` - High-level HAQEI project decisions
- `haqei-programmer` - bunenjin-compliant coding
- `haqei-requirements-analyst` - I Ching-aware specifications
- `haqei-qa-tester` - Philosophy-aligned testing
- `haqei-reporter` - HAQEI progress communication
- `haqei-iching-expert` - 易経 validation and interpretation
- `bunenjin-strategy-navigator` - Philosophy framework implementation

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

## Important Notes
- Always run tests before committing: `npm run test`
- Use SPARC memory system to maintain context across sessions
- Follow Red-Green-Refactor cycle during TDD phases
- Document architectural decisions in memory
- Regular security reviews for authentication/data handling code
- Date format: YYYYMMDD (not YYYY-MM-DD)