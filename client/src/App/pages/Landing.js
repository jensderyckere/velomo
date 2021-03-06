import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

// Smooth scroll
import { Link, Element } from "react-scroll";

// Images
import Background from '../assets/landing/bg.svg';
import Logo from '../assets/landing/logo.svg';
import Points from '../assets/landing/points.svg';
import Challenges from '../assets/landing/challenges.svg';
import Monitoring from '../assets/landing/monitoring.svg';
import Team from '../assets/landing/team.svg';
import User from '../assets/landing/user.svg';
import Event from '../assets/landing/event.svg';
import Reward from '../assets/landing/reward.svg';
import Mockup from '../assets/landing/mockup_1.png';
import Mockup2 from '../assets/landing/mockup_2.png';
import BigQuote from '../assets/landing/quote_trans.svg';
import SmallQuote from '../assets/landing/quote_small.svg';

// Components
import { StandardButton } from "../components";

// Partials
import { Footer } from "../partials";

// Routes
import * as Routes from "../routes";

// Services
import { useApi } from "../services";

export const Landing = () => {
  // Routing
  const history = useHistory();

  // Services
  const { getLandingStats } = useApi();

  // States
  const [ scrolling, setScrolling ] = useState(false);
  const [ stats, setStats ] = useState();

  const watchWindow = useCallback(() => {
    if (window.scrollY > 400) {
      setScrolling(true);
    } else {
      setScrolling(false);
    };
  }, []);

  const fetchStats = useCallback(async () => {
    const result = await getLandingStats();
    setStats(result);
  }, [getLandingStats]);

  useEffect(() => {
    window.addEventListener('scroll', watchWindow);
    fetchStats();
  }, [fetchStats, watchWindow]);

  return (
    <div className="landing">
      <header className={`landing__header ${scrolling ? 'scrolling-header' : ''}`}>
        <div className="d-md-flex d-none container align-items-center">
          <ul>
            <li>
              <Link className="landing__header--link" to="front">
                <img src={Logo} alt="logo" />
              </Link>
            </li>
            <li>
              <Link className="landing__header--link" to="front">
                Home
              </Link>
            </li>
            <li>
              <Link className="landing__header--link" to="features">
                Features
              </Link>
            </li>
            <li>
              <Link className="landing__header--link" to="stories">
                Verhalen
              </Link>
            </li>
            <li>
              <Link className="landing__header--link" to="results">
                Prestaties
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-md-none d-flex container align-items-center justify-content-center">
          <ul>
            <li>
              <Link className="landing__header--link" to="front">
                <img src={Logo} alt="logo" />
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <Element className="landing__first" name="front">
        <section className="landing__front d-lg-block d-none" style={{
          backgroundImage: `url(${Background})`,
        }}>
          <div className="container d-lg-flex d-none justify-content-between align-items-center">
            <div className="landing__front--text">
              <h1 className="landing__front--title">
                De connectie tussen renner en club
              </h1>
              <StandardButton 
                text="Start meteen"
                action={() => history.push(Routes.SIGNUP)}
              />
            </div>
            <div className="landing__front--wrapper">
              <img className="landing__front--mockup" alt="mockup" src={Mockup} />
            </div>
          </div>
        </section>
        <section className="landing__front--mob d-lg-none d-block" style={{
          backgroundImage: `url(${Background})`,
        }}>
          <div className="container">
            <h1 className="landing__front--mob--title">
              De connectie tussen renner en club
            </h1>
            <div className="d-flex justify-content-center">
              <StandardButton 
                text="Start meteen"
                action={() => history.push(Routes.SIGNUP)}
              />
            </div>
            <div className="landing__front--mob--mockup d-flex justify-content-center">
              <img alt="mockup" src={Mockup} />
            </div>
          </div>
        </section>
        <div className="landing__back"></div>
      </Element>
      <Element className="landing__features" name="features">
        <div className="landing__clients">

        </div>
        <div className="landing__featured-content container">
          <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <h1 className="landing__featured-content--title">
                Modernisering van clubtoepassingen
              </h1>
              <p className="landing__featured-content--text">
                We zijn 2021. De wereld verandert snel en dat maakt zich ook kenbaar in de wielerwereld. Het digitaliseren van verschillende toepassingen is geen luxe maar een nood geworden.
              </p>
            </div>
          </div>
          <div className="landing__featured-content__items row">
            <div className="col-md-4 col-12 landing__featured-content__items--item">
              <div className="d-flex justify-content-center">
                <img src={Points} alt="puntensysteem" />
              </div>
              <h6>Puntensysteem</h6>
              <p>
                Een puntensysteem op maat van jouw wielerteam? En dit doorgaans het ganse seizoen? Allemaal mogelijk binnen Velomo.
              </p>
            </div>
            <div className="col-md-4 col-12 landing__featured-content__items--item">
              <div className="d-flex justify-content-center">
                <img src={Challenges} alt="uitdagingen" />
              </div>
              <h6>Uitdagingen</h6>
              <p>
                Stel als renner doelen voor jezelf en stel als club doelen en uitdagingen voor jouw renner. Zo houd je de motivatie hoog.
              </p>
            </div>
            <div className="col-md-4 col-12 landing__featured-content__items--item">
              <div className="d-flex justify-content-center">
                <img src={Monitoring} alt="puntensysteem" />
              </div>
              <h6>Monitoring</h6>
              <p>
                Of het nu gaat om aanwezigheden op een bepaald evenement of om het bekijken van de inzet van van één van jouw renners. Je blijft voortdurend op de hoogte.
              </p>
            </div>
          </div>
        </div>
      </Element>
      <Element className="landing__testimonials d-lg-flex d-none" name="stories">
        <div className="container d-flex">
          <div className="landing__testimonials__left">
            <div className="landing__testimonials__left--title">
              <img src={BigQuote} alt="quote" />
              <h1>Wat anderen hebben te zeggen</h1>
            </div>
            <div className="landing__testimonials__card--large">
              <div className="landing__testimonials__card">
                <div className="landing__testimonials__card--content">
                  <img src={SmallQuote} alt="small-quote" />
                  <p>
                    Ik maak nu al een tijdje gebruik van Velomo om als renner te communiceren met mijn team. Ik heb nooit echt nood aan fysieke ingevingen van de club maar mentaal kunnen ze me wel heel wat motiveren nu.
                  </p>
                  <h6>
                    Arnaud Deleu
                  </h6>
                  <span>
                    A'Bloc Coaching
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="landing__testimonials__right">
            <div className="landing__testimonials__card--large">
              <div className="landing__testimonials__card">
                <div className="landing__testimonials__card--content">
                  <img src={SmallQuote} alt="small-quote" />
                  <p>
                    Dit geeft nog maar eens aan hoe belangrijk het mentale aspect is binnen sport.
                  </p>
                  <h6>
                    Jorden Vankeirsbulck
                  </h6>
                  <span>
                    Leerkracht L.O
                  </span>
                </div>
              </div>
            </div>
            <div className="landing__testimonials__card--medium">
              <div className="landing__testimonials__card">
                <div className="landing__testimonials__card--content">
                  <img src={SmallQuote} alt="small-quote" />
                  <p>
                    Ik ben iemand die zeer vaak nood heeft aan uitdaging. Zomaar gaan trainen lukt mij niet. Velomo geeft mij, samen met de club, heel wat doelen.
                  </p>
                  <h6>
                    Nourdine Ranson
                  </h6>
                  <span>
                    Asfra Racing Team
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>
      <Element className="landing__stories" name="results">
        <section className="landing__stories--digits container">
          <div className="row">
            <div className="col-md-6 col-12 landing__stories--digits--context">
              <h1>
                Enkele interessante cijfers over Velomo 
              </h1>
              <p>
                Deze cijfers zijn up-to-date
              </p>
            </div>
            <div className="col-md-6 col-12">
              <div className="row">
                <div className="col-12 col-lg-6 landing__stories--digits--item d-flex justify-content-start">
                  <div className="d-flex align-items-center">
                    <img src={Team} alt="team" />
                    <div>
                      <h5>
                        {stats && stats.teams}
                      </h5>
                      <span>
                        Teams
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6 landing__stories--digits--item d-flex  justify-content-start">
                  <div className="d-flex align-items-center">
                    <img src={User} alt="user" />
                    <div>
                      <h5>
                      {stats && stats.users}
                      </h5>
                      <span>
                        Gebruikers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6 landing__stories--digits--item d-flex justify-content-start">
                  <div className="d-flex align-items-center">
                    <img src={Event} alt="event" />
                    <div>
                      <h5>
                      {stats && stats.events}
                      </h5>
                      <span>
                        Evenementen
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6 landing__stories--digits--item d-flex justify-content-start">
                  <div className="d-flex align-items-center">
                    <img src={Reward} alt="reward" />
                    <div>
                      <h5>
                      {stats && stats.rewards}
                      </h5>
                      <span>
                        Beloningen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>  
        <section className="landing__stories--last container">
          <div className="row">
            <div className="d-md-flex d-none col-md-6">
              <div className="landing__stories--last__mockup">
                <img src={Mockup2} alt="mockup" />
              </div>
            </div>
            <div className="col-md-6 col-12 landing__stories--last__text">
              <h1>
                Doorneem zelf snel Velomo
              </h1>
              <p>
                Velomo bied een ruim aanbod aan mogelijkheden voor club als renner. Het bied een club de kans om renners nauwkeuriger te monitoren maar ook efficiënter te motiveren aan de hand van alle functionaliteiten verwerkt binnen Velomo. De kans op een gemotiveerde renners is nevast groter.
              </p>
              <StandardButton
                text="Start onmiddelijk"
                action={() => history.push(Routes.SIGNUP)}
              />
            </div>
            <div className="d-md-none d-flex col-12">
              <div className="landing__stories--last__mockup">
                <img src={Mockup2} alt="mockup" />
              </div>
            </div>
          </div>
        </section>
      </Element>
      <Footer />
    </div>
  );
};