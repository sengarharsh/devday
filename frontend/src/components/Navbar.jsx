const Navbar = () => {
  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3 py-2">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        <span className="navbar-brand fw-bold mb-0">DevDay</span>
        <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
          Profile
        </span>
      </div>
    </nav>
  );
};

export default Navbar;