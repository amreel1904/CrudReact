import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [pakaian, setPakaian] = useState([]);
  const [newPakaian, setNewPakaian] = useState({
    nama: '',
    desc: '',
    main_color: '',
    sub_color: '',
    jenis: '',
    brand: '',
    occasion: '',
    wear_frequency: 1,
    status: 1
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    axios.get('http://localhost:8080/api/pakaian')
      .then(response => {
        console.log(response.data); // Log the full response here
        setPakaian(response.data.pakaian);  // Set data to state
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch data.');
        setLoading(false);
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/pakaian', newPakaian) // Make sure the API URL is correct
      .then(response => {
        setPakaian([...pakaian, response.data]);
        setNewPakaian({
          nama: '',
          desc: '',
          main_color: '',
          sub_color: '',
          jenis: '',
          brand: '',
          occasion: '',
          wear_frequency: 1,
          status: 1
        });
      })
      .catch(err => {
        console.log(err);
        setError('Failed to add new item.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Senarai Pakaian</h1>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display fetched pakaian data in a table */}
      {!loading && !error && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Bil</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Warna Utama</th>
              <th>Warna Sekunder</th>
              <th>Jenis</th>
              <th>Brand</th>
              <th>Occasion</th>
              <th>Wear Frequency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pakaian.map((item, index) => (
              <tr key={index}>
                <td>{item.bilangan}</td> {/* Ensure 'bilangan' is showing here */}
                <td>{item.nama}</td>
                <td>{item.desc}</td>
                <td>{item.main_color}</td>
                <td>{item.sub_color}</td>
                <td>{item.jenis}</td>
                <td>{item.brand}</td>
                <td>{item.occasion}</td>
                <td>{item.wear_frequency}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-4">Tambah Pakaian Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nama"
            value={newPakaian.nama}
            onChange={(e) => setNewPakaian({ ...newPakaian, nama: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Deskripsi"
            value={newPakaian.desc}
            onChange={(e) => setNewPakaian({ ...newPakaian, desc: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Warna Utama"
            value={newPakaian.main_color}
            onChange={(e) => setNewPakaian({ ...newPakaian, main_color: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Warna Sekunder"
            value={newPakaian.sub_color}
            onChange={(e) => setNewPakaian({ ...newPakaian, sub_color: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Jenis"
            value={newPakaian.jenis}
            onChange={(e) => setNewPakaian({ ...newPakaian, jenis: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Brand"
            value={newPakaian.brand}
            onChange={(e) => setNewPakaian({ ...newPakaian, brand: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Occasion"
            value={newPakaian.occasion}
            onChange={(e) => setNewPakaian({ ...newPakaian, occasion: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" type="submit">Tambah</button>
      </form>
    </div>
  );
}

export default App;