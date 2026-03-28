import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        
        <span>Schedulr 🚀</span>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/meetings">Meetings</Link>
          <Link to="/create">Create</Link>
        </div>

      </div>
    </div>
  );
}

export default Navbar;