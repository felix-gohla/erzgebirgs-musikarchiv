import { Skeleton, TableCell, TableRow } from '@mui/material';

export const TableRowsLoadingAnimation: React.FC<{ numRows: number, numColumns: number }> = ({ numRows, numColumns }) =>
  [...Array(numRows)].map((_row, idx) => (
    <TableRow key={idx}>
      { [...Array(numColumns)].map((_, columnIdx) => <TableCell key={columnIdx}><Skeleton animation="wave" variant="text" /></TableCell>) }
    </TableRow>
  ));