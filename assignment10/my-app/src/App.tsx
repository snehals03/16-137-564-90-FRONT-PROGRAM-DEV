import React from "react";

// Define Issue type
//Task 5: adding priority
type Issue = {
  id: number;
  status: string;
  owner: string;
  created: Date;
  effort: number;
  priority: string;
  completionDate?: Date;
  title: string;
};

// IssueRow Props
type IssueRowProps = {
  issue: Issue;
  index: number;
};

// IssueRow Component
class IssueRow extends React.Component<IssueRowProps> {
  render() {
    const { issue, index } = this.props;

    const borderedStyle: React.CSSProperties = {
      border: "1px solid silver",
      padding: 6,
    };

    const rowStyle: React.CSSProperties = {
      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
    };

    return (
      <tr style={rowStyle}>
        <td style={borderedStyle}>{issue.id}</td>
        <td style={borderedStyle}>{issue.status}</td>
        <td style={borderedStyle}>{issue.owner}</td>
        <td style={borderedStyle}>
          {issue.created.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </td>
        <td style={borderedStyle}>{issue.effort}</td>
        <td style={borderedStyle}>{issue.priority}</td>
        <td style={borderedStyle}>
          {issue.completionDate
            ? issue.completionDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </td>
        <td style={borderedStyle}>{issue.title}</td>
      </tr>
    );
  }
}

// IssueTable Props
type IssueTableProps = {
  issues: Issue[];
};

// IssueTable Component
//Task 5: Adding priority to the table header and rows
class IssueTable extends React.Component<IssueTableProps> {
  render() {
    const issueRows = this.props.issues.map((issue, index) => (
      <IssueRow key={issue.id} issue={issue} index={index} />
    ));

const borderedStyle: React.CSSProperties = {
  border: "1px solid silver",
  padding: 6,
};
// Task 1: updating the table to show all columns
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={borderedStyle}>Id</th>
            <th style={borderedStyle}>Status</th>
            <th style={borderedStyle}>Owner</th>
            <th style={borderedStyle}>Created</th>
            <th style={borderedStyle}>Effort</th>
            <th style={borderedStyle}>Priority</th>
            <th style={borderedStyle}>Completion Date</th>
            <th style={borderedStyle}>Title</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    );
  }
}

// IssueFilter Component (no props)
class IssueFilter extends React.Component {
  render() {
    return <div></div>;
  }
}

// IssueAdd Component (no props)
class IssueAdd extends React.Component {
  render() {
    return <div>This is a placeholder for an Issue Add entry form.</div>;
  }
}

// Sample Data
// Task 2: Add a third issue of your own with the following
//Task 5: adding priority to the new issue
const issues: Issue[] = [
  {
    id: 1,
    status: "Open",
    owner: "Ravan",
    created: new Date("2016-08-15"),
    effort: 5,
    priority: "High",
    completionDate: undefined,
    title: "Error in console when clicking Add",
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Eddie",
    created: new Date("2016-08-16"),
    effort: 14,
    priority: "Medium",
    completionDate: new Date("2016-08-30"),
    title: "Missing bottom border on panel",
  },
  {
    id: 3,
    status: "New",
    owner: "Your Name",
    created: new Date(),
    effort: 8,
    priority: "Low",
    completionDate: undefined,
    title: "Submit button is not working",
  },
];

//Task 3: n the IssueList component, add a line of text below the first <hr /> that displays how many issues are in the list. It should read Total Issues: 3
class IssueList extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <p>Total Issues: {issues.length}</p>
        <IssueTable issues={issues} />
        <hr />
        <IssueAdd />
      </React.Fragment>
    );
  }
}

export default class App extends React.Component {
  render() {
    return <IssueList />;
  }
}
