import { FAIL_REQ_ATTEMPT_COUNT, FAIL_REQ_ATTEMPT_DELAY_MS } from "./constants";

export async function findMirror(
  mirrors: string[],
  onMirrorFail: (failedMirror: string) => void
): Promise<string | null> {
  for (let i = 0; i < mirrors.length; i++) {
    const mirror = mirrors[i];
    try {
      await fetch(mirror);
      return mirror;
    } catch (e) {
      onMirrorFail(mirror);
    }
  }
  return null;
}

export async function attempt<T>(
  cb: () => Promise<T>,
  onFail?: (message: string) => void,
  onError?: (message: string) => void,
  onComplete?: () => void
): Promise<T | null> {
  for (let i = 0; i < FAIL_REQ_ATTEMPT_COUNT; i++) {
    try {
      const result = await cb();

      if (onComplete) {
        onComplete();
      }

      return result;
    } catch (e: unknown) {
      if (onFail) {
        onFail(
          `Request failed, trying again ${i + 1}/${FAIL_REQ_ATTEMPT_COUNT}`
        );
      }
      await delay(FAIL_REQ_ATTEMPT_DELAY_MS);
      if (i + 1 === FAIL_REQ_ATTEMPT_COUNT) {
        if (onError) {
          onError((e as Error)?.message);
        }
      }
    }
  }
  return null;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
