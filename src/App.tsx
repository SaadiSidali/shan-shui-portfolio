import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { IndependentWork } from "./components/IndependentWork";
import { Landscape } from "./components/Landscape";
import { SelectedWork } from "./components/SelectedWork";
import { SiteHeader } from "./components/SiteHeader";
import { Teams } from "./components/Teams";

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Landscape />
      <div className="paper-wash" aria-hidden="true" />
      <SiteHeader />
      <main id="main">
        <Hero />
        <div className="content-sheet">
          <Teams />
          <SelectedWork />
          <IndependentWork />
          <About />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
