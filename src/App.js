// import logo from "./logo.svg";
import "./App.css";
// import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PlaceIcon from '@mui/icons-material/Place';
// import Thing from "./Thing.js";
// import Person from "./Person";
import Moment from "./Moment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import "dayjs/locale/id"; // Impor plugin lokal bahasa Indonesia
// import data from "./data.json";
import { getPrayerCalculator, methods, format } from "time-pray";
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
    const [waktu, setWaktu] = useState(dayjs());
    const [isTimeRunning, setIsTimeRunning] = useState(true);
    const [isShowDetail, setIsShowDetail] = useState(false);

    const toggleShowDetail = () => {
        setIsShowDetail((last) => !last);
    };
    useEffect(() => {
        // Update the seconds value every second
        const intervalId = setInterval(() => {
            if (isTimeRunning) {
                setWaktu(dayjs());
            }
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [isTimeRunning]); //

    const handleClickWaktu = (newWaktu) => {
        setWaktu(newWaktu);
        setIsTimeRunning(false);
    };
    const handleClickNow = () => {
        setWaktu(dayjs());
        setIsTimeRunning(true);
    };

    let data = [];

    // WaKTU SHOLAT

    const calculator = getPrayerCalculator(methods.MWL);

    const times = calculator(
        {
            longitude: 107.017,
            latitude: -6.317,
        },
        today() // or getDatePartsUTC(new Date("2022-11-12")) or [2022,11,12]
    );

    for (const time of Object.keys(times)) {
        console.log(times[time].toISOString());
    }
    const formatted = format(times, "24h", +7);

    const selectedPrayers = [
        "fajr",
        "sunrise",
        "dhuhr",
        "asr",
        "maghrib",
        "isha",
    ];
    // Filter and format the data
    const filteredPrayerTimes = {};
    let urutan = 1;
    selectedPrayers.forEach((prayer) => {
        filteredPrayerTimes[prayer] = formatted[prayer];
        const waktuSholatBaru = {
            id: urutan,
            name: prayer,
            type: "Moment",
            // when: "2023-09-28 07:24",
            when: waktu.format("YYYY-MM-DD ") + formatted[prayer],
        };
        data.push(waktuSholatBaru);

        urutan++;
    });

    const listWaktuSholat = Object.entries(filteredPrayerTimes).map(
        ([prayer, time]) => (
            <li>
                {prayer} {time} {waktu.format("HH:mm")}
            </li>
        )
    );

    let filteredData = data;

    let theThings = filteredData.map((thing) => {
        return (
            <Moment
                id={thing.id}
                data={thing}
                handleClickWaktu={handleClickWaktu}
                waktu={waktu}
                isTimeRunning={isTimeRunning}
                isShowDetail={isShowDetail}
            />
        );
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />

            <div className="App">
                <Container maxWidth="sm" disableGutters={true}>
                    {/* <CssBaseline /> */}
                    <AppBar sx={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
                        <Toolbar>
                            <IconButton
                                size="small"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                {/* <MenuIcon /> */}
                            </IconButton>
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
                                    <PlaceIcon fontSize="small"/> Kota Bekasi
                                </Typography>
                            </Stack>

                            <IconButton
                                size="small"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 0 }}
                                onClick={handleClickNow}
                            >
                                {/* <UpdateIcon /> */}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {/* </Box> */}

                    <Stack
                        // spacing={{ xs: 1, sm: 1 }}
                        padding={1}
                        paddingTop={11}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {theThings}
                        {/* <ul>{listWaktuSholat}</ul> */}
                    </Stack>
                </Container>
                {/* </Box> */}
            </div>
        </ThemeProvider>
    );
}

export default App;
