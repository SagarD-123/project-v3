import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="home-container">
            <div className="slider-container">
            
                <div className="slider-tabs">
                    <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
                    <button className={activeTab === 'register' ? 'active' : ''} onClick={() => setActiveTab('register')}>Register</button>
                </div>
                <div className="slider-content">
                    
                    {activeTab === 'login' && (
                        <div>
                            <h2><Link to="/login">Login</Link></h2>
                            
                        </div>
                    )}
                    {activeTab === 'register' && (
                        <div>
                            <h2><Link to="/register">Register</Link></h2>
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
