import { Compass, User, LogOut } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  savedCount, 
  tripsCount,
  user,
  onLoginClick,
  onLogout
}) {
  return (
    <header className="header-wrapper">
      <div className="container header-container">
        {/* Logo */}
        <div className="logo" onClick={() => setActiveTab('explore')}>
          <Compass size={28} className="logo-dot" />
          <span>nest</span>find
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore
          </span>
          <span 
            className={`nav-link ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            My trips {tripsCount > 0 && <span style={{fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px'}}>{tripsCount}</span>}
          </span>
          <span 
            className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved {savedCount > 0 && <span style={{fontSize: '11px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px'}}>{savedCount}</span>}
          </span>
        </nav>

        {/* Auth Actions */}
        <div className="auth-buttons" style={{ alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
                <User size={18} style={{ color: '#10b981' }} />
                <span>{user.email.split('@')[0]}</span>
              </div>
              <button 
                onClick={onLogout}
                style={{ color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={onLoginClick}>Log in</button>
              <button className="btn-signup" onClick={onLoginClick}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
