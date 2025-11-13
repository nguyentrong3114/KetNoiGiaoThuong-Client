import React from "react";
import AdminHeader from "./components/AdminHeader";
import "./ReportsPage.css";

const ReportsPage = () => {
  return (
    <>
      <AdminHeader title="Reports" subtitle="" />
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-label">Pending</div>
              <div className="stat-number">2</div>
            </div>
            <div className="badge" style={{backgroundColor: '#FEF3C7'}}>
              <span style={{color: '#92400E', fontSize: '14px', fontWeight: '600'}}>2</span>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">In Progress</div>
              <div className="stat-number">2</div>
            </div>
            <div className="badge" style={{backgroundColor: '#DBEAFE'}}>
              <span style={{color: '#1E40AF', fontSize: '14px', fontWeight: '600'}}>2</span>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Resolved</div>
              <div className="stat-number">1</div>
            </div>
            <div className="badge" style={{backgroundColor: '#D1FAE5'}}>
              <span style={{color: '#065F46', fontSize: '14px', fontWeight: '600'}}>1</span>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Reports</div>
              <div className="stat-number">6</div>
            </div>
            <div className="icon-wrapper" style={{backgroundColor: '#F3F4F6'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Reports Management Section */}
        <div className="management-card">
          <div className="management-header">
            <div className="title-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <h3 className="management-title">Reports Management</h3>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="filters-row">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search reports..."
                className="search-input"
              />
            </div>

            <select className="select">
              <option>All Statuses</option>
            </select>

            <select className="select">
              <option>All Categories</option>
            </select>

            <select className="select">
              <option>All Priorities</option>
            </select>
          </div>
          
          {/* Table */}
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header" style={{width: '35%'}}>Report</th>
                  <th className="table-header" style={{width: '15%'}}>Category</th>
                  <th className="table-header" style={{width: '15%'}}>Status</th>
                  <th className="table-header" style={{width: '12%'}}>Priority</th>
                  <th className="table-header" style={{width: '23%'}}>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Large Pothole on Main Street</div>
                    <div className="report-desc">Deep pothole causing damage to vehicles near the intersectio...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Pothole</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#FEF3C7', color: '#92400E'}}>Pending</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#FEE2E2', color: '#991B1B'}}>High</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>123 Main Street, Dow</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Broken Streetlight</div>
                    <div className="report-desc">Streetlight has been out for over a week on Elm Street. Crea...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Streetlight</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#DBEAFE', color: '#1E40AF'}}>In Progress</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#E0E7FF', color: '#3730A3'}}>Medium</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>456 Elm Street, Resid</span>
                    </div>
                  </td>
                </tr>

                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Overflowing Trash Bins</div>
                    <div className="report-desc">Public trash bins haven't been emptied in days. Trash is spi...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Sanitation</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#D1FAE5', color: '#065F46'}}>Resolved</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#E0E7FF', color: '#3730A3'}}>Medium</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>Central Park, North Er</span>
                    </div>
                  </td>
                </tr>

                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Cracked Sidewalk</div>
                    <div className="report-desc">Large crack in sidewalk creating tripping hazard for pedestr...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Sidewalk</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#FEF3C7', color: '#92400E'}}>Pending</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#FEE2E2', color: '#991B1B'}}>High</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>789 Oak Avenue, Busi</span>
                    </div>
                  </td>
                </tr>

                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Graffiti on Public Building</div>
                    <div className="report-desc">Offensive graffiti vandalism on the side of the community ce...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Graffiti</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#DBEAFE', color: '#1E40AF'}}>In Progress</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#FEF3C7', color: '#92400E'}}>Low</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>321 Community Cent</span>
                    </div>
                  </td>
                </tr>

                <tr className="table-row">
                  <td className="table-cell">
                    <div className="report-title">Broken Fire Hydrant</div>
                    <div className="report-desc">Fire hydrant leaking water continuously, wasting resources a...</div>
                  </td>
                  <td className="table-cell">
                    <span className="category-badge">Other</span>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge" style={{backgroundColor: '#FEE2E2', color: '#991B1B'}}>urgent</span>
                  </td>
                  <td className="table-cell">
                    <span className="priority-badge" style={{backgroundColor: '#FEE2E2', color: '#991B1B'}}>Urgent</span>
                  </td>
                  <td className="table-cell">
                    <div className="location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>567 Pine Street, Indus</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className="pagination-bar">
              <div className="pagination-progress"></div>
            </div>
            <button className="pagination-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
    </>
  );
};

export default ReportsPage;
