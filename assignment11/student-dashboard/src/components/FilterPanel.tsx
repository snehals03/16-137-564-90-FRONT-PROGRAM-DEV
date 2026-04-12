interface Props {
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function FilterPanel({
  selectedFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}: Props) {
  return (
    <section className="filter-panel">
      <div className="panel-copy">
        <p className="panel-eyebrow">controls</p>
        <h2>Find Students</h2>
        <p>Search by name or sort students by current status</p>
      </div>

      {/* task 5: filter students */}
      <div className="control-card">
        <label htmlFor="filter">filter students</label>
        <select
          id="filter"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">all students</option>
          <option value="active">active students</option>
          <option value="inactive">inactive students</option>
        </select>
      </div>

      {/* task 6: search bar */}
      <div className="control-card">
        <label htmlFor="search">search name</label>
        <input
          id="search"
          type="text"
          placeholder="type a student name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </section>
  );
}

export default FilterPanel;