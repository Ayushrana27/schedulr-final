import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://schedulr-ba.onrender.com";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  fetch(`${API}/api/events`)
    .then(res => res.json())
    .then(data => setEvents(data))
    .catch(err => console.error(err));
}, []);
  return (
    <div className="container">

      {/* 🔥 HERO SECTION */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 className="title">Effortless Scheduling</h1>
        <p className="subtitle">
          Book meetings in seconds. No back-and-forth emails.
        </p>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 && (
        <p style={{ color: "gray", textAlign: "center" }}>
          No events available
        </p>
      )}

      {/* EVENTS */}
      {events
        .filter((e) => e.title)
        .map((e) => (
          <div className="card" key={e.id}>

            <h2 style={{ marginBottom: "6px" }}>
              📅 {e.title}
            </h2>

            <p style={{ marginBottom: "15px" }}>
              ⏱ {e.duration} minutes
            </p>

            <div style={{ display: "flex", gap: "10px" }}>

              <a href={`/book/${e.slug}`}>
                <button>Schedule →</button>
              </a>

              <a href={`/edit/${e.id}`}>
                <button style={{ background: "#6b7280" }}>
                  Edit
                </button>
              </a>

            </div>

          </div>
        ))}
    </div>
  );
}

export default Home;