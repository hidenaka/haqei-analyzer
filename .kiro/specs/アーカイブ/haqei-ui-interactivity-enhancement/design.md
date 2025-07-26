# Design Document

## Overview

This design enhances the HaQei Analyzer's Triple OS Results View to create an interactive, data-rich user experience. The solution addresses four critical areas: data reference corrections, visual interactivity indicators, structured detail displays, and expandable dynamics cards. The design maintains the existing component architecture while adding progressive disclosure patterns and smooth animations.

## Architecture

### Component Structure

The enhancement builds upon the existing `TripleOSResultsView` class without breaking changes:

```
TripleOSResultsView
├── Data Access Layer (Fixed References)
├── Visual Interaction Layer (New)
├── Animation System (Enhanced)
└── Event Management (Extended)
```

### Data Flow

1. **Corrected Data Access**: Fix object reference paths for OS data
2. **Progressive Disclosure**: Show basic info → expand to detailed insights
3. **Interactive Feedback**: Visual cues → user interaction → content reveal
4. **Smooth Transitions**: CSS animations coordinate with JavaScript state changes

## Components and Interfaces

### 1. Data Reference Correction System

**Problem**: Current code uses incorrect object paths like `this.analysisResult.osName`
**Solution**: Implement proper data access patterns

```javascript
// Current (incorrect)
this.analysisResult.osName;

// Fixed (correct)
this.analysisResult.engineOS.osName;
this.analysisResult.interfaceOS.osName;
this.analysisResult.safeModeOS.osName;
```

**Interface**:

```javascript
class DataAccessHelper {
  static getOSData(analysisResult, osType) {
    const osMap = {
      engine: analysisResult.engineOS,
      interface: analysisResult.interfaceOS,
      safemode: analysisResult.safeModeOS,
    };
    return osMap[osType] || null;
  }
}
```

### 2. Interactive Visual Indicators

**Expand/Collapse Icons**:

- Initial state: `+` icon (indicates expandable)
- Expanded state: `×` icon (indicates collapsible)
- Smooth 45-degree rotation animation

**HTML Structure**:

```html
<div class="os-card-header">
  <div class="os-icon">🔧</div>
  <div class="os-label-group">...</div>
  <div class="os-score-group">...</div>
  <span class="expand-icon">+</span>
</div>
```

**CSS Animation System**:

```css
.expand-icon {
  font-size: 1.5rem;
  font-weight: 300;
  transition: transform 0.4s ease;
  cursor: pointer;
}

.is-expanded .expand-icon {
  transform: rotate(45deg);
}
```

### 3. Structured Detail Display System

**Data Source**: `hexagram_details.js` provides structured data:

```javascript
hexagramDetails = {
  engine: {
    potential_strengths: ["strength1", "strength2"],
    potential_weaknesses: ["weakness1", "weakness2"],
  },
};
```

**Rendering Logic**:

```javascript
generateOSCardBody(osData, osType) {
  const details = this.dataManager.getHexagramDetails(osData.hexagramId);
  const strengths = details[osType]?.potential_strengths || [];
  const weaknesses = details[osType]?.potential_weaknesses || [];

  return `
    <h4>潜在的な強み</h4>
    <ul>${strengths.map(s => `<li>${s}</li>`).join('')}</ul>
    <h4>成長の課題</h4>
    <ul>${weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
  `;
}
```

### 4. Dynamics Card Interactive System

**Evaluation Metrics Display**:
Five key evaluation categories with visual progress bars:

1. 機能効率 (Functional Efficiency)
2. 適応性 (Adaptability)
3. 安定性 (Stability)
4. 表現力 (Expression Capability)
5. 調和維持 (Harmony Maintenance)

**HTML Structure**:

```html
<div class="dynamics-card" data-dynamics-type="interface">
  <div class="dynamics-header">
    <h4>インターフェース力学</h4>
    <span class="expand-icon">+</span>
  </div>
  <div class="dynamics-details">
    <div class="evaluation-item">
      <div class="evaluation-label">機能効率</div>
      <div class="evaluation-bar-container">
        <div class="evaluation-bar" style="width: 85%"></div>
      </div>
      <div class="evaluation-score">85%</div>
    </div>
    <!-- More evaluation items -->
  </div>
</div>
```

## Data Models

### Enhanced Analysis Result Structure

```javascript
analysisResult = {
  engineOS: {
    osName: string,
    hexagramId: number,
    strength: number,
    hexagramInfo: object,
  },
  interfaceOS: {
    osName: string,
    hexagramId: number,
    matchScore: number,
    hexagramInfo: object,
  },
  safeModeOS: {
    osName: string,
    hexagramId: number,
    matchScore: number,
    hexagramInfo: object,
  },
};
```

### Dynamics Evaluation Model

```javascript
dynamicsEvaluation = {
  interface: {
    functionalEfficiency: number, // 0-100
    adaptability: number, // 0-100
    stability: number, // 0-100
    expressionCapability: number, // 0-100
    harmonyMaintenance: number, // 0-100
  },
  safemode: {
    // Same structure
  },
};
```

## Error Handling

### Data Access Fallbacks

```javascript
function safeGetOSData(analysisResult, osType, property) {
  try {
    const osData = analysisResult[`${osType}OS`];
    return osData?.[property] || "データ取得中...";
  } catch (error) {
    console.warn(`Failed to get ${osType} ${property}:`, error);
    return "データ取得中...";
  }
}
```

### Missing Hexagram Details

```javascript
function getHexagramDetailsWithFallback(hexagramId) {
  const details = HEXAGRAM_DETAILS[hexagramId];
  if (!details) {
    return {
      potential_strengths: ["分析データを準備中です..."],
      potential_weaknesses: ["分析データを準備中です..."],
    };
  }
  return details;
}
```

## Testing Strategy

### Unit Tests

1. **Data Access Tests**: Verify correct object path resolution
2. **Animation Tests**: Ensure smooth expand/collapse transitions
3. **Event Handler Tests**: Validate click interactions and state changes
4. **Fallback Tests**: Test behavior with missing or invalid data

### Integration Tests

1. **Full Card Interaction Flow**: Click → expand → display details → collapse
2. **Multiple Card States**: Test simultaneous expansion of different cards
3. **Data Loading Scenarios**: Test with various data availability states
4. **Responsive Behavior**: Test on different screen sizes

### Visual Regression Tests

1. **Icon Animation**: Verify smooth rotation transitions
2. **Content Reveal**: Test max-height transitions for content areas
3. **Hover States**: Validate interactive feedback on hover
4. **Loading States**: Test placeholder content display

### Accessibility Tests

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **Screen Reader Support**: Test ARIA labels and announcements
3. **Focus Management**: Verify proper focus handling during interactions
4. **Color Contrast**: Ensure sufficient contrast for all text elements

## Implementation Phases

### Phase 1: Data Reference Fixes

- Fix OS data access patterns in `TripleOSResultsView.js`
- Update `generateOSCardBody` method
- Add data validation and fallbacks

### Phase 2: Visual Interaction Indicators

- Add expand icons to card headers
- Implement CSS animations for icon rotation
- Add hover states and cursor indicators

### Phase 3: Structured Detail Display

- Enhance card body content with structured lists
- Implement smooth expand/collapse animations
- Add proper content hierarchy with headings

### Phase 4: Dynamics Card Interactivity

- Make dynamics cards clickable
- Add evaluation metrics display
- Implement progress bar visualizations
- Add smooth content reveal animations

### Phase 5: Polish and Testing

- Refine animations and transitions
- Add accessibility features
- Implement comprehensive error handling
- Conduct thorough testing across devices
