import React from 'react';
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import './TransactionsPage.css';

const TransactionsPage = () => {
  return (
    <div className="dashboard-container">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader title="Transactions" subtitle="" />
        <div className="transactions-content">
          <PaymentHistory />
          <PaymentChart />
        </div>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const transactions = [
    { id: 1, type: 'Deposit PayPal', date: '5 march, 18:33', amount: '+2000', icon: 'paypal', color: '#00A7E1' },
    { id: 2, type: 'Deposit PayPal', date: '5 march, 18:33', amount: '+2000', icon: 'paypal2', color: '#9F7AEA' },
    { id: 3, type: 'Deposit from Bank', date: '5 march, 18:33', amount: '+2000', icon: 'bank', color: '#4299E1' },
    { id: 4, type: 'Cancelled', date: '5 march, 18:33', amount: '+2000', icon: 'cancel', color: '#F56565' },
    { id: 5, type: 'Deposit from Bank', date: '5 march, 18:33', amount: '+2000', icon: 'bank', color: '#4299E1' },
  ];

  return (
    <div className="transactions-history-card">
      <div className="transactions-history-header">
        <h2 className="transactions-history-title">Payment History</h2>
        <button className="transactions-more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>
      
      <div className="transactions-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transactions-item">
            <div className="transactions-item-icon" style={{ backgroundColor: `${transaction.color}20` }}>
              {transaction.icon === 'paypal' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={transaction.color}>
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h7.2a4.45 4.45 0 0 1 3.12 1.14 3.93 3.93 0 0 1 1.14 3.12v.39a6.45 6.45 0 0 1-1.92 4.56 6.39 6.39 0 0 1-4.56 1.92h-3.36a.77.77 0 0 0-.76.633l-.78 4.83a.77.77 0 0 1-.76.633z"/>
                </svg>
              )}
              {transaction.icon === 'paypal2' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={transaction.color}>
                  <circle cx="12" cy="12" r="8"/>
                </svg>
              )}
              {transaction.icon === 'bank' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={transaction.color} strokeWidth="2">
                  <rect x="3" y="8" width="18" height="13" rx="2"/>
                  <path d="M3 8l9-5 9 5"/>
                  <line x1="7" y1="13" x2="7" y2="17"/>
                  <line x1="12" y1="13" x2="12" y2="17"/>
                  <line x1="17" y1="13" x2="17" y2="17"/>
                </svg>
              )}
              {transaction.icon === 'cancel' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={transaction.color} strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
            </div>
            <div className="transactions-item-info">
              <div className="transactions-item-type">{transaction.type}</div>
              <div className="transactions-item-date">{transaction.date}</div>
            </div>
            <div className="transactions-item-amount">
              <div className="transactions-item-value">{transaction.amount}</div>
              <div className="transactions-item-currency">EUR</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentChart = () => {
  return (
    <div className="transactions-chart-card">
      <div className="transactions-chart-header">
        <h2 className="transactions-chart-title">Payment History</h2>
        <button className="transactions-more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>
      
      <div className="transactions-chart-legend">
        <div className="transactions-legend-item">
          <span className="transactions-legend-dot" style={{ backgroundColor: '#4299E1' }}></span>
          <span>2018</span>
        </div>
        <div className="transactions-legend-item">
          <span className="transactions-legend-dot" style={{ backgroundColor: '#48BB78' }}></span>
          <span>2019</span>
        </div>
      </div>
      
      <div className="transactions-chart">
        <svg viewBox="0 0 500 200" className="transactions-chart-svg">
          {/* Y-axis labels */}
          <text x="20" y="20" className="transactions-chart-label">60</text>
          <text x="20" y="50" className="transactions-chart-label">50</text>
          <text x="20" y="80" className="transactions-chart-label">40</text>
          <text x="20" y="110" className="transactions-chart-label">30</text>
          <text x="20" y="140" className="transactions-chart-label">20</text>
          <text x="20" y="170" className="transactions-chart-label">10</text>
          
          {/* X-axis labels */}
          <text x="60" y="195" className="transactions-chart-label">Jan</text>
          <text x="110" y="195" className="transactions-chart-label">Feb</text>
          <text x="160" y="195" className="transactions-chart-label">Mar</text>
          <text x="210" y="195" className="transactions-chart-label">Apr</text>
          <text x="260" y="195" className="transactions-chart-label">May</text>
          <text x="310" y="195" className="transactions-chart-label">Jun</text>
          <text x="360" y="195" className="transactions-chart-label">Jul</text>
          <text x="410" y="195" className="transactions-chart-label">Aug</text>
          
          {/* 2018 line (blue) */}
          <path
            d="M 50,130 L 80,100 L 110,110 L 140,120 L 170,105 L 200,55 L 230,75 L 260,90 L 290,85 L 320,115 L 350,105 L 380,90 L 410,100 L 440,115 L 470,120"
            fill="none"
            stroke="#4299E1"
            strokeWidth="2"
          />
          <path
            d="M 50,130 L 80,100 L 110,110 L 140,120 L 170,105 L 200,55 L 230,75 L 260,90 L 290,85 L 320,115 L 350,105 L 380,90 L 410,100 L 440,115 L 470,120 L 470,180 L 50,180 Z"
            fill="rgba(66, 153, 225, 0.1)"
          />
          
          {/* 2019 line (green dotted) */}
          <path
            d="M 50,120 L 80,80 L 110,95 L 140,85 L 170,90 L 200,45 L 230,50 L 260,60 L 290,85 L 320,95 L 350,75 L 380,80 L 410,75 L 440,90 L 470,100"
            fill="none"
            stroke="#48BB78"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      
      <div className="transactions-chart-footer">
        <span className="transactions-chart-footer-label">Month</span>
      </div>
    </div>
  );
};

export default TransactionsPage;
