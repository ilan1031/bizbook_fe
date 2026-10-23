// Amount in words, Indian numbering (lakh, crore):
//   amountInWords(106082) -> "Indian Rupees One Lakh Six Thousand Eighty Two Only"
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const belowHundred = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}`.trim());
const belowThousand = (n) =>
  n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred ${belowHundred(n % 100)}`.trim() : belowHundred(n);

// Whole number in words ("" for 0).
export const numberToWords = (value) => {
  let n = Math.floor(Math.abs(Number(value) || 0));
  if (n === 0) return "Zero";
  const parts = [];
  const crore = Math.floor(n / 1e7);
  n %= 1e7;
  const lakh = Math.floor(n / 1e5);
  n %= 1e5;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) parts.push(`${numberToWords(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (n) parts.push(belowThousand(n));
  return parts.join(" ");
};

export const amountInWords = (amount, currency = "Indian Rupees") => {
  const value = Math.round((Number(amount) || 0) * 100) / 100;
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);
  return `${currency} ${numberToWords(rupees)}${paise ? ` and ${numberToWords(paise)} Paise` : ""} Only`;
};
