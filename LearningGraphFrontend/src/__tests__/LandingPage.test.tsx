import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../pages/LandingPage';
import { describe, it, expect, vi } from 'vitest';

// Mock hooks
vi.mock('../hooks/auth', () => ({
  useAuth: () => ({
    username: 'testuser',
    logout: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock GraphCanvas so we don’t have to render actual canvas
vi.mock('../components/GraphCanvas', () => ({
  default: () => <div data-testid="graph-canvas" />,
}));

describe('LandingPage', () => {
  it('renders GraphCanvas', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('graph-canvas')).toBeInTheDocument();
  });
});
