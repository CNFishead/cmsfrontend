export const IS_SERVER = typeof window === 'undefined';
const isProd = process.env.NODE_ENV === 'production';

export function getProtocol() {
  if (isProd) return 'https://';
  return 'http://';
}
export function getAbsoluteUrl() {
  //get absolute url in client/browser
  if (!IS_SERVER) {
    return location.origin;
  }
  //get absolute url in server.
  const protocol = getProtocol();
  if (isProd) {
    return `${protocol}studio.truthcasting.com`;
  } else {
    return `${protocol}localhost:3000`;
  }
}
