import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://schedulr-ba.onrender.com";

function Meetings() {
  const [meetings, setMeetings] = useState([]);

  // fetch meetings
  const fetchMeetings = () => {
    axios.get(`${API}/api/bookings`)
      .then(res => setMeetings(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // cancel meeting
  const cancelMeeting = async (id) => {
    try {
      await axios.delete(`${API}/api/bookings/${id}`);
      alert("Meeting cancelled ❌");

      fetchMeetings(); // refresh UI

    } catch (err) {
      alert("Error cancelling meeting");
    }
  };

  const now = new Date();

  const upcoming = meetings.filter(m => new Date(m.date) >= now);
  const past = meetings.filter(m => new Date(m.date) < now);

  return (
    <div className="container">
      <h1 className="title">Your Meetings</h1>

      {/* UPCOMING */}
      <h2>Upcoming</h2>

      {upcoming.length === 0 && <p>No upcoming meetings</p>}

      {upcoming.map(m => (
        <div className="card" key={m.id}>
          <h3>{m.name}</h3>
          <p>{m.date} at {m.startTime}</p>

          <button
            style={{ background: "red", marginTop: "10px" }}
            onClick={() => cancelMeeting(m.id)}
          >
            Cancel
          </button>
        </div>
      ))}

      {/* PAST */}
      <h2 style={{ marginTop: "30px" }}>Past</h2>

      {past.length === 0 && <p>No past meetings</p>}

      {past.map(m => (
        <div className="card" key={m.id}>
          <h3>{m.name}</h3>
          <p>{m.date} at {m.startTime}</p>
        </div>
      ))}
    </div>
  );
}

export default Meetings;