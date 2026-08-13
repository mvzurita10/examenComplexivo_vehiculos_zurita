import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Vehicle, listVehiclesApi } from "../api/vehicles.api";
import { type Rental, listRentalsAdminApi, createRentalApi, updateRentalApi, deleteRentalApi } from "../api/rentals.api";

/*#id BIGSERIAL PRIMARY KEY
#vehicle_id BIGINT NOT NULL REFERENCES vehicles(id)
#customer_name VARCHAR(120) NOT NULL
#total NUMERIC(10,2) NOT NULL
#status VARCHAR(20) NOT NULL (RESERVED, ACTIVE, CLOSED, CANCELLED)
#created_at TIMESTAMP NOT NULL DEFAULT NOW()*/

export default function AdminRentalsPage() {
  const [items, setItems] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [vehicle_id, setVehicleId] = useState<number>(0);
  const [customer_name, setCustomerName] = useState("");
  const [total, setTotal] = useState(2020);
  const [status, setStatus] = useState("");
  const [created_at, setCreatedAt] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listRentalsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar alquileres. ¿Login? ¿Token admin?");
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await listVehiclesApi();
      setVehicles(data.results); // DRF paginado
      if (!vehicle_id && data.results.length > 0) setVehicleId(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadVehicles(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!vehicle_id) return setError("Seleccione un vehículo");
      if (!customer_name.trim()) return setError("Nombre del cliente es requerido");
      if (!total) return setError("Total es requerido");

      const payload = {
        vehicle_id: Number(vehicle_id),
        customer_name: customer_name.trim(),
        total: Number(total),
        status: status || "RESERVED",
        created_at: created_at || new Date().toISOString(),
      };

      if (editId) await updateRentalApi(editId, payload);
      else await createRentalApi(payload);

      setEditId(null);
      setCustomerName("");
      setTotal(0);
      setStatus("");
      setCreatedAt("");
      await load();
    } catch {
      setError("No se pudo guardar alquiler. ¿Token admin?");
    }
  };

  const startEdit = (r: Rental) => {
    setEditId(r.id);
    setVehicleId(r.vehicle_id);
    setCustomerName(r.customer_name);
    setTotal(r.total);
    setStatus(r.status);
    setCreatedAt(r.created_at);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteRentalApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar alquiler. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Alquileres (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="vehicle-label">Vehículo</InputLabel>
              <Select
                labelId="vehicle-label"
                label="Vehículo"
                value={vehicle_id}
                onChange={(e) => setVehicleId(Number(e.target.value))}
              >
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.brand} - {v.plate} (#{v.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Nombre del Cliente" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Total" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="vehicle-label">Vehículo</InputLabel>
              <Select
                labelId="vehicle-label"
                label="Vehículo"
                value={vehicle_id}
                onChange={(e) => setVehicleId(Number(e.target.value))}
              >
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.brand} - {v.plate} (#{v.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Modelo" value={vehicle_} onChange={(e) => setModelo(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setModelo(""); setPlaca(""); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadMarcas(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.brand} - {v.plate}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell>{v.placa}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}