import React from 'react';

const AnalyticsPage = () => {
  return (
    <div>
      <h1>Vendor Analytics Dashboard</h1>
      <p>Here you will see your personalized sales analytics.</p>
      {/* Placeholder for Tableau dashboard */}
      <iframe
        title="Tableau Analytics"
        src="YOUR_TABLEAU_DASHBOARD_URL"
        width="100%"
        height="600px"
      />
    </div>
  );
};

export default AnalyticsPage;
