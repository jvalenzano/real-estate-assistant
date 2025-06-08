# Power User Scenario Testing Guide

## Overview
The Power User scenario demonstrates a comprehensive 3-minute real estate transaction workflow designed for sophisticated investors. This guide will help you test all features and ensure proper functionality.

## Pre-Testing Setup

1. **Navigate to the demo application**
2. **Login**: Use demo credentials (sarah@realeai.com, mike@realeai.com, or investor@realeai.com)
3. **Welcome Screen**: Verify circular scenario badges (#1, #2, #3) are displayed prominently
4. **Select Power User Scenario**: Click "Advanced Features Demo" card with circular #2 badge
5. **Auto-Start Verification**: Scenario should start automatically after selection
6. **Open DemoController**: Press `Ctrl+D` to show the metrics overlay with sign-out button
7. **Verify Initial State**: Ensure the scenario is selected and auto-started

## Testing Sections

### 1. Scenario Selection and Setup
**Expected Behavior:**
- Power User scenario button should be highlighted in blue
- Metrics overlay should show "Power User (3m)" as current scenario
- Total steps should show 6 steps
- Current step should show "Ready to start demo"

**Test Steps:**
1. Press `Ctrl+D` to open DemoController
2. Click "Power User (3m)" button
3. Verify scenario selection is highlighted
4. Check metrics display shows correct scenario

### 2. Automated Scenario Start
**Expected Behavior:**
- Scenario should start automatically when pressing `Ctrl+S`
- Timer should begin counting
- First step should begin (Property Search)

**Test Steps:**
1. Press `Ctrl+S` to start the scenario
2. Verify timer starts counting in metrics overlay
3. Confirm "Starting scenario..." message appears
4. Watch for automatic progression to property details

### 3. Property Comparison Phase (25 seconds)
**Expected Behavior:**
- Property comparison grid should appear after ~5 seconds
- Three properties should be displayed side-by-side
- Properties should animate in sequentially
- Best ROI property (Oak Avenue) should be automatically selected
- "Best ROI Choice" badge should appear

**Test Steps:**
1. Watch for property comparison grid to appear
2. Verify all three properties are displayed with metrics
3. Confirm sequential animation of property cards
4. Check that Oak Avenue property gets selected automatically
5. Verify "Best ROI Choice" badge appears
6. Confirm metrics update to show "Comparing properties..."

### 4. RPA Customization Phase (40 seconds)
**Expected Behavior:**
- Document generation view should load
- Customization panel should appear with purple theme
- Four customization options should animate in
- Custom terms should be applied sequentially
- Form fields should auto-fill with enhanced data
- Custom fields should be highlighted with purple indicators

**Test Steps:**
1. Verify transition to document generation view
2. Watch for purple customization panel to appear
3. Confirm four customization options (Contingency, Financing, Inspection, Closing)
4. Check that options get "Applied" status sequentially
5. Verify form auto-fill with custom terms
6. Confirm purple indicators on custom fields
7. Check "Enhanced Terms Applied" section appears

### 5. Enhanced Signature Workflow (45 seconds)
**Expected Behavior:**
- Signature view should load with enhanced features
- Document progress section should show 4 documents
- Multiple signature rounds should occur (4 docs × 3 signers = 12 signatures)
- Progress percentage should update continuously
- Document completion should be tracked
- All documents should be marked as signed

**Test Steps:**
1. Verify transition to enhanced signature view
2. Check document progress section shows 4 documents
3. Watch signature workflow progress through all documents
4. Confirm progress percentage updates (0% → 100%)
5. Verify each document gets marked as "Complete"
6. Check final completion message appears

### 6. Transaction Completion (30 seconds)
**Expected Behavior:**
- Final completion view should appear
- All signatures and documents should be marked complete
- Success message should display
- Metrics should show "TRANSACTION COMPLETE"
- Timer should stop

**Test Steps:**
1. Verify transition to completion view
2. Check all documents show "Complete" status
3. Confirm success message appears
4. Verify metrics show completion status
5. Check timer stops counting

### 7. Speed Controls Testing
**Expected Behavior:**
- `Ctrl+3`: Fast mode (0.5x speed) - ~1.5 minutes total
- `Ctrl+4`: Normal mode (1.0x speed) - ~3 minutes total  
- `Ctrl+5`: Instant mode (0.1x speed) - ~18 seconds total

**Test Steps:**
1. Reset scenario with `Ctrl+R`
2. Test each speed mode:
   - Press `Ctrl+3` then `Ctrl+S` for fast mode
   - Reset and press `Ctrl+4` then `Ctrl+S` for normal mode
   - Reset and press `Ctrl+5` then `Ctrl+S` for instant mode
3. Verify timing differences
4. Confirm all features work at different speeds

### 8. Emergency Controls Testing
**Expected Behavior:**
- `Ctrl+1`: Jump to Document Generation phase
- `Ctrl+2`: Jump to Success/Completion phase
- `Ctrl+R`: Reset to beginning
- `Ctrl+Space`: Pause/Resume automation

**Test Steps:**
1. Start Power User scenario
2. Test `Ctrl+1` - should jump to RPA customization
3. Test `Ctrl+2` - should jump to completion
4. Test `Ctrl+R` - should reset to beginning
5. Start scenario and test `Ctrl+Space` for pause/resume
6. Verify all controls work during automation

### 9. Visual and UI Testing
**Expected Behavior:**
- Purple theme elements for Power User features
- Smooth animations and transitions
- Responsive design elements
- Clear visual hierarchy
- Professional appearance

**Test Steps:**
1. Verify purple color scheme for Power User elements
2. Check smooth transitions between phases
3. Confirm animations work properly
4. Test on different screen sizes if possible
5. Verify text readability and contrast

### 10. Integration Testing
**Expected Behavior:**
- Seamless switching between scenarios
- Proper state management
- No conflicts with Happy Path scenario
- Metrics accuracy
- Auto-start functionality works consistently

**Test Steps:**
1. Switch between Power User and Happy Path scenarios from Welcome Screen
2. Verify each scenario auto-starts when selected
3. Verify each scenario maintains its own timing and features
4. Test scenario switching during automation
5. Confirm metrics update correctly for each scenario
6. Test sign-out button functionality from metrics overlay

### 11. New Features Testing
**Expected Behavior:**
- Auto-start works from Welcome Screen and AI Discovery
- Circular scenario badges display prominently
- Sign-out button accessible in metrics overlay

**Test Steps:**
1. **Auto-Start**: Select Power User from Welcome Screen, verify immediate start
2. **Circular Badges**: Confirm #2 badge is prominently displayed on scenario card
3. **Sign-Out Access**: Press Ctrl+D and verify sign-out button is available
4. **ARIA Integration**: If coming from AI Discovery, verify auto-start still works

## Success Criteria

✅ **All phases complete in proper sequence**
✅ **Property comparison shows 3 properties with automatic selection**
✅ **RPA customization shows 4 enhancement areas**
✅ **Signature workflow handles 4 documents with progress tracking**
✅ **Speed controls work correctly (Fast/Normal/Instant)**
✅ **Emergency controls function during automation**
✅ **Purple theme elements appear for Power User features**
✅ **Smooth transitions and animations throughout**
✅ **Metrics tracking accurate for 3-minute flow**
✅ **Auto-start functionality works from Welcome Screen**
✅ **Circular scenario badges (#1, #2, #3) display prominently**
✅ **Sign-out button accessible in metrics overlay**
✅ **No errors in browser console**

## Troubleshooting

**If scenario doesn't start:**
- Verify Power User scenario is selected
- Check browser console for errors
- Try refreshing and selecting scenario again

**If timing seems off:**
- Check speed setting (Ctrl+3/4/5)
- Verify no other timers are interfering
- Reset with Ctrl+R and try again

**If animations are choppy:**
- Check browser performance
- Close other tabs/applications
- Try instant mode (Ctrl+5) for testing

**If emergency controls don't work:**
- Ensure focus is on the demo application
- Try clicking on the page first
- Check that Ctrl key is being held properly

## Reporting Issues

When reporting issues, please include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Screenshot or screen recording if helpful

---

**Total Test Time:** ~15-20 minutes for comprehensive testing
**Quick Test Time:** ~5 minutes for basic functionality verification 