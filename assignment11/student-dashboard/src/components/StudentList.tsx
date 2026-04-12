import type { Student } from "../App";
import StudentCard from "./StudentCard";

interface Props {
  students: Student[];
}

function StudentList({ students }: Props) {
  return (
    <section className="student-list-section">
      <div className="list-header">
        <div>
          <p className="list-eyebrow">class roster</p>
          <h2>Student List</h2>
        </div>

        <div className="list-badge">
          showing {students.length} student{students.length !== 1 ? "s" : ""}
        </div>
      </div>

      {students.length > 0 ? (
        <div className="student-grid">
          {students.map((student) => (
            // task 1 + 2: render list and pass props
            <StudentCard
              key={student.id}
              name={student.name}
              grade={student.grade}
              isActive={student.isActive}
            />
          ))}
        </div>
      ) : (
        <p className="empty-message">no students found</p>
      )}
    </section>
  );
}

export default StudentList;