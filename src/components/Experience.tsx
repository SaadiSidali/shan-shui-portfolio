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
        <h2 id="experience-heading">Experience.</h2>
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
