# Design Document

## Overview

The data structure validation errors occur because the current DataManager expects hexagrams data in object format (with hexagram_id as keys), but the data is being loaded as an array. The validation system needs to be enhanced to handle flexible data formats and perform automatic data transformation.

## Architecture

### Current Data Flow Issue

1. data_box.js exports hexagrams_master as an array
2. DataManager loads it as HAQEI_DATA.hexagrams (still array)
3. validateDataStructure() expects object format
4. Validation fails with type mismatch error

### Proposed Solution Architecture

1. **Flexible Data Validation**: Update validation to accept both array and object formats
2. **Automatic Data Transformation**: Convert arrays to objects when needed
3. **Enhanced Error Reporting**: Provide specific guidance for data format issues
4. **Backward Compatibility**: Ensure existing object-format data continues to work

## Components and Interfaces

### Enhanced DataManager Methods

#### validateDataStructure()

```javascript
validateDataStructure(data) {
  // Enhanced validation that accepts flexible formats
  // Provides detailed error reporting with suggested fixes
  // Returns validation result with transformation recommendations
}
```

#### transformDataForBackwardCompatibility()

```javascript
transformDataForBackwardCompatibility(data) {
  // Convert array formats to expected object formats
  // Handle hexagrams array → object conversion
  // Maintain data integrity during transformation
  // Log transformation activities
}
```

#### normalizeHexagramsData()

```javascript
normalizeHexagramsData(hexagramsData) {
  // Convert array format to object format using hexagram_id as key
  // Handle both array and object inputs
  // Preserve all original properties
}
```

### Data Transformation Logic

#### Array to Object Conversion

```javascript
// Input: Array format
[
  { hexagram_id: 1, name_jp: "乾為天", ... },
  { hexagram_id: 2, name_jp: "坤為地", ... }
]

// Output: Object format
{
  1: { hexagram_id: 1, name_jp: "乾為天", ... },
  2: { hexagram_id: 2, name_jp: "坤為地", ... }
}
```

## Data Models

### Expected Data Structure After Transformation

```javascript
this.data = {
  questions: {
    worldview: Array, // Validated as array
    scenarios: Array, // Validated as array
  },
  vectors: Object, // Validated as object
  hexagrams: Object, // Converted from array if needed
  osManual: Object, // Expected as object
  // ... other properties
};
```

### Validation Configuration

```javascript
const validationRules = {
  questions: {
    type: "object",
    required: true,
    properties: {
      worldview: { type: "array", required: true },
      scenarios: { type: "array", required: true },
    },
  },
  vectors: { type: "object", required: true },
  hexagrams: {
    type: "object",
    required: true,
    allowArrayConversion: true, // New flag for flexible validation
  },
  osManual: { type: "object", required: true },
};
```

## Error Handling

### Enhanced Error Messages

- **Before**: "プロパティ 'hexagrams' はオブジェクトである必要があります"
- **After**: "hexagrams データが配列形式で提供されました。オブジェクト形式に自動変換します。"

### Validation Error Categories

1. **Type Mismatch with Auto-Fix**: Data can be automatically converted
2. **Type Mismatch without Auto-Fix**: Manual intervention required
3. **Missing Required Data**: Data is completely absent
4. **Structural Issues**: Data exists but has wrong internal structure

## Testing Strategy

### Unit Tests

- Test array to object conversion for hexagrams data
- Test validation with both array and object inputs
- Test error handling for malformed data
- Test backward compatibility with existing object data

### Integration Tests

- Test full data loading flow with array-format hexagrams
- Test validation and transformation in realistic scenarios
- Test performance impact of data transformation

### Data Format Tests

```javascript
// Test cases for different data formats
testArrayFormat(); // hexagrams as array
testObjectFormat(); // hexagrams as object
testMixedFormat(); // some arrays, some objects
testMalformedData(); // invalid data structures
```

## Implementation Strategy

### Phase 1: Immediate Fix

1. Update validateDataStructure() to handle array formats
2. Implement automatic array-to-object conversion for hexagrams
3. Add detailed logging for transformation process

### Phase 2: Enhanced Validation

1. Create flexible validation rules system
2. Implement comprehensive error reporting
3. Add data format detection and recommendation

### Phase 3: Optimization

1. Optimize transformation performance
2. Add caching for transformed data
3. Implement lazy transformation for large datasets
