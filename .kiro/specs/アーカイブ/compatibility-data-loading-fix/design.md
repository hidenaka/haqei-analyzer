# Design Document

## Overview

This document outlines the design for fixing the compatibility data loading issue in HaQei Analyzer. The problem is that Interface OS and SafeMode OS analyses are failing because `keyword_map` and `line_keyword_map` are empty, preventing proper matching of user responses to hexagram characteristics.

## Architecture

### Current Problem Analysis

1. **Root Cause**: `HAQEI_DATA` object lacks `keyword_map` and `line_keyword_map` properties
2. **Impact**: Interface OS and SafeMode OS show "分析不能" with 0% match scores
3. **Data Availability**: Compatibility data exists in JSON files but isn't processed into keyword maps
4. **Location**: Data exists in `public/new-analyzer/js/data/compatibility/` folders

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Flow Architecture                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Compatibility JSON Files                                 │
│    ├── engine-interface/ (64 hexagram files)               │
│    └── engine-safemode/ (64 hexagram files)                │
│                                                             │
│ 2. Dynamic Data Processing                                  │
│    ├── CompatibilityDataLoader                             │
│    ├── Keyword Extraction Engine                           │
│    └── Map Generation System                               │
│                                                             │
│ 3. Integration with Existing System                        │
│    ├── DataManager Enhancement                             │
│    ├── HAQEI_DATA Extension                                │
│    └── TripleOSEngine Compatibility                        │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. CompatibilityDataLoader

**Purpose**: Load and process compatibility JSON files into keyword maps

**Key Methods**:

- `loadCompatibilityData()` - Main loading orchestrator
- `_loadEngineInterfaceData()` - Process interface compatibility data
- `_loadEngineSafemodeData()` - Process safemode compatibility data
- `_extractKeywords(text)` - Extract relevant keywords from descriptions

**Interface**:

```javascript
class CompatibilityDataLoader {
  constructor() {
    this.keywordMap = {};
    this.lineKeywordMap = {};
    this.isLoaded = false;
  }

  async loadCompatibilityData() {
    // Returns { keyword_map, line_keyword_map }
  }

  getKeywordMap() {
    // Returns processed keyword_map
  }

  getLineKeywordMap() {
    // Returns processed line_keyword_map
  }
}
```

### 2. Enhanced DataManager

**Purpose**: Integrate compatibility data loading into existing data management

**Key Enhancements**:

- Add `loadCompatibilityData()` method
- Update `getKeywordMap()` and `getLineKeywordMap()` to use loaded data
- Provide fallback mechanisms for missing data

**Interface**:

```javascript
class DataManager {
  async loadCompatibilityData() {
    // Load and integrate compatibility data
  }

  getKeywordMap() {
    // Return keyword_map with fallback
  }

  getLineKeywordMap() {
    // Return line_keyword_map with fallback
  }
}
```

### 3. Keyword Extraction Engine

**Purpose**: Extract meaningful keywords from compatibility data structures

**Key Features**:

- Multi-source keyword extraction (strengths, challenges, descriptions)
- Japanese text processing for relevant terms
- Keyword normalization and deduplication
- Context-aware extraction based on data structure

## Data Models

### Keyword Map Structure

```javascript
{
    "keyword_map": {
        "リーダーシップ": [1, 7, 14, 21, ...],
        "創造性": [1, 3, 16, 25, ...],
        "安定性": [2, 8, 15, 23, ...],
        // ... more keywords mapped to hexagram IDs
    }
}
```

### Line Keyword Map Structure

```javascript
{
    "line_keyword_map": {
        "防御的": [
            { "hexagram_id": 1, "line_number": 1 },
            { "hexagram_id": 3, "line_number": 2 },
            // ... more line references
        ],
        "内向的": [
            { "hexagram_id": 2, "line_number": 3 },
            // ... more line references
        ]
    }
}
```

### Compatibility Data Processing Flow

```javascript
// Input: engine-interface/hexagram_01.json
{
    "hexagram_id": 1,
    "internal_team_analysis": {
        "interface_combinations": [
            {
                "advice": {
                    "strengths": ["リーダーシップ", "創造性"],
                    "challenges": ["独善的", "孤立"]
                },
                "evaluation": {
                    "functional_efficiency": {
                        "description": "強いリーダーシップを発揮..."
                    }
                }
            }
        ]
    }
}

// Output: keyword_map entries
{
    "リーダーシップ": [1, ...],
    "創造性": [1, ...],
    "独善的": [1, ...],
    "孤立": [1, ...]
}
```

## Error Handling

### Error Categories

1. **File Loading Errors**: Missing or corrupted JSON files
2. **Data Structure Errors**: Unexpected JSON structure
3. **Processing Errors**: Keyword extraction failures
4. **Integration Errors**: DataManager integration issues

### Error Handling Strategy

```javascript
// Graceful degradation approach
try {
  const compatibilityData = await loader.loadCompatibilityData();
  this.data.keyword_map = compatibilityData.keyword_map;
  this.data.line_keyword_map = compatibilityData.line_keyword_map;
} catch (error) {
  console.warn("Compatibility data loading failed, using fallback");
  this.data.keyword_map = this.generateFallbackKeywordMap();
  this.data.line_keyword_map = this.generateFallbackLineKeywordMap();
}
```

### Fallback Mechanisms

1. **Partial Loading**: Continue with successfully loaded files
2. **Default Mappings**: Provide basic keyword mappings for common terms
3. **Error Reporting**: Detailed logging for debugging
4. **Graceful Degradation**: System continues to function with reduced accuracy

## Testing Strategy

### Unit Tests

1. **CompatibilityDataLoader Tests**

   - Test JSON file loading
   - Test keyword extraction accuracy
   - Test map generation correctness
   - Test error handling for malformed data

2. **DataManager Integration Tests**

   - Test compatibility data integration
   - Test fallback mechanisms
   - Test performance with large datasets

3. **Keyword Extraction Tests**
   - Test Japanese text processing
   - Test keyword normalization
   - Test deduplication logic

### Integration Tests

1. **End-to-End Analysis Tests**

   - Test complete Triple OS analysis flow
   - Test Interface OS determination
   - Test SafeMode OS determination
   - Test match score calculation

2. **Data Consistency Tests**
   - Verify all 64 hexagrams are processed
   - Verify keyword map completeness
   - Verify line keyword map accuracy

## Implementation Plan

### Phase 1: Core Data Loading Infrastructure

- Implement CompatibilityDataLoader class
- Add JSON file loading capabilities
- Implement basic keyword extraction

### Phase 2: Keyword Processing Engine

- Enhance keyword extraction algorithms
- Add Japanese text processing
- Implement normalization and deduplication

### Phase 3: DataManager Integration

- Integrate CompatibilityDataLoader with DataManager
- Update HAQEI_DATA structure
- Add fallback mechanisms

### Phase 4: Testing and Optimization

- Comprehensive testing of all components
- Performance optimization
- Error handling refinement

## Performance Considerations

### Loading Strategy

- **Lazy Loading**: Load compatibility data only when needed
- **Caching**: Cache processed keyword maps
- **Parallel Loading**: Load multiple JSON files concurrently
- **Progressive Enhancement**: Start with basic functionality, enhance gradually

### Memory Management

- **Efficient Storage**: Optimize keyword map data structures
- **Garbage Collection**: Proper cleanup of temporary processing data
- **Memory Monitoring**: Track memory usage during data processing

## Success Metrics

1. **Functionality**: Interface OS and SafeMode OS show specific hexagram names
2. **Accuracy**: Match scores > 0% for valid user responses
3. **Performance**: Data loading completes within 2 seconds
4. **Reliability**: System handles missing files gracefully
5. **Maintainability**: Easy to add new compatibility data files
