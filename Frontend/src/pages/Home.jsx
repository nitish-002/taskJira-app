import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>TaskBoard Pro</h1>
        <p className="tagline">
          A collaborative project management platform that helps teams work efficiently
        </p>

        {currentUser ? (
          <Link to="/dashboard" className="cta-button">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="cta-button">
            Get Started
          </Link>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Project Management</h3>
            <p>Create and manage projects with flexible boards</p>
          </div>
          <div className="feature-card">
            <h3>Task Organization</h3>
            <p>Create, assign and track tasks across different statuses</p>
          </div>
          <div className="feature-card">
            <h3>Team Collaboration</h3>
            <p>Work together with your team in real-time</p>
          </div>
          <div className="feature-card">
            <h3>Workflow Automation</h3>
            <p>Set up rules to automate your workflow processes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
