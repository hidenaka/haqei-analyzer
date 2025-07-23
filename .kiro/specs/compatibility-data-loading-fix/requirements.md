# Requirements Document

## Introduction

HaQei Analyzer のインターフェース OS とセーフモード OS が「分析不能」と表示され、マッチスコアが 0%になっている問題を解決する必要があります。この問題は、compatibility フォルダのデータが正しく読み込まれておらず、`keyword_map` と `line_keyword_map` が空のオブジェクトになっていることが原因です。

## Requirements

### Requirement 1

**User Story:** As a user, I want the Interface OS analysis to work properly, so that I can see my external behavioral patterns and interface style.

#### Acceptance Criteria

1. WHEN the Triple OS analysis is performed THEN the Interface OS SHALL be determined based on scenario question outer choices
2. WHEN keyword matching is performed for interface analysis THEN the system SHALL have access to a populated keyword_map
3. WHEN the interface analysis completes THEN the match score SHALL be greater than 0% for valid responses
4. WHEN the results are displayed THEN the Interface OS SHALL show a specific hexagram name instead of "分析不能"

### Requirement 2

**User Story:** As a user, I want the SafeMode OS analysis to work properly, so that I can understand my internal defensive patterns and stress responses.

#### Acceptance Criteria

1. WHEN the Triple OS analysis is performed THEN the SafeMode OS SHALL be determined based on scenario question inner choices
2. WHEN line keyword matching is performed for safemode analysis THEN the system SHALL have access to a populated line_keyword_map
3. WHEN the safemode analysis completes THEN the match score SHALL be greater than 0% for valid responses
4. WHEN the results are displayed THEN the SafeMode OS SHALL show a specific hexagram name instead of "分析不能"

### Requirement 3

**User Story:** As a developer, I want the compatibility data to be automatically loaded and processed, so that the keyword maps are available for OS analysis without manual intervention.

#### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL automatically load compatibility data from the compatibility folder
2. WHEN compatibility data is loaded THEN keyword_map SHALL be generated from engine-interface JSON files
3. WHEN compatibility data is loaded THEN line_keyword_map SHALL be generated from engine-safemode JSON files
4. WHEN data loading fails for some files THEN the system SHALL continue with available data and log warnings

### Requirement 4

**User Story:** As a developer, I want the keyword mapping system to be robust and extensible, so that it can handle various data formats and be easily maintained.

#### Acceptance Criteria

1. WHEN processing compatibility data THEN the system SHALL extract keywords from multiple data sources (strengths, challenges, descriptions)
2. WHEN generating keyword maps THEN the system SHALL handle missing or malformed data gracefully
3. WHEN keyword extraction occurs THEN the system SHALL normalize and deduplicate keywords
4. WHEN new compatibility data is added THEN the system SHALL automatically incorporate it into the keyword maps

### Requirement 5

**User Story:** As a developer, I want comprehensive error handling and logging for compatibility data loading, so that issues can be quickly identified and resolved.

#### Acceptance Criteria

1. WHEN compatibility data loading fails THEN the system SHALL log detailed error information
2. WHEN keyword maps are empty THEN the system SHALL provide clear diagnostic information
3. WHEN data processing encounters errors THEN the system SHALL continue operation with fallback mechanisms
4. WHEN debugging is needed THEN the system SHALL provide statistics on loaded data and keyword map sizes
