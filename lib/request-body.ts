export type LimitedBodyResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; tooLarge?: boolean };

/**
 * Read at most maxBytes from a request stream. This enforces the limit even when
 * Content-Length is missing or dishonest, before JSON/multipart parsing buffers
 * the full body.
 */
export async function readRequestBodyLimited(
  request: Request,
  maxBytes: number,
): Promise<LimitedBodyResult> {
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, tooLarge: true };
  }
  if (!request.body) return { ok: false };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { ok: false, tooLarge: true };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false };
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

export function requestWithBodyBytes(request: Request, bytes: Uint8Array): Request {
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  // Materialize a plain ArrayBuffer so this works with DOM BodyInit typings
  // even when the input Uint8Array is backed by ArrayBufferLike.
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);
  return new Request(request.url, {
    method: request.method,
    headers,
    body,
  });
}

export async function readJsonRequestLimited(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge?: boolean }> {
  const body = await readRequestBodyLimited(request, maxBytes);
  if (!body.ok) return body;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body.bytes);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}
