import { resumeDataSchema, type ResumeData } from "./schema";

/** Demo content for thumbnails/gallery only, never a fallback for user data. */
export const sampleResume: ResumeData = resumeDataSchema.parse({
  version: 1,
  profile: {
    firstName: "John",
    lastName: "Doe",
    headline: "Software Engineer",
    email: "john.doe@gmail.com",
    phone: "+1 123-456-7890",
    location: "123 Main Street, Cityville, State, 12345",
    summary:
      "Passionate **full-stack developer** with 3+ years building *fast, accessible* web apps. Open-source contributor at [github.com/johndoe](https://github.com/johndoe).",
  },
  links: [
    {
      id: "link-1",
      network: "linkedin",
      url: "https://www.linkedin.com/in/johndoe",
    },
    { id: "link-2", network: "github", url: "https://github.com/johndoe" },
    { id: "link-3", network: "twitter", url: "https://twitter.com/johndoe" },
  ],
  skills: [
    "html5",
    "css3",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "next js",
    "tailwind css",
    "sql",
    "git & github",
    "mongodb",
  ].map((name, i) => ({ id: `skill-${i + 1}`, name })),
  interests: ["Reading", "Hiking", "Coding Challenges"].map((name, i) => ({
    id: `interest-${i + 1}`,
    name,
  })),
  education: [
    {
      id: "education-1",
      degree: "Master of Web Development",
      institution: "Digital University",
      dates: { start: { year: 2022 }, end: { year: 2024 } },
    },
    {
      id: "education-2",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      dates: { start: { year: 2018 }, end: { year: 2022 } },
    },
    {
      id: "education-3",
      degree: "Diploma in Software Engineering",
      institution: "Tech Institute",
      dates: { start: { year: 2016 }, end: { year: 2018 } },
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "E-commerce Platform",
      description:
        "Developed a responsive e-commerce platform with user authentication and payment gateway integration.",
      liveUrl: "https://example.com",
      sourceUrl: "https://github.com/johndoe/e-commerce-project",
      tags: ["React", "Node.js", "MongoDB", "Bootstrap"],
    },
    {
      id: "project-2",
      name: "Task Manager App",
      description:
        "Built a task manager application to organize and track daily tasks with user-friendly interfaces.",
      liveUrl: "https://example.com/task-manager",
      sourceUrl: "https://github.com/johndoe/task-manager-app",
      tags: ["JavaScript", "Express", "MongoDB", "React"],
    },
  ],
  experience: [
    {
      id: "experience-1",
      company: "Tech Solutions Inc.",
      role: "Software Engineer",
      location: "Cityville, State",
      dates: { start: { year: 2022, month: 6 }, end: { year: 2023, month: 9 } },
      bullets: [
        "Developing and maintaining web applications",
        "Collaborating with cross-functional teams",
        "Troubleshooting and debugging issues",
      ].map((text, i) => ({ id: `bullet-1-${i + 1}`, text })),
    },
    {
      id: "experience-2",
      company: "Code Innovators",
      role: "Junior Developer",
      location: "Cityville, State",
      dates: { start: { year: 2021, month: 1 }, end: { year: 2022, month: 5 } },
      bullets: [
        "Assisting in the development of new features",
        "Conducting code reviews",
        "Participating in agile development cycles",
      ].map((text, i) => ({ id: `bullet-2-${i + 1}`, text })),
    },
  ],
  languages: [
    { id: "language-1", name: "English", proficiency: "Native" },
    { id: "language-2", name: "Spanish", proficiency: "B2" },
  ],
  certifications: [
    {
      id: "certification-1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: { year: 2023, month: 4 },
      url: "https://aws.amazon.com/certification",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "Hackathon Winner",
      issuer: "City Tech Fest",
      date: { year: 2022, month: 11 },
      description: "Built a *real-time* transit tracker in 24 hours.",
    },
  ],
  customSections: [
    {
      id: "personal-profile",
      title: "Personal Profile",
      items: [
        {
          id: "personal-profile-1",
          title: "Language Known",
          description: "English, Spanish",
        },
        {
          id: "personal-profile-2",
          title: "Certifications",
          description: "React Developers Certifications, Node.js Certification",
        },
      ],
    },
  ],
  layout: {
    order: [
      "summary",
      "experience",
      "projects",
      "education",
      "skills",
      "languages",
      "certifications",
      "awards",
      "interests",
      "links",
      "custom:personal-profile",
    ],
  },
});
