export default function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{description}</span>
    </div>
  );
}
