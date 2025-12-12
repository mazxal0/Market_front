export function ReformatImageUrlLink(url: string | undefined) {
  if (typeof url === 'undefined') return ""
  return url.replace("minio:9000", "localhost:9000");
}
