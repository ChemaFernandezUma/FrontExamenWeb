import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";




function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/prueba')
      .then(res => {
        setData(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div>
      <Navbar />
      {data.map((item) => {
        return (
          <div>
            <h1>{item.nombre}</h1>
            <h1>{item.texto}</h1>
          </div>
        )

      })}
    </div>);
}

export default App;
