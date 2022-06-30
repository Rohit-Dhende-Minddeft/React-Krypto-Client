import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <div className="navbar-welcome-services-container">
        <div className="landing-page">
          <Navbar />
          <Welcome />
        </div>
        <Services />
      </div>
      <Transactions />
      <Footer />
    </div>
  );
};

export default App;
