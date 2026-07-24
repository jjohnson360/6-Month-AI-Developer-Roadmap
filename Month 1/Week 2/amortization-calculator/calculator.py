#!/usr/bin/env python3
"""
Financial Interest & Amortization Calculator
A pure Python script with input validation, zero-interest handling, 
and month-by-month breakdown generation.
"""

def get_positive_float(prompt: str) -> float:
    """Prompt the user for a positive float value with validation."""
    while True:
        try:
            value = float(input(prompt))
            if value < 0:
                print("Value cannot be negative. Please try again.")
                continue
            return value
        except ValueError:
            print("Invalid input. Please enter a valid number.")

def calculate_monthly_payment(principal: float, annual_rate: float, years: int) -> float:
    """Calculate the fixed monthly payment for a loan."""
    if annual_rate == 0:
        return principal / (years * 12)
    
    monthly_rate = annual_rate / 12 / 100
    total_payments = years * 12
    numerator = monthly_rate * ((1 + monthly_rate) ** total_payments)
    denominator = ((1 + monthly_rate) ** total_payments) - 1
    return principal * (numerator / denominator)

def generate_amortization_schedule(principal: float, annual_rate: float, years: int):
    """Generate and print the month-by-month amortization schedule."""
    monthly_payment = calculate_monthly_payment(principal, annual_rate, years)
    monthly_rate = annual_rate / 12 / 100 if annual_rate > 0 else 0
    balance = principal
    total_payments = years * 12

    print(f"\n--- Loan Summary ---")
    print(f"Principal Amount:     ${principal:,.2f}")
    print(f"Annual Interest Rate: {annual_rate:.2f}%")
    print(f"Loan Term:            {years} years ({total_payments} months)")
    print(f"Monthly Payment:      ${monthly_payment:,.2f}\n")

    print(f"{'Month':<6} | {'Payment':<10} | {'Principal':<10} | {'Interest':<10} | {'Balance':<12}")
    print("-" * 58)

    for month in range(1, total_payments + 1):
        if annual_rate > 0:
            interest_payment = balance * monthly_rate
            principal_payment = monthly_payment - interest_payment
        else:
            interest_payment = 0.0
            principal_payment = monthly_payment

        balance -= principal_payment
        
        # Prevent negative balance drift on final payment
        if balance < 0:
            balance = 0.0

        print(f"{month:<6} | ${monthly_payment:<9.2f} | ${principal_payment:<9.2f} | ${interest_payment:<9.2f} | ${balance:<11.2f}")

if __name__ == "__main__":
    print("=== Amortization Calculator ===")
    p = get_positive_float("Enter principal loan amount ($): ")
    r = get_positive_float("Enter annual interest rate (e.g., 5.5 for 5.5%): ")
    
    while True:
        try:
            y = int(input("Enter loan term in years: "))
            if y <= 0:
                print("Term must be at least 1 year.")
                continue
            break
        except ValueError:
            print("Invalid input. Please enter a whole integer for years.")

    generate_amortization_schedule(p, r, y)