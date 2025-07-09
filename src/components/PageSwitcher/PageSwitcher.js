//this component handles everything that happens during the phase when the muse is connected. UI flow before and after is seperated out into seperate components
import React, { useState, useCallback } from "react";
import { MuseClient } from "muse-js";
import { Card } from "@shopify/polaris";
import {
  Grid,
  Button
} from '@material-ui/core';


// import { mockMuseEEG } from "./utils/mockMuseEEG";
import * as generalTranslations from "./components/translations/en";
import { emptyAuxChannelData, emptyPpgChannelData} from "./components/chartOptions";

import * as funBands from "./components/EEGEduP5/EEGEduSpectro";
import * as funQual  from "./components/EEGEduP5/EEGEduQual";

const preconn = "0. Preconnect"
const qual = "1. Quality Check"
const bands = "2. Begin Session"
const record = "3. Record"

window.firstAnimate = true;

export function PageSwitcher(props) {

  window.nchans = 4
  // data pulled out of multicast$
  const [bandsData, setBandsData] = useState(JSON.parse(JSON.stringify(emptyAuxChannelData))); 

  //use JSON to stringify and parse, this effectively deep copies the objects so they aren't the same object
  const [ppgData, setPpgData] = useState(JSON.parse(JSON.stringify(emptyPpgChannelData)));

  const [qualData, setQualData] = useState(JSON.parse(JSON.stringify(emptyAuxChannelData)));


  // pipe settings
  const [bandsSettings, setBandsSettings] = useState(funBands.getSettings);
  const [qualSettings] = useState(funQual.getSettings);

  // connection status
  const [status, setStatus] = useState(generalTranslations.connect);

  // for picking a new module
  const [selected, setSelected] = useState(preconn);

  // for popup flag when recording
  const [recordPop, setRecordPop] = useState(false);
  const recordPopChange = useCallback(() => setRecordPop(!recordPop), [recordPop]);

  function buildPipes(value) {
    funQual.buildPipe(qualSettings);
    funBands.buildPipe(bandsSettings);
  }

  function subscriptionSetup(value) {
    switch (value) {
      case qual:
        funQual.setup(setQualData, setPpgData, qualSettings)
        break;
      case bands:
        funBands.setup(setBandsData, setPpgData, bandsSettings)
        break;
      default:
        console.log(
          "Error on handle Subscriptions. Couldn't Switch to: " + value
        );
    }
  }

   async function connect() {
    try {
      // Connect with the Muse EEG Client
      setStatus(generalTranslations.connecting);
      window.source = new MuseClient();
      window.source.enableAux = false;
      window.source.enablePpg = true;
      await window.source.connect();
      //window.source.sendCommand("*1") //send this to get muse out of bootloader state
      await window.source.start();
      window.source.eegReadings$ = window.source.eegReadings;
      window.source.ppgReadings$ = window.source.ppgReadings;
      window.source.accelerometerData$ = window.source.accelerometerData;
      window.source.gyroscopeData$ = window.source.gyroscopeData;
      if (
        window.source.connectionStatus.value === true &&
        window.source.eegReadings$ &&
        window.source.ppgReadings$
      ) {
        setStatus(generalTranslations.connected);
        setSelected(qual);

        console.log("buildPipes")
        buildPipes(qual)
        console.log("setupCharts")
        subscriptionSetup(qual)

      }
    } catch (err) {
      setStatus(generalTranslations.connect);
      console.log("Connection error: " + err);
    }
  }

  function acceptQuality() {
     var value = record;
     console.log("Switching to: " + value);

    if (window.subscriptQual) window.subscriptQual.unsubscribe();
    if (window.subscriptBands) window.subscriptBands.unsubscribe();
    if (window.subscriptPPG) window.subscriptPPG.unsubscribe();

    subscriptionSetup(bands);

    setSelected(value);
  }


  function endSession(data) {
    if (window.subscriptQual) window.subscriptQual.unsubscribe();
    if (window.subscriptBands) window.subscriptBands.unsubscribe();
    if (window.subscriptPPG) window.subscriptPPG.unsubscribe();
    props.endSession(data);
  }


  function renderModules() {
    switch (selected) {
      case qual: 
        return <funQual.RenderModule data={qualData} dataPPG={ppgData} acceptQuality={acceptQuality}/>;
      case bands:
        return <funBands.RenderModule dataBands={bandsData} dataPPG={ppgData}/>;
      default:
        return null;
    }
  }

  return (
    <React.Fragment>
      <Card sectioned>
          <Grid
              container
              spacing={1}
              direction={'row'}
              justify={'left'}
              alignItems={'center'}
            >

              <Grid item>
                    <Button 
                      color="primary"
                      variant="contained"
                      disabled={status === generalTranslations.connected}
                      onClick={() => {
                        window.debugWithMock = false;
                        connect();
                      }}
                    >
                      {status}
                    </Button>
              </Grid>
          </Grid>
      </Card>

      {renderModules()}      

      {funBands.RenderRecord((selected === record), setBandsData, recordPopChange, recordPop, status, bandsSettings, setBandsSettings, endSession)}

    </React.Fragment>
  );
}

