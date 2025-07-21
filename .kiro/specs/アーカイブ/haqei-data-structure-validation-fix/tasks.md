# Implementation Plan

- [x] 1. Fix immediate validation errors in DataManager

  - Update validateDataStructure() method to accept both array and object formats for hexagrams
  - Add flexible type checking that can handle data format variations
  - Implement immediate error suppression for known convertible formats
  - _Requirements: 1.1, 2.1, 2.2_

- [x] 2. Implement automatic data transformation

  - Create normalizeHexagramsData() method to convert array format to object format
  - Add array-to-object conversion using hexagram_id as key
  - Ensure all original data properties are preserved during transformation
  - _Requirements: 1.1, 1.3, 3.1_

- [ ] 3. Enhance transformDataForBackwardCompatibility() method

  - Add hexagrams array-to-object conversion logic
  - Implement detection of data format before transformation
  - Add comprehensive logging for all transformation activities
  - _Requirements: 3.1, 3.2, 4.2_

- [ ] 4. Update validation rules and error handling

  - Create flexible validation configuration that accepts multiple data formats
  - Implement specific error messages with actionable guidance
  - Add validation warnings vs errors distinction for auto-fixable issues
  - _Requirements: 2.1, 2.2, 4.1, 4.3_

- [ ] 5. Add comprehensive data transformation logging

  - Log data format detection results
  - Log transformation process with before/after states
  - Add debug information for data structure analysis
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. Create unit tests for data transformation

  - Test array-to-object conversion for hexagrams data
  - Test validation with both array and object input formats
  - Test error handling for malformed or incomplete data
  - _Requirements: 1.2, 2.3, 3.3_

- [ ] 7. Implement integration testing for data validation

  - Test full data loading flow with different data formats
  - Verify backward compatibility with existing object-format data
  - Test performance impact of data transformation processes
  - _Requirements: 1.2, 1.3, 3.1_

- [ ] 8. Update error messages and documentation
  - Replace technical error messages with user-friendly explanations
  - Add troubleshooting guide for common data format issues
  - Document supported data formats and transformation behavior
  - _Requirements: 2.2, 4.3_
