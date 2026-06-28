import { MessageCircle, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReviewEmptyState() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%'
      }}>
        {/* Icon Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            position: 'relative'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              background: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              transition: 'transform 0.3s ease'
            }}>
              <MessageCircle 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  color: '#ffffff',
                  strokeWidth: 1.5
                }} 
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            Share Your Experience
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#666666',
            lineHeight: '1.6',
            letterSpacing: '-0.01em'
          }}>
            Sign in to leave a review and help others make informed decisions
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/login">
            <button style={{
              width: '100%',
              background: '#000000',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '15px',
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
            }}>
              <LogIn style={{ width: '20px', height: '20px', strokeWidth: 2 }} />
              Sign In to Review
            </button>
          </Link>
          
          <Link to="/registration">
            <button style={{
              width: '100%',
              background: '#ffffff',
              color: '#000000',
              fontWeight: '500',
              fontSize: '15px',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f8f8';
              e.currentTarget.style.borderColor = '#000000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <UserPlus style={{ width: '20px', height: '20px', strokeWidth: 2 }} />
              Create Account
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}