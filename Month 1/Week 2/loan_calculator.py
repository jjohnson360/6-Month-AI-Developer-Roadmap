"""
Pure Python Loan Calculator
---------------------------
Calculates loan monthly payments, total interest, total cost,
and optional amortization schedules with precise Decimal currency rounding.

No external dependencies required.
"""

from decimal import Decimal, ROUND_HALF_UP
import sys


def round_currency(val: Decimal) -> Decimal:
    """
    Rounds a Decimal value to 2 decimal places using half-up rounding.
    
    >>> round_currency(Decimal("123.456"))
    Decimal('123.46')
    """
    return val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def validate_positive_number(
    value: str | float | int | Decimal, field_name: str, allow_zero: bool = False
) -> Decimal:
    """
    Validates and converts input into a non-negative Decimal.

    Raises:
        ValueError: If value is non-numeric, negative, or zero (when allow_zero=False).
    """
    try:
        dec_val = Decimal(str(value).strip())
    except Exception:
        raise ValueError(f"Invalid input for {field_name}: '{value}' is not a valid number.")

    if dec_val < Decimal("0"):
        raise ValueError(f"{field_name.capitalize()} cannot be negative ({dec_val}).")

    if not allow_zero and dec_val == Decimal("0"):
        raise ValueError(f"{field_name.capitalize()} must be greater than zero.")

    return dec_val


def calculate_loan(
    principal: Decimal | float | int | str,
    annual_rate: Decimal | float | int | str,
    years: Decimal | float | int | str,
) -> dict[str, Decimal]:
    """
    Calculates monthly payment, total interest, and total payment for a loan.

    Args:
        principal: Total loan principal amount (> 0).
        annual_rate: Annual interest rate as a percentage, e.g. 5.5 for 5.5% (>= 0).
        years: Loan duration in years (> 0).

    Returns:
        Dict containing rounded loan calculation metrics.
    """
    p = validate_positive_number(principal, "principal amount", allow_zero=False)
    rate_pct = validate_positive_number(annual_rate, "annual interest rate", allow_zero=True)
    y = validate_positive_number(years, "loan term in years", allow_zero=False)

    total_months = int(y * Decimal("12"))
    if total_months <= 0:
        raise ValueError("Loan term must yield at least 1 monthly payment.")

    if rate_pct == Decimal("0"):
        monthly_payment = p / Decimal(total_months)
    else:
        # Monthly interest rate
        r_float = float(rate_pct / Decimal("100") / Decimal("12"))
        # Compounding payment formula: M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        compounding_factor = (1.0 + r_float) ** total_months
        monthly_payment_float = (float(p) * r_float * compounding_factor) / (compounding_factor - 1.0)
        monthly_payment = Decimal(str(monthly_payment_float))

    monthly_payment_rounded = round_currency(monthly_payment)
    total_payment = round_currency(monthly_payment_rounded * Decimal(total_months))
    total_interest = round_currency(total_payment - round_currency(p))

    return {
        "principal": round_currency(p),
        "annual_rate": rate_pct,
        "years": y,
        "total_months": Decimal(total_months),
        "monthly_payment": monthly_payment_rounded,
        "total_payment": total_payment,
        "total_interest": total_interest,
    }


def generate_amortization_schedule(
    principal: Decimal | float | int | str,
    annual_rate: Decimal | float | int | str,
    years: Decimal | float | int | str,
) -> list[dict[str, Decimal]]:
    """
    Generates month-by-month amortization schedule for the loan.
    """
    summary = calculate_loan(principal, annual_rate, years)
    balance = summary["principal"]
    rate_pct = summary["annual_rate"]
    monthly_rate = (rate_pct / Decimal("100") / Decimal("12")) if rate_pct > 0 else Decimal("0")
    monthly_payment = summary["monthly_payment"]
    total_months = int(summary["total_months"])

    schedule = []
    for month in range(1, total_months + 1):
        interest_paid = round_currency(balance * monthly_rate)

        if month == total_months:
            principal_paid = balance
            payment = round_currency(principal_paid + interest_paid)
            balance = Decimal("0.00")
        else:
            principal_paid = round_currency(monthly_payment - interest_paid)
            if principal_paid > balance:
                principal_paid = balance
            balance = round_currency(balance - principal_paid)
            payment = monthly_payment

        schedule.append({
            "month": Decimal(month),
            "payment": payment,
            "principal_paid": principal_paid,
            "interest_paid": interest_paid,
            "remaining_balance": balance,
        })

    return schedule


def print_summary(results: dict[str, Decimal]) -> None:
    """Prints a nicely formatted loan summary."""
    print("=" * 48)
    print("                LOAN SUMMARY                    ")
    print("=" * 48)
    print(f" Principal Amount:        ${results['principal']:>14,.2f}")
    print(f" Annual Interest Rate:     {results['annual_rate']:>13.2f}%")
    print(f" Loan Term:               {results['years']:>11.2f} years ({int(results['total_months'])} months)")
    print("-" * 48)
    print(f" Monthly Payment:         ${results['monthly_payment']:>14,.2f}")
    print(f" Total Interest Paid:     ${results['total_interest']:>14,.2f}")
    print(f" Total Cost of Loan:      ${results['total_payment']:>14,.2f}")
    print("=" * 48)


def print_schedule(schedule: list[dict[str, Decimal]], limit: int = 12) -> None:
    """Prints a preview of the amortization schedule."""
    print("\nAMORTIZATION SCHEDULE (First " + str(min(limit, len(schedule))) + " months):")
    print(f"{'Month':<7} | {'Payment':<11} | {'Principal':<11} | {'Interest':<11} | {'Balance':<11}")
    print("-" * 65)
    for row in schedule[:limit]:
        print(
            f"{int(row['month']):<7} | "
            f"${row['payment']:>9,.2f} | "
            f"${row['principal_paid']:>9,.2f} | "
            f"${row['interest_paid']:>9,.2f} | "
            f"${row['remaining_balance']:>9,.2f}"
        )
    if len(schedule) > limit:
        print(f"... and {len(schedule) - limit} more months.")


def prompt_user_input() -> tuple[Decimal, Decimal, Decimal]:
    """Prompts user for inputs interactively with validation."""
    print("--- Pure Python Loan Calculator ---")
    
    while True:
        try:
            val = input("Enter Principal Amount ($): ")
            principal = validate_positive_number(val, "principal amount", allow_zero=False)
            break
        except ValueError as e:
            print(f"Error: {e}")

    while True:
        try:
            val = input("Enter Annual Interest Rate (%): ")
            annual_rate = validate_positive_number(val, "annual interest rate", allow_zero=True)
            break
        except ValueError as e:
            print(f"Error: {e}")

    while True:
        try:
            val = input("Enter Loan Term in Years: ")
            years = validate_positive_number(val, "loan term in years", allow_zero=False)
            break
        except ValueError as e:
            print(f"Error: {e}")

    return principal, annual_rate, years


def main() -> None:
    """Main execution flow."""
    if len(sys.argv) == 4:
        # CLI usage: python loan_calculator.py <principal> <annual_rate> <years>
        try:
            p, r, y = sys.argv[1], sys.argv[2], sys.argv[3]
            results = calculate_loan(p, r, y)
            print_summary(results)
            schedule = generate_amortization_schedule(p, r, y)
            print_schedule(schedule, limit=12)
        except ValueError as err:
            print(f"Error: {err}", file=sys.stderr)
            sys.exit(1)
    else:
        # Interactive mode or default sample run if non-interactive stdin
        if sys.stdin.isatty():
            p, r, y = prompt_user_input()
            results = calculate_loan(p, r, y)
            print_summary(results)
            schedule = generate_amortization_schedule(p, r, y)
            print_schedule(schedule, limit=12)
        else:
            # Example demonstration run
            print("Running sample loan calculation (Principal: $250,000, Interest: 6.5%, Term: 30 Years):\n")
            results = calculate_loan(250000, 6.5, 30)
            print_summary(results)
            schedule = generate_amortization_schedule(250000, 6.5, 30)
            print_schedule(schedule, limit=12)


if __name__ == "__main__":
    main()
