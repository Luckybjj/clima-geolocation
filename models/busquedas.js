const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    constructor() {
        // leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado () {
        // capitalizar cada palabra
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            // palabras = palabras.map( p => p[0].toUpperCase() + p.slice(1));
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')

        })
    }
    // parámetros
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'languaje': 'es',
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        }
    }
    // Primer metodo para buscar ciudad
    async ciudad(lugar = '') {
        try {
            // peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            return resp.data.features.map((lugar) => ({        // las llaves dentro del parentesís significa que se retornara un objeto de forma implicita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            // creando la instancia
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon },
            })
            const resp = await instance.get();
            // console.log(resp.data)
            const { weather, main } = resp.data
            console.log(weather)
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        } catch (error) {
            console.log(error)
        }
    }

    // metodo encargado de hacer la grabacion del historial
    agregarHistorial(lugar = '') {
        // preveinir duplicidad
        if (this.historial.includes(lugar.toLocaleLowerCase())) {       // toLocaleLowerCase() --> retorna la cadena de texto desde la que se llama convertida en minúsculas
            return;
        }
        // limitar el historial de busqueda a 10 elementos
        this.historial = this.historial.splice(0,9)
        // convertir los elementos en minusculas
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Grabar en DB
        this.guardarDB()
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        // verificar si el archivo existe     
        if (!fs.existsSync(this.dbPath)) return null;
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas;