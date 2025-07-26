# Design Document

## Overview

This document outlines the design for fixing MIME type issues in the HaQei Analyzer application. The primary problem is that JavaScript files are being served with incorrect MIME types ("text/html; charset=utf-8" instead of "application/javascript"), causing validation warnings and potential loading issues.

## Architecture

### Current Problem Analysis

1. **Root Cause**: Server configuration is serving JavaScript files with HTML MIME type
2. **Impact**: ScriptPathValidator reports errors for all JavaScript files
3. **Symptoms**: Console flooded with MIME type warnings, potential script loading failures
4. **Environment**: Occurs in development server environments (localhost:8788)

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Solution Components                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Enhanced MIME Type Detection                             │
│ 2. Intelligent Error Grouping                              │
│ 3. Graceful Degradation                                    │
│ 4. Server Configuration Guide                              │
│ 5. Development Mode Optimizations                          │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Enhanced ScriptPathValidator

**Purpose**: Improve MIME type validation and error reporting

**Key Methods**:

- `validateMimeType(response, expectedType)` - Enhanced MIME validation
- `groupSimilarErrors(errors)` - Group similar MIME type errors
- `generateMimeTypeRecommendations(errors)` - Provide specific solutions

**Interface**:

```javascript
class EnhancedScriptPathValidator {
  constructor(options) {
    this.options = {
      ...options,
      mimeTypeValidation: true,
      groupSimilarErrors: true,
      developmentMode: false,
    };
  }

  async validateScriptMimeType(url) {
    // Enhanced MIME type validation logic
  }

  groupMimeTypeErrors(validationResults) {
    // Group similar MIME type issues
  }

  generateMimeTypeSolutions(errorGroups) {
    // Generate specific solutions for MIME type issues
  }
}
```

### 2. MIME Type Error Handler

**Purpose**: Centralized handling of MIME type related errors

**Key Features**:

- Error categorization (missing file vs MIME type issue)
- Solution recommendation engine
- Development vs production mode handling

**Interface**:

```javascript
class MimeTypeErrorHandler {
  constructor(options) {
    this.developmentMode = options.developmentMode || false;
    this.verboseLogging = options.verboseLogging || false;
  }

  handleMimeTypeError(error, context) {
    // Categorize and handle MIME type errors
  }

  generateSolution(errorType, context) {
    // Generate specific solutions based on error type
  }

  reportErrorSummary(errors) {
    // Provide consolidated error reporting
  }
}
```

### 3. Server Configuration Detector

**Purpose**: Detect server type and provide appropriate configuration guidance

**Key Features**:

- Automatic server type detection
- Configuration template generation
- Environment-specific recommendations

**Interface**:

```javascript
class ServerConfigurationDetector {
  detectServerType() {
    // Detect current server environment
  }

  generateConfigurationGuide(serverType) {
    // Generate server-specific configuration
  }

  validateServerConfiguration() {
    // Check if server is properly configured
  }
}
```

## Data Models

### MIME Type Validation Result

```javascript
{
    url: string,
    isValid: boolean,
    actualMimeType: string,
    expectedMimeType: string,
    errorType: 'MISSING_FILE' | 'INCORRECT_MIME_TYPE' | 'NETWORK_ERROR',
    recommendations: string[],
    severity: 'ERROR' | 'WARNING' | 'INFO'
}
```

### Error Group

```javascript
{
    errorType: string,
    count: number,
    affectedFiles: string[],
    commonSolution: string,
    detailedSolutions: string[]
}
```

### Server Configuration

```javascript
{
    serverType: 'APACHE' | 'NGINX' | 'NODE_EXPRESS' | 'PYTHON_HTTP' | 'UNKNOWN',
    configurationFile: string,
    requiredChanges: string[],
    testCommands: string[]
}
```

## Error Handling

### Error Categories

1. **Critical Errors**: Missing files, network failures
2. **Configuration Warnings**: MIME type mismatches
3. **Development Info**: Non-critical development environment issues

### Error Handling Strategy

```javascript
// Error handling flow
try {
  const validationResult = await validateScriptPath(url);

  if (!validationResult.isValid) {
    const errorHandler = new MimeTypeErrorHandler({
      developmentMode: isDevelopmentMode(),
    });

    errorHandler.handleMimeTypeError(validationResult.error, {
      url,
      environment: getEnvironment(),
    });
  }
} catch (error) {
  // Graceful degradation - continue with script loading
  console.warn(
    `Script validation failed for ${url}, continuing anyway:`,
    error
  );
}
```

### Graceful Degradation

1. **Continue Loading**: Even with MIME type errors, attempt script execution
2. **Fallback Mechanisms**: Provide alternative loading strategies
3. **User Notification**: Inform developers without blocking functionality

## Testing Strategy

### Unit Tests

1. **MIME Type Detection Tests**

   - Test correct MIME type identification
   - Test error categorization
   - Test solution generation

2. **Error Grouping Tests**

   - Test similar error grouping
   - Test error summary generation
   - Test recommendation accuracy

3. **Server Detection Tests**
   - Test server type detection
   - Test configuration generation
   - Test validation accuracy

### Integration Tests

1. **End-to-End Validation**

   - Test complete validation flow
   - Test error handling integration
   - Test graceful degradation

2. **Server Configuration Tests**
   - Test with different server types
   - Test configuration effectiveness
   - Test environment detection

### Performance Tests

1. **Validation Performance**
   - Test validation speed with many files
   - Test memory usage during validation
   - Test error handling overhead

## Implementation Plan

### Phase 1: Enhanced Error Detection

- Improve MIME type validation logic
- Implement error categorization
- Add development mode optimizations

### Phase 2: Intelligent Error Reporting

- Implement error grouping
- Add solution recommendation engine
- Create consolidated error reporting

### Phase 3: Server Configuration Support

- Add server type detection
- Create configuration templates
- Implement validation testing

### Phase 4: Documentation and Guides

- Create server setup documentation
- Add troubleshooting guides
- Implement interactive configuration helper

## Configuration Examples

### Apache (.htaccess)

```apache
AddType application/javascript .js
AddType application/json .json
```

### Nginx

```nginx
location ~* \.js$ {
    add_header Content-Type application/javascript;
}
```

### Node.js Express

```javascript
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);
```

### Python HTTP Server

```python
import http.server
import mimetypes

mimetypes.add_type('application/javascript', '.js')
```

## Success Metrics

1. **Error Reduction**: 90% reduction in MIME type warnings
2. **Loading Performance**: No degradation in script loading times
3. **Developer Experience**: Clear, actionable error messages
4. **Configuration Success**: Easy server setup with provided guides
