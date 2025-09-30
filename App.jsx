import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './firebase/firebase';
import Auth from '../components/Auth';
import UserDashboard from '../components/UserDashboard';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import VrikshaVedAI from '../components/VrikshaVedAI';
import QuoteSystem from '../components/QuoteSystem'; 
import { useMobileOptimizations, useTouchOptimizations } from '../components/MobileOptimizations';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const { isMobile, isPWA } = useMobileOptimizations();
  useTouchOptimizations();

  // 🆕 Mobile-specific rendering
  const mobileProps = isMobile ? { className: 'mobile-view' } : {};

  // Authentication state management
  useEffect(() => {
    console.log('🔐 Auth state listener started...');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔥 Auth state changed - Current User:', currentUser);
      
      if (user?.uid !== currentUser?.uid) {
        setUser(currentUser);
        
        if (currentUser) {
          localStorage.setItem('userUID', currentUser.uid);
          
          try {
            console.log('📡 Fetching user data from MongoDB...');
            const response = await fetch(`${API_URL}/api/users/${currentUser.uid}`);
            const result = await response.json();
            
            if (result.success) {
              setUserData(result.user);
              localStorage.setItem('userData', JSON.stringify(result.user));
              console.log('✅ User data saved to session');
            }
          } catch (error) {
            console.error('❌ Error fetching user data:', error);
          }
        } else {
          localStorage.removeItem('userUID');
          localStorage.removeItem('userData');
          setUserData(null);
          console.log('🧹 Session cleared');
        }
      }
      
      setAuthLoading(false);
    });
    
    const savedUserUID = localStorage.getItem('userUID');
    if (savedUserUID && !user) {
      console.log('🔍 Found existing session:', savedUserUID);
      
      if (auth.currentUser) {
        auth.currentUser.reload().then(() => {
          const firebaseUser = auth.currentUser;
          if (firebaseUser && firebaseUser.uid === savedUserUID) {
            setUser(firebaseUser);
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
              setUserData(JSON.parse(savedUserData));
            }
          }
        });
      }
    }
    
    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, [auth, user, API_URL]); 

  // Plants data management
  useEffect(() => {
    if (user) {
      setPlantsLoading(true);
      setError(null);
      
      fetch(`${API_URL}/api/plants`)
        .then(response => {
          if (!response.ok) throw new Error('Network response failed');
          return response.json();
        })
        .then(data => {
          setPlants(data);
          setPlantsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching plants:', error);
          setError('Failed to load plants. Please try again.');
          setPlantsLoading(false);
        });
    }
  }, [user, API_URL]);

  // Loading state
  if (authLoading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <h2>Loading Greenora...</h2>
        <p>Checking your session...</p>
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return <Auth />;
  }

  // Main application
  return (
    <ErrorBoundary>
      {/* 🆕 SINGLE App div with mobile props */}
      <div className="App" {...mobileProps}>
        {/* 🆕 Show PWA install prompt for mobile users */}
        {isMobile && !isPWA && (
          <div className="pwa-install-prompt show">
            <span>📱 Install Greenora App</span>
            <button onClick={() => {
              // PWA install logic - browser will handle this
              if ('serviceWorker' in navigator) {
                // Trigger browser's PWA install prompt
                window.dispatchEvent(new Event('beforeinstallprompt'));
              }
            }}>Install</button>
          </div>
        )}
        
        {/* Show error message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {/* Header with User Management */}
        <header className="header">
          <nav className="navbar">
            <div className="nav-brand">
              <span className="logo">🌿</span>
              <span className="brand-name">Greenora</span>
            </div>
            <div className="nav-links">
              <span className="user-welcome">
                👋 Hello, {userData?.name || user.email}
                {userData?.userType && ` (${userData.userType})`}
              </span>
              <button onClick={() => {
                console.log('🚪 User signing out...');
                signOut(auth);
              }} className="logout-btn">
                Sign Out
              </button>
            </div>
          </nav>

          <div className="hero-section">
            <h1>Premium Herbal Plants</h1>
            <p className="hero-subtitle">
              {userData?.userType === 'exporter' 
                ? 'Manage your export business' 
                : 'Find quality plants for your needs'
              }
            </p>
          </div>
        </header>

        {/* User Dashboard */}
        <section className="dashboard-section">
          <UserDashboard user={user} userData={userData} />
        </section>

        {/* VrikshaVed AI Section */}
        <section className="ai-section">
          <div className="container">
            <h2>🤖 VrikshaVed AI Assistant</h2>
            <VrikshaVedAI />
          </div>
        </section>

        {/* Plants Catalog */}
        <section className="plants-section">
          <div className="container">
            <h2>🌿 Our Premium Collection</h2>
            
            {plantsLoading ? (
              <div className="loading">
                <div className="loader"></div>
                <p>Loading plants catalog...</p>
              </div>
            ) : (
              <div className="plants-grid">
                {plants.map(plant => (
                  <div key={plant._id} className="plant-card">
                    <div className="plant-image">
                      <span className="plant-icon">🌱</span>
                    </div>
                    <div className="plant-content">
                      <h3>{plant.name}</h3>
                      <p className="price">₹{plant.price}/plant</p>
                      <div className="benefits">
                        {plant.benefits?.slice(0, 2).map((benefit, index) => (
                          <span key={index} className="benefit-tag">✓ {benefit}</span>
                        ))}
                      </div>
                      <button 
                        className="plant-cta"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        {userData?.userType === 'exporter' ? 'Export Inquiry' : 'Get Quote'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quote System Modal */}
        {selectedPlant && (
          <div className="modal-overlay">
            <div className="modal-content">
              <QuoteSystem plant={selectedPlant} userData={userData} user={user} API_URL={API_URL} />
              <button 
                className="close-modal"
                onClick={() => setSelectedPlant(null)}
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;