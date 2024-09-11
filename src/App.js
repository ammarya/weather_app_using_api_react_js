import logo from './logo.svg';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// React
import { useEffect, useState } from 'react';

// MUI Component
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';


// External Libraries
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from 'react-i18next';

moment.locale("de");



const theme = createTheme({
  typography: {
    fontFamily: ["GermaniaOne"],
  }
})

let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();

  // ========== Stats ========== //
  const [dateAndTime, setDateAndTime] = useState("")
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    humidity: null,
    min: null,
    max: null,
    icon: null
  })

  const [local, setLocal] = useState("de")


  // ========== Event Handlers ========== //
  function handleLanguageClick() {
    if (local == "en") {
      setLocal("de");
      i18n.changeLanguage("de");
      moment.locale("de");
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("Do MMMM YYYY, hh:mm"));

  }


  useEffect(() => {
    i18n.changeLanguage("de");

  }, []);

  useEffect(() => {
    setDateAndTime(moment().format("Do MMMM YYYY, hh:mm"));
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=47.36864980&lon=8.53918250&appid=87aaeb395d19cf1cde396a8eebe60da6", {
      cancelToken: new axios.CancelToken((c) => {
        cancelAxios = c;
      }),
    })
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15)

        const description = response.data.weather[0].description;

        const humidity = response.data.main.humidity;

        const min = Math.round(response.data.main.temp_min - 272.15);

        const max = Math.round(response.data.main.temp_max - 272.15);

        const responseIcon = response.data.weather[0].icon;


        setTemp({
          number: responseTemp,
          description: description,
          humidity: humidity,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`
        });

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => {
      cancelAxios();
    }
  }, []);

  return (
    <div className="App">

      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Content Container */}
          <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
            {/* Card */}
            <div style={{
              width: "100%",
              background: "rgb(28 52 91 / 36%)",
              color: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "5px 5px 15px 5px rgba(0,0,0,0.5)"
            }}>
              {/* Content */}
              <div>
                {/* City & Time */}
                <div style={{
                  display: "flex",
                  alignItems: "end"
                }}>
                  <Typography variant="h1" style={{
                    marginRight: "20px",
                  }}>
                    {t("Zürich")}
                  </Typography>
                  <Typography variant="h5" style={{
                    marginRight: "20px"
                  }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/*==== City & Time ====*/}
                <hr />
                {/* Container Of Degree + Cloud Icon */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-around"
                }}>
                  {/* Degree & Description */}
                  <div>
                    {/* Temp */}
                    <div style={{
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Typography variant="h1" >
                        {temp.number}&deg;
                      </Typography>
                      {/* Temp Image */}
                      <img alt='' src={temp.icon} />
                      {/*==== Temp Image ====*/}
                    </div>
                    <Typography variant="h6" >
                      {t(temp.description)}
                    </Typography>
                    {/* Min & Max & Humidity */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <Typography>{t("Der Tiefwert")}:{temp.min}</Typography>
                      <hr style={{ height: "25px", margin: "0px 5px" }} />
                      <Typography>{t("Der Höchstwert")}:{temp.max}</Typography>
                      <hr style={{ height: "25px", margin: "0px 5px" }} />
                      <Typography>{t("Die Luftfeuchtigkeit")}:{temp.humidity}%</Typography>
                      {/*==== Min & Max & Humidity ====*/}
                    </div>
                    {/*==== Temp ====*/}
                  </div>
                  {/*==== Degree & Description ====*/}
                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/*==== Container Of Degree + Cloud Icon ====*/}
              </div>
              {/*==== Content ====*/}
            </div>
            {/*==== Card ====*/}

            {/* Translation Container */}
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              marginTop: "20px"
            }}>
              <Button variant="text" style={{ color: "white" }} onClick={handleLanguageClick}>{local == "en" ? "English" : "Deutsch"}</Button>
            </div>
            {/*==== Translation Container ====*/}
          </div>
          {/*==== Content Container ====*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
