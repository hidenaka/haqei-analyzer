# Implementation Plan

- [ ] 1. Create CompatibilityDataLoader Class

  - Implement core class structure with loading orchestration methods
  - Add JSON file loading capabilities for engine-interface and engine-safemode data
  - Implement error handling for missing or corrupted files
  - Add progress tracking and logging for data loading process
  - _Requirements: 3.1, 3.4, 5.1, 5.3_

- [ ] 2. Implement Keyword Extraction Engine

  - Create keyword extraction methods for Japanese text processing
  - Extract keywords from strengths, challenges, and description fields
  - Implement keyword normalization and deduplication logic
  - Add support for trigram and dimension-related keyword detection
  - _Requirements: 4.1, 4.3, 3.2, 3.3_

- [ ] 3. Build Keyword Map Generation System

  - Generate keyword_map from engine-interface compatibility data
  - Generate line_keyword_map from engine-safemode compatibility data
  - Implement proper data structure formatting for TripleOSEngine compatibility
  - Add validation for generated keyword maps
  - _Requirements: 3.2, 3.3, 1.2, 2.2_

- [ ] 4. Integrate with DataManager

  - Add loadCompatibilityData() method to DataManager class
  - Update getKeywordMap() and getLineKeywordMap() methods to use loaded data
  - Implement fallback mechanisms for when compatibility data loading fails
  - Add compatibility data loading to the main data loading flow
  - _Requirements: 3.1, 5.3, 4.4_

- [ ] 5. Enhance HAQEI_DATA Structure

  - Extend HAQEI_DATA object to include keyword_map and line_keyword_map
  - Ensure backward compatibility with existing data structure
  - Add data validation for the extended structure
  - Update data loading sequence to include compatibility data
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6. Fix TripleOSEngine Analysis Flow

  - Ensure TripleOSEngine can access populated keyword maps
  - Fix Interface OS analysis to use keyword_map for matching
  - Fix SafeMode OS analysis to use line_keyword_map for matching
  - Add proper error handling when keyword maps are empty
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

- [ ] 7. Implement Comprehensive Error Handling and Logging

  - Add detailed error logging for compatibility data loading failures
  - Implement diagnostic information for empty keyword maps
  - Create fallback mechanisms for partial data loading failures
  - Add statistics reporting for loaded data and keyword map sizes
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 8. Testing and Validation
  - Test complete Triple OS analysis flow with loaded compatibility data
  - Validate that Interface OS and SafeMode OS show proper hexagram names
  - Verify match scores are greater than 0% for valid responses
  - Test error handling and fallback mechanisms
  - _Requirements: 1.4, 2.4, 3.4, 4.2_
