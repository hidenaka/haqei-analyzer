# Design Document

## Overview

The HAQEI_DATA loading issue in analyzer.html is caused by a timing problem where DataManager.loadData() is called before the data_box.js script has finished executing and setting window.HAQEI_DATA. This results in the application failing to initialize properly.

## Architecture

### Current Data Loading Flow

1. HTML loads scripts in order
2. DataManager is instantiated
3. DataManager.loadData() is called immediately
4. data_box.js may still be loading/executing
5. window.HAQEI_DATA is undefined when checked

### Proposed Solution Architecture

1. **Script Loading Order Verification**: Ensure data_box.js loads before DataManager initialization
2. **Async Data Loading**: Implement proper async/await pattern for data loading
3. **Data Availability Checking**: Add robust checks for data availability before proceeding
4. **Fallback Mechanism**: Improve fallback data handling for missing data sources

## Components and Interfaces

### DataManager Enhancement

- **loadData()**: Enhanced with proper async loading and data availability checks
- **waitForData()**: New method to wait for global data to be available
- **validateDataIntegrity()**: New method to verify loaded data structure
- **getDataStats()**: Fix missing method that's causing the current error

### Script Loading Manager

- **ensureDataLoaded()**: Utility function to ensure all required data is loaded
- **checkGlobalDataAvailability()**: Function to verify global data objects exist

### Error Handling Enhancement

- **DataLoadingError**: Custom error class for data loading issues
- **gracefulFallback()**: Enhanced fallback mechanism with better error reporting

## Data Models

### HAQEI_DATA Structure

```javascript
window.HAQEI_DATA = {
  hexagrams: hexagrams_master, // Array of hexagram objects
  hexagrams_master, // Same as hexagrams (legacy compatibility)
  os_manual, // Object with hexagram ID keys
  trigrams_master, // Array of trigram data
  element_relationships, // Array of element relationship data
  action_plans, // Object with action plan data
  sho_den, // Object with sho_den data
  tai_sho_den, // Object with tai_sho_den data
  jo_ka_den, // Object with jo_ka_den data
  zatsu_ka_den, // Object with zatsu_ka_den data
};
```

### DataManager.data Structure

```javascript
this.data = {
  questions: {
    worldview: [], // Array of worldview questions
    scenarios: [], // Array of scenario questions
  },
  vectors: {}, // H64_8D_VECTORS object
  hexagrams: {}, // From HAQEI_DATA.hexagrams
  osManual: {}, // From HAQEI_DATA.os_manual
  trigramsMaster: [], // From HAQEI_DATA.trigrams_master
  elementRelationships: [], // From HAQEI_DATA.element_relationships
  actionPlans: {}, // From HAQEI_DATA.action_plans
  bible: {}, // From BIBLE_DATA (optional)
  tuanDen: {}, // From HAQEI_DATA.tuan_den
  taiShoDen: {}, // From HAQEI_DATA.tai_sho_den
  shoDen: {}, // From HAQEI_DATA.sho_den
  joKaDen: {}, // From HAQEI_DATA.jo_ka_den
  zatsuKaDen: {}, // From HAQEI_DATA.zatsu_ka_den
};
```

## Error Handling

### Current Error Scenarios

1. **HAQEI_DATA undefined**: When data_box.js hasn't finished loading
2. **Missing getDataStats method**: Method called but not defined in DataManager
3. **Partial data loading**: Some global variables available, others missing

### Error Handling Strategy

1. **Graceful Degradation**: Continue with available data when possible
2. **Detailed Logging**: Provide specific information about what data is missing
3. **User-Friendly Messages**: Convert technical errors to user-understandable messages
4. **Retry Mechanism**: Attempt to reload missing data sources

## Testing Strategy

### Unit Tests

- Test DataManager.loadData() with various data availability scenarios
- Test fallback mechanisms when data is partially available
- Test error handling for completely missing data

### Integration Tests

- Test full application initialization flow
- Test data loading timing with different script loading orders
- Test backward compatibility with existing data structures

### Performance Tests

- Measure data loading time before and after fixes
- Ensure no significant performance degradation
- Test memory usage with fallback data structures

## Implementation Phases

### Phase 1: Immediate Fix

- Add missing getDataStats() method to DataManager
- Implement proper async data loading with retry mechanism
- Fix script loading order issues

### Phase 2: Robust Error Handling

- Implement comprehensive error handling and logging
- Add data validation and integrity checks
- Improve fallback mechanisms

### Phase 3: Performance Optimization

- Optimize data loading performance
- Implement lazy loading for non-critical data
- Add caching mechanisms for frequently accessed data
