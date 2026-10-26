import { installNetworkGuard } from '@affine/env/network-guard';

if (BUILD_CONFIG.isLocalOnly) {
  installNetworkGuard(environment.publicPath);
}
