export default function Loading() {
  return (
    <div className="page-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ height: '60px', width: '300px' }} />
        <div className="skeleton" style={{ height: '200px' }} />
        <div className="skeleton" style={{ height: '150px' }} />
      </div>
    </div>
  );
}
