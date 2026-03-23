import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
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
});
