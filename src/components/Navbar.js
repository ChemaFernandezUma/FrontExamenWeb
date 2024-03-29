import React from 'react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Navbar = () => {

    const [saldo, setSaldo] = React.useState(0);

    async function handleCallbackResponse(response) {
        var userObject = jwtDecode(response.credential);
        localStorage.setItem("token", response.credential);
        localStorage.setItem("email", userObject.email);
        localStorage.setItem("name", userObject.name);
        localStorage.setItem("picture", userObject.picture);
        localStorage.setItem("cargado", true);
        localStorage.setItem("tokenId", userObject.jti);
        console.log(userObject);
        // var url = "https://back-examen-web.vercel.app/logs";
        // var respuesta = await axios.post(url, {
        //     usuario: userObject.email,
        //     timestamp: new Date().toISOString(),
        //     caducidad: new Date() + userObject.exp,
        //     token: response.credential
        // });
        window.location.href = "http://localhost:3000";
    }


    useEffect(() => {
        // Verificar si el objeto 'google' está disponible
        if (window.google && window.google.accounts && window.google.accounts.id) {
            // Inicializar Google Sign-In
            window.google.accounts.id.initialize({
                client_id: '71937643255-t87vgiaf2pignoee98j3uej1q648cp5r.apps.googleusercontent.com',
                callback: handleCallbackResponse,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('sigInDiv'),
                { theme: 'outline', size: 'large', text: 'signIn', width: '300px', height: '50px' }
            );

        } else {
            console.error("El objeto 'google' no está disponible.");
        }
    }, [handleCallbackResponse])

    useEffect(() => {
        const getSaldo = async () => {
            var url = "https://back-examen-web.vercel.app/gastos/saldo/" + localStorage.getItem("email");
            var respuesta = await axios.get(url).then(res => {
                console.log(res.data);
                setSaldo(res.data);
            }
            ).catch(err => {
                console.log(err);
            })

        }
        getSaldo();
    }, [])


    return (
        <nav className=''>
            <div className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">WebExamen3</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav col-md-12">
                            <a className="nav-link active" aria-current="page" href="/">Inicio</a>
                            <a className="nav-link active" aria-current="page" href="/crearPago">Crear pago</a>
                            {localStorage.getItem("cargado") ? <><a className='nombreInicioSesion ponerDerecha '>Bienvenido {localStorage.getItem("name")}</a>
                                <a className='nombreInicioSesion saldo'>Saldo : {saldo>0 ? <a className='saldoPos'>{saldo}</a> : <a className='saldoNeg'>{saldo}</a>}</a>
                                <button className='btn btn-danger' onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "http://localhost:3000";
                                }}>Cerrar sesion</button></>
                                : <div id="sigInDiv" className='ponerDerecha'></div>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
