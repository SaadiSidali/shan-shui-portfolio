import { freelanceProjects } from "../data/portfolio";
import { useMotionControl } from "../hooks/useMotionControl";
import { assetUrl } from "../paths";

export function IndependentWork() {
  const [paused, setPaused] = useMotionControl();

  return (
    <section
      className={`freelance-section ${paused ? "showcase-paused" : "showcase-playing"}`}
      id="freelance"
      aria-labelledby="freelance-heading"
    >
      <div className="section freelance-heading">
        <h2 id="freelance-heading" className="eyebrow">
          02 / INDEPENDENT WORK
        </h2>
        <button
          id="showcase-toggle"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Play" : "Pause"} showcase{" "}
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
      <div
        className="marquee-viewport"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            event.currentTarget.scrollLeft = 0;
        }}
      >
        <div className="marquee-track">
          {[false, true].map((duplicate) => (
            <div
              className="marquee-group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {freelanceProjects.map((project) => (
                <a
                  className="freelance-card"
                  key={project.url}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={project.name}
                  tabIndex={duplicate ? -1 : undefined}
                >
                  <img
                    className="freelance-logo"
                    src={assetUrl(project.logo)}
                    alt={project.name}
                    width={project.width}
                    height={project.height}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
