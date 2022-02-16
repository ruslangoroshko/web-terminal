export const getOneSignalAppId = (locationHref: string) => {
  if (locationHref.includes('trading-test.mnftx')) {
    return '88c64d44-f1e1-4561-b08f-344b07fe31f6';
  } else if (locationHref.includes('trade.monfex')) {
    return '6cebaf4d-407b-491e-acb3-65a27855c428';
  } else if (locationHref.includes('trade.handelpro')) {
    return '942fefca-4a88-438e-b124-0b03412e8507';
  } else if (locationHref.includes('trade.allianzmarket')) {
    return '97635471-a2bc-4eb8-b66b-eeb5be55c9ae';
  }
  return null;
};
