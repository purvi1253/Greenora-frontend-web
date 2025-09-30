import { useState, useEffect } from 'react';
// ❌ getAuth remove kardo since we're not using it
// import { getAuth } from 'firebase/auth';

const UserDashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.uid}`);
        const result = await response.json();
        
        if (result.success) {
          setUserData(result.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '2rem'}}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2e8b57',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <h2>👤 Welcome, {userData?.name || user.email}</h2>
      <div className="user-info">
        <p><strong>User Type:</strong> {userData?.userType || 'buyer'}</p>
        <p><strong>Company:</strong> {userData?.company || 'Not specified'}</p>
        <p><strong>Country:</strong> {userData?.country || 'Not specified'}</p>
        <p><strong>Member since:</strong> {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</p>
      </div>
      
      <div className="user-stats">
        <div className="stat-card">
          <h3>Saved Plants</h3>
          <p>{userData?.plantsSaved?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Quotes Requested</h3>
          <p>{userData?.quotesRequested?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;