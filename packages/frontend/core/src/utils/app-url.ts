/**
 * NPNnote: the local-only build keeps the in-app path after `#`.
 * Browsers never send the fragment, so workspace and doc ids do not reach
 * the server in a request path.
 */
export function toAppHref(path: string) {
  return BUILD_CONFIG.isLocalOnly ? `${environment.publicPath}#${path}` : path;
}

/**
 * Turns `https://host/NPNnote/#/workspace/x/y` into `https://host/workspace/x/y`
 * so the usual path based parsing works. Other urls are returned as is.
 */
export function fromAppUrl(url: URL) {
  if (BUILD_CONFIG.isLocalOnly && url.hash.startsWith('#/')) {
    return new URL(url.hash.slice(1), url.origin);
  }
  return url;
}
