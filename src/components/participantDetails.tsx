import { FC, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { ParticipantStats } from "../types";
import { useData } from "./dataContext";
import { CommonTableContainer } from "./styledComponents";

interface ParticipantDetailsProps {
  participant: ParticipantStats;
}

type SortField = "year" | "track" | "distance" | "altitude" | "time" | "pace" | "rank";
type SortOrder = "asc" | "desc";

export const ParticipantDetails: FC<ParticipantDetailsProps> = ({ participant }) => {
  const theme = useTheme();
  const { yearData } = useData();
  const [sortField, setSortField] = useState<SortField>("year");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRaces = useMemo(() => {
    return [...participant.races].sort((a, b) => {
      switch (sortField) {
        case "year":
          return sortOrder === "asc" ? a.year - b.year : b.year - a.year;
        case "track":
          return sortOrder === "asc" ? a.track - b.track : b.track - a.track;
        case "distance":
          return sortOrder === "asc" ? a.distance - b.distance : b.distance - a.distance;
        case "altitude":
          return sortOrder === "asc" ? (a.altitude ?? 0) - (b.altitude ?? 0) : (b.altitude ?? 0) - (a.altitude ?? 0);
        case "time":
          return sortOrder === "asc" ? a.time - b.time : b.time - a.time;
        case "pace":
          return sortOrder === "asc" ? (a.pace ?? 0) - (b.pace ?? 0) : (b.pace ?? 0) - (a.pace ?? 0);
        case "rank":
          return sortOrder === "asc"
            ? (a.rank ?? Infinity) - (b.rank ?? Infinity)
            : (b.rank ?? Infinity) - (a.rank ?? Infinity);
        default:
          return 0;
      }
    });
  }, [sortField, sortOrder, participant.races]);

  const trackProgressions = useMemo(() => {
    // Group races by track
    const trackGroups = participant.races.reduce(
      (acc, race) => {
        if (!race.isDisqualified) {
          const track = race.track;
          if (!acc[track]) {
            acc[track] = [];
          }
          acc[track].push(race);
        }
        return acc;
      },
      {} as Record<number, typeof participant.races>,
    );

    // Filter tracks with multiple runs and sort by year
    return Object.entries(trackGroups)
      .filter(([_, races]) => races.length > 1)
      .map(([track, races]) => {
        const sortedRaces = races.sort((a, b) => a.year - b.year);
        const times = sortedRaces.map(r => r.time).filter((t): t is number => t !== 0);
        const paces = sortedRaces.map(r => r.pace).filter((p): p is number => p !== undefined);

        // Calculate time range with padding
        const timeMin = Math.min(...times);
        const timeMax = Math.max(...times);
        const timeRange = timeMax - timeMin;
        const padding = timeRange * 0.1; // 10% padding

        // Calculate appropriate interval based on the time range
        const interval = Math.ceil(timeRange / 5); // Aim for about 5 intervals
        const min = Math.floor((timeMin - padding) / interval) * interval;
        const max = Math.ceil((timeMax + padding) / interval) * interval;

        const minPace = Math.floor(Math.min(...paces) * 2) / 2; // Round down to nearest 0.5
        const maxPace = Math.ceil(Math.max(...paces) * 2) / 2; // Round up to nearest 0.5

        return {
          track: Number(track),
          data: sortedRaces.map(race => {
            const yearDataItem = yearData.find(data => data.year === race.year);
            return {
              year: race.year,
              time: race.time,
              rank: race.rank,
              participants: yearDataItem?.participants,
              pace: race.pace,
            };
          }),
          timeRange: { min, max },
          paceRange: { min: minPace, max: maxPace },
        };
      })
      .sort((a, b) => a.track - b.track);
  }, [participant, yearData]);

  const formatAxisTime = (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatAxisPace = (value: number) => {
    return value.toFixed(2);
  };

  const formatPace = (pace: number | undefined): string => {
    if (pace === undefined) return "-";
    return `${pace.toFixed(2)} min/km`;
  };

  const renderTooltip = (props: TooltipProps<number, string>) => {
    if (!props.active || !props.payload || !props.payload.length) return null;
    const data = props.payload[0].payload;
    return (
      <Box sx={{ bgcolor: "background.paper", p: 1, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="body2">{`${data.year}`}</Typography>
        <Typography variant="body2" color="primary">{`Rang: ${data.rank ?? "-"} von ${data.participants}`}</Typography>
        <Typography variant="body2" color="secondary">{`Zeit: ${formatTime(data.time)}`}</Typography>
        {data.pace && <Typography variant="body2" color="info.main">{`Pace: ${formatPace(data.pace)}`}</Typography>}
      </Box>
    );
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          [theme.breakpoints.down("sm")]: {
            p: 1.5,
            mb: 2,
          },
        }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
              },
            }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Gesamtdistanz
              </Typography>
              <Typography variant="h6">{participant.totalDistance.toFixed(1)} km</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Gesamthöhenmeter
              </Typography>
              <Typography variant="h6">{participant.totalAltitude.toFixed(0)} m</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Gesamtzeit
              </Typography>
              <Typography variant="h6">{formatTime(participant.totalTime)}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Bester Rang
              </Typography>
              <Typography variant="h6">{participant.bestRank ?? "-"}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Durchschnittlicher Rang
              </Typography>
              <Typography variant="h6">{participant.averageRank?.toFixed(0) ?? "-"}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
              },
            }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Teilnahmen
              </Typography>
              <Typography variant="h6">{participant.participationCount}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Erfolgreich
              </Typography>
              <Typography variant="h6">{participant.completedRaces}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Disqualifiziert
              </Typography>
              <Typography variant="h6">{participant.disqualifiedRaces}</Typography>
            </Box>
            <Box></Box>
            <Box></Box>
          </Box>
        </Stack>
      </Paper>

      <CommonTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "year"}
                  direction={sortField === "year" ? sortOrder : "asc"}
                  onClick={() => handleSort("year")}>
                  Jahr
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "track"}
                  direction={sortField === "track" ? sortOrder : "asc"}
                  onClick={() => handleSort("track")}>
                  Strecke
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "distance"}
                  direction={sortField === "distance" ? sortOrder : "asc"}
                  onClick={() => handleSort("distance")}>
                  Distanz
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "altitude"}
                  direction={sortField === "altitude" ? sortOrder : "asc"}
                  onClick={() => handleSort("altitude")}>
                  Höhenmeter
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "time"}
                  direction={sortField === "time" ? sortOrder : "asc"}
                  onClick={() => handleSort("time")}>
                  Zeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "pace"}
                  direction={sortField === "pace" ? sortOrder : "asc"}
                  onClick={() => handleSort("pace")}>
                  Pace (min/km)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "rank"}
                  direction={sortField === "rank" ? sortOrder : "asc"}
                  onClick={() => handleSort("rank")}>
                  Rang
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRaces.map((race, index) => (
              <TableRow key={index}>
                <TableCell>{race.year}</TableCell>
                <TableCell>{race.track}</TableCell>
                <TableCell align="right">{race.distance.toFixed(1)}</TableCell>
                <TableCell align="right">{race.altitude !== null ? race.altitude.toFixed(0) : "-"}</TableCell>
                <TableCell align="right">
                  {race.isDisqualified ? (
                    <Typography color="error">Disqualifiziert</Typography>
                  ) : race.isCancelled ? (
                    <Typography color="waring">Abgesagt</Typography>
                  ) : race.time !== null ? (
                    formatTime(race.time)
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="right">{formatPace(race.pace)}</TableCell>
                <TableCell align="right">{race.rank !== null ? race.rank : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CommonTableContainer>

      {trackProgressions.length > 0 && (
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Streckenverlauf
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={3}
            sx={{
              "& > *": {
                flex: "1 1 400px",
                overflow: "hidden",
              },
            }}>
            {trackProgressions.map(({ track, data, timeRange, paceRange }) => (
              <Stack key={track} spacing={1} sx={{ height: 250 }}>
                <Typography variant="subtitle1">Strecke {track}</Typography>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{
                          value: "Jahr",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        label={{
                          value: "Zeit",
                          angle: -90,
                          position: "insideLeft",
                          offset: 0,
                        }}
                        domain={[timeRange.min, timeRange.max]}
                        tickFormatter={formatAxisTime}
                      />
                      <YAxis yAxisId="middle" orientation="left" domain={[0, 1000]} hide={true} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Pace (min/km)",
                          angle: 90,
                          position: "insideRight",
                          offset: 10,
                          style: { textAnchor: "middle" },
                        }}
                        domain={[paceRange.min, paceRange.max]}
                        tickFormatter={formatAxisPace}
                      />
                      <Tooltip content={renderTooltip} />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar yAxisId="middle" dataKey="rank" name="Rang" fill={theme.palette.primary.main} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="time"
                        name="Zeit"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="pace"
                        name="Pace"
                        stroke={theme.palette.info.main}
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
