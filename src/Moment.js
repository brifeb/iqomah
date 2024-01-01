import * as React from "react";
import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import AgeInfo from "./AgeInfo";

dayjs.extend(duration);

export default function Moment({
    data,
    handleClickWaktu,
    waktu,
    isTimeRunning,
    isShowDetail,
}) {
    const waktuSholat = dayjs(data.when); // Replace '1984-06-15' with your actual birthdate in YYYY-MM-DD format
    let currentDate = waktu;
    // currentDate = dayjs("2024-01-01 11:55:00");
    let gapSholat = dayjs.duration(currentDate.diff(waktuSholat));

    const [seconds, setSeconds] = useState(gapSholat.seconds());

    const cetakBefore = () => {
        if (
            gapSholat.hours() < 0 ||
            gapSholat.minutes() < 0 ||
            gapSholat.seconds() < 0
        ) {
            const hour = gapSholat.hours();
            const minutes = gapSholat.minutes();
            const seconds = gapSholat.seconds();

            const toplus = (angka) => {
                return angka * -1;
            };

            const hourS = hour !== 0 ? toplus(hour) + "h " : "";
            const minutesS = minutes !== 0 ? toplus(minutes) + "m " : "";
            const secondsS = seconds !== 0 ? toplus(seconds) + "s" : "";

            return "- " + hourS + minutesS + secondsS;
        }
    };

    const cetakAfter = () => {
        if (
            gapSholat.hours() > 0 ||
            gapSholat.minutes() > 0 ||
            gapSholat.seconds() > 0
        ) {
            const hour = gapSholat.hours();
            const minutes = gapSholat.minutes();
            const seconds = gapSholat.seconds();

            const hourS = hour !== 0 ? hour + "h " : "";
            const minutesS = minutes !== 0 ? minutes + "m " : "";
            const secondsS = seconds !== 0 ? seconds + "s" : "";

            return "+ " + hourS + minutesS + secondsS;
        }
    };

    const cetakDurasi = () => {
        return (
            gapSholat.hours() +
            ":" +
            gapSholat.minutes() +
            ":" +
            gapSholat.seconds()
        );
    };

    const progress = 50;

    useEffect(() => {
        // Update the seconds value every second
        const intervalId = setInterval(() => {
            if (isTimeRunning) {
                currentDate = dayjs();
                gapSholat = dayjs.duration(currentDate.diff(waktuSholat));
                setSeconds(gapSholat.seconds());
            }
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [isTimeRunning]); //

    function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }

    return (
        <Box
            sx={{
                minWidth: 275,
                background: data.img
                    ? `url("/img/${data.img}")`
                    : "linear-gradient(to bottom, #331100 , #006600)",
                backgroundSize: "100%",
                padding: 0,
            }}
        >
            <Box
                sx={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    // backgroundColor: "red",
                    color: "#ccc",
                    // borderRadius: "5px",
                    display: "flow-root",
                }}
                paddingTop={1}
                paddingBottom={1}
            >
                <Grid container zeroMinWidth="true">
                    <Grid item xs={4}>
                        <Typography>{cetakBefore()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>{toTitleCase(data.name)}</Typography>
                        <Typography variant="h6">
                            {waktuSholat.format("hh:mm")}
                        </Typography>
                        {/* <Typography fontSize="small">
                            {currentDate.format("dddd, DD MMMM YYYY hh:mm:ss")}
                            <br />({cetakDurasi()})
                        </Typography> */}
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>{cetakAfter()}</Typography>
                    </Grid>
                </Grid>
                {/* 
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ minWidth: 20 }}></Box>
                    <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            color="inherit"
                            value={progress}
                            sx={{ height: 5, borderRadius: 5 }}
                        />
                    </Box>
                    <Box
                        sx={{ minWidth: 20, textAlign: "left", marginRight: 1 }}
                    >

                        <Typography fontSize="small">{progress}%</Typography>
                    </Box>
                </Box>
                 */}
            </Box>
        </Box>
    );
}
