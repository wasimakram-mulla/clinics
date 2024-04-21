import {
  Add,
  Brightness5,
  DarkMode,
  LightMode,
  Save,
} from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  FormData,
  PresciptionDataType,
  Timing,
} from '../_types/prescription.types';
import { fetchAllMedicines } from '../../../../firebase/_utils/appointment.util';

const initData: FormData = {
  medicine: '',
  qty: '',
  timing: { M: 0, A: 0, N: 0 },
  duration: '1',
  days: 'days',
  BMAM: 'AM',
};

type PresciptionProps = {
  handleSave: (data: PresciptionDataType) => void;
  initPrescription: PresciptionDataType;
};
const Presciption = ({ handleSave, initPrescription }: PresciptionProps) => {
  const [formData, setFormData] = useState<FormData[]>([initData]);
  const [followUpDate, setFollowUpDate] = useState<Dayjs | null>();
  const [remarks, setRemarks] = useState('');
  const [allMeds, setAllMeds] = useState<string[]>([]);

  useEffect(() => {
    //Fetch All Meds
    getMedicineList();
  }, []);

  const getMedicineList = async () => {
    const data = [...(await fetchAllMedicines())] as string[];
    if (data?.[0]) {
      setAllMeds(data);
    }
  };

  useEffect(() => {
    if (initPrescription) {
      if (initPrescription?.prescription?.[0]) {
        setFormData(initPrescription.prescription);
      }
      setRemarks(initPrescription.remarks);
      setFollowUpDate(dayjs(initPrescription.followUpDate));
    }
  }, [initPrescription]);
  const handleInputChange = (
    index: number,
    fieldName: keyof FormData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const newFormData = JSON.parse(JSON.stringify([...formData]));
    newFormData[index][fieldName] = value.toUpperCase();
    setFormData(newFormData);
  };

  const handleDayTime = (index: number, timetype: keyof Timing) => {
    const newFormData = JSON.parse(JSON.stringify([...formData]));
    newFormData[index].timing[timetype] =
      newFormData[index].timing[timetype] === 1 ? 0 : 1;
    setFormData(newFormData);
  };

  const handleMealsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newFormData = JSON.parse(JSON.stringify([...formData]));
    newFormData[index].BMAM = e.target.value;
    setFormData(newFormData);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFollowUpDate = (followDateVal: any) => {
    setFollowUpDate(followDateVal);
  };

  const addRow = () => {
    setFormData([...formData, initData]);
  };

  const handleSubmit = async () => {
    try {
      const allPrescriptions = formData?.filter((x) => !!x.medicine);

      const prescriptionData: PresciptionDataType = {
        prescription: allPrescriptions,
        followUpDate: followUpDate
          ? dayjs(followUpDate).format('MM/DD/YYYY')
          : '',
        remarks,
      };
      handleSave(prescriptionData);
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div>
      <Typography
        variant="h6"
        component="div"
        sx={{ textAlign: 'right', mb: 1 }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={addRow}
          startIcon={<Add />}
        >
          Add More
        </Button>
      </Typography>
      <Grid container spacing={1}>
        {formData.map((row, index) => (
          <React.Fragment key={index}>
            <Grid item xs={1} md={1}>
              <Typography variant="body1" component="div" sx={{ p: 1 }}>
                {index + 1}
              </Typography>
            </Grid>
            <Grid item xs={11} md={4}>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={allMeds}
                value={row.medicine}
                onInputChange={(_e, newInputValue) => {
                  handleInputChange(index, 'medicine', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Medicine"
                    placeholder="Enter Medicine"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                value={row.qty}
                size="small"
                label="Quantity"
                placeholder="Quantity"
                onChange={(e) =>
                  handleInputChange(index, 'qty', e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
              <IconButton
                size="small"
                title="Morning"
                onClick={() => handleDayTime(index, 'M')}
                color={row.timing.M === 1 ? 'primary' : 'default'}
              >
                <Brightness5 />
              </IconButton>
              <IconButton
                size="small"
                title="Afternoon"
                sx={{ mx: 2 }}
                onClick={() => handleDayTime(index, 'A')}
                color={row.timing.A === 1 ? 'primary' : 'default'}
              >
                <LightMode />
              </IconButton>
              <IconButton
                size="small"
                title="Evening"
                onClick={() => handleDayTime(index, 'N')}
                color={row.timing.N === 1 ? 'primary' : 'default'}
              >
                <DarkMode />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={6} md={6}>
                  <TextField
                    value={row.duration}
                    size="small"
                    label="Duration"
                    placeholder="Duration"
                    onChange={(e) =>
                      handleInputChange(index, 'duration', e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue="days"
                      value={row.days}
                      onChange={(e) =>
                        handleInputChange(index, 'days', e.target.value)
                      }
                    >
                      <MenuItem value="days" selected>
                        Days
                      </MenuItem>
                      <MenuItem value="weeks">Weeks</MenuItem>
                      <MenuItem value="months">Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={row.BMAM}
                      row
                      onChange={(e) => handleMealsChange(e, index)}
                    >
                      <FormControlLabel
                        value="BM"
                        control={<Radio />}
                        label="Before Meal"
                      />
                      <FormControlLabel
                        value="AM"
                        control={<Radio />}
                        label="After Meal"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Divider />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item xs={12} md={8}>
          <TextField
            multiline
            label="Enter Remarks (Optional)"
            placeholder="Enter Remarks (Optional)"
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            maxRows={3}
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <DatePicker
            label="Follow Up Date (optional)"
            closeOnSelect={true}
            value={followUpDate}
            onChange={(newValue) => handleFollowUpDate(newValue)}
            slotProps={{
              textField: {
                helperText: 'DD/MM/YYYY',
              },
            }}
            format="DD/MM/YYYY"
            orientation="portrait"
            disablePast
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Button variant="contained" onClick={handleSubmit} startIcon={<Save />}>
        Save
      </Button>
    </div>
  );
};

export default Presciption;
