import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import DSA from "../pages/DSA";
import Activity from "../pages/Activity";
import BrainDump from "../pages/BrainDump";

const Layout = () => {
  const [activePage, setActivePage] = useState("dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "tasks":
        return <Tasks />;
      case "dsa":
        return <DSA />;
      case "activity":
        return <Activity />;
      case "brain-dump":
        return <BrainDump />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  }
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container-fluid flex-grow-1 d-flex p-0">
        <div className="row g-0 flex-grow-1">
          <aside className="col-md-3 col-lg-2 bg-white border-end p-3">
            <Sidebar activePage={activePage} onSelectPage={setActivePage} />
          </aside>
          <main className="col-md-9 col-lg-10 p-4">
            {renderPage()}
          </main> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
