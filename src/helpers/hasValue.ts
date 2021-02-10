export default <T>(val?: T | null): val is T =>
  val !== null && val !== undefined;
