import * as React from "react";
// import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default function Sholat({ data, waktu }) {
    const waktuSholat = dayjs(data.when);
    const waktuNextSholat = dayjs(data.next);
    let gapNowToSholat = dayjs.duration(waktu.diff(waktuSholat));
    let gapNowToNextSholat = dayjs.duration(waktu.diff(waktuNextSholat));
    let gapSholatToNextSholat = dayjs.duration(
        waktuNextSholat.diff(waktuSholat)
    );

    const cetakSisa = () => {
        const hour = gapNowToNextSholat.hours();
        const minutes = gapNowToNextSholat.minutes();
        const seconds = gapNowToNextSholat.seconds();

        const toplus = (angka) => {
            return angka * -1;
        };

        const hourS = hour !== 0 ? toplus(hour) + "h " : "";
        const minutesS = minutes !== 0 ? toplus(minutes) + "m " : "";
        const secondsS = seconds !== 0 ? toplus(seconds) + "s" : "";

        if (data.currentSholat === data.id) {
            return "- " + hourS + minutesS + secondsS;
        }
    }

    const cetakBefore = () => {
        if (
            gapNowToSholat.hours() < 0 ||
            gapNowToSholat.minutes() < 0 ||
            gapNowToSholat.seconds() < 0
        ) {
            const hour = gapNowToSholat.hours();
            const minutes = gapNowToSholat.minutes();
            const seconds = gapNowToSholat.seconds();

            const toplus = (angka) => {
                return angka * -1;
            };

            const hourS = hour !== 0 ? toplus(hour) + "h " : "";
            const minutesS = minutes !== 0 ? toplus(minutes) + "m " : "";
            const secondsS = seconds !== 0 ? toplus(seconds) + "s" : "";

            if (data.currentSholat + 1 === data.id) {
                return "- " + hourS + minutesS + secondsS;
            }
        }
    };

    const cetakAfter = () => {
        if (
            gapNowToSholat.hours() > 0 ||
            gapNowToSholat.minutes() > 0 ||
            gapNowToSholat.seconds() > 0
        ) {
            const hour = gapNowToSholat.hours();
            const minutes = gapNowToSholat.minutes();
            const seconds = gapNowToSholat.seconds();

            const hourS = hour !== 0 ? hour + "h " : "";
            const minutesS = minutes !== 0 ? minutes + "m " : "";
            const secondsS = seconds !== 0 ? seconds + "s" : "";

            if (data.currentSholat === data.id) {
                return "+ " + hourS + minutesS + secondsS;
            }
        }
    };

    const cetakIqomah = () => {
        if (data.currentSholat === data.id && data.name !== "terbit") {
            const lamaIqomah = 20;
            const waktuIqomah = waktuSholat.add(lamaIqomah, "minute");
            let gapNowToIqomah = dayjs.duration(waktuIqomah.diff(waktu));

            if (
                gapNowToIqomah.minutes() >= 0 &&
                gapNowToIqomah.seconds() >= 0
            ) {
                let min = gapNowToIqomah.minutes();
                min = min <= 9 ? "0" + min : min;
                let sec = gapNowToIqomah.seconds();
                sec = sec <= 9 ? "0" + sec : sec;

                return "Iqomah - " + min + ":" + sec;
            }
        }
    };

    let progress = parseInt((gapNowToSholat / gapSholatToNextSholat) * 100);
    progress = progress > 100 ? 100 : progress;
    progress = progress < 0 ? 0 : progress;

    let progressTxt = (100 - progress) + "%";
    progressTxt = progress === 0 || progress === 100 ? "" : progressTxt;

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return (
        <Box
            sx={{
                minWidth: 275,
                background:
                    "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(3,27,2,1) " +
                    progress +
                    "%, rgba(7,74,2,1) " +
                    progress +
                    "%)",
                padding: 0,
                margin: "3px",
                borderRadius: "3px",
            }}
        >
            <Box
                sx={{
                    backgroundColor:
                        data.currentSholat === data.id
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(0,0,0,0.5)",
                    color: "#ccc",
                    display: "flow-root",
                }}
                paddingTop={1}
                paddingBottom={1}
            >
                <Grid container>
                    <Grid item xs={4}>
                        <Typography color="lightgreen">{cetakAfter()}</Typography>
                        <Typography>{cetakIqomah()}</Typography>
                        <Typography>{cetakBefore()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>{toTitleCase(data.name)}</Typography>
                        <Typography variant="h6">
                            {waktuSholat.format("HH:mm")}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Typography color="pink">{cetakSisa()}</Typography> */}
                        <Typography color="green">{progressTxt}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
