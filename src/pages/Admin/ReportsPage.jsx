import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import { adminApi } from "../../services/apiClient";
import "./ReportsPage.css";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [selectedReport, setSelectedReport] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = { per_page: 50 };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const [reportsRes, statsRes] = await Promise.all([
        adminApi.getReports(params),
        adminApi.getReportStats(),
      ]);

      setReports(reportsRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, status) => {
    const note = status === "dismissed" 
      ? prompt("Nhập lý do bác bỏ:") 
      : prompt("Nhập ghi chú xử lý:");
    
    if (note === null) return;

    setProcessing(id);
    try {
      await adminApi.resolveReport(id, { status, resolution_note: note });
      alert("Đã xử lý báo cáo!");
      loadData();
      setSelectedReport(null);
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Chờ xử lý" },
      in_review: { bg: "bg-blue-100 text-blue-700", icon: Eye, label: "Đang xem xét" },
      resolved: { bg: "bg-green-100 text-green-700", icon: CheckCircle, label: "Đã giải quyết" },
      dismissed: { bg: "bg-gray-100 text-gray-700", icon: XCircle, label: "Đã bác bỏ" },
    };
    return styles[status] || styles.pending;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      spam: "Spam",
      fraud: "Lừa đảo",
      inappropriate: "Nội dung không phù hợp",
      copyright: "Vi phạm bản quyền",
      other: "Khác",
    };
    return categories[category] || category;
  };

  return (
    <div className="p-6">
      <AdminHeader title="Quản lý báo cáo" subtitle="Xử lý các báo cáo từ người dùng" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã giải quyết</p>
              <p className="text-2xl font-bold text-green-600">{stats?.resolved || 0}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã bác bỏ</p>
              <p className="text-2xl font-bold text-gray-600">{stats?.dismissed || 0}</p>
            </div>
            <XCircle className="text-gray-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng báo cáo</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_review">Đang xem xét</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="dismissed">Đã bác bỏ</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả danh mục</option>
            <option value="spam">Spam</option>
            <option value="fraud">Lừa đảo</option>
            <option value="inappropriate">Nội dung không phù hợp</option>
            <option value="copyright">Vi phạm bản quyền</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có báo cáo nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nội dung</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người báo cáo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời gian</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => {
                  const status = getStatusBadge(report.status);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-500">#{report.id}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800 line-clamp-2">{report.reason || report.content}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {getCategoryLabel(report.category)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-800">{report.reporter?.full_name || "N/A"}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${status.bg}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {report.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleResolve(report.id, "resolved")}
                                disabled={processing === report.id}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg"
                              >
                                Giải quyết
                              </button>
                              <button
                                onClick={() => handleResolve(report.id, "dismissed")}
                                disabled={processing === report.id}
                                className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-lg"
                              >
                                Bác bỏ
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết báo cáo #{selectedReport.id}</h3>

            <div className="space-y-3 mb-6">
              <div className="py-2 border-b">
                <span className="text-gray-600 block mb-1">Nội dung báo cáo</span>
                <p className="text-gray-800">{selectedReport.reason || selectedReport.content}</p>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Danh mục</span>
                <span className="font-medium">{getCategoryLabel(selectedReport.category)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Người báo cáo</span>
                <span className="font-medium">{selectedReport.reporter?.full_name || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Đối tượng bị báo cáo</span>
                <span className="font-medium">{selectedReport.reported_type}: #{selectedReport.reported_id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedReport.status).bg}`}>
                  {getStatusBadge(selectedReport.status).label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Thời gian</span>
                <span>{new Date(selectedReport.created_at).toLocaleString("vi-VN")}</span>
              </div>
              {selectedReport.resolution_note && (
                <div className="py-2 border-b">
                  <span className="text-gray-600 block mb-1">Ghi chú xử lý</span>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded">{selectedReport.resolution_note}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedReport.status === "pending" && (
                <>
                  <button
                    onClick={() => handleResolve(selectedReport.id, "resolved")}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                  >
                    Giải quyết
                  </button>
                  <button
                    onClick={() => handleResolve(selectedReport.id, "dismissed")}
                    className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg"
                  >
                    Bác bỏ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
