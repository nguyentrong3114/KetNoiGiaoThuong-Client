import React from "react";
import AdminHeader from "./components/AdminHeader";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  return (
    <>
      <AdminHeader title="Giao dịch" subtitle="" />
      <div className="transactions-content">
        <PaymentHistory />
        <PaymentChart />
      </div>
    </>
  );
};

// ===============================
// 📌 LỊCH SỬ GIAO DỊCH
// ===============================
const PaymentHistory = () => {
  // ❗ XOÁ DEMO → dữ liệu thật sẽ đến từ API /admin/transactions
  const transactions = [];

  return (
    <div className="transactions-history-card">
      <div className="transactions-history-header">
        <h2 className="transactions-history-title">Lịch sử giao dịch</h2>

        <button className="transactions-more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      <div className="transactions-list">
        {/* ❗ Nếu không có dữ liệu */}
        {transactions.length === 0 ? (
          <p className="text-gray-500 p-4">Chưa có giao dịch.</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="transactions-item">
              {/* Icon */}
              <div
                className="transactions-item-icon"
                style={{ backgroundColor: `${transaction.color}20` }}
              >
                {/* Icon types (giữ UI, nhưng không dùng demo nữa) */}
                {transaction.icon === "paypal" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={transaction.color}>
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h7.2a4.45 4.45 0 0 1 3.12 1.14 3.93 3.93 0 0 1 1.14 3.12v.39a6.45 6.45 0 0 1-1.92 4.56 6.39 6.39 0 0 1-4.56 1.92h-3.36a.77.77 0 0 0-.76.633l-.78 4.83a.77.77 0 0 1-.76.633z" />
                  </svg>
                )}

                {transaction.icon === "paypal2" && (
                  <svg width="24" height="24" fill={transaction.color}>
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                )}

                {transaction.icon === "bank" && (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke={transaction.color}
                    strokeWidth="2"
                  >
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M3 8l9-5 9 5" />
                    <line x1="7" y1="13" x2="7" y2="17" />
                    <line x1="12" y1="13" x2="12" y2="17" />
                    <line x1="17" y1="13" x2="17" y2="17" />
                  </svg>
                )}

                {transaction.icon === "cancel" && (
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke={transaction.color}
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="transactions-item-info">
                <div className="transactions-item-type">{transaction.type}</div>
                <div className="transactions-item-date">{transaction.date}</div>
              </div>

              {/* Amount */}
              <div className="transactions-item-amount">
                <div className="transactions-item-value">{transaction.amount}</div>
                <div className="transactions-item-currency">VNĐ</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===============================
// 📌 BIỂU ĐỒ GIAO DỊCH
// ===============================
const PaymentChart = () => {
  return (
    <div className="transactions-chart-card">
      <div className="transactions-chart-header">
        <h2 className="transactions-chart-title">Thống kê giao dịch</h2>

        <button className="transactions-more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* ❗ Không có dữ liệu biểu đồ */}
      <p className="text-gray-500 p-4">Chưa có dữ liệu thống kê.</p>
    </div>
  );
};

export default TransactionsPage;
