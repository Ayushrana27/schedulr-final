import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const API = "https://schedulr-ba.onrender.com";

function Booking() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🔥 Fetch slots when date or slug changes
  useEffect(() => {
    if (!slug) return;

    const formattedDate = date.toISOString().split("T")[0];

    console.log("Slug:", slug);
    console.log("Date:", formattedDate);

    axios
      .get(`${API}/api/bookings/slots/${slug}?date=${formattedDate}`)
      .then((res) => {
        console.log("Slots:", res.data);
        setSlots(res.data);
      })
      .catch((err) => {
        console.error("Error fetching slots:", err);
      });

  }, [slug, date]);

  // 🔥 Book slot
  const bookSlot = async () => {
    if (!name || !email || !selected) {
      alert("Fill all details");
      return;
    }

    try {
      await axios.post(`${API}/api/bookings`, {
        name,
        email,
        date: date.toISOString().split("T")[0],
        time: selected,
        eventTypeId: 1 // simple static for now
      });

      navigate("/success");

    } catch (err) {
      alert(err.response?.data?.message || "Booking error");
    }
  };

  return (
    <div className="container">

      <div className="booking-layout">

        {/* LEFT SIDE */}
        <div className="left">

          <h2>Select Date</h2>

          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            minDate={new Date()}
            className="date-picker"
          />

          <h3 style={{ marginTop: "20px" }}>Available Slots</h3>

          <div className="slots">
            {slots.length === 0 && (
              <p style={{ color: "gray" }}>No slots available</p>
            )}

            {slots.map((slot) => (
              <div
                key={slot}
                className={`slot ${selected === slot ? "selected" : ""}`}
                onClick={() => setSelected(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">

          {selected ? (
            <>
              <h2>Booking for {selected}</h2>

              <input
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button onClick={bookSlot}>
                Confirm Booking
              </button>
            </>
          ) : (
            <p>Select date & slot</p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Booking;