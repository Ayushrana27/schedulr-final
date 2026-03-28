import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://192.168.56.1:5000";

function CreateEvent() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [slug, setSlug] = useState("");

  const createEvent = async () => {
    if (!title || !duration || !slug) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/api/events`, {
        title,
        duration: Number(duration),
        slug
      });

      alert("Event Created 🚀");
      navigate("/");

    } catch (err) {
      alert("Error creating event");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Create Event</h1>

      <div className="card">

        <input
          placeholder="Event Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Duration (minutes)"
          type="number"
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          placeholder="Slug (unique URL)"
          onChange={(e) => setSlug(e.target.value)}
        />

        <button onClick={createEvent}>
          Create Event
        </button>

      </div>
    </div>
  );
}

export default CreateEvent;