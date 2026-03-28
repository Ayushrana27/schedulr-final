import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://192.168.56.1:5000";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [slug, setSlug] = useState("");

  // 🔥 load existing event
  useEffect(() => {
    axios.get(`${API}/api/events`)
      .then(res => {
        const event = res.data.find(e => e.id === Number(id));
        if (event) {
          setTitle(event.title);
          setDuration(event.duration);
          setSlug(event.slug);
        }
      });
  }, [id]);

  // 🔥 update event
  const updateEvent = async () => {
    try {
      await axios.put(`${API}/api/events/${id}`, {
        title,
        duration: Number(duration),
        slug
      });

      alert("Event updated ✅");
      navigate("/");

    } catch (err) {
      alert("Error updating");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Edit Event</h1>

      <div className="card">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <button onClick={updateEvent}>
          Update Event
        </button>

      </div>
    </div>
  );
}

export default EditEvent;