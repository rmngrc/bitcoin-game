import { PropsWithChildren, useEffect, useState } from "react";

export function MockApiProvider({ children }: Readonly<PropsWithChildren>) {
  const [isMockingEnabled, setIsMockingEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function enableApiMocking() {
      const { worker } = await import("../server/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      if (isMounted) {
        setIsMockingEnabled(true);
      }
    }

    if (!isMockingEnabled) {
      enableApiMocking();
    }

    return () => {
      isMounted = false;
    };
  }, [isMockingEnabled]);

  return isMockingEnabled ? children : null;
}
