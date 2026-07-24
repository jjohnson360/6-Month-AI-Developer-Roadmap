#!/usr/bin/env python3
"""
CLI Calculator
A clean, robust command-line calculator supporting basic arithmetic and error handling.
"""

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Error: Division by zero is undefined.")
    return a / b

def power(a, b):
    return a ** b

def get_number(prompt: str) -> float:
    """Prompt user for a valid number."""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Invalid input. Please enter a valid number.")

def main():
    print("=== Python CLI Calculator ===")
    print("Operations: +, -, *, /, ^ (power)")
    
    num1 = get_number("Enter first number: ")
    op = input("Enter operator (+, -, *, /, ^): ").strip()
    num2 = get_number("Enter second number: ")

    try:
        if op == '+':
            result = add(num1, num2)
        elif op == '-':
            result = subtract(num1, num2)
        elif op == '*':
            result = multiply(num1, num2)
        elif op == '/':
            result = divide(num1, num2)
        elif op == '^':
            result = power(num1, num2)
        else:
            print(f"Unknown operator: {op}")
            return
        
        print(f"Result: {num1} {op} {num2} = {result}")
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()