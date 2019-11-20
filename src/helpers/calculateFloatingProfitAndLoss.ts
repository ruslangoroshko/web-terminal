interface FloatingPNL {
  currentPrice: number;
  openPrice: number;
  investment: number;
  leverage: number;
  side: number;
  costs: number;
}

function calculateFloatingProfitAndLoss({
  costs,
  currentPrice,
  investment,
  leverage,
  openPrice,
  side,
}: FloatingPNL) {
  return +((currentPrice / openPrice - 1) * investment * leverage * side + costs).toFixed(2);
}

export default calculateFloatingProfitAndLoss;
