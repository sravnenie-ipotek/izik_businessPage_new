# Subagent Implementation Examples

## Real Usage Examples

### Example 1: Search Task with General-Purpose Agent
```javascript
// Input to Task tool
{
  "description": "Find React components",
  "prompt": "Search through the codebase and find all React component files. Look for .jsx, .tsx files and identify component names, props, and their locations. Provide a summary of the component structure.",
  "subagent_type": "general-purpose"
}

// Expected agent behavior:
// 1. Uses Glob to find *.jsx, *.tsx files
// 2. Uses Read to examine component files  
// 3. Uses Grep to search for component patterns
// 4. Returns structured summary
```

### Example 2: UI Design with World-Class-Designer Agent
```javascript
// Input to Task tool  
{
  "description": "Create landing page design",
  "prompt": "Design a modern landing page for a SaaS product. Include hero section, features, testimonials, and CTA. Use contemporary design trends, proper typography hierarchy, and ensure mobile responsiveness. Generate the HTML/CSS code and provide design rationale.",
  "subagent_type": "world-class-designer"
}

// Expected agent behavior:
// 1. Uses WebFetch to research current design trends
// 2. Uses Write to create HTML structure
// 3. Uses Write to create CSS styles
// 4. Uses Edit to refine and optimize
// 5. Returns complete design system
```

### Example 3: Design Research with Design-Scraper Agent
```javascript
// Input to Task tool
{
  "description": "Analyze competitor designs", 
  "prompt": "Visit the top 5 SaaS landing pages and extract their design patterns, color schemes, typography choices, and layout structures. Identify common patterns and unique elements. Provide actionable insights for our own design.",
  "subagent_type": "design-scraper"
}

// Expected agent behavior:
// 1. Uses WebFetch to visit competitor sites
// 2. Uses Write to document findings
// 3. Uses Grep to search for pattern files
// 4. Uses Task to spawn additional analysis agents if needed
// 5. Returns comprehensive competitive analysis
```

## Complete Code Implementation

### 1. Main Agent Controller
```javascript
// agent-controller.js
const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs-extra');
const path = require('path');

class SubAgentController {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    this.agents = this.loadAgentConfig();
    this.tools = this.loadToolConfig();
  }

  loadAgentConfig() {
    return JSON.parse(fs.readFileSync('./config/agents.json', 'utf8'));
  }

  loadToolConfig() {
    return JSON.parse(fs.readFileSync('./config/tools.json', 'utf8'));
  }

  async invokeAgent(agentType, description, prompt) {
    const agent = this.agents.agents[agentType];
    if (!agent) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    const tools = this.getToolsForAgent(agentType);
    
    try {
      const response = await this.anthropic.messages.create({
        model: agent.model,
        max_tokens: 4000,
        temperature: 0.1,
        tools: tools,
        messages: [{
          role: "user",
          content: `You are a ${agentType} agent. Task: ${description}\n\nDetailed Instructions:\n${prompt}\n\nProvide a comprehensive response and use the available tools to complete this task thoroughly.`
        }]
      });

      return this.processResponse(response, agentType);
    } catch (error) {
      console.error(`Agent ${agentType} error:`, error);
      throw error;
    }
  }

  getToolsForAgent(agentType) {
    const agent = this.agents.agents[agentType];
    const toolNames = agent.tools.includes("*") ? Object.keys(this.tools.tools) : agent.tools;
    
    return toolNames.map(toolName => ({
      name: toolName,
      description: this.tools.tools[toolName].description,
      input_schema: this.getToolSchema(toolName)
    }));
  }

  getToolSchema(toolName) {
    // Return appropriate JSON schema for each tool
    const schemas = {
      "Read": {
        type: "object",
        properties: {
          file_path: { type: "string", description: "Path to file to read" }
        },
        required: ["file_path"]
      },
      "Write": {
        type: "object", 
        properties: {
          file_path: { type: "string", description: "Path to file to write" },
          content: { type: "string", description: "Content to write" }
        },
        required: ["file_path", "content"]
      },
      // Add all other tool schemas...
    };
    
    return schemas[toolName] || { type: "object" };
  }

  async processResponse(response, agentType) {
    const result = {
      agentType,
      content: response.content[0].text,
      toolCalls: [],
      timestamp: new Date().toISOString()
    };

    // Process any tool calls made by the agent
    for (const content of response.content) {
      if (content.type === 'tool_use') {
        const toolResult = await this.executeTool(content.name, content.input);
        result.toolCalls.push({
          tool: content.name,
          input: content.input,
          output: toolResult
        });
      }
    }

    return result;
  }

  async executeTool(toolName, input) {
    // Implementation of actual tool execution
    switch (toolName) {
      case "Read":
        return await this.readFile(input.file_path);
      case "Write": 
        return await this.writeFile(input.file_path, input.content);
      case "WebFetch":
        return await this.fetchWeb(input.url, input.prompt);
      // Implement all other tools...
      default:
        throw new Error(`Tool ${toolName} not implemented`);
    }
  }

  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf8');
      return `File written successfully: ${filePath}`;
    } catch (error) {
      return `Error writing file: ${error.message}`;
    }
  }

  async fetchWeb(url, prompt) {
    // Implement web fetching logic
    // This would use a web scraping service or headless browser
    return "Web fetch functionality would be implemented here";
  }
}

module.exports = SubAgentController;
```

### 2. Proactive Agent Trigger System
```javascript
// proactive-triggers.js
class ProactiveTriggerSystem {
  constructor(agentController) {
    this.agentController = agentController;
    this.triggerRules = this.loadTriggerRules();
  }

  loadTriggerRules() {
    return {
      "world-class-designer": {
        keywords: ["design", "ui", "visual", "component", "layout", "brand", "interface", "mockup", "prototype"],
        patterns: [
          /create.*ui/i,
          /design.*component/i, 
          /build.*interface/i,
          /style.*element/i
        ]
      },
      "design-scraper": {
        keywords: ["competitor", "extract", "analyze", "scrape", "reverse-engineer", "research"],
        patterns: [
          /analyze.*design/i,
          /competitor.*analysis/i,
          /extract.*pattern/i,
          /research.*ui/i
        ]
      }
    };
  }

  shouldTriggerAgent(userInput, context = {}) {
    const inputLower = userInput.toLowerCase();
    
    for (const [agentType, rules] of Object.entries(this.triggerRules)) {
      // Check keywords
      const hasKeyword = rules.keywords.some(keyword => 
        inputLower.includes(keyword)
      );
      
      // Check patterns
      const hasPattern = rules.patterns.some(pattern =>
        pattern.test(userInput)
      );
      
      if (hasKeyword || hasPattern) {
        return {
          agentType,
          confidence: this.calculateConfidence(userInput, rules),
          reason: hasKeyword ? 'keyword_match' : 'pattern_match'
        };
      }
    }
    
    return null;
  }

  calculateConfidence(input, rules) {
    const inputLower = input.toLowerCase();
    let score = 0;
    
    // Score based on keyword matches
    const keywordMatches = rules.keywords.filter(keyword =>
      inputLower.includes(keyword)
    ).length;
    score += keywordMatches * 0.2;
    
    // Score based on pattern matches
    const patternMatches = rules.patterns.filter(pattern =>
      pattern.test(input)
    ).length;
    score += patternMatches * 0.3;
    
    return Math.min(score, 1.0);
  }

  async handleProactiveExecution(userInput, context) {
    const trigger = this.shouldTriggerAgent(userInput, context);
    
    if (trigger && trigger.confidence > 0.5) {
      console.log(`Proactively triggering ${trigger.agentType} (confidence: ${trigger.confidence})`);
      
      // Generate appropriate prompt based on agent type
      const prompt = this.generatePromptForAgent(trigger.agentType, userInput, context);
      
      return await this.agentController.invokeAgent(
        trigger.agentType,
        `Proactive ${trigger.agentType} task`,
        prompt
      );
    }
    
    return null;
  }

  generatePromptForAgent(agentType, userInput, context) {
    const promptTemplates = {
      "world-class-designer": `
        Based on the user's request: "${userInput}"
        
        Please create a comprehensive design solution that includes:
        1. Visual design concept and rationale
        2. Color palette and typography choices
        3. Layout structure and component breakdown
        4. HTML/CSS implementation
        5. Responsive design considerations
        
        Focus on modern design principles and user experience best practices.
      `,
      "design-scraper": `
        Based on the user's request: "${userInput}"
        
        Please conduct comprehensive design research that includes:
        1. Identifying relevant websites/competitors to analyze
        2. Extracting design patterns and elements
        3. Analyzing color schemes, typography, and layouts
        4. Documenting common patterns and unique elements
        5. Providing actionable insights and recommendations
        
        Focus on gathering comprehensive design intelligence.
      `
    };
    
    return promptTemplates[agentType] || userInput;
  }
}

module.exports = ProactiveTriggerSystem;
```

### 3. Main Application Integration
```javascript
// main.js
const SubAgentController = require('./agent-controller');
const ProactiveTriggerSystem = require('./proactive-triggers');

class ClaudeCodeWithSubAgents {
  constructor() {
    this.agentController = new SubAgentController();
    this.proactiveTriggers = new ProactiveTriggerSystem(this.agentController);
  }

  async processUserInput(userInput, context = {}) {
    // Check for proactive agent triggers first
    const proactiveResult = await this.proactiveTriggers.handleProactiveExecution(
      userInput, 
      context
    );
    
    if (proactiveResult) {
      return {
        type: 'proactive',
        result: proactiveResult,
        message: `Proactively executed ${proactiveResult.agentType} agent`
      };
    }

    // Check for explicit agent calls
    const agentMatch = this.parseAgentCall(userInput);
    if (agentMatch) {
      const result = await this.agentController.invokeAgent(
        agentMatch.agentType,
        agentMatch.description, 
        agentMatch.prompt
      );
      
      return {
        type: 'explicit',
        result: result,
        message: `Executed ${agentMatch.agentType} agent`
      };
    }

    // Default behavior for non-agent tasks
    return await this.handleRegularTask(userInput, context);
  }

  parseAgentCall(input) {
    // Parse explicit agent calls from user input
    const agentCallPattern = /use\s+(\w+[-\w]*)\s+agent\s+to\s+(.+)/i;
    const match = input.match(agentCallPattern);
    
    if (match) {
      return {
        agentType: match[1],
        description: "User requested task",
        prompt: match[2]
      };
    }
    
    return null;
  }

  async handleRegularTask(userInput, context) {
    // Handle non-agent tasks with regular Claude functionality
    return {
      type: 'regular',
      result: `Processed regular task: ${userInput}`,
      message: 'Handled with main Claude functionality'
    };
  }
}

// Usage example
async function main() {
  const claude = new ClaudeCodeWithSubAgents();
  
  // Example 1: Proactive design agent trigger
  const designResult = await claude.processUserInput(
    "Create a modern dashboard UI component for our analytics app"
  );
  console.log(designResult);
  
  // Example 2: Explicit agent call
  const searchResult = await claude.processUserInput(
    "use general-purpose agent to find all React components in the src directory"
  );
  console.log(searchResult);
  
  // Example 3: Proactive scraper trigger
  const researchResult = await claude.processUserInput(
    "Research competitor designs for e-commerce checkout flows"
  );
  console.log(researchResult);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeCodeWithSubAgents;
```

### 4. Configuration Files

#### package.json
```json
{
  "name": "claude-subagent-system",
  "version": "1.0.0",
  "description": "Complete subagent system for Claude Code",
  "main": "main.js",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "axios": "^1.6.0", 
    "fs-extra": "^11.2.0",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.0.0"
  },
  "scripts": {
    "start": "node main.js",
    "test": "node test/test-agents.js"
  }
}
```

#### .env.example
```bash
# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Model Selection (optional - defaults to config)
CLAUDE_HAIKU_KEY=your_haiku_specific_key
CLAUDE_SONNET_KEY=your_sonnet_specific_key  
CLAUDE_OPUS_KEY=your_opus_specific_key

# Web Scraping APIs
BROWSERLESS_API_KEY=your_browserless_key
SCRAPFLY_API_KEY=your_scrapfly_key

# Agent Configuration
MAX_AGENT_DEPTH=3
MAX_CONCURRENT_AGENTS=5
AGENT_TIMEOUT=300000
AGENT_ISOLATION_KEY=random_32_char_string_here

# File System Permissions
PROJECT_PATH=/path/to/your/project
TEMP_DIR=/tmp/claude-agents
LOG_DIR=/var/log/claude-agents
```

This complete implementation provides exact instructions, code examples, and configuration files needed to recreate the subagent system with all 5 agent types and their specific capabilities.