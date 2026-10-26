import { installNetworkGuard } from './network-guard';

// workers are served from `<publicPath>js/`, so the app root is one level up
installNetworkGuard(new URL('..', globalThis.location.href).pathname);
