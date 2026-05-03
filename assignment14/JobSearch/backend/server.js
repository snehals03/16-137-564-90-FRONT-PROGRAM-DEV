import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function buildJSearchQuery({ query, location }) {
  const q = (query ?? "").toString().trim();
  const loc = (location ?? "").toString().trim();

  if (!q && !loc) return "";
  if (q && !loc) return q;
  if (!q && loc) return `jobs in ${loc}`;

  return `${q} jobs in ${loc}`;
}

function normalizeEmploymentType(type) {
  const value = (type ?? "all").toString();

  if (value === "all") return undefined;

  return value;
}

app.get("/jobs", async (req, res) => {
  try {
    if (!RAPIDAPI_KEY) {
      return res.status(500).json({
        error: "Missing RAPIDAPI_KEY on server",
      });
    }

    const {
      query,
      location,
      page = "1",
      num_pages = "1",
      country = "us",
      date_posted = "all",
      employment_type = "all",
    } = req.query;

    const builtQuery = buildJSearchQuery({ query, location });

    if (!builtQuery) {
      return res.status(400).json({
        error: "Please provide query and/or location",
      });
    }

    const params = {
      query: builtQuery,
      page,
      num_pages,
      country,
      date_posted,
    };

    const normalizedEmploymentType = normalizeEmploymentType(employment_type);

    if (normalizedEmploymentType) {
      params.employment_types = normalizedEmploymentType;
    }

    const response = await axios.get(`https://${RAPIDAPI_HOST}/search`, {
      params,
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });

    const rawJobs = response?.data?.data ?? [];

    const jobs = rawJobs.map((j) => ({
      id: j.job_id ?? j.job_apply_link ?? `${j.employer_name ?? ""}-${j.job_title ?? ""}`,
      title: j.job_title ?? "",
      company: j.employer_name ?? "",
      location:
        j.job_city || j.job_state || j.job_country
          ? [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", ")
          : j.job_location ?? "",
      employmentType: j.job_employment_type ?? "",
      postedAt: j.job_posted_at_datetime_utc ?? "",
      description: j.job_description ?? "",
      applyLink: j.job_apply_link ?? j.job_google_link ?? "",
      source: j.job_publisher ?? "",
    }));

    res.json({
      query: {
        query: builtQuery,
        page: Number(page),
        num_pages: Number(num_pages),
        country,
        date_posted,
        employment_type,
      },
      jobs,
      raw: response.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        (error.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? error.response.data.message
          : undefined) ?? error.message;

      console.error("JSearch request failed:", status, message);

      return res.status(status).json({
        error: "Failed to fetch jobs",
        upstream: { status, message },
      });
    }

    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/cover-letter", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY on server",
      });
    }

    const { resumeText, ui, job } = req.body;

    if (!job?.title || !job?.company) {
      return res.status(400).json({
        error: "Missing job title or company",
      });
    }

    const prompt = `
Write a customized cover letter for this job.

Candidate resume:
${resumeText || "No resume text was provided."}

Search context:
Title searched: ${ui?.query || ""}
Location searched: ${ui?.location || ""}
Country: ${ui?.country || ""}
Date posted filter: ${ui?.date_posted || ""}
Employment type filter: ${ui?.employment_type || ""}

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location || ""}
Employment type: ${job.employmentType || ""}
Source: ${job.source || ""}
Apply link: ${job.applyLink || ""}

Job description:
${job.description || ""}

Write the cover letter in a professional but natural tone. Keep it around 250 to 350 words.
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write clear, tailored cover letters based on resumes and job descriptions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const coverLetter = response.data?.choices?.[0]?.message?.content ?? "";

    res.json({ coverLetter });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message;

      console.error("Cover letter request failed:", status, message);

      return res.status(status).json({
        error: "Failed to generate cover letter",
        upstream: { status, message },
      });
    }

    console.error(error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));