import React from "react";

//Define Issue type
type Issue = {
  id: number;
  status: string;
  owner: string;
  created: Date;
  effort: number;
  completionDate?: Date;
  title: string;
  priority: string;
};

// --------------------
// Helper Function
// --------------------
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const borderedStyle: React.CSSProperties = {
  border: "1px solid silver",
  padding: 6,
};

const formContainerStyle: React.CSSProperties = {
  border: "1px solid silver",
  padding: 16,
  marginTop: 12,
  display: "inline-block",
};

const formInputStyle: React.CSSProperties = {
  padding: 8,
  marginRight: 8,
  marginBottom: 8,
  border: "1px solid silver",
  borderRadius: 4,
};

const formButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  border: "1px solid #555",
  borderRadius: 4,
  backgroundColor: "#f3f3f3",
  cursor: "pointer",
};

// --------------------
// IssueRow Component
// --------------------
class IssueRow extends React.Component<{
  issue: Issue;
  deleteIssue: (id: number) => void;
}> {
  render() {
    const { issue } = this.props;

    return (
      <tr>
        <td style={borderedStyle}>{issue.id}</td>
        <td style={borderedStyle}>{issue.status}</td>
        <td style={borderedStyle}>{issue.owner}</td>
        <td style={borderedStyle}>{formatDate(issue.created)}</td>
        <td style={borderedStyle}>{issue.effort}</td>
        <td style={borderedStyle}>
          {issue.completionDate ? formatDate(issue.completionDate) : ""}
        </td>
        <td style={borderedStyle}>{issue.title}</td>
        <td style={borderedStyle}>{issue.priority}</td>
        {/* Actions Column */}
        <td style={borderedStyle}>
          <button onClick={() => this.props.deleteIssue(issue.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

// --------------------
// IssueTable
// --------------------
class IssueTable extends React.Component<{
  issues: Issue[];
  deleteIssue: (id: number) => void;
}> {
  render() {
    const issueRows = this.props.issues.map((issue) => (
      <IssueRow
        key={issue.id}
        issue={issue}
        deleteIssue={this.props.deleteIssue}
      />
    ));

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={borderedStyle}>Id</th>
            <th style={borderedStyle}>Status</th>
            <th style={borderedStyle}>Owner</th>
            <th style={borderedStyle}>Created</th>
            <th style={borderedStyle}>Effort</th>
            <th style={borderedStyle}>Completion Date</th>
            <th style={borderedStyle}>Title</th>
            <th style={borderedStyle}>Priority</th>
            <th style={borderedStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    );
  }
}

// --------------------
// IssueFilter
// --------------------
class IssueFilter extends React.Component {
  render() {
    return <div></div>;
  }
}

//--------------------
// IssueAdd
// --------------------
type IssueAddProps = {
  addIssue: (issue: Issue) => void;
};

type IssueAddState = {
  owner: string;
  title: string;
  effort: string;
  completionDate: string;
  priority: string;
};

class IssueAdd extends React.Component<IssueAddProps, IssueAddState> {
  constructor(props: IssueAddProps) {
    super(props);
    this.state = {
      owner: "",
      title: "",
      effort: "",
      completionDate: "",
      priority: "Low",
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<
      IssueAddState,
      keyof IssueAddState
    >);
  };

  validateForm = () => {
    const owner = this.state.owner.trim();
    const title = this.state.title.trim();
    const effort = this.state.effort.trim();
    const effortValue = Number(effort);

    if (owner.length < 3) {
      alert("Owner must be at least 3 characters long.");
      return false;
    }

    if (title.length < 5) {
      alert("Title must be at least 5 characters long.");
      return false;
    }

    if (effort === "" || Number.isNaN(effortValue) || effortValue <= 0) {
      alert("Effort must be a positive number greater than 0.");
      return false;
    }

    return true;
  };

  handleSubmit = (e: React.FormEvent) => {
    //Task 3: Part 2: Code here
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const newIssue: Issue = {
      id: 0,
      status: "Open",
      owner: this.state.owner.trim(),
      created: new Date(),
      effort: Number(this.state.effort),
      completionDate: this.state.completionDate
        ? new Date(this.state.completionDate)
        : undefined,
      title: this.state.title.trim(),
      priority: this.state.priority,
    };

    this.props.addIssue(newIssue);
    this.setState({
      owner: "",
      title: "",
      effort: "",
      completionDate: "",
      priority: "Low",
    });
  };

  render() {
    //Task 3: Part 1 and 3 Add code here
    return (
      <div style={formContainerStyle}>
        <form onSubmit={this.handleSubmit}>
          <input
            style={formInputStyle}
            name="owner"
            placeholder="Owner"
            value={this.state.owner}
            onChange={this.handleChange}
          />
          <input
            style={formInputStyle}
            name="title"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <input
            style={formInputStyle}
            name="effort"
            type="number"
            min="1"
            placeholder="Effort"
            value={this.state.effort}
            onChange={this.handleChange}
          />
          <input
            style={formInputStyle}
            name="completionDate"
            type="date"
            value={this.state.completionDate}
            onChange={this.handleChange}
          />

          <button style={formButtonStyle} type="submit">
            Add Issue
          </button>
        </form>
      </div>
    );
  }
}

// --------------------
// IssueList
// --------------------
type IssueListState = {
  issues: Issue[];
};

class IssueList extends React.Component<{}, IssueListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      issues: [
        {
          id: 1,
          status: "Open",
          owner: "John",
          created: new Date("2016-08-15"),
          effort: 5,
          completionDate: undefined,
          title: "Error in console when clicking Add",
          priority: "High",
        },
        {
          id: 2,
          status: "Assigned",
          owner: "Emma",
          created: new Date("2016-08-16"),
          effort: 14,
          completionDate: new Date("2016-08-30"),
          title: "Missing bottom border on panel",
          priority: "Low",
        },
      ],
    };
  }

  addIssue = (issue: Issue) => {
    // Task 1: code here
    const newId = Math.max(...this.state.issues.map((i) => i.id)) + 1;
    const updatedIssue = { ...issue, id: newId };

    this.setState((prevState) => ({
      issues: [...prevState.issues, updatedIssue],
    }));
    // Task 4: Code here
    console.log("After addIssue setState (still old snapshot):", this.state.issues);
  };

  deleteIssue = (id: number) => {
    // Task 2: code here
    this.setState((prevState) => ({
      issues: prevState.issues.filter((issue) => issue.id !== id),
    }));
    // Task 4: Code here
    console.log("After deleteIssue setState (still old snapshot):", this.state.issues);
  };

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />

        <p>Total Issues: {this.state.issues.length}</p>

        <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
        <hr />

        <IssueAdd addIssue={this.addIssue} />
      </React.Fragment>
    );
  }
}

export default IssueList;
