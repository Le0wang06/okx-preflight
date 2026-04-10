export default function Home() {
  return (
    <main className="container">
      <h1>OKX Preflight</h1>
      <p>
        Lean foundation for a swap safety app that explains risk before users sign transactions.
      </p>
      <ul>
        <li>Server-side OKX signing and request wrapper is ready.</li>
        <li>Client has timeout and retry handling for API resilience.</li>
        <li>Health endpoint: `/api/health`</li>
        <li>Credential status endpoint: `/api/okx/status`</li>
        <li>CI runs lint, typecheck, and build on every push/PR.</li>
      </ul>
    </main>
  );
}
