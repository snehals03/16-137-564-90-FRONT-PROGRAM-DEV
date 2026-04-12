import React from "react";

interface Props {
  name: string;
  grade: number;
  isActive: boolean;
}

// task 8: pure component
const StudentCard: React.FC<Props> = React.memo(({ name, grade, isActive }) => {
  // task 3: jsx function variable
  const getResult = (value: number): string => {
    return value >= 75 ? "Passed" : "Failed";
  };

  const result = getResult(grade);

  return (
    <article className="student-card">
      <div className="student-card-top">
        <div className="student-avatar">{name.charAt(0)}</div>

        <div>
          <p className="student-eyebrow">student profile</p>
          <h3>{name}</h3>
        </div>
      </div>

      <div className="student-meta">
        <div className="meta-item">
          <span className="meta-label">grade</span>
          <span className="meta-value">{grade}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">result</span>
          <span className={result === "Passed" ? "meta-pill passed" : "meta-pill failed"}>
            {result}
          </span>
        </div>

        <div className="meta-item">
          <span className="meta-label">status</span>
          <span className={isActive ? "meta-pill active" : "meta-pill inactive"}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </article>
  );
});

export default StudentCard;