// Placeholder: Extended Euclidean algorithm for comparison
export function egcd(a, b) {
  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }
  return { gcd: old_r, x: old_s, y: old_t };
}

export function modInverseEuclid(a, m) {
  const { gcd, x } = egcd((a % m + m) % m, m);
  if (gcd !== 1) return 0;
  return (x % m + m) % m;
}
