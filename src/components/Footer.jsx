import React, { useState } from "react";
import "./css/Footer.scss";
import ReactTooltip from "react-tooltip";

const Footer = () => {
  const [tooltip, showTooltip] = useState(false);

  const handleOnMouseEnter = () => {
    showTooltip(true);
  };
  const handleOnMouseLeave = () => {
    showTooltip(false);
    setTimeout(() => showTooltip(true), 50);
  };

  const handleClick = (link) => {
    let accounts = {
      youtube: "https://www.youtube.com/channel/UCWlv387s3h7ThjgViStKqbA",
      instagram: "https://www.instagram.com/_n.o_o.b_/",
      linkedin: "https://www.linkedin.com/in/rohit-dhende-044835150",
      github: "https://github.com/Rohitdhende",
      behance: "https://www.behance.net/jonsleve",
      portfolio: "https://rohitdhende.github.io/portfolio",
      airlinesTable: "https://airlines-user-table.netlify.app",
      userCrud: "https://react-crud-user.netlify.app",
      weatherForecast: "https://rohitdhende.github.io/Weather-Forecast",
    };

    if (link === "youtube") {
      window.open(accounts.youtube, "_blank");
    }
    if (link === "instagram") {
      window.open(accounts.instagram, "_blank");
    }
    if (link === "linkedin") {
      window.open(accounts.linkedin, "_blank");
    }
    if (link === "github") {
      window.open(accounts.github, "_blank");
    }
    if (link === "behance") {
      window.open(accounts.behance, "_blank");
    }
    if (link === "portfolio") {
      window.open(accounts.portfolio, "_blank");
    }
    if (link === "airlinesTable") {
      window.open(accounts.airlinesTable, "_blank");
    }
    if (link === "userCrud") {
      window.open(accounts.userCrud, "_blank");
    }
    if (link === "weatherForecast") {
      window.open(accounts.weatherForecast, "_blank");
    }
  };
  return (
    <div className="footer-container">
      <footer className="footer-top">
        {tooltip && <ReactTooltip effect="solid" />}
        <div className="footer-connections-container">
          <div className="left-side">
            <div className="footer-connections">
              <i
                className="fab fa-youtube"
                data-tip="Youtube"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("youtube");
                }}
              ></i>
              <i
                className="fab fa-instagram"
                data-tip="Instagram"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("instagram");
                }}
              ></i>
              <i
                className="fab fa-linkedin"
                data-tip="LinkedIn"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("linkedin");
                }}
              ></i>
              <i
                className="fab fa-github"
                data-tip="GitHub"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("github");
                }}
              ></i>
              <i
                className="fab fa-behance-square"
                data-tip="Behance"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("behance");
                }}
              ></i>
            </div>
            <div className="connection-label">Connect with me</div>
          </div>
          <div className="footer-division"></div>
          <div className="right-side">
            <div className="footer-connections">
              <i
                className="fas fa-user-secret"
                data-tip="Portfolio"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("portfolio");
                }}
              ></i>
              <i
                className="fas fa-cloud"
                data-tip="Weather ForeCast"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("weatherForecast");
                }}
              ></i>
              <i
                className="fas fa-plane-departure"
                data-tip="Airlines Table"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("airlinesTable");
                }}
              ></i>
              <i
                className="fas fa-user-plus"
                data-tip="User CRUD"
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={() => {
                  handleClick("userCrud");
                }}
              ></i>
            </div>
            <div className="connection-label">Projects</div>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        Website made with &hearts; by
        <div
          data-tip="JonSleve"
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          Rohit <span>Dhende</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
