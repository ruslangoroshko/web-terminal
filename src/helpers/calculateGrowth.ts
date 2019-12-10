function calculateGrowth(bid: number, ask: number, accuracy: number = 5) {
  const calculated = +((bid + ask) * 0.5).toFixed(accuracy);
  return `${calculated >= 0 ? '+' : '-'}${calculated}`;
}
export default calculateGrowth;
