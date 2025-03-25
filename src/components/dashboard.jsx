import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(res.data);
      } catch {
        alert("User not logged in");
        navigate("/");
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {cards.map((card) => (
        <div key={card.id} onClick={() => navigate(`/map/${card.id}`)}>
          <h3>{card.title}</h3>
        </div>
      ))}
    </div>
  );
}
