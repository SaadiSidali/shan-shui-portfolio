import { skills } from "../data/portfolio";

export function About() {
  return (
    <section
      className="section about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div>
        <h2 id="about-heading">
          About <em>me.</em>
        </h2>
      </div>
      <div className="about-copy">
        <p className="large-copy">
          I’m Sidali, a software engineer in Algeria. I build across frontend,
          backend, and cloud infrastructure.
        </p>
        <p>
          Currently at Yassir, with experience in commerce, AI workflows, and
          product development. Outside work: applied mathematics, cybersecurity,
          and open source.
        </p>
      </div>
      <div className="skills">
        {skills.map((skill) => (
          <div key={skill.title}>
            <h3>{skill.title}</h3>
            <p>
              {skill.lines[0]}
              <br />
              {skill.lines[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
