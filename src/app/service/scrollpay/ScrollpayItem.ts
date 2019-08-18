export interface ScrollpayItem<T> {
  title: string;
  description: string;
  preview: T;
  chunkSha256Hashes: string[];
}
