import { render, screen, act, fireEvent } from '@testing-library/react';
import { DemoDocumentGeneration } from '../DemoDocumentGeneration';
import { useDemoController } from '../../../stores/demoController';

// Mock the demo controller store
jest.mock('../../../stores/demoController', () => ({
  useDemoController: jest.fn()
}));

describe('DemoDocumentGeneration', () => {
  const mockTrackAction = jest.fn();
  const mockDemoSpeed = 'normal';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useDemoController as unknown as jest.Mock).mockImplementation(() => ({
      trackAction: mockTrackAction,
      demoSpeed: mockDemoSpeed
    }));
  });

  it('renders the document generation interface', () => {
    render(<DemoDocumentGeneration />);
    
    // Check for core UI elements
    // There are two elements with this text (h1 and h2)
    const rpaHeadings = screen.getAllByText('Residential Purchase Agreement');
    expect(rpaHeadings.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Generated for 8615 Circle R Course Ln, Escondido, CA 92026')).toBeInTheDocument();
    expect(screen.getByText('Send for Signatures')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('shows loading state during document generation', () => {
    render(<DemoDocumentGeneration />);
    
    // Check for loading overlay
    expect(screen.getByText('Generating RPA...')).toBeInTheDocument();
    expect(screen.getByText('Preparing document...')).toBeInTheDocument();
  });

  it('tracks document generation actions', async () => {
    jest.useFakeTimers();
    render(<DemoDocumentGeneration />);

    // Advance all timers to trigger both actions
    await act(async () => {
      jest.runAllTimers();
    });
    // Check that both actions were called
    expect(mockTrackAction).toHaveBeenCalledWith('rpa_generation_started');
    expect(mockTrackAction).toHaveBeenCalledWith('rpa_generated');
    jest.useRealTimers();
  });

  it('handles different demo speeds correctly', async () => {
    jest.useFakeTimers();
    
    // Test normal speed
    (useDemoController as unknown as jest.Mock).mockImplementation(() => ({
      trackAction: mockTrackAction,
      demoSpeed: 'normal'
    }));
    
    const { rerender } = render(<DemoDocumentGeneration />);
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
    expect(mockTrackAction).toHaveBeenCalledWith('rpa_generated');
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Test fast speed
    (useDemoController as unknown as jest.Mock).mockImplementation(() => ({
      trackAction: mockTrackAction,
      demoSpeed: 'fast'
    }));
    
    rerender(<DemoDocumentGeneration />);
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(mockTrackAction).toHaveBeenCalledWith('rpa_generated');
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Test instant speed
    (useDemoController as unknown as jest.Mock).mockImplementation(() => ({
      trackAction: mockTrackAction,
      demoSpeed: 'instant'
    }));
    
    rerender(<DemoDocumentGeneration />);
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(mockTrackAction).toHaveBeenCalledWith('rpa_generated');
    
    jest.useRealTimers();
  });

  it('shows completion state after generation', async () => {
    jest.useFakeTimers();
    render(<DemoDocumentGeneration />);

    // Fast forward through generation
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });

    // Check for completion elements
    expect(screen.getByText('RPA Generated')).toBeInTheDocument();
    expect(screen.getByText('Ready for signatures')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('handles signature action correctly', async () => {
    jest.useFakeTimers();
    render(<DemoDocumentGeneration />);

    // Fast forward through generation
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });

    // Click signature button
    fireEvent.click(screen.getByText('Send for Signatures'));
    expect(mockTrackAction).toHaveBeenCalledWith('signature_sent');
    
    jest.useRealTimers();
  });

  it('cleans up timers on unmount', () => {
    jest.useFakeTimers();
    const { unmount } = render(<DemoDocumentGeneration />);
    
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    
    // Unmount component
    unmount();
    
    // Verify cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    jest.useRealTimers();
  });
}); 