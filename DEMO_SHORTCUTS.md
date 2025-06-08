# DemoController Keyboard Shortcuts

## Overview
The DemoController provides powerful keyboard shortcuts for seamless demo presentations. These shortcuts allow presenters to navigate scenarios, control demo speed, and reveal metrics contextually during investor presentations.

## Primary Controls

### Stealth Mode Toggle
- **Ctrl + D**: Toggle metrics overlay visibility
  - **Purpose**: Show/hide the full-screen metrics overlay
  - **Use Case**: Reveal impressive metrics when investors ask about time savings
  - **Visual**: Full-screen overlay with real-time metrics and progress tracking
  - **New Feature**: Sign out button available in metrics overlay for easy logout

### Emergency Navigation
- **Ctrl + 1**: Jump to Document Generation
  - **Purpose**: Instantly navigate to the RPA generation step
  - **Use Case**: Skip to the "magic moment" of automated document creation
  - **Effect**: Updates metrics to show document generation in progress

- **Ctrl + 2**: Jump to Success State
  - **Purpose**: Instantly navigate to transaction completion
  - **Use Case**: Show the final success state and completion metrics
  - **Effect**: Displays "TRANSACTION COMPLETE" with full time savings

- **Ctrl + R**: Reset Demo
  - **Purpose**: Reset the entire demo to initial state
  - **Use Case**: Start fresh for a new presentation or recover from errors
  - **Effect**: Preserves current scenario but resets all progress and metrics

## Speed Controls

### Demo Pace Adjustment
- **Ctrl + 3**: Set to Fast Speed
  - **Purpose**: Accelerate animations and transitions (0.5x timing)
  - **Use Case**: Speed up demo for time-constrained presentations

- **Ctrl + 4**: Set to Normal Speed
  - **Purpose**: Return to standard demo pace (1.0x timing)
  - **Use Case**: Default presentation speed for detailed walkthroughs

- **Ctrl + 5**: Set to Instant Speed
  - **Purpose**: Skip animations for immediate results (0.1x timing)
  - **Use Case**: Quick demonstrations or when focusing on outcomes

## Presenter Guidelines

### Best Practices
1. **Practice the shortcuts** before live presentations
2. **Use Ctrl + D strategically** - reveal metrics only when investors ask about value
3. **Keep Ctrl + R ready** as a safety net for demo recovery
4. **Adjust speed based on audience** - use faster speeds for technical audiences

### Demo Flow Recommendations
1. **Start clean** - metrics hidden by default (stealth mode)
2. **Auto-start advantage** - scenarios now start automatically when selected
3. **Build narrative** - let the story unfold naturally, ARIA interaction engages during search
4. **Reveal metrics contextually** - use Ctrl + D when discussing time savings
5. **Use emergency controls sparingly** - only when needed for flow or recovery

### Troubleshooting
- If shortcuts don't work, ensure the browser window has focus
- All shortcuts require the Ctrl key to be held down
- Shortcuts work regardless of which demo component is currently active

## Technical Notes
- Shortcuts are handled at both component and store levels for reliability
- State changes are immediate and trigger smooth animations
- All shortcuts prevent default browser behavior to avoid conflicts
- Keyboard events are captured globally within the application context 