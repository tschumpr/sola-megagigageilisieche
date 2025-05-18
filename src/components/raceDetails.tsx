import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Run } from "../types";
import { CommonTableContainer } from "./styledComponents";

interface RaceDetailsProps {
  runs: Run[] | null;
}

export const RaceDetails = ({ runs }: RaceDetailsProps) => {
  if (!runs) return null;

  return (
    <CommonTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Track</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Distanz</TableCell>
            <TableCell align="right">Zeit</TableCell>
            <TableCell align="right">Rang</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map(run => (
            <TableRow key={run.track}>
              <TableCell>{run.track}</TableCell>
              <TableCell>{run.name}</TableCell>
              <TableCell align="right">{run.distance}km</TableCell>
              <TableCell align="right">{run.time ?? "-"}</TableCell>
              <TableCell align="right">{run.rank ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CommonTableContainer>
  );
};
