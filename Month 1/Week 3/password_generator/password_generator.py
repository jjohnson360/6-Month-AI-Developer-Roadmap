#!/usr/bin/env python3
"""
CLI Secure Password Generator
A lightweight utility to generate randomized, secure passwords with custom options.
"""

import random
import string

def generate_password(length: int, use_symbols: bool, use_numbers: bool) -> str:
    """Generate a random password based on specified criteria."""
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits if use_numbers else ""
    symbols = string.punctuation if use_symbols else ""
    
    # Ensure at least lowercase and uppercase are available
    pool = lowercase + uppercase + digits + symbols
    
    if length < 4:
        raise ValueError("Password length should be at least 4 characters for security.")
    
    # Generate password characters
    password = ''.join(random.choice(pool) for _ in range(length))
    return password

def get_yes_no(prompt: str) -> bool:
    """Prompt user for a yes/no response."""
    while True:
        choice = input(prompt).strip().lower()
        if choice in ['y', 'yes']:
            return True
        elif choice in ['n', 'no']:
            return False
        print("Please enter 'y' or 'n'.")

def main():
    print("=== Secure Password Generator ===")
    
    while True:
        try:
            length = int(input("Enter desired password length (minimum 4): "))
            break
        except ValueError:
            print("Invalid input. Please enter a valid integer.")
            
    use_nums = get_yes_no("Include numbers? (y/n): ")
    use_syms = get_yes_no("Include symbols/special characters? (y/n): ")
    
    try:
        password = generate_password(length, use_syms, use_nums)
        print(f"\nGenerated Password: {password}")
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()