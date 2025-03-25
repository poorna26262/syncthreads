import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [mapData, setMapData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMap() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/map", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMapData(data);
      } catch {
        alert("User not logged in");
        navigate("/");
      }
    }
    fetchMap();
  }, []);

  if (!mapData) return <div>Loading Map...</div>;

  return (
    <MapContainer center={mapData.center} zoom={mapData.zoom} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}
