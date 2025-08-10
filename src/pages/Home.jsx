function Home() {
  return (
    <div className="page">
      <h2>Welcome to Desert Radio</h2>
      <p>Weekly episodes and archives from the dunes of sound.</p>

          {/* YouTube embed */}
      <div style={{ marginTop: "20px" }}>
        <h3>Check out the latest Episode</h3>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/EYAm0gL0Tkw?start=0"
          title="Desert Radio Episode"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <button className="cta">Enter the Dunes</button>
    </div>
  );
}

export default Home;
