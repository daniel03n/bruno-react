// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';

const CardList = ({ cards, loadMore }) => (
  <div>
    <ul>
      {cards.map((card) => (
        <li key={card.id}>
          <Link to={`/cards/${card.id}`}>{card.name}</Link>
          <img src={card.imageUrl} alt={card.name} />
        </li>
      ))}
    </ul>
    <button onClick={loadMore}>Carregar mais!</button>
  </div>
);

const AllCards = ({ cards, loadMore }) => (
  <div>
    <h2>All Cards</h2>
    <CardList cards={cards} loadMore={loadMore} />
  </div>
);

  const CardDetails = ({ cards }) => {
  const { id } = useParams();

  if (!id) {
    
    return <p>Nenhuma carta selecionada.</p>;
  }

  const selectedCard = cards.find((card) => String(card.id) === id);

  if (!selectedCard) {
    
    return <p>Carta não encontrada</p>;
  }

  console.log('Selected card:', selectedCard);

  return (
    <div>
       <img src={selectedCard.imageUrl} alt="" />
      <p>Nome:<br/> {selectedCard.name}</p>
      <p>Texto da Carta: <br/> {selectedCard.text}</p>
      <p>Custo de mana convertido: <br/> {selectedCard.manaCost}</p>
      <p>Cor da carta: <br/> {selectedCard.colors && selectedCard.colors.join(', ')}</p>
      <p>Edição (Set): <br/> {selectedCard.set}</p>
      <button><Link to="/">Voltar </Link></button>
    </div>

    
  );
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.magicthegathering.io/v1/cards?page=${page}`);
        setCards([...cards, ...response.data.cards]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page]);

  const loadMore = () => {
    setPage(page + 1);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div>
        <h1>Magic: The Gathering Cards</h1>
        <Routes>
          <Route path="/" element={<CardList cards={cards} loadMore={loadMore} />} />
          <Route path="/cards" element={<AllCards cards={cards} loadMore={loadMore} />} />
          <Route path="/cards/:id" element={<CardDetails cards={cards} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
