import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/dashboard/Dashboard";
import Tasks from "../pages/tasks/Tasks";
import DSA from "../pages/dsa/DSA";
import Activity from "../pages/activity/Activity";
import BrainDump from "../pages/braindump/BrainDump";

const Layout = () => {
  const [activePage, setActivePage] = useState("dashboard");

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
  };
  
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <Navbar />
      <div className="container-fluid flex-grow-1 overflow-hidden p-0">
        <div className="row g-0 h-100">
          <aside
            className="col-md-3 col-lg-2 bg-white border-end p-3 h-100"
            style={{ overflowY: "auto" }}
          >
            <Sidebar activePage={activePage} onSelectPage={setActivePage} />
          </aside>
          <main
            className="col-md-9 col-lg-10 p-3 p-md-4 h-100 page-bg-gradient d-flex flex-column"
            style={{ overflowY: "auto" }}
          >
            {renderPage()}
          </main> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
