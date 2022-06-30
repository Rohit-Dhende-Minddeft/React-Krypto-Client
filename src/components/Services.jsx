import "./css/Services.scss";

const Services = () => {
  return (
    <div className="services-container" id="services">
      <div className="services-heading">We are improving services</div>
      <div className="services-cards-container">
        <div className="services-cards">
          <i className="fas fa-shield-alt services-icons services-icon-shield"></i>
          <div className="services-card-description">
            <div>Security Garaunteed</div>
            <div>
              Security is garaunted. We always maintain privacy and maintaining
              the quality of our products.
            </div>
          </div>
        </div>
        <div className="services-cards">
          <i className="fas fa-file-invoice-dollar services-icons services-icon-rate"></i>
          <div className="services-card-description">
            <div>Best exchange rates</div>
            <div>
              Our services for managed blockchain applications include
              blockchain wallet applications and exchange platforms for
              desktops, mobile devices, and browser applications.
            </div>
          </div>
        </div>
        <div className="services-cards">
          <i className="fas fa-coins services-icons services-icon-transaction"></i>
          <div className="services-card-description">
            <div>Fastest transactions</div>
            <div>
              We program smart contracts for blockchain networks, providing
              decentralized network and resulting in fastest transactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
