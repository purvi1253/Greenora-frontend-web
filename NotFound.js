import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="not-found-content">
        <h1 style={{ fontSize: '4rem', margin: 0, color: '#10b981' }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;