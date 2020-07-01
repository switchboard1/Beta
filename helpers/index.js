import jwtDecode from "jwt-decode";
import cookieparser from "cookieparser";

export function debounce(fn, delay) {
  let timeoutID = null;
  return function() {
    clearTimeout(timeoutID);
    const args = arguments;
    const that = this;
    timeoutID = setTimeout(function() {
      fn.apply(that, args);
    }, delay);
  };
}

export function getUserFromCookie(req) {
  if (process.server && process.static) return;
  if (!req.headers.cookie) return;

  if (req.headers.cookie) {
    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;
    if (!accessTokenCookie) return;

    const decodedToken = jwtDecode(accessTokenCookie);
    if (!decodedToken) return;

    return decodedToken;
  }
}
