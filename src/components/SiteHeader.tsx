export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="identity" href="#home" aria-label="Sidali Saadi, home">
        <span className="seal" aria-hidden="true">
          s<span>s</span>
        </span>
        <span>
          Sidali Saadi<span className="identity-role">Software engineer</span>
        </span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a className="nav-contact" href="mailto:saadisidali010@gmail.com">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
