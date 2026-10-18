import { companies } from "../data/portfolio";
import { assetUrl } from "../paths";

export function Teams() {
  return (
    <div className="company-strip">
      <p className="eyebrow">TEAMS I’VE BUILT WITH</p>
      <div className="company-logos">
        {Object.entries(companies).map(([id, company]) => (
          <a
            key={id}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={company.label ? undefined : `${company.name} website`}
          >
            <img
              className={company.logoClassName || undefined}
              src={assetUrl(company.logo)}
              alt={company.label ? "" : company.name}
              width={company.width}
              height={company.height}
              loading="lazy"
            />
            {company.label && <span>{company.label}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
