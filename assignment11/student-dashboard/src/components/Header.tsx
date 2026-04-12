interface Props {
  total: number;
  active: number;
  inactive: number;
}

function Header({ total, active, inactive }: Props) {
  return (
    <header className="dashboard-header">
      <div className="header-copy">
        <p className="header-eyebrow">Student Overview</p>
        <h1>Student Dashboard</h1>
        <p className="subtitle">Track progress, attendance, and class status</p>
      </div>

      {/* task 7: display counts */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-caption">total students</span>
          <span className="stat-number">{total}</span>
        </div>

        <div className="stat-card">
          <span className="stat-caption">active students</span>
          <span className="stat-number">{active}</span>
        </div>

        <div className="stat-card">
          <span className="stat-caption">inactive students</span>
          <span className="stat-number">{inactive}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;