import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/auth/realms/restaurant',
  clientId: 'restaurant-ui',
  responseType: 'code',
  redirectUri: window.location.origin + "/menu",
  scope: 'openid profile email offline_access roles',
  disableAtHashCheck: true,
  showDebugInformation: true,
  requireHttps: false
};
