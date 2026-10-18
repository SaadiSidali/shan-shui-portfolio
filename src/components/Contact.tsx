import { assetUrl } from "../paths";

export function Contact() {
  return (
    <section
      className="section contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <p className="eyebrow">05 / THE NEXT CHAPTER</p>
      <h2 id="contact-heading">
        Something in mind?
        <br />
        Let’s <em>build it.</em>
      </h2>
      <a className="contact-email" href="mailto:saadisidali010@gmail.com">
        saadisidali010@gmail.com <span aria-hidden="true">↗</span>
      </a>
      <div className="social-links">
        <a
          href="https://github.com/SaadiSidali"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/in/sid-ali-saadi"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn ↗
        </a>
        <a href={assetUrl("resume.pdf")} target="_blank" rel="noopener">
          Résumé ↗
        </a>
      </div>
    </section>
  );
}
