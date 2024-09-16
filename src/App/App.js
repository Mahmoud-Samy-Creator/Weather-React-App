import React, { useEffect } from "react";
import './App.scss';
import axios from "axios";
import moment from 'moment';
import { createTheme, ThemeProvider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import "moment/min/locales";

const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=24.774265&lon=46.738586&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"]
  }
});

const englishLang = {
  dir: "ltr",
  btnContent: "عربي",
  locale: "ar"
};

const arabicLang = {
  dir: "rtl",
  btnContent: "English",
  locale: "en"
};

// Utility function to convert Kelvin to Celsius
const toCelsius = (kelvin) => Math.round(kelvin - 273.15);

export default function App() {
  const [lang, setLang] = React.useState(englishLang);
  const [data, setData] = React.useState({});
  const [dateAndTime, setDateAndTime] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { t, i18n } = useTranslation();

  function langToggle() {
    if (lang === englishLang) {
      setLang(arabicLang);
    } else {
      setLang(englishLang);
    }
    i18n.changeLanguage(lang.locale);
    moment.locale(lang.locale);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiURL);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
    moment.locale("en");
  }, [lang]);

  // Destructuring data to improve readability
  const { main, weather, name } = data;
  const temperatureInCelsius = main ? toCelsius(main.temp) : "N/A";
  const minTemperature = main ? toCelsius(main.temp_min) : "N/A";
  const maxTemperature = main ? toCelsius(main.temp_max) : "N/A";
  const weatherDescription = weather && weather.length > 0 ? weather[0].description : "N/A";
  const weatherIcon = weather && weather.length > 0 ? `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png` : null;

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" className="container" dir={lang.dir} sx={{ height: "100vh", alignContent: "center" }}>
          <div className="card">
            {/* Loading State */}
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                {/* City & Time */}
                <div className="city-time">
                  <Typography className="city" variant="h2" component="h2">
                    {t(name) || "Loading..."}
                  </Typography>
                  <Typography className="time" variant="h5" component="h5">
                    {dateAndTime}
                  </Typography>
                </div>
                <hr />
                {/* Degree & Description */}
                <div className="degree-description" dir={lang.dir}>
                  <div className="degree">
                    <div className="degree-details">
                      <div>{temperatureInCelsius}°C</div>
                      <div>
                        {weatherIcon && <img src={weatherIcon} alt={`Weather icon representing ${weatherDescription}`} />}
                      </div>
                    </div>
                    <div>{t(weatherDescription)}</div>
                    <div>{`${t("Min")}: ${minTemperature}°C   |   ${t("Max")}: ${maxTemperature}°C`}</div>
                  </div>
                  <div className="description-icon">
                    <FontAwesomeIcon icon={faCloud} />
                  </div>
                </div>
              </>
            )}
            {/* Language Toggle Button */}
            <Button variant="contained" onClick={langToggle}>
              {lang.btnContent}
            </Button>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}
