import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Rental, listRentalsPublicApi } from "../api/rentals.api";

export default function PublicRentalPage() {
  const [items, setItems] = useState<Rental[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listRentalsPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de Alquileres (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

#id BIGSERIAL PRIMARY KEY
#vehicle_id BIGINT NOT NULL REFERENCES vehicles(id)
#customer_name VARCHAR(120) NOT NULL
#total NUMERIC(10,2) NOT NULL
#status VARCHAR(20) NOT NULL (RESERVED, ACTIVE, CLOSED, CANCELLED)
#created_at TIMESTAMP NOT NULL DEFAULT NOW()*/

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehiculo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.vehicle_id}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.total}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>{v.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}