export const getPrice = (
  features: any[],
  user: any,
  options?: {
    noCredits?: boolean;
  }
) => {
  let price = features.reduce((acc, feature) => {
    return acc + feature.price;
  }, 0);

  if (user.credits && user.credits > 0 && !options?.noCredits) {
    price -= user.credits;
  }

  //TODO add coupon code
  return price.toFixed(2);
};
