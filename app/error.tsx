'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😟</div>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#1E293B',
        }}
      >
        Something went wrong
      </h2>
      <p style={{ color: '#64748B', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Don&apos;t worry — even the best of us have off moments. Take a breath and try again.
      </p>
      <button className="btn-primary" onClick={reset} aria-label="Try again">
        Try Again
      </button>
    </div>
  );
}
