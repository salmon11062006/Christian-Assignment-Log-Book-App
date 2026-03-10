"use client";
// src/app/api-docs/page.tsx

import { useEffect, useState } from "react";

export default function ApiDocsPage() {
  const [SwaggerUI, setSwaggerUI] = useState<React.ComponentType<{ url: string }> | null>(null);

  useEffect(() => {
    import("swagger-ui-react").then((mod) => {
      setSwaggerUI(() => mod.default);
    });
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.2/swagger-ui.min.css";
    document.head.appendChild(link);

    // Override dark header
    const style = document.createElement("style");
    style.textContent = `.swagger-ui .topbar { display: none; }`;
    document.head.appendChild(style);
  }, []);

  if (!SwaggerUI) return <div>Loading...</div>;

  return <SwaggerUI url="/api/docs" />;
}