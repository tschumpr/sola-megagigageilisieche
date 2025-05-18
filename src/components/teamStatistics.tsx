import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
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
import { timeToMinutes } from "../utils/dataUtils";
import { handleSort, SortOrder } from "../utils/tableUtils";
import { CommonDialog } from "./commonDialog";
import { useData } from "./dataContext";
import { RaceDetails } from "./raceDetails";
import { CommonTableContainer } from "./styledComponents";

type SortField = "year" | "category" | "totalTime" | "rank";

const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return "-";
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const TeamStatistics = () => {
  const { teamStats, yearData } = useData();
  const theme = useTheme();
  const [sortField, setSortField] = useState<SortField>("year");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleRowClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleCloseModal = () => {
    setSelectedYear(null);
  };

  const selectedYearData = useMemo(() => {
    if (!selectedYear) return null;
    const yearDataItem = yearData.find(data => data.year === selectedYear);
    return yearDataItem?.runs ?? null;
  }, [selectedYear, yearData]);

  const sortedStats = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "year":
          comparison = Number(a.year) - Number(b.year);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "totalTime":
          if (a.totalTime === null && b.totalTime === null) comparison = 0;
          else if (a.totalTime === null) comparison = 1;
          else if (b.totalTime === null) comparison = -1;
          else comparison = a.totalTime.localeCompare(b.totalTime);
          break;
        case "rank":
          if (a.rank === null && b.rank === null) comparison = 0;
          else if (a.rank === null) comparison = 1;
          else if (b.rank === null) comparison = -1;
          else comparison = Number(a.rank) - Number(b.rank);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [teamStats, sortField, sortOrder]);

  const chartData = useMemo(() => {
    return teamStats
      .filter(stat => !stat.isCancelled && !stat.isDisqualified)
      .sort((a, b) => a.year - b.year) // Always sort by year ascending
      .map(stat => {
        const yearDataItem = yearData.find(data => data.year === stat.year);
        return {
          year: stat.year,
          time: stat.totalTime ? timeToMinutes(stat.totalTime) : null,
          rank: stat.rank,
          participants: yearDataItem?.participants,
          timeFormatted: stat.totalTime ? formatTime(stat.totalTime) : null,
        };
      });
  }, [teamStats, yearData]);

  const formatAxisTime = (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatAxisRank = (value: number) => {
    return value.toString();
  };

  // Calculate min and max time for the axis
  const timeRange = useMemo(() => {
    const times = chartData.map(d => d.time).filter((t): t is number => t !== null);
    if (times.length === 0) return { min: 480, max: 600 }; // Default 8-10 hours
    const min = Math.floor(Math.min(...times) / 30) * 30; // Round down to nearest 30 minutes
    const max = Math.ceil(Math.max(...times) / 30) * 30; // Round up to nearest 30 minutes
    return { min, max };
  }, [chartData]);

  const renderTooltip = (props: TooltipProps<number, string>) => {
    if (!props.active || !props.payload || !props.payload.length) return null;
    const data = props.payload[0].payload;
    return (
      <Box sx={{ bgcolor: "background.paper", p: 1, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="body2">{`${data.year}`}</Typography>
        <Typography variant="body2" color="primary">{`Rang: ${data.rank ?? "-"} von ${data.participants}`}</Typography>
        <Typography variant="body2" color="secondary">{`Zeit: ${data.timeFormatted ?? "-"}`}</Typography>
      </Box>
    );
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Rang",
                  angle: 90,
                  position: "insideRight",
                  offset: 0,
                }}
                domain={[0, 1000]}
                tickFormatter={formatAxisRank}
              />
              <Tooltip content={renderTooltip} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar yAxisId="right" dataKey="rank" name="Rang" fill={theme.palette.primary.main} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="time"
                name="Zeit"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <CommonTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "year"}
                  direction={sortField === "year" ? sortOrder : "asc"}
                  onClick={() => handleSort("year", sortField, sortOrder, setSortField, setSortOrder)}>
                  Jahr
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "category"}
                  direction={sortField === "category" ? sortOrder : "asc"}
                  onClick={() => handleSort("category", sortField, sortOrder, setSortField, setSortOrder)}>
                  Kategorie
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "totalTime"}
                  direction={sortField === "totalTime" ? sortOrder : "asc"}
                  onClick={() => handleSort("totalTime", sortField, sortOrder, setSortField, setSortOrder)}>
                  Zeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "rank"}
                  direction={sortField === "rank" ? sortOrder : "asc"}
                  onClick={() => handleSort("rank", sortField, sortOrder, setSortField, setSortOrder)}>
                  Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStats.map(stat => (
              <TableRow
                key={stat.year}
                onClick={() => handleRowClick(stat.year)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}>
                <TableCell>{stat.year}</TableCell>
                <TableCell>{stat.category}</TableCell>
                <TableCell align="right">{formatTime(stat.totalTime)}</TableCell>
                <TableCell align="right">{stat.rank ?? "-"}</TableCell>
                <TableCell align="right">
                  {stat.isCancelled ? (
                    <Chip label="Abgesagt" color="warning" />
                  ) : stat.isDisqualified ? (
                    <Chip label="Disqualifiziert" color="error" />
                  ) : (
                    <Chip label="Erfolgreich" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CommonTableContainer>

      <CommonDialog
        open={selectedYear !== null}
        onClose={handleCloseModal}
        title={`SOLA-Stafette ${selectedYear}`}
        maxWidth="lg">
        {selectedYear && <RaceDetails runs={selectedYearData} />}
      </CommonDialog>
    </>
  );
};
