"""
Unit tests for Pure Python Loan Calculator
"""

import unittest
from decimal import Decimal
from loan_calculator import (
    calculate_loan,
    validate_positive_number,
    round_currency,
    generate_amortization_schedule,
)


class TestLoanCalculator(unittest.TestCase):

    def test_round_currency(self):
        self.assertEqual(round_currency(Decimal("100.456")), Decimal("100.46"))
        self.assertEqual(round_currency(Decimal("100.454")), Decimal("100.45"))
        self.assertEqual(round_currency(Decimal("100.455")), Decimal("100.46"))

    def test_validate_positive_number_valid(self):
        self.assertEqual(validate_positive_number("10000", "principal"), Decimal("10000"))
        self.assertEqual(validate_positive_number(5.5, "rate", allow_zero=True), Decimal("5.5"))
        self.assertEqual(validate_positive_number(0, "rate", allow_zero=True), Decimal("0"))

    def test_validate_positive_number_invalid(self):
        with self.assertRaises(ValueError):
            validate_positive_number("-5000", "principal")

        with self.assertRaises(ValueError):
            validate_positive_number("0", "principal", allow_zero=False)

        with self.assertRaises(ValueError):
            validate_positive_number("invalid_text", "principal")

    def test_calculate_loan_standard(self):
        # 30-year loan of $200,000 at 6% annual rate
        res = calculate_loan(200000, 6.0, 30)
        self.assertEqual(res["principal"], Decimal("200000.00"))
        self.assertEqual(res["monthly_payment"], Decimal("1199.10"))
        self.assertEqual(res["total_months"], Decimal("360"))
        self.assertEqual(res["total_payment"], Decimal("431676.00"))
        self.assertEqual(res["total_interest"], Decimal("231676.00"))

    def test_calculate_loan_zero_interest(self):
        # 10-year loan of $120,000 at 0% annual rate
        res = calculate_loan(120000, 0, 10)
        self.assertEqual(res["monthly_payment"], Decimal("1000.00"))
        self.assertEqual(res["total_payment"], Decimal("120000.00"))
        self.assertEqual(res["total_interest"], Decimal("0.00"))

    def test_amortization_schedule(self):
        schedule = generate_amortization_schedule(10000, 5, 1)
        self.assertEqual(len(schedule), 12)
        self.assertEqual(schedule[-1]["remaining_balance"], Decimal("0.00"))
        total_p = sum(row["principal_paid"] for row in schedule)
        self.assertEqual(total_p, Decimal("10000.00"))


if __name__ == "__main__":
    unittest.main()
