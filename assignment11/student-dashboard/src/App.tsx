// Student Dashboard project built with React and TypeScript.
// App.tsx stores the student data and passes it into StudentList.
// StudentList uses map() to render StudentCard components and filter() with useState to show all, active, or inactive students.
// StudentCard uses props to display each student's name, grade, active status, and pass/fail result.
// Conditional rendering is used in StudentCard to show Active/Inactive and Passed/Failed.
// GitHub Repository Link: https://github.com/yourusername/student-dashboard
import { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import FilterPanel from "./components/FilterPanel";
import StudentList from "./components/StudentList";

export interface Student {
  id: number;
  name: string;
  grade: number;
  isActive: boolean;
}

// task 1
// extra requirement: added minimum 10 students
const studentsData: Student[] = [
  { id: 1, name: "Jim", grade: 90, isActive: true },
  { id: 2, name: "Kelly", grade: 70, isActive: false },
  { id: 3, name: "Dwight", grade: 85, isActive: true },
  { id: 4, name: "Michael", grade: 60, isActive: true },
  { id: 5, name: "Oscar", grade: 95, isActive: true },
  { id: 6, name: "Jan", grade: 72, isActive: false },
  { id: 7, name: "Angela", grade: 88, isActive: true },
  { id: 8, name: "Pam", grade: 91, isActive: true },
  { id: 9, name: "Kevin", grade: 67, isActive: false },
  { id: 10, name: "Ryan", grade: 78, isActive: true },
];

function App() {
  // task 5: selected status filter
  const [selectedFilter, setSelectedFilter] = useState("all");

  // task 6: search input state
  const [searchTerm, setSearchTerm] = useState("");

  // task 7: student counts
  const totalStudents = studentsData.length;
  const activeStudents = studentsData.filter((student) => student.isActive).length;
  const inactiveStudents = studentsData.filter((student) => !student.isActive).length;

  // task 5 & 6: filter by status and search
  const filteredStudents = useMemo(() => {
    return studentsData
      .filter((student) => {
        if (selectedFilter === "active") return student.isActive;
        if (selectedFilter === "inactive") return !student.isActive;
        return true;
      })
      .filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedFilter, searchTerm]);

  return (
    <div className="app-container">
      {/* task 8: header component */}
      <Header
        total={totalStudents}
        active={activeStudents}
        inactive={inactiveStudents}
      />

      {/* task 8: filter panel component */}
      <FilterPanel
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* task 1: render student list */}
      <StudentList students={filteredStudents} />
    </div>
  );
}

export default App;