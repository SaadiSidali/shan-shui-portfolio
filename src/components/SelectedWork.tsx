import type { ReactNode } from "react";
import { assetUrl } from "../paths";

function Project({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <details className="project" open>
      <summary>
        <span className="project-title">
          {title}
          <span>{subtitle}</span>
        </span>
        <span className="expand-icon" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="project-body">{children}</div>
    </details>
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
        <h2 id="work-heading">
          Selected <em>work.</em>
        </h2>
      </div>
      <div className="projects">
        <Project
          title="Caterings Hub"
          subtitle="Full-stack platform · Australia"
        >
          <div className="project-description">
            <p>
              Dashboards, subscriptions, search, and event management, from the
              frontend to the AWS infrastructure.
            </p>
            <a
              className="text-link"
              href="https://caterings.com.au/b/Feedwell%20Catering%20Sydney"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit site <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="project-art website-art catering-art">
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
          </div>
        </Project>
        <Project title="StoresDZ" subtitle="Built to scale">
          <div className="project-description">
            <p>
              A commerce platform built to scale across stores, storefronts, and
              orders, with shared APIs and a fast Rust-based Liquid renderer.
            </p>
            <a
              className="text-link"
              href="https://app.storesdz.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit site <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="theme-showcase">
            <a
              className="website-preview"
              href="https://app.storesdz.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assetUrl("assets/storesdz-site.webp")}
                alt="StoresDZ landing page showing Couture, Heritage, and Marketplace storefront designs"
                width="1440"
                height="1163"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </Project>
      </div>
    </section>
  );
}
