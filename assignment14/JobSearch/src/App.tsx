import { useState } from "react";
import axios from "axios";
import "./App.css";

type Job = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  postedAt?: string;
  source?: string;
  description: string;
  applyLink: string;
  match?: number;
};

export default function JobAssistant() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("frontend developer");
  const [location, setLocation] = useState("New Jersey");
  const [country, setCountry] = useState("us");
  const [datePosted, setDatePosted] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const [coverLetterErrors, setCoverLetterErrors] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs", {
        params: {
          query,
          location,
          country,
          date_posted: datePosted,
          employment_type: employmentType,
        },
      });

      const data: Job[] = response.data?.jobs || [];
      setJobs(data.slice(0, 20));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setResumeText(reader.result as string);
    };
    reader.readAsText(file);
  };

  const calculateMatch = (resume: string, desc: string) => {
    if (!resume || !desc) return 0;

    const resumeWords = resume.toLowerCase().split(/\W+/).filter(Boolean);
    const descWords = desc.toLowerCase().split(/\W+/).filter(Boolean);

    if (descWords.length === 0) return 0;

    let matchCount = 0;

    descWords.forEach((word) => {
      if (resumeWords.includes(word)) matchCount++;
    });

    return Math.min(100, Math.round((matchCount / descWords.length) * 100));
  };

  const sortedJobs = jobs
    .map((job) => ({
      ...job,
      match: calculateMatch(resumeText, job.description),
    }))
    .sort((a, b) => (b.match || 0) - (a.match || 0));

  const generateCoverLetter = async (job: Job) => {
    const jobKey = job.id ?? `${job.company}-${job.title}`;
    setGeneratingFor(jobKey);

    try {
      setCoverLetterErrors((prev) => ({ ...prev, [jobKey]: "" }));

      const response = await axios.post("http://localhost:5000/cover-letter", {
        resumeText,
        resumeFileName: resumeFile?.name ?? "",
        ui: {
          query,
          location,
          country,
          date_posted: datePosted,
          employment_type: employmentType,
        },
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          employmentType: job.employmentType,
          description: job.description,
          applyLink: job.applyLink,
          source: job.source,
        },
      });

      const generatedText = response.data?.coverLetter || "";

      if (!generatedText) {
        throw new Error("No cover letter text returned.");
      }

      setCoverLetters((prev) => ({ ...prev, [jobKey]: generatedText }));
    } catch (error) {
      console.error("Error generating cover letter:", error);

      setCoverLetterErrors((prev) => ({
        ...prev,
        [jobKey]:
          "Unable to generate the cover letter. Check your backend server, API key, or quota.",
      }));
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="job-assistant">
      <h2 className="job-assistant__title">Job Search Assistant</h2>

      <div className="job-assistant__form">
        <div className="job-assistant__field">
          <div className="job-assistant__label">Title *</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="frontend developer"
            className="job-assistant__control"
          />
        </div>

        <div className="job-assistant__field">
          <div className="job-assistant__label">Location</div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New Jersey"
            className="job-assistant__control"
          />
        </div>

        <div className="job-assistant__field job-assistant__field--sm">
          <div className="job-assistant__label">Country</div>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="us"
            className="job-assistant__control"
          />
        </div>

        <div className="job-assistant__field job-assistant__field--md">
          <div className="job-assistant__label">Date Posted</div>
          <select
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            className="job-assistant__control"
          >
            <option value="all">Any time</option>
            <option value="today">Today</option>
            <option value="3days">Last 3 days</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
          </select>
        </div>

        <div className="job-assistant__field job-assistant__field--md">
          <div className="job-assistant__label">Employment Type</div>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="job-assistant__control"
          >
            <option value="all">All</option>
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="CONTRACTOR">Contract</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>

        <button onClick={fetchJobs} className="job-assistant__submit">
          Search Jobs
        </button>
      </div>

      <br />
      <br />

      <div className="job-assistant__resume">
        <div className="job-assistant__label">Resume upload optional, .txt recommended</div>
        <input type="file" accept=".txt" onChange={handleResumeUpload} />
      </div>

      <br />
      <br />

      {sortedJobs.map((job, index) => {
        const jobKey = job.id ?? `${job.company}-${job.title}`;

        return (
          <div
            key={job.id ?? `${job.company}-${job.title}-${index}`}
            className="job-assistant__card"
          >
            {coverLetterErrors[jobKey] ? (
              <div className="job-assistant__error">
                {coverLetterErrors[jobKey]}
              </div>
            ) : null}

            <h3>{job.title}</h3>

            <p>
              <strong>{job.company}</strong>
            </p>

            {job.location ? <p>{job.location}</p> : null}
            {job.employmentType ? <p>{job.employmentType}</p> : null}
            {job.postedAt ? <p>Posted: {job.postedAt}</p> : null}

            <p>Match: {job.match ?? 0}%</p>

            {job.applyLink ? (
              <a href={job.applyLink} target="_blank" rel="noreferrer">
                Apply Here
              </a>
            ) : (
              <p>No apply link provided.</p>
            )}

            <details>
              <summary>Job Description</summary>
              <p>{job.description}</p>
            </details>

            <button
              onClick={() => generateCoverLetter(job)}
              className="job-assistant__cover-letter-btn"
              disabled={generatingFor === jobKey}
            >
              {generatingFor === jobKey ? "Generating..." : "Generate Cover Letter"}
            </button>

            {coverLetters[jobKey] ? (
              <details className="job-assistant__cover-letter" open>
                <summary>Cover Letter</summary>
                <pre className="job-assistant__cover-letter-text">
                  {coverLetters[jobKey]}
                </pre>
              </details>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}