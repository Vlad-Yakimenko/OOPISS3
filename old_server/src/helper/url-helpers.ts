import * as qs from 'querystring';

export function getBaseUrl(url: string): string {
  const separator = url.indexOf('/', 1) < url.indexOf('?') && url.indexOf('/', 1) >= 0 ? '/' : '?';
  const urlParts: string[] = url.split(separator).filter(part => part != '');
  return urlParts.length ? `${urlParts[0]}` : '/';
}

export function getQueryParams(url: string): Record<string, any> {
  const hasQueryParams = (url: string): boolean => url.indexOf('?') >= 0;

  if (hasQueryParams(url)) {
    const queryParamsString = url.substring(url.indexOf('?') + 1, url.length);
    return qs.parse(queryParamsString);
  }

  return {};
}
