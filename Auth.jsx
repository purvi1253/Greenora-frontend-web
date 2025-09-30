import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../src/firebase/firebase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    name: '',
    company: '',
    country: '',
    phone: '',
    userType: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  // Sync user with our database
  const syncUserWithDB = async (user, userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUID: user.uid,
          email: user.email,
          name: userData.name,
          userType: userData.userType,
          company: userData.company,
          country: userData.country,
          phone: userData.phone
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('User synced with database:', result.user);
      }
    } catch (error) {
      console.error('Error syncing user with database:', error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    if (isLogin) {
      // LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('✅ Login successful:', userCredential.user.email);
    } else {
      // REGISTER
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('✅ Registration successful:', userCredential.user.email);
      
      // Sync with MongoDB
      const dbResult = await syncUserWithDB(userCredential.user, {
        name: formData.name,
        userType: formData.userType
      });
      
      if (dbResult?.success) {
        console.log('✅ User saved to database');
      }
    }

    // 🔥 CRITICAL FIX: Force page reload to trigger auth state update
    window.location.reload();
    
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🌿</span>
          <h2>{isLogin ? 'Welcome to Greenora' : 'Join as Exporter/Buyer'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create your professional account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
              
              <div className="form-group">
                <select 
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                >
                  <option value="buyer">I want to buy plants</option>
                  <option value="exporter">I want to export plants</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Company Name (optional)"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="business@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="auth-toggle-btn"
            disabled={loading}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;