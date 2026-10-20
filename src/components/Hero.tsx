import { assetUrl } from "../paths";

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <h1 id="hero-heading">
          Software,
          <br />
          with <em>intention.</em>
        </h1>
        <div className="hero-actions">
          <a className="quiet-link" href="#work">
            Selected work <span aria-hidden="true">↓</span>
          </a>
          <a
            className="quiet-link"
            href={assetUrl("resume.pdf")}
            target="_blank"
            rel="noopener"
          >
            Résumé <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
