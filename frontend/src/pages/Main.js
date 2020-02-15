import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import loadingImg from '../assets/loading.png';
import api from '../services/api';
import './Main.css';

export default function Main({ match }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: { user: match.params.id },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  function updateUsersList(id) {
    setUsers(users.filter(user => user._id !== id));
    setLoading(false);
  }

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    });

    updateUsersList(id);
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    });

    updateUsersList(id);
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt="user avatar" />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : loading ? (
        <div className="loading">
          <img src={loadingImg} alt="loading" />
        </div>
      ) : (
        <div className="empty">Acabou :(</div>
      )}
    </div>
  );
}
