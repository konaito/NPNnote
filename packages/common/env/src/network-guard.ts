/**
 * NPNnote: No Privacy, No Note.
 *
 * Blocks every network API except reading the app's own static files.
 * The CSP meta tag only covers the page, so workers install this guard too.
 */

export class NetworkBlockedError extends Error {
  constructor(url: string) {
    super(`NPNnote blocked a network request: ${url}`);
    this.name = 'NetworkBlockedError';
  }
}

const LOCAL_PROTOCOLS = new Set(['data:', 'blob:']);

export function isAllowedUrl(
  input: string | URL,
  origin: string,
  pathPrefix: string
) {
  let url: URL;
  try {
    url = new URL(input, origin + pathPrefix);
  } catch {
    return false;
  }
  if (LOCAL_PROTOCOLS.has(url.protocol)) {
    return true;
  }
  return url.origin === origin && url.pathname.startsWith(pathPrefix);
}

function toUrlString(input: RequestInfo | URL) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

/**
 * @param pathPrefix the path the static files are served from, e.g. `/NPNnote/`
 */
export function installNetworkGuard(pathPrefix: string) {
  const g = globalThis as any;
  if (g.__NPN_NETWORK_GUARD__) {
    return;
  }
  g.__NPN_NETWORK_GUARD__ = true;

  const origin = globalThis.location.origin;
  const allowed = (input: string | URL) =>
    isAllowedUrl(input, origin, pathPrefix);

  const rawFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = toUrlString(input);
    if (!allowed(url)) {
      return Promise.reject(new NetworkBlockedError(url));
    }
    return rawFetch(input, init);
  };

  if (typeof XMLHttpRequest !== 'undefined') {
    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      if (!allowed(url)) {
        throw new NetworkBlockedError(url.toString());
      }
      return (rawOpen as any).call(this, method, url, ...rest);
    } as typeof XMLHttpRequest.prototype.open;
  }

  const block = (name: string) => {
    if (g[name] === undefined) return;
    g[name] = class {
      constructor(url: string | URL) {
        throw new NetworkBlockedError(url.toString());
      }
    };
  };
  block('WebSocket');
  block('EventSource');

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    navigator.sendBeacon = (url: string | URL) => {
      throw new NetworkBlockedError(url.toString());
    };
  }
}
