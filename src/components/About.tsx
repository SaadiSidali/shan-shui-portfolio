import { skills } from "../data/portfolio";
import { assetUrl } from "../paths";

export function About() {
  return (
    <section
      className="section about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div>
        <p className="eyebrow">03 / A LITTLE CONTEXT</p>
        <h2 id="about-heading">
          Curiosity is
          <br />
          the <em>constant.</em>
        </h2>
      </div>
      <div className="about-copy">
        <p className="large-copy">
          I’m Sidali, a software engineer based in Algeria. I like understanding
          how things work and finding ways to improve them.
        </p>
        <p>
          My work connects frontend, backend, and cloud infrastructure. I’m
          currently building transaction services and operational tools at
          Yassir, with experience across commerce, AI workflows, and full-stack
          product development.
        </p>
        <p>
          Applied mathematics at the University of Boumerdès is part of my
          background. Beyond product work, I’m drawn to cybersecurity, CTF
          challenges, networking, self-hosting, and open source.
        </p>
        <a
          className="text-link"
          href={assetUrl("resume.pdf")}
          target="_blank"
          rel="noopener"
        >
          Read my résumé <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="skills">
        {skills.map((skill) => (
          <div key={skill.number}>
            <span>{skill.number}</span>
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
