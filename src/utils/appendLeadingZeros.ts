export default function appendLeadingZeroes(n: any) {
  if (n <= 9) {
    return '0' + n;
  }
  return n;
}
