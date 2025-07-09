import React, { useState } from "react";

import { Card } from "@shopify/polaris";

import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';

export function PatientInfoPage(props) {
    const [patientId, setPatientId] = useState('');
    const [patientWeight, setPatientWeight] = useState('');
    const [patientMedication, setPatientMedication] = useState('');
    const [patientDosage, setPatientDosage] = useState('');
    const [patientTimeAdministered, setPatientTimeAdministered] = useState('');
    const [patientAddNotes, setPatientAddNotes] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientGender, setPatientGender] = useState('');

    //on submit, pass all the data to the parent component
    const handleSubmit = (event) => {
      event.preventDefault();
      props.submitPatientInfo(patientId, patientWeight, patientMedication, patientDosage, patientTimeAdministered, patientAddNotes, patientAge, patientGender);
    }

  return (
      <Card sectioned>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={1}
              direction={'column'}
              justify={'center'}
              alignItems={'center'}
            >
              <Grid item xs={12}>
                <h1>Session Information</h1>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Session ID (YYYY/MM/DD - #xx)" onChange={event => setPatientId(event.target.value)} value={patientId} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Age" onChange={event => setPatientAge(event.target.value)} value={patientAge}  style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Gender (M/F/X)" onChange={event => setPatientGender(event.target.value)} value={patientGender} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Weight (lbs)" onChange={event => setPatientWeight(event.target.value)} value={patientWeight} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Medication" onChange={event => setPatientMedication(event.target.value)} value={patientMedication} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Dosage" onChange={event => setPatientDosage(event.target.value)} value={patientDosage} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Time Administered (00:00 am/pm)" onChange={event => setPatientTimeAdministered(event.target.value)} value={patientTimeAdministered} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Additional Notes" onChange={event => setPatientAddNotes(event.target.value)} value={patientAddNotes} style={{width: '20vw'}}></TextField>
              </Grid>

              <Grid item xs={32}>
                <Button onClick={handleSubmit} variant="contained" color="primary" type="submit"> Submit </Button>
              </Grid>
            </Grid>
          </form>
      </Card>
  );
}

