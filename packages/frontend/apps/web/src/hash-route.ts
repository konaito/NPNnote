// NPNnote: move a path based url (old link, 404.html fallback) after `#`,
// so later reloads only send the public path to the server
if (BUILD_CONFIG.isLocalOnly) {
  const { pathname, search, hash } = window.location;
  const base = environment.publicPath;
  if (pathname.startsWith(base) && pathname !== base && !hash) {
    window.history.replaceState(
      null,
      '',
      base + '#/' + pathname.slice(base.length) + search
    );
  }
}
