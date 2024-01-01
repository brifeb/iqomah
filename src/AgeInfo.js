import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import CakeIcon from "@mui/icons-material/Cake";

dayjs.extend(duration);

export default function AgeInfo({
    birth,
    showAge,
    showCountdown,
    showProgress,
    waktu,
    isTimeRunning,
    isShowDetail,
}) {
    const birthdate = dayjs(birth); // Replace '1984-06-15' with your actual birthdate in YYYY-MM-DD format
    const currentDate = waktu;
    let nextBirthday = birthdate.set("year", currentDate.year());

    // Check if the birthday has already occurred this year
    if (nextBirthday.isBefore(currentDate)) {
        nextBirthday = nextBirthday.add(1, "year"); // If it has, set it to next year
    }

    // Calculate the duration until the next birthday
    const daysDurationUntilNextBirthday = nextBirthday.diff(currentDate, "day");

    const lastBirthday = nextBirthday.subtract(1, "year"); // If it has, set it to next year

    const daysBetweenBirthday = nextBirthday.diff(lastBirthday, "day");

    const progress =
        ((daysBetweenBirthday - daysDurationUntilNextBirthday) /
            daysBetweenBirthday) *
        100;

    const durationUntilNextBirthday = dayjs.duration(
        nextBirthday.diff(currentDate)
    );

    const ageDuration = dayjs.duration(currentDate.diff(birthdate));

    const cetakDurasi = (durasi) => {
        const years = durasi.years();
        const yearsS = years > 0 ? years + " tahun " : "";
        const months = durasi.months();
        const monthsS = months > 0 ? months + " bulan " : "";
        const days = durasi.days();
        const daysS = days > 0 ? days + " hari " : "";
        let out = yearsS + monthsS + daysS;

        if (years + months + days == 0) out = "was born";

        return out;
    };

    return (
        <>
            {showAge && (
                <>
                    {isShowDetail && isTimeRunning && (
                        <Typography fontSize="small">
                            {birthdate.format("dddd, DD MMMM YYYY")}
                        </Typography>
                    )}

                    <Typography variant="h6" sx={{ mb: 1.5 }} color="white">
                        {cetakDurasi(ageDuration)}
                    </Typography>
                </>
            )}
            {showCountdown && isTimeRunning && (
                <Typography>
                    Birthday {cetakDurasi(durationUntilNextBirthday)} lagi
                </Typography>
            )}
            {showProgress && isTimeRunning && (
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
                    <Box sx={{ minWidth: 20, textAlign: 'left' }}>
                        <CakeIcon fontSize="5px" />
                    </Box>
                </Box>
            )}
        </>
    );
}
