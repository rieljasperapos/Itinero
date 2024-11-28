import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div style={{ 
            backgroundColor: '#F5F7FA', 
            height: '100vh', 
            width: '100vw', 
            margin: 0, 
            padding: 0 
        }}>
            <h1 className="heading" style={{ margin: '20px'}}>
                My Plans
            </h1>
            <hr />
            {/* Add your dashboard components here */}
        </div>
    );
};

export default Dashboard;