# Complete Subagent System Setup Guide

## Overview
This guide provides exact instructions to recreate the Claude Code subagent system with all available agent types, their tools, and configuration requirements.

## Available Agent Types

### 1. **general-purpose**
**Description:** General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks.
**Tools:** All available tools (*)
**Use Cases:**
- Complex multi-step research tasks
- Keyword/file searching when uncertain of matches
- General problem-solving requiring multiple tools

### 2. **statusline-setup**
**Description:** Configure the user's Claude Code status line setting.
**Tools:** Read, Edit
**Use Cases:**
- Status line configuration
- CLI interface customization

### 3. **output-style-setup**
**Description:** Create Claude Code output styles.
**Tools:** Read, Write, Edit, Glob, Grep
**Use Cases:**
- Output formatting configuration
- Style system setup

### 4. **world-class-designer** 🎨
**Description:** World-class designer and visual creation specialist for web applications. Proactively creates stunning UI/UX designs, generates AI-powered visuals, and builds comprehensive design systems.
**Tools:** Read, Write, Edit, Bash, WebFetch, Task
**MUST BE USED for:**
- Web app design
- UI components
- Brand identity
- Visual asset creation
**Proactive:** Yes

### 5. **design-scraper** 🔍
**Description:** World-class design scraper and visual intelligence expert. Proactively extracts, analyzes, and reverse-engineers design systems, UI components, and visual patterns from websites.
**Tools:** Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task
**MUST BE USED for:**
- Design research
- Competitor analysis
- Component extraction tasks
**Proactive:** Yes

## Core Implementation Requirements

### 1. Task Tool Configuration
```javascript
{
  "name": "Task",
  "description": "Launch a new agent to handle complex, multi-step tasks autonomously",
  "parameters": {
    "description": {
      "type": "string",
      "description": "A short (3-5 word) description of the task"
    },
    "prompt": {
      "type": "string", 
      "description": "The task for the agent to perform"
    },
    "subagent_type": {
      "type": "string",
      "description": "The type of specialized agent to use for this task"
    }
  },
  "required": ["description", "prompt", "subagent_type"]
}
```

### 2. Agent Selection Logic
```
When NOT to use Agent tool:
- Reading specific file paths → Use Read/Glob instead
- Searching specific class definitions → Use Glob instead  
- Searching within 2-3 files → Use Read instead
- Tasks unrelated to agent descriptions
```

### 3. Usage Rules
1. **Concurrency:** Launch multiple agents simultaneously when possible
2. **Stateless:** Each invocation is independent
3. **Detailed Prompts:** Include complete task description
4. **Return Format:** Specify what information should be returned
5. **Trust Outputs:** Agent results should generally be trusted
6. **Code vs Research:** Clearly specify if writing code or doing research

## Required API Keys & Configuration

### Anthropic Claude API
```bash
# Required environment variables
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# For multiple model access (if using different models per agent)
export CLAUDE_HAIKU_KEY="your_haiku_key"  # For fast search agents
export CLAUDE_SONNET_KEY="your_sonnet_key"  # For coding agents  
export CLAUDE_OPUS_KEY="your_opus_key"  # For deep analysis agents
```

### Web Access APIs (for design agents)
```bash
# For WebFetch tool functionality
export WEB_FETCH_API_KEY="your_web_scraping_api_key"

# Optional: For enhanced web scraping
export BROWSERLESS_API_KEY="your_browserless_key"
export SCRAPFLY_API_KEY="your_scrapfly_key"
```

### File System Access
```bash
# Ensure proper permissions for file operations
chmod 755 /path/to/project/directory
```

## Step-by-Step Setup Instructions

### Step 1: Environment Setup
```bash
# 1. Install required dependencies
npm install @anthropic-ai/sdk
npm install axios  # For web requests
npm install fs-extra  # For enhanced file operations

# 2. Set environment variables
echo 'export ANTHROPIC_API_KEY="your_key_here"' >> ~/.bashrc
source ~/.bashrc

# 3. Verify access
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.anthropic.com/v1/messages
```

### Step 2: Tool Implementation
```javascript
// Core tool definitions required for each agent type
const TOOL_SETS = {
  "general-purpose": ["*"], // All tools
  "statusline-setup": ["Read", "Edit"],
  "output-style-setup": ["Read", "Write", "Edit", "Glob", "Grep"],
  "world-class-designer": ["Read", "Write", "Edit", "Bash", "WebFetch", "Task"],
  "design-scraper": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "WebFetch", "Task"]
};
```

### Step 3: Agent Invocation System
```javascript
async function invokeAgent(agentType, description, prompt) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229", // Adjust per agent type
    max_tokens: 4000,
    tools: getToolsForAgent(agentType),
    messages: [{
      role: "user", 
      content: `Agent Type: ${agentType}\nTask: ${description}\n\nDetailed Instructions:\n${prompt}`
    }]
  });
  
  return response;
}
```

### Step 4: Proactive Agent Logic
```javascript
// For proactive agents (world-class-designer, design-scraper)
function shouldTriggerProactiveAgent(userInput, context) {
  const designKeywords = ["ui", "design", "visual", "component", "layout", "brand"];
  const scrapeKeywords = ["competitor", "extract", "analyze", "reverse-engineer"];
  
  // Trigger world-class-designer
  if (designKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
    return "world-class-designer";
  }
  
  // Trigger design-scraper  
  if (scrapeKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
    return "design-scraper";
  }
  
  return null;
}
```

## Configuration Files

### agents.json
```json
{
  "agents": {
    "general-purpose": {
      "description": "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks",
      "tools": ["*"],
      "model": "claude-3-sonnet-20240229",
      "proactive": false
    },
    "statusline-setup": {
      "description": "Configure the user's Claude Code status line setting",
      "tools": ["Read", "Edit"],
      "model": "claude-3-haiku-20240307",
      "proactive": false
    },
    "output-style-setup": {
      "description": "Create Claude Code output styles",
      "tools": ["Read", "Write", "Edit", "Glob", "Grep"],
      "model": "claude-3-haiku-20240307", 
      "proactive": false
    },
    "world-class-designer": {
      "description": "🎨 World-class designer and visual creation specialist for web applications",
      "tools": ["Read", "Write", "Edit", "Bash", "WebFetch", "Task"],
      "model": "claude-3-sonnet-20240229",
      "proactive": true,
      "triggers": ["web app design", "UI components", "brand identity", "visual asset creation"]
    },
    "design-scraper": {
      "description": "🔍 World-class design scraper and visual intelligence expert",
      "tools": ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "WebFetch", "Task"],
      "model": "claude-3-sonnet-20240229",
      "proactive": true,
      "triggers": ["design research", "competitor analysis", "component extraction"]
    }
  }
}
```

### tools.json
```json
{
  "tools": {
    "Read": {
      "description": "Read files from filesystem",
      "permissions": ["file:read"]
    },
    "Write": {
      "description": "Write files to filesystem", 
      "permissions": ["file:write"]
    },
    "Edit": {
      "description": "Edit existing files",
      "permissions": ["file:read", "file:write"]
    },
    "Bash": {
      "description": "Execute bash commands",
      "permissions": ["system:exec"]
    },
    "Glob": {
      "description": "File pattern matching",
      "permissions": ["file:read"]
    },
    "Grep": {
      "description": "Search file contents",
      "permissions": ["file:read"]
    },
    "WebFetch": {
      "description": "Fetch web content",
      "permissions": ["network:http"]
    },
    "Task": {
      "description": "Launch subagents",
      "permissions": ["agent:spawn"]
    }
  }
}
```

## Security & Permissions

### Required Permissions
```yaml
permissions:
  file:
    - read: /project/path/**
    - write: /project/path/**
  network:
    - http: "*"
    - https: "*"  
  system:
    - exec: ["bash", "npm", "git"]
  agent:
    - spawn: true
    - recursive_depth: 3
```

### Security Keys
```bash
# Agent isolation keys
export AGENT_ISOLATION_KEY="random_32_char_string_here"

# Task execution limits
export MAX_AGENT_DEPTH=3
export MAX_CONCURRENT_AGENTS=5
export AGENT_TIMEOUT=300000  # 5 minutes
```

## Advanced Configuration

### Model Selection Strategy
```javascript
const MODEL_MAPPING = {
  "general-purpose": "claude-3-sonnet-20240229",
  "statusline-setup": "claude-3-haiku-20240307", 
  "output-style-setup": "claude-3-haiku-20240307",
  "world-class-designer": "claude-3-sonnet-20240229",
  "design-scraper": "claude-3-sonnet-20240229"
};
```

### Performance Optimization
```javascript
// Parallel agent execution
async function executeParallelAgents(tasks) {
  const promises = tasks.map(task => invokeAgent(task.type, task.desc, task.prompt));
  return await Promise.all(promises);
}

// Agent result caching
const agentCache = new Map();
const CACHE_TTL = 300000; // 5 minutes
```

## Testing & Validation

### Test Each Agent Type
```bash
# Test general-purpose agent
curl -X POST localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"type": "general-purpose", "task": "search for React components", "prompt": "Find all React component files in the src directory"}'

# Test designer agent  
curl -X POST localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"type": "world-class-designer", "task": "create button component", "prompt": "Design a modern button component with hover states"}'
```

### Validation Checklist
- [ ] All 5 agent types respond correctly
- [ ] Tools are properly assigned per agent
- [ ] Proactive agents trigger automatically
- [ ] Parallel execution works
- [ ] File permissions are correct
- [ ] API keys are valid
- [ ] Security isolation functions
- [ ] Performance metrics acceptable

## Troubleshooting

### Common Issues
1. **Agent not found:** Check `subagent_type` spelling
2. **Tool access denied:** Verify permissions in tools.json
3. **API rate limits:** Implement request throttling
4. **Memory issues:** Set proper timeout limits
5. **Proactive agents not triggering:** Check keyword matching logic

### Debug Commands
```bash
# Check agent status
curl localhost:3000/agents/status

# View agent logs
tail -f /var/log/claude-agents.log

# Test tool access
curl localhost:3000/tools/test
```

This guide provides complete instructions for recreating the exact subagent system with all keys, configurations, and implementation details needed for full functionality.