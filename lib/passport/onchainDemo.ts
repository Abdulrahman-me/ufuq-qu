const DEFAULT_AMOY_EXPLORER = "https://amoy.polygonscan.com";

/** قاعدة مستكشف الشبكة للواجهة (Amoy أو غيره). */
export function getPolygonExplorerBase(): string {
  return (
    process.env.NEXT_PUBLIC_POLYGON_EXPLORER_BASE_URL?.replace(/\/$/, "") ||
    process.env.POLYGON_EXPLORER_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_AMOY_EXPLORER
  );
}

function isEvmAddress(s: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(s);
}

function isTxHash(s: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/i.test(s);
}

/** محفظة للتحقق (42 حرفًا فقط). */
export function getPassportStudentWallet(): string {
  const raw = (process.env.NEXT_PUBLIC_PASSPORT_STUDENT_WALLET || process.env.NEXT_PUBLIC_PASSPORT_DEMO_WALLET || "").trim();
  if (isEvmAddress(raw)) return raw;
  return "";
}

/**
 * رقم معاملة مرجعية: من `NEXT_PUBLIC_PASSPORT_REFERENCE_TX`،
 * أو إن وُضع hash معاملة (64 hex) في `NEXT_PUBLIC_PASSPORT_STUDENT_WALLET`.
 */
export function getPassportReferenceTxHash(): string {
  const ref = process.env.NEXT_PUBLIC_PASSPORT_REFERENCE_TX?.trim();
  if (ref && isTxHash(ref)) return ref;
  const mixed = (process.env.NEXT_PUBLIC_PASSPORT_STUDENT_WALLET || "").trim();
  if (isTxHash(mixed)) return mixed;
  return "0x4a96e3c78e2350e7e53ba0788e161ae6c3caf854f5ecaf38694bfab06973a816";
}

export function getPassportReferenceTxUrl(): string {
  return `${getPolygonExplorerBase()}/tx/${getPassportReferenceTxHash()}`;
}

/** رابط عنوان على نفس المستكشف المعرّف في البيئة. */
export function polygonExplorerAddressUrl(address: string): string {
  const a = address.startsWith("0x") ? address : `0x${address}`;
  return `${getPolygonExplorerBase()}/address/${a}`;
}

/** @deprecated استخدم polygonExplorerAddressUrl */
export function polygonAddressUrl(address: string): string {
  return polygonExplorerAddressUrl(address);
}

/** للاستدعاءات التجريبية للـ API عند غياب عنوان محفظة صالح. */
export const PASSPORT_FALLBACK_DEV_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export function truncateHash(hex: string, head = 6, tail = 4): string {
  if (!hex || hex.length < head + tail + 2) return hex;
  return `${hex.slice(0, head + 2)}…${hex.slice(-tail)}`;
}
