import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Vehicle, listVehiclesApi, createVehicleApi, updateVehicleApi, deleteVehicleApi } from "../api/vehicles.api";

export default function AdminVehiclesPage() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [daily_rate, setDailyRate] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listVehiclesApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!plate.trim()) return setError("Placa requerida");
      if (!brand.trim()) return setError("Marca requerida");
      if (!daily_rate.trim()) return setError("Tarifa diaria requerida");

      if (editId) await updateVehicleApi(editId, plate.trim());
      else await createVehicleApi(plate.trim());

      setPlate("");
      setBrand("");
      setDailyRate("");
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (m: Vehicle) => {
    setEditId(m.id);
    setPlate(m.plate);
    setBrand(m.brand);
    setDailyRate(m.daily_rate.toString());
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteVehicleApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Nombre marca" value={plate} onChange={(e) => setPlate(e.target.value)} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setPlate(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.plate}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}