const menuItems = [
  {
    name: "Dashboard",
    key: "dashboard"
  },
  {
    name: "Tasks",
    key: "tasks"
  },
  {
    name: "DSA",
    key: "dsa"
  },
  {
    name: "Activity",
    key: "activity"
  },
  {
    name: "Brain Dump",
    key: "brain-dump"
  }
];

const Sidebar = ({ activePage = "dashboard", onSelectPage }) => {
  return (
    <div className="list-group list-group-flush">
      {menuItems.map((item) => (
        <div
          key={item.key}
          className={`list-group-item list-group-item-action border-0 rounded mb-1 py-2 px-3 fw-medium 
            ${item.key === activePage ? "active" : ""}`
          }
          role="button"
          onClick={() => onSelectPage && onSelectPage(item.key)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;