
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";


const StopMarker = (props) => {
  return (
    <Marker position={props.position}>
      <Popup>{props.stopName}</Popup>
    </Marker>
  );
};


function App() {

  const [data, setData] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [coordenadas, setCoordenadas] = useState([36.719091, -4.416206]);

  useEffect(() => {
    axios.get('http://localhost:5001/gastos/gasto/desc')
      .then(res => {
        setData(res.data);
        const markers = res.data.map((parada) => (
          parada.lat && parada.lon ? <StopMarker key={parada._id} position={[parada.lat, parada.lon]} stopName={parada.nombre} /> : null
        ));
        setParadas(markers);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const eliminarItem = (id) => {
    return () => {
      axios.delete('http://localhost:5001/gastos/' + id)
        .then(res => {
          console.log(res.data);
          window.location.reload();
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
      {data.map((item) => {
        return (
          <div className="card mt-4">
            <p>Pagador: {item.email}</p>
            <p>Cantidad: {item.importe}</p>
            <p>Fecha: {item.timestamp}</p>
            <p>Concepto: {item.concepto}</p>
            <p>Lat : {item.lat}</p>
            <p>Lon : {item.lon}</p>
            <p> Lugar: {item.lugar}</p>
            {item.imagenes ? <img src={item.imagenes} alt="" className="fotoPuque"/> : null}
            {item.email === localStorage.getItem('email') ? <button className="btn btn-danger" onClick={eliminarItem(item._id)}>Eliminar</button> : null}
          </div>
        )

      })}
      </div>
      <div id="map">
        <MapContainer center={coordenadas} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
          />
          {/* <Marker position={position}>
                            <Popup>{articulo.nombre}</Popup>
                        </Marker> */}
          {paradas}
        </MapContainer>

      </div>
    </div>);
}

export default App;
