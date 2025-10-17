'use client';

import { Button } from "@/components/ui/button";
import { useInstallPWA } from "@/hooks/use-install-pwa";

export function InstallPWA() {
  const { supportsPWA, installPWA } = useInstallPWA();

  if (!supportsPWA) {
    return null;
  }

  return (
    <Button
      onClick={installPWA}
      variant="outline"
      className="fixed bottom-4 right-4 z-50"
    >
      Install App
    </Button>
  );
}