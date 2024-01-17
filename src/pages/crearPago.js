import React from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const CrearPago = () => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dgqruvvjr' } });

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            alert("No has iniciado sesion");
            window.location.href = "http://localhost:3000/";
        }
    }, []);

    const crearpago = async () => {
        var concepto = document.getElementById("concepto").value;
        var importe = document.getElementById("importe").value;
        var lugar = document.getElementById("lugar").value;
        var organizador = localStorage.getItem("email");
        var imagenes = document.getElementById("imagenes").files;

        

         const cloudinaryUploadPromises = Array.from(imagenes).map((imagen) => {
             const formData = new FormData();
            formData.append('imagen', imagen);

             // Devolvemos la promesa de la subida de la imagen
             return axios.post('http://localhost:5001/subir', formData)
                 .then((response) => response.data.secure_url);
            });


        

        axios.get("https://nominatim.openstreetmap.org/search?q=" + lugar + "&format=json&polygon=1&addressdetails=1").then(async (response) => {
            if (response.data.length == 0) {
                alert("No se ha encontrado la direccion")
                return;
            }
            var latitud = response.data[0].lat;
            var longitud = response.data[0].lon;

             Promise.all(cloudinaryUploadPromises)
                .then(async (imagenes) => {
                    var url = "http://localhost:5001/gastos";
                    var respuesta = await axios.post(url, {
                        concepto: concepto,
                        importe: importe,
                        lugar: lugar,
                        timestamp: Date.now(),
                        email: localStorage.getItem("email"),
                        token: localStorage.getItem("token"),
                        lat: latitud,
                        lon: longitud,
                        // imagenes: imagenes

                    });
                    alert("Evento creado");
                    window.location.href = "http://localhost:3000/";
                })
         })
    }
    return (
        <div>
            <Navbar />
            <div className="container">
                <h1 className="text-center">Crear pago</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Concepto</label>
                        <input type="text" className="form-control" id="concepto" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lugar" className="form-label">Importe</label>
                        <input type="number" className="form-control" id="importe" />
                    </div>
                    <label htmlFor="imagenes" className="form-label">
                        Imágenes
                    </label>
                    <label htmlFor="lugar" className="form-label">
                        lugar
                    </label>
                    <input type="text" className="form-control" id="lugar" />
                    <input
                        type="file"
                        className="form-control"
                        name="imagenes"
                        required
                        id="imagenes"
                    />
                    <button type="button" className="btn btn-primary" onClick={crearpago}>Crear pago</button>
                </form>
            </div>
        </div>
    );
}

export default CrearPago;