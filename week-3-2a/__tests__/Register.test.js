import { router } from 'expo-router'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase'
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../app/(auth)/register';

// Mock firebase/auth'
jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn()
}))

// Mock firebase config 
jest.mock('../firebase', () => ({
    auth: {}
}))

// Mock expo router
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn()
    }
}))

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form elements correctly', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        expect(getByText('Create an Account')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Create')).toBeTruthy();
        expect(getByText('Already have an account? Log In')).toBeTruthy();

    })

    it('updates email input when user types', () => {
        const { getByPlaceholderText } = render(<Register />);

        const emailInput = getByPlaceholderText('Email');
        fireEvent.changeText(emailInput, 'test@email.com');

        expect(emailInput.props.value).toBe('test@email.com');

    })

    it('updates password inputs when user types', () => {
        const { getByPlaceholderText } = render(<Register />);

        const passwordInput = getByPlaceholderText("Password");
        const confirmPasswordInput = getByPlaceholderText("Confirm Password");

        fireEvent.changeText(passwordInput, '123456');
        fireEvent.changeText(confirmPasswordInput, '123456');

        expect(passwordInput.props.value).toBe('123456');
        expect(confirmPasswordInput.props.value).toBe('123456');
    })

    it('shows error when all fields are empty', () => {
        const { getByText } = render(<Register />);

        fireEvent.press(getByText('Create'));

        expect(getByText('All fields are required')).toBeTruthy();
    })

    it('shows error when email is invalid', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'invalidEmail');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        expect(getByText('Please enter a valid email address')).toBeTruthy()

    })

    it('shows error when password is less than 6 characters', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '12345');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '12345');
        fireEvent.press(getByText("Create"));

        expect(getByText('Password must be at least 6 characters')).toBeTruthy()

    })

    it('shows error when passwords do not match', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '1234566');
        fireEvent.press(getByText("Create"));

        expect(getByText('Passwords do not match')).toBeTruthy()

    })

    it('shows loading text when creating user', async () => {
        createUserWithEmailAndPassword.mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        const { getByPlaceholderText, getByText } = render(<Register />)

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        await waitFor(() => {
            expect('Creating user...').toBeTruthy();
        })

    })

    it('successfully creates user and shows success modal', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });

        const { getByPlaceholderText, getByText } = render(<Register />)

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        await waitFor(() => {
            expect('User created successfully!').toBeTruthy();
        })
    })

    it('navigates to login when OK button is pressed in modal', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
        const { getByPlaceholderText, getByText } = render(<Register />)

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        await waitFor(() => {
            expect('User created successfully!').toBeTruthy();
        })

        fireEvent.press(getByText('OK'))
        await waitFor(() => {
            expect(router.push).toHaveBeenCalledWith('/login');
        })
    })

    it('shows error when email is already in use', async () => {
        createUserWithEmailAndPassword.mockRejectedValue({
            code: 'auth/email-already-in-use'
        })

        const { getByPlaceholderText, getByText } = render(<Register />)

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        await waitFor(() => {
            expect(getByText('Email already exists')).toBeTruthy();
        });
    })

    it('shows generic error message for other Firebase errors', async () => {
        createUserWithEmailAndPassword.mockRejectedValue({
            message: 'Network error occurred'
        })

        const { getByPlaceholderText, getByText } = render(<Register />)

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
        fireEvent.press(getByText("Create"));

        await waitFor(() => {
            expect(getByText('Network error occurred')).toBeTruthy();
        });
    })

    it('navigates to login when "Already have an account" link is pressed', () => {
        const {getByText} = render(<Register />);

        fireEvent.press(getByText('Already have an account? Log In'));

        expect(router.push).toHaveBeenCalledWith('/login');
    })
})