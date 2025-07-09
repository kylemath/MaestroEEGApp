import React from "react";
import { Card } from "@shopify/polaris";

import {
  Grid,
  Button
} from '@material-ui/core';

export function SessionCompletePage(props) {

  function refreshPage(){
    window.location.reload();
  }

  return (
      <Card title={"Session Complete"} sectioned>
          <Grid
              container
              spacing={3}
              direction={'column'}
              justify={'center'}
              alignItems={'center'}
            >
              <Grid item>
                <h3>Your data has been successfully collected and saved with MAESTRO.</h3>
              </Grid>

              <Grid item>
                  <Grid
                      container
                      spacing={3}
                      direction={'row'}
                      justify={'center'}
                      alignItems={'center'}
                    >
                      <Grid item>
                        <Button onClick={props.newSession} variant="contained" color="primary">New Session</Button>
                      </Grid>

                      <Grid item>
                        <Button onClick={refreshPage} variant="contained" color="primary">Logout</Button>
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      </Card>
  );
}

