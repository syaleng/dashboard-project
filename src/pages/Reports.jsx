import { useRef, useState } from "react";
import { reports } from "../data/reports";

export default function Reports() {
  const formRef = useRef(null);

  const [reportList, setReportList] = useState(() => {
    const savedReports = localStorage.getItem("systemReports");

    if (savedReports) {
      return JSON.parse(savedReports);
    }

    return reports;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    type: "Users",
    date: "",
    status: "pending",
  });

  const [error, setError] = useState("");
  const [editReportId, setEditReportId] = useState(null);

  const isEditing = editReportId !== null;

  const totalReports = reportList.length;

  const completedReports = reportList.filter(
    (report) => report.status === "completed",
  ).length;

  const pendingReports = reportList.filter(
    (report) => report.status === "pending",
  ).length;

  const inProgressReports = reportList.filter(
    (report) => report.status === "in-progress",
  ).length;

  const filteredReports = reportList.filter((report) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      report.title.toLowerCase().includes(searchText) ||
      report.type.toLowerCase().includes(searchText) ||
      report.date.toLowerCase().includes(searchText) ||
      report.status.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function saveReports(updatedReports) {
    setReportList(updatedReports);
    localStorage.setItem("systemReports", JSON.stringify(updatedReports));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function resetForm() {
    setFormData({
      title: "",
      type: "Users",
      date: "",
      status: "pending",
    });

    setEditReportId(null);
    setError("");
  }

  function validateForm() {
    if (!formData.title.trim() || !formData.date.trim()) {
      setError("Please fill in report title and date.");
      return false;
    }

    const titleExists = reportList.some(
      (report) =>
        report.id !== editReportId &&
        report.title.trim().toLowerCase() ===
          formData.title.trim().toLowerCase(),
    );

    if (titleExists) {
      setError("This report title already exists.");
      return false;
    }

    return true;
  }

  function handleAddReport(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newReport = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      date: formData.date,
      status: formData.status,
    };

    const updatedReports = [...reportList, newReport];

    saveReports(updatedReports);
    resetForm();
  }

  function handleEditReport(report) {
    setEditReportId(report.id);

    setFormData({
      title: report.title,
      type: report.type,
      date: report.date,
      status: report.status,
    });

    setError("");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function handleUpdateReport(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedReports = reportList.map((report) => {
      if (report.id === editReportId) {
        return {
          ...report,
          title: formData.title.trim(),
          type: formData.type,
          date: formData.date,
          status: formData.status,
        };
      }

      return report;
    });

    saveReports(updatedReports);
    resetForm();
  }

  function handleDeleteReport(reportId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmDelete) {
      return;
    }

    const updatedReports = reportList.filter(
      (report) => report.id !== reportId,
    );

    saveReports(updatedReports);

    if (editReportId === reportId) {
      resetForm();
    }

    setError("");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <div className="page-card reports-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Add, edit, delete, search, and filter system reports.</p>
        </div>

        <span className="total-badge">Total Reports: {totalReports}</span>
      </div>

      <div className="report-summary-grid">
        <div className="report-summary-card">
          <p>Total Reports</p>
          <h3>{totalReports}</h3>
          <span>All generated reports</span>
        </div>

        <div className="report-summary-card">
          <p>Completed</p>
          <h3>{completedReports}</h3>
          <span>Finished reports</span>
        </div>

        <div className="report-summary-card">
          <p>Pending</p>
          <h3>{pendingReports}</h3>
          <span>Waiting for review</span>
        </div>

        <div className="report-summary-card">
          <p>In Progress</p>
          <h3>{inProgressReports}</h3>
          <span>Currently processing</span>
        </div>
      </div>

      <form
        ref={formRef}
        className="add-user-form"
        onSubmit={isEditing ? handleUpdateReport : handleAddReport}
      >
        <h2>{isEditing ? "Edit Report" : "Add New Report"}</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-grid">
          <input
            type="text"
            name="title"
            placeholder="Report title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="Users">Users</option>
            <option value="System">System</option>
            <option value="Security">Security</option>
            <option value="Analytics">Analytics</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-user-button">
            {isEditing ? "Update Report" : "Add Report"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="cancel-edit-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="reports-filter-bar">
        <input
          className="search-input reports-search-input"
          type="text"
          placeholder="Search by title, type, date, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
        </select>

        <button
          type="button"
          className="clear-filter-button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="reports-table-wrapper">
        <h2>Recent Reports</h2>

        {filteredReports.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Report Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>
                  <td>{report.title}</td>
                  <td>{report.type}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="edit-user-button"
                        onClick={() => handleEditReport(report)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-user-button"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">No report found.</p>
        )}
      </div>
    </div>
  );
}
