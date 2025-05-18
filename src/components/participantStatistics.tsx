import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { SortOrder } from "../utils/tableUtils";
import { CommonDialog } from "./commonDialog";
import { useData } from "./dataContext";
import { ParticipantDetails } from "./participantDetails";
import { CommonTableContainer } from "./styledComponents";

type SortField =
  | "name"
  | "totalDistance"
  | "totalTime"
  | "totalAltitude"
  | "participationCount"
  | "completedRaces"
  | "disqualifiedRaces"
  | "bestRank"
  | "averageRank"
  | "tracks";

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${hours}h ${mins}m ${secs}s`;
};

export const ParticipantStatistics = () => {
  const { participantStats } = useData();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      navigate({ pathname: location.pathname, hash: "participants", search: `?search=${value}` }, { replace: true });
    } else {
      navigate({ pathname: location.pathname, hash: "participants", search: "" }, { replace: true });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    navigate({ pathname: location.pathname, hash: "participants", search: "" }, { replace: true });
  };

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const handleRowClick = (name: string) => {
    setSelectedParticipant(name);
  };

  const handleCloseModal = () => {
    setSelectedParticipant(null);
  };

  const selectedParticipantData = useMemo(() => {
    if (!selectedParticipant) return null;
    return participantStats.find(stat => stat.name === selectedParticipant) ?? null;
  }, [selectedParticipant, participantStats]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedStats = useMemo(() => {
    return participantStats
      .filter(
        stat =>
          stat.name.toLowerCase().includes(searchTerm.toLowerCase()) && stat.races.some(race => !race.isCancelled),
      )
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "totalDistance":
            comparison = a.totalDistance - b.totalDistance;
            break;
          case "totalAltitude":
            comparison = a.totalAltitude - b.totalAltitude;
            break;
          case "totalTime":
            comparison = a.totalTime - b.totalTime;
            break;
          case "participationCount":
            comparison = a.participationCount - b.participationCount;
            break;
          case "completedRaces":
            comparison = a.completedRaces - b.completedRaces;
            break;
          case "disqualifiedRaces":
            comparison = a.disqualifiedRaces - b.disqualifiedRaces;
            break;
          case "bestRank":
            if (a.bestRank === null && b.bestRank === null) comparison = 0;
            else if (a.bestRank === null) comparison = 1;
            else if (b.bestRank === null) comparison = -1;
            else comparison = a.bestRank - b.bestRank;
            break;
          case "averageRank":
            if (a.averageRank === null && b.averageRank === null) comparison = 0;
            else if (a.averageRank === null) comparison = 1;
            else if (b.averageRank === null) comparison = -1;
            else comparison = a.averageRank - b.averageRank;
            break;
          case "tracks": {
            const aTracks = [...new Set(a.races.map(r => r.track))].sort((x, y) => x - y);
            const bTracks = [...new Set(b.races.map(r => r.track))].sort((x, y) => x - y);
            comparison = aTracks.length - bTracks.length;
            if (comparison === 0) {
              comparison = aTracks[0] - bTracks[0];
            }
            break;
          }
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [participantStats, sortField, sortOrder, searchTerm]);

  return (
    <>
      <Stack sx={{ mb: 2 }}>
        <TextField
          label="Nach Namen suchen"
          variant="outlined"
          size="small"
          color="secondary"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end" size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <CommonTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "totalDistance"}
                  direction={sortField === "totalDistance" ? sortOrder : "asc"}
                  onClick={() => handleSort("totalDistance")}>
                  Distanz
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "totalAltitude"}
                  direction={sortField === "totalAltitude" ? sortOrder : "asc"}
                  onClick={() => handleSort("totalAltitude")}>
                  Höhenmeter
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "totalTime"}
                  direction={sortField === "totalTime" ? sortOrder : "asc"}
                  onClick={() => handleSort("totalTime")}>
                  Zeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "participationCount"}
                  direction={sortField === "participationCount" ? sortOrder : "asc"}
                  onClick={() => handleSort("participationCount")}>
                  Teilnahmen
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "completedRaces"}
                  direction={sortField === "completedRaces" ? sortOrder : "asc"}
                  onClick={() => handleSort("completedRaces")}>
                  Erfolgreich
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "disqualifiedRaces"}
                  direction={sortField === "disqualifiedRaces" ? sortOrder : "asc"}
                  onClick={() => handleSort("disqualifiedRaces")}>
                  Disqualifiziert
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "tracks"}
                  direction={sortField === "tracks" ? sortOrder : "asc"}
                  onClick={() => handleSort("tracks")}>
                  Strecken
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "bestRank"}
                  direction={sortField === "bestRank" ? sortOrder : "asc"}
                  onClick={() => handleSort("bestRank")}>
                  Bester Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "averageRank"}
                  direction={sortField === "averageRank" ? sortOrder : "asc"}
                  onClick={() => handleSort("averageRank")}>
                  Durchschnitt
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedStats.map(stat => (
              <TableRow
                key={stat.name}
                onClick={() => handleRowClick(stat.name)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}>
                <TableCell>{stat.name}</TableCell>
                <TableCell align="right">{stat.totalDistance.toFixed(1)}km</TableCell>
                <TableCell align="right">{stat.totalAltitude}m</TableCell>
                <TableCell align="right">{formatTime(stat.totalTime)}</TableCell>
                <TableCell align="right">{stat.participationCount}</TableCell>
                <TableCell align="right">{stat.completedRaces}</TableCell>
                <TableCell align="right">{stat.disqualifiedRaces}</TableCell>
                <TableCell align="right">
                  {[...new Set(stat.races.map(r => r.track))].sort((a, b) => a - b).join(", ")}
                </TableCell>
                <TableCell align="right">{stat.bestRank ?? "-"}</TableCell>
                <TableCell align="right">{stat.averageRank ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CommonTableContainer>

      <CommonDialog open={!!selectedParticipant} onClose={handleCloseModal} title={selectedParticipant ?? ""}>
        {selectedParticipantData && <ParticipantDetails participant={selectedParticipantData} />}
      </CommonDialog>
    </>
  );
};
