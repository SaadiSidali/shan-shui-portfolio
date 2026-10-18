import type { ReactNode } from "react";
import { themes } from "../data/portfolio";
import { assetUrl } from "../paths";

function Project({
  number,
  title,
  subtitle,
  category,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  category: string;
  children: ReactNode;
}) {
  return (
    <details className="project" open>
      <summary>
        <span className="project-number">{number}</span>
        <span className="project-title">
          {title}
          <span>{subtitle}</span>
        </span>
        <span className="project-category">{category}</span>
        <span className="expand-icon" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="project-body">{children}</div>
    </details>
  );
}

function TechnologyTags({ tags }: { tags: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export function SelectedWork() {
  return (
    <section
      className="section work-section"
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">01 / SELECTED WORK</p>
        <h2 id="work-heading">
          Ideas, made <em>real.</em>
        </h2>
        <p>
          A selection of platforms, systems, and
          <br />
          web experiences I’ve worked on.
        </p>
      </div>
      <div className="projects">
        <Project
          number="01"
          title="Caterings Hub"
          subtitle="Full-stack platform · Australia"
          category="PRODUCT ENGINEERING"
        >
          <div className="project-description">
            <p className="project-kicker">FROM FRONTEND TO PRODUCTION</p>
            <h3>
              A platform with
              <br />a lot on its plate.
            </h3>
            <p>
              End-to-end development for a catering platform, formerly
              Foodtrucker. I worked on dashboards, subscriptions, event
              management, search, and the cloud infrastructure behind them.
            </p>
            <TechnologyTags
              tags={[
                "Next.js",
                "NestJS",
                "PostgreSQL",
                "Redis",
                "Elasticsearch",
                "AWS",
              ]}
            />
            <a
              className="text-link"
              href="https://caterings.com.au/b/Feedwell%20Catering%20Sydney"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore a business profile <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="project-art website-art catering-art">
            <div className="project-brand">
              <img
                src={assetUrl("assets/caterings.png")}
                alt=""
                width="32"
                height="32"
                loading="lazy"
              />
              <span>Catering Hub</span>
              <a
                href="https://caterings.com.au/b/Feedwell%20Catering%20Sydney"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Catering Hub"
              >
                ↗
              </a>
            </div>
            <a
              className="website-preview"
              href="https://caterings.com.au/b/Feedwell%20Catering%20Sydney"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assetUrl("assets/caterings-site.jpg")}
                alt="Fully loaded Feedwell Catering Sydney profile on Catering Hub, with its gallery, ratings, and enquiry tools"
                width="1440"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </a>
            <div className="art-caption">
              CATERING HUB · FEEDWELL CATERING SYDNEY
            </div>
          </div>
        </Project>
        <Project
          number="02"
          title="StoresDZ"
          subtitle="A commerce platform built for scaling"
          category="SCALABLE COMMERCE"
        >
          <div className="project-description">
            <p className="project-kicker">SCALING, FROM STOREFRONT TO SYSTEM</p>
            <h3>
              Commerce built
              <br />
              to scale.
            </h3>
            <p>
              Scaling is the core purpose of StoresDZ: a commerce platform that
              helps merchants grow across stores, storefront experiences, sales
              funnels, and order management.
            </p>
            <p>
              My work connects the storefront to the systems behind it,
              including independently designed themes, shared commerce APIs, and
              a fast Rust-based Liquid renderer.
            </p>
            <TechnologyTags
              tags={["TypeScript", "React", "Go", "Rust", "Redis", "Liquid"]}
            />
            <a
              className="text-link"
              href="https://github.com/SaadiSidali"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find me on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="theme-showcase">
            <div className="theme-showcase-heading">
              <span>
                STORES<span className="stores-mark">DZ</span>
              </span>
              <small>ONE PLATFORM. MANY POSSIBILITIES.</small>
            </div>
            <div className="theme-collage">
              {themes.map((theme) => (
                <figure
                  key={theme.name}
                  className={`theme-shot${theme.featured ? " theme-featured" : ""}`}
                >
                  <a
                    href={assetUrl(theme.image)}
                    target="_blank"
                    rel="noopener"
                    aria-label={`View ${theme.name} theme screenshot`}
                  >
                    <img
                      src={assetUrl(theme.image)}
                      alt={`${theme.name} storefront theme`}
                      width="1440"
                      height="1000"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <figcaption>{theme.name}</figcaption>
                </figure>
              ))}
            </div>
            <p className="art-caption">
              7 THEMES · ONE SHARED COMMERCE FOUNDATION
            </p>
          </div>
        </Project>
      </div>
    </section>
  );
}
