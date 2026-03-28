function Success() {
  return (
    <div className="container">
      <div className="success-box">

        <h1 style={{ color: "#16a34a" }}>🎉 Booked Successfully</h1>

        <p className="subtitle">
          Your meeting is confirmed. Check your email.
        </p>

        <a href="/">
          <button style={{ marginTop: "20px" }}>
            Go Home
          </button>
        </a>

      </div>
    </div>
  );
}

export default Success;