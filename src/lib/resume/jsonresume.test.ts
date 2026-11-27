import { describe, expect, it } from "vitest";

import example from "./__fixtures__/jsonresume-example.json";
import {
  formatDate,
  fromJsonResume,
  parseDate,
  toJsonResume,
} from "./jsonresume";
import { sampleResume } from "./sample";

describe("JSON Resume", () => {
  const data = fromJsonResume(example)!;

  it("imports the official example", () => {
    expect(data.profile).toMatchObject({
      firstName: "Richard",
      lastName: "Hendriks",
      headline: "Programmer",
      email: "richard.hendriks@mail.com",
      location: "San Francisco, California, US",
    });
    expect(data.links.map((l) => [l.network, l.url])).toEqual([
      ["portfolio", "http://richardhendricks.example.com"],
      ["twitter", "https://x.com/neutralthoughts"],
      ["other", "https://soundcloud.example.com/dandymusicnl"],
    ]);
    expect(data.links[2].label).toBe("SoundCloud");

    const [work] = data.experience;
    expect(work).toMatchObject({
      company: "Pied Piper",
      role: "CEO/President",
      location: "Palo Alto, CA",
      dates: {
        start: { year: 2013, month: 12 },
        end: { year: 2014, month: 12 },
        present: false,
      },
    });
    expect(work.bullets).toHaveLength(4);

    expect(data.education[0].degree).toBe("Bachelor in Information Technology");
    expect(data.education[0].details).toContain("Score: 4.0");
    expect(data.skills.map((s) => s.name)).toEqual([
      "HTML",
      "CSS",
      "Javascript",
      "Mpeg",
      "MP4",
      "GIF",
    ]);
    expect(data.projects[0]).toMatchObject({
      name: "Miss Direction",
      liveUrl: "missdirection.example.com",
      tags: ["GoogleMaps", "Chrome Extension", "Javascript"],
    });
    expect(data.customSections.map((s) => s.title)).toEqual([
      "Volunteering",
      "Publications",
      "References",
    ]);
    expect(data.layout.order.slice(-3)).toEqual(
      data.customSections.map((s) => `custom:${s.id}`),
    );
  });

  it("round-trips key fields (import → export)", () => {
    const out = toJsonResume(data);
    expect(out.basics).toMatchObject({
      name: "Richard Hendriks",
      label: "Programmer",
      email: example.basics.email,
      phone: example.basics.phone,
      url: example.basics.url,
    });
    expect(out.basics?.profiles?.map((p) => p?.network)).toEqual([
      "Twitter",
      "SoundCloud",
    ]);
    expect(out.work?.[0]).toMatchObject({
      name: "Pied Piper",
      position: "CEO/President",
      startDate: "2013-12",
      endDate: "2014-12",
    });
    expect(out.work?.[0]?.highlights).toEqual(
      expect.arrayContaining(example.work[0].highlights),
    );
    expect(out.education?.[0]).toMatchObject({
      institution: "University of Oklahoma",
      startDate: "2011-06",
    });
    expect(out.skills?.map((s) => s?.name)).toContain("Javascript");
    expect(out.languages).toEqual([
      { language: "English", fluency: "Native speaker" },
    ]);
    expect(out.certificates?.[0]).toMatchObject({
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      date: "2018-01",
    });
    expect(out.awards?.[0]).toMatchObject({ awarder: "Techcrunch" });
    expect(out.volunteer?.[0]).toMatchObject({
      organization: "CoderDojo",
      position: "Teacher",
      startDate: "2012-01",
    });
    expect(out.publications?.[0]).toMatchObject({
      name: "Video compression for 3d media",
      releaseDate: "2014-10",
    });
    expect(out.references?.[0]?.name).toBe("Erlich Bachman");
  });

  it("exports our data and re-imports it", () => {
    const back = fromJsonResume(
      JSON.parse(JSON.stringify(toJsonResume(sampleResume))),
    )!;
    expect(back.profile.email).toBe(sampleResume.profile.email);
    expect(back.experience.map((e) => [e.company, e.role, e.dates])).toEqual(
      sampleResume.experience.map((e) => [e.company, e.role, e.dates]),
    );
    expect(back.skills.map((s) => s.name)).toEqual(
      sampleResume.skills.map((s) => s.name),
    );
  });

  it("parses partial dates; missing end w/ a start means present", () => {
    expect(parseDate("2020")).toEqual({ year: 2020 });
    expect(parseDate("2020-03-15")).toEqual({ year: 2020, month: 3 });
    expect(parseDate("2020-13")).toEqual({ year: 2020 });
    expect(parseDate("soon")).toBeUndefined();
    expect(formatDate({ year: 2020, month: 3 })).toBe("2020-03");
    expect(
      fromJsonResume({ work: [{ name: "X", startDate: "2020-01" }] })!
        .experience[0].dates.present,
    ).toBe(true);
  });

  it("ignores garbage fields; rejects non-resumes", () => {
    const data = fromJsonResume({
      basics: { name: 42, profiles: "nope" },
      work: [null, { name: "Acme", highlights: [1, 2] }],
    })!;
    expect(data.profile.firstName).toBe("");
    expect(data.experience.map((e) => e.company)).toEqual(["Acme"]);
    expect(fromJsonResume({ foo: 1 })).toBeNull();
    expect(fromJsonResume(null)).toBeNull();
  });
});
