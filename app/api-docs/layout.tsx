export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .swagger-ui .topbar { display: none !important; }
        .swagger-ui .info-wrapper,
        .swagger-ui .scheme-container,
        .swagger-ui section.models,
        .swagger-ui .opblock-tag-section,
        .swagger-ui .wrapper { background: #fff !important; }
        .swagger-ui .info .title,
        .swagger-ui .info p,
        .swagger-ui .opblock-tag,
        .swagger-ui .opblock-tag small { color: #000 !important; }
      `}</style>
      {children}
    </>
  );
}