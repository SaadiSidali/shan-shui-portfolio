import { useCallback, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { IndependentWork } from "./components/IndependentWork";
import { Landscape } from "./components/Landscape";
import { LoadingScreen } from "./components/LoadingScreen";
import { SelectedWork } from "./components/SelectedWork";
import { SiteHeader } from "./components/SiteHeader";
import { Teams } from "./components/Teams";

export function App() {
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);
  return (
    <div className={`portfolio${ready ? " is-ready" : ""}`}>
      <Landscape onReady={reveal} />
      <div className="paper-wash" aria-hidden="true" />
      {!ready && <LoadingScreen />}
      <div className="site-content" inert={!ready} aria-hidden={!ready}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
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
      </div>
    </div>
  );
}
