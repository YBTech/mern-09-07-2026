// Shows which environment and version you're looking at, e.g. "dev · a1b2c3d".
// After a deploy, reload the page: the version changes to the new commit.
import { useEffect, useState } from "react";

type VersionInfo = { env: string; version: string };

export function VersionBadge() {
  const [info, setInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch("/version")
      .then((res) => res.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  if (!info) return null;
  return (
    <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#666", textAlign: "center" }}>
      environment: <strong>{info.env}</strong> · version: <strong>{info.version}</strong>
    </p>
  );
}
