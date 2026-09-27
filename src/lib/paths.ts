export const baseUrl = import.meta.env.BASE_URL || '/';

export function withBase(path: string) {
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = pathname.replace(/^\/+/, '');
  const routePath = normalizedPath && !normalizedPath.includes('.') && !normalizedPath.endsWith('/')
    ? `${normalizedPath}/`
    : normalizedPath;
  return `${normalizedBase}${routePath}${suffix}`;
}
