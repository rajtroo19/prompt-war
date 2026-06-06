import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from '../components/Onboarding';
import { getUserProfile, clearChatMessages } from '../lib/storage';

// Mock the storage functions
jest.mock('../lib/storage', () => {
  const actual = jest.requireActual('../lib/storage');
  return {
    ...actual,
    saveUserProfile: jest.fn(),
  };
});

describe('Onboarding & Auth Flow', () => {
  let mockOnComplete: jest.Mock;

  beforeEach(() => {
    mockOnComplete = jest.fn();
    jest.clearAllMocks();
  });

  it('renders the welcome screen initially', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.getByText(/Welcome to MindPrep/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('navigates to the Auth screen and switches between Login and Sign up', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    // Click get started
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    
    // Default is Sign Up
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    
    // Switch to Login
    fireEvent.click(screen.getByText(/Already have an account\? Log in/i));
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Enter your name/i)).not.toBeInTheDocument();
    
    // Switch back to Sign up
    fireEvent.click(screen.getByText(/Need an account\? Sign up/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  it('disables auth button if fields are empty', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    
    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    expect(continueBtn).toBeDisabled();
    
    // Fill only name
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Rajeev' } });
    expect(continueBtn).toBeDisabled();
    
    // Fill email
    fireEvent.change(screen.getByPlaceholderText(/student@example.com/i), { target: { value: 'test@test.com' } });
    expect(continueBtn).toBeDisabled();
    
    // Fill password
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    expect(continueBtn).not.toBeDisabled();
  });
});
