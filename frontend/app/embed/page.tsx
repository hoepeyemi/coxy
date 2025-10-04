export const metadata = {
  title: "Coxy Domain Intelligence - Embedded",
  description: "Real-time Web3 domain analytics and market trends",
};

export default function EmbedPage() {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src="https://coxy.onrender.com"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        allow="fullscreen"
        title="Coxy Domain Intelligence Platform"
      ></iframe>
    </div>
  );
}
