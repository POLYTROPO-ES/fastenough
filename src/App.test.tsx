import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  window.history.replaceState({}, '', '/');
  cleanup();
  vi.restoreAllMocks();
});

describe('App', () => {
  it('renders the updated speedometer title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Fast enough' })).toBeInTheDocument();
  });

  it('shows diff mode on overlay mark when speed limit is active', async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId('distance-slider'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('speed-limit-slider'), { target: { value: '100' } });

    await waitFor(() => {
      expect(screen.getByTestId('overlay-100')).toHaveTextContent('0m');
    });
  });

  it('updates copy when language changes to Spanish', async () => {
    render(<App />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'es' },
    });

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Idioma' })).toBeInTheDocument();
    });
  });

  it('updates current speed when clicking current ring', async () => {
    render(<App />);

    vi.spyOn(SVGSVGElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 600,
      bottom: 600,
      width: 600,
      height: 600,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerDown(screen.getByTestId('ring-current'), {
      clientX: 155,
      clientY: 535,
      pointerType: 'mouse',
    });

    await waitFor(() => {
      const parsed = Number(screen.getByTestId('speed-value').textContent ?? '0');
      expect(parsed).toBeLessThan(15);
    });
  });

  it('updates speed limit when touching limit ring', async () => {
    render(<App />);

    vi.spyOn(SVGSVGElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 600,
      bottom: 600,
      width: 600,
      height: 600,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerDown(screen.getByTestId('ring-limit'), {
      clientX: 155,
      clientY: 535,
      pointerType: 'touch',
    });

    await waitFor(() => {
      const limitSlider = screen.getByTestId('speed-limit-slider') as HTMLInputElement;
      expect(Number(limitSlider.value)).toBeLessThan(15);
    });
  });

  it('initializes values from URL settings parameters', () => {
    window.history.replaceState({}, '', '/?d=250&s=132&l=120');
    render(<App />);

    const distanceSlider = screen.getByTestId('distance-slider') as HTMLInputElement;
    const speedSlider = screen.getByTestId('speed-slider') as HTMLInputElement;
    const limitSlider = screen.getByTestId('speed-limit-slider') as HTMLInputElement;

    expect(distanceSlider.value).toBe('250');
    expect(speedSlider.value).toBe('132');
    expect(limitSlider.value).toBe('120');
  });

  it('uses fallback defaults when URL has no settings parameters', () => {
    window.history.replaceState({}, '', '/');
    render(<App />);

    const distanceSlider = screen.getByTestId('distance-slider') as HTMLInputElement;
    const speedSlider = screen.getByTestId('speed-slider') as HTMLInputElement;
    const limitSlider = screen.getByTestId('speed-limit-slider') as HTMLInputElement;

    expect(distanceSlider.value).toBe('100');
    expect(speedSlider.value).toBe('130');
    expect(limitSlider.value).toBe('120');
  });

  it('creates share link with d s l parameters', async () => {
    window.history.replaceState({}, '', '/');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);
    const distanceSlider = screen.getByTestId('distance-slider') as HTMLInputElement;
    const speedSlider = screen.getByTestId('speed-slider') as HTMLInputElement;
    const limitSlider = screen.getByTestId('speed-limit-slider') as HTMLInputElement;

    fireEvent.click(screen.getByTestId('share-settings-btn'));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText.mock.calls[0][0]).toContain(
        `?d=${distanceSlider.value}&s=${speedSlider.value}&l=${limitSlider.value}`,
      );
    });
  });
});
