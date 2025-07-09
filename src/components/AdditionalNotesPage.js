import React, { useState } from "react";
import { Card } from "@shopify/polaris";

import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';

export function AdditionalNotesPage(props) {

   const [patientPostAddNotes, setPatientPostAddNotes] = useState('');

   const handleSubmit = (event) => {
        props.submit(patientPostAddNotes)
   }

  return (
      <Card title={"Additional Notes"} sectioned>
        <Grid
          container
          spacing={3}
          direction={'column'}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid item>
              <TextField
                  placeholder="Fill in additional session notes here..."
                  multiline
                  rows={8}
                  maxRows={Infinity}
                  onChange={event => setPatientPostAddNotes(event.target.value)} value={patientPostAddNotes}
                />
          </Grid>
          <Grid item>
            <Button onClick={handleSubmit} variant="contained" color="primary">Continue</Button>
          </Grid>
        </Grid>
      </Card>
  );
}

