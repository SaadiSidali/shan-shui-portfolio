import { assetUrl } from "../paths";

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-line"></span> SIDALI SAADI · SOFTWARE ENGINEER
        </p>
        <h1 id="hero-heading">
          Software,
          <br />
          with <em>intention.</em>
        </h1>
        <p className="intro">
          From the interface to the infrastructure.
          <br />I build thoughtful products and the systems
          <br className="desktop-break" /> that keep them running.
        </p>
        <div className="hero-actions">
          <a className="primary-link" href="#work">
            Explore my work <span aria-hidden="true">↘</span>
          </a>
          <a
            className="quiet-link"
            href={assetUrl("resume.pdf")}
            target="_blank"
            rel="noopener"
          >
            View résumé <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="vertical-note" aria-hidden="true">
        <span>FORM / FUNCTION / CRAFT</span>
        <i></i> 01 / ∞
      </div>
      <div className="hero-bottom">
        <a className="scroll-hint" href="#work">
          <span aria-hidden="true">↓</span> A FEW THINGS I’VE BUILT
        </a>
        <p>
          <span className="status-dot"></span> Currently engineering at Yassir{" "}
          <span className="location">Algeria · working across borders</span>
        </p>
      </div>
    </section>
  );
}
