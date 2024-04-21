import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import { PRIORITY, PRIORITY_TYPE } from '../../../common/system.util';
import { updateAppointment } from '../../../../firebase/_utils/appointment.util';

type UpdatePatientProps = {
  selectedPatient: DocumentData;
  handleModalClose: () => void;
};
const UpdatePatient = ({
  selectedPatient,
  handleModalClose,
}: UpdatePatientProps) => {
  const [formData, setFormData] = useState({
    weight: selectedPatient?.weight || '',
    height: selectedPatient?.height || '',
    symptoms: selectedPatient?.symptoms || '',
    priority: selectedPatient?.priority || PRIORITY.REGULAR,
  });
  const [priority, setPriority] = useState(
    selectedPatient?.priority || PRIORITY.REGULAR
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setPriority(e.target.value);
    setFormData({ ...formData, priority: e.target.value });
  };

  const handlePatientUpdate = async () => {
    await updateAppointment(formData, selectedPatient.userId);
    handleModalClose();
  };
  return (
    <>
      <Box className="boxModalStyle">
        <Typography variant="h6" component="h6" color="primary">
          Update Patient Details
        </Typography>
        <hr />

        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <TextField
              label="Update Weight (Kg)"
              fullWidth
              size="small"
              placeholder="Update Weight (Kg)"
              sx={{ mt: 2 }}
              value={formData.weight}
              name="weight"
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Update Height (cm)"
              fullWidth
              size="small"
              placeholder="Update Height (cm)"
              value={formData.height}
              name="height"
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Update Symptoms"
              fullWidth
              size="small"
              placeholder="Update Symptoms"
              value={formData.symptoms}
              name="symptoms"
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Update Priority
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={priority}
                label="Update Priority"
                placeholder="Update Priority"
                onChange={handleSelectChange}
                fullWidth
                size="small"
              >
                <MenuItem value={PRIORITY.REGULAR}>
                  {PRIORITY_TYPE.REGULAR}
                </MenuItem>
                <MenuItem value={PRIORITY.HIGH}>{PRIORITY_TYPE.HIGH}</MenuItem>
                <MenuItem value={PRIORITY.LOW}>{PRIORITY_TYPE.LOW}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12} sx={{ textAlign: 'center' }}>
            <Button
              disabled={!formData.symptoms}
              variant="contained"
              onClick={handlePatientUpdate}
            >
              Update Details
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UpdatePatient;
