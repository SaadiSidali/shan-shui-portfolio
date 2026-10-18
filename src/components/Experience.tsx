import { experience } from "../data/portfolio";
import { assetUrl } from "../paths";

export function Experience() {
  return (
    <section
      className="section experience-section"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">04 / ALONG THE WAY</p>
        <h2 id="experience-heading">
          Built through
          <br />
          <em>experience.</em>
        </h2>
        <a
          className="text-link"
          href={assetUrl("resume.pdf")}
          target="_blank"
          rel="noopener"
        >
          Download résumé <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="experience-list">
        {experience.map((job) => (
          <article key={job.name} className="job">
            <p className="job-date">{job.date}</p>
            <div>
              <h3>
                {job.company ? (
                  <a
                    className="job-company"
                    href={job.company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={assetUrl(job.company.logo)}
                      alt=""
                      loading="lazy"
                      width="38"
                      height="38"
                    />
                    {job.name}
                  </a>
                ) : (
                  job.name
                )}
                {job.current && (
                  <>
                    {" "}
                    <span className="current-label">CURRENT</span>
                  </>
                )}
              </h3>
              <p className="job-role">{job.role}</p>
              <p>{job.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
