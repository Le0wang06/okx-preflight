export default function Home() {
  return (
    <main className="container">
      <h1>OKX Preflight</h1>
      <p>Lean foundation for a swap safety app that explains risk before users sign transactions.</p>
      <ul>
        <li>Server-side OKX signing and request wrapper is ready.</li>
        <li>Health endpoint: `/api/health`</li>
        <li>Credential status endpoint: `/api/okx/status`</li>
      </ul>
    </main>
  );
}
