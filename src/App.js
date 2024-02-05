import "./App.css";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import PlaceIcon from "@mui/icons-material/Place";
import Sholat from "./Sholat.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import "dayjs/locale/id"; // Impor plugin lokal bahasa Indonesia
import { getPrayerCalculator, methods, format, tune } from "time-pray";
import { today } from "./Dates.ts";
import { ThemeProvider, createTheme } from "@mui/material/styles";

dayjs.locale("id"); // Mengatur bahasa menjadi bahasa Indonesia

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    // const debugTime = "2024-01-02 0:24:50"
    // const [waktu, setWaktu] = useState(dayjs(debugTime));
    const [waktu, setWaktu] = useState(dayjs());

    useEffect(() => {
        // Update the seconds value every second
        const intervalId = setInterval(() => {
            // setWaktu(dayjs(debugTime));
            setWaktu(dayjs());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); //

    let data = [];

    // WaKTU SHOLAT

    const params = {
        imsak: { minutes: 10 },
        fajr: { degree: 19 },
        dhuhr: { minutes: 3 },
        asr: { factor: 1 },
        maghrib: { minutes: 3 },
        isha: { degree: 18 },
        midnight: "Standard",
        highLats: "NightMiddle",
    };
    const calculator = getPrayerCalculator(params);

    const times = calculator(
        {
            longitude: 107.017006,
            latitude: -6.3175761,
        },
        today()
    );

    const tunedTimes = tune(
        {
            fajr: 0,
            sunrise: 1,
            dhuhr: 0,
            asr: 3,
            maghrib: 0,
            isha: 2,
        },
        times
    );

    const formatted = format(tunedTimes, "24h", +7);

    const selectedPrayers = [
        "fajr",
        "sunrise",
        "dhuhr",
        "asr",
        "maghrib",
        "isha",
    ];

    const namaWaktu = ["subuh", "terbit", "dzuhur", "ashar", "maghrib", "isya"];

    // Filter and format the data
    const filteredPrayerTimes = {};
    let urutan = 1;
    let currentSholat = 0;

    selectedPrayers.forEach((prayer) => {
        filteredPrayerTimes[prayer] = formatted[prayer];

        let tanggalSholat = waktu;
        let nextIndex = urutan;

        // jika isya', maka next subuh besoknya
        if (urutan >= selectedPrayers.length) {
            tanggalSholat = waktu.add(1, "day");
            nextIndex = 0;
        }

        const nextPrayer = selectedPrayers[nextIndex];

        const when = waktu.format("YYYY-MM-DD ") + formatted[prayer];
        const next =
            tanggalSholat.format("YYYY-MM-DD ") + formatted[nextPrayer];

        const waktuSholat = dayjs(when);
        const waktuNextSholat = dayjs(next);
        let currentDate = waktu;

        let gapNowToSholat = dayjs.duration(currentDate.diff(waktuSholat));
        let gapNowToNextSholat = dayjs.duration(
            currentDate.diff(waktuNextSholat)
        );

        if (
            gapNowToSholat.asSeconds() >= 0 &&
            gapNowToNextSholat.asSeconds() < 0
        ) {
            currentSholat = urutan;
        }

        const waktuSholatBaru = {
            id: urutan,
            name: namaWaktu[urutan-1],
            when: when,
            next: next,
        };
        data.push(waktuSholatBaru);

        urutan++;
    });

    data.forEach((element) => {
        element.currentSholat = currentSholat;
    });

    const theThings = data.map((thing) => {
        return <Sholat key={thing.id} id={thing.id} data={thing} waktu={waktu} />;
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <Container maxWidth="sm" disableGutters={true}>
                    <CssBaseline />
                    <AppBar sx={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
                        <Toolbar>
                            <Stack sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {waktu.format("dddd, DD MMMM YYYY")}
                                </Typography>

                                <Typography
                                    component="div"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {waktu.format("HH:mm:ss")}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ flexGrow: 1 }}
                                    fontSize="small"
                                >
                                    <PlaceIcon fontSize="small" /> Kota Bekasi, Jawa Barat
                                </Typography>
                            </Stack>
                        </Toolbar>
                    </AppBar>

                    <Stack
                        padding={1}
                        paddingTop={11}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {theThings}
                    </Stack>
                </Container>
            </div>
        </ThemeProvider>
    );
}

export default App;
