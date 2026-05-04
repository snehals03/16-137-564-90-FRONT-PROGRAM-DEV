import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const JSEARCH_RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
const COVER_LETTER_RAPIDAPI_HOST = "ai-resume-and-job-enhancer.p.rapidapi.com";

function buildJSearchQuery({ query, location }) {
  const q = (query ?? "").toString().trim();
  const loc = (location ?? "").toString().trim();

  if (!q && !loc) return "";
  if (q && !loc) return q;
  if (!q && loc) return `jobs in ${loc}`;

  return `${q} jobs in ${loc}`;
}

function normalizeEmploymentType(type) {
  const value = (type ?? "all").toString().trim().toLowerCase();

  if (value === "all") return undefined;
  if (value === "fulltime" || value === "full-time") return "FULLTIME";
  if (value === "parttime" || value === "part-time") return "PARTTIME";
  if (value === "contract" || value === "contractor") return "CONTRACTOR";
  if (value === "temporary" || value === "temp") return "TEMPORARY";

  return value.toUpperCase();
}

app.get("/", (_req, res) => {
  res.json({
    message: "Job Search backend is running.",
  });
});

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

    const response = await axios.get(`https://${JSEARCH_RAPIDAPI_HOST}/search`, {
      params,
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": JSEARCH_RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });

    const rawJobs = response?.data?.data ?? [];

    const jobs = rawJobs.map((j) => ({
      id:
        j.job_id ??
        j.job_apply_link ??
        `${j.employer_name ?? ""}-${j.job_title ?? ""}`,
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
    if (!RAPIDAPI_KEY) {
      return res.status(500).json({
        error: "Missing RAPIDAPI_KEY on server",
      });
    }

    const { resumeText, ui, job } = req.body;

    if (!job?.description) {
      return res.status(400).json({
        error: "Missing job description",
      });
    }

    const resumeContent =
      resumeText && resumeText.trim().length > 0
        ? resumeText
        : "Candidate has experience in user experience design, frontend development, accessibility, research, communication, and product-focused project work.";

    const jobDescription = `
Job title: ${job?.title || ""}
Company: ${job?.company || ""}
Location: ${job?.location || ui?.location || ""}
Employment type: ${job?.employmentType || ui?.employment_type || ""}

Job description:
${job.description}
`;

    const additionalInfo = `
Please generate a customized cover letter for this job.

Search context:
- Title searched: ${ui?.query || ""}
- Location searched: ${ui?.location || ""}
- Country: ${ui?.country || ""}
- Date posted filter: ${ui?.date_posted || ""}
- Employment type filter: ${ui?.employment_type || ""}

Keep the tone professional, natural, specific, and concise.
`;

    const encodedParams = new URLSearchParams();

    encodedParams.set("additional_info", additionalInfo);
    encodedParams.set("resume_content", resumeContent);
    encodedParams.set("job_description", jobDescription);

    const response = await axios.post(
      `https://${COVER_LETTER_RAPIDAPI_HOST}/cover-letter-generation`,
      encodedParams,
      {
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": COVER_LETTER_RAPIDAPI_HOST,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    console.log("Cover letter API response:", data);

    const coverLetter =
      data?.coverLetter ||
      data?.cover_letter ||
      data?.content ||
      data?.result ||
      data?.text ||
      data?.message ||
      data?.generated_cover_letter ||
      data?.cover_letter_text ||
      data?.letter ||
      data?.output ||
      (typeof data === "string" ? data : JSON.stringify(data, null, 2));

    res.json({ coverLetter });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      console.error("Cover letter request failed:", status);
      console.error("Cover letter API error data:", error.response?.data);

      return res.status(status).json({
        error: "Failed to generate cover letter",
        upstream: {
          status,
          data: error.response?.data,
          message: error.message,
        },
      });
    }

    console.error(error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});