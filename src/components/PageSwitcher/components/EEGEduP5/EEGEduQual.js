import React, {useState, useCallback} from "react";
import { catchError, multicast } from "rxjs/operators";

import { Button } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { Card, RangeSlider, TextField, ButtonGroup,
           } from "@shopify/polaris";


import { take, takeUntil } from "rxjs/operators";
import { Subject, timer } from "rxjs";

import { saveAs } from 'file-saver';

import { zipSamples, channelNames } from "muse-js";

import { Bar } from "react-chartjs-2";

import {
  bandpassFilter,
  epoch,
  } from "@neurosity/pipes";

import { generalOptions } from "../chartOptions";

import * as generalTranslations from "../translations/en";
// import { generateXTics } from "../../utils/chartUtils";

import { standardDeviation } from "../../utils/chartUtils";

export function getSettings () {
  return {
    cutOffLow: .001,
    cutOffHigh: 100,
    interval: 64,
    bins: 1024,
    duration: 512,
    //ppgDuration: 640,
    srate: 256,
    //ppgSrate: 64,
    name: 'Quality',
    minutesToSave: 3
  }
};

export function buildPipe(Settings) {
  if (window.subscriptionQuality) window.subscriptionQuality.unsubscribe();
  //if (window.subscriptionPPG) window.subscriptionPPG.unsubscribe();

  window.pipeQuality$ = null;
  window.multicastQuality$ = null;
  window.subscriptionQual = null;
  window.pipePPG$ = null;
  window.multicastPPG$ = null;
  //window.subscriptPPG = null;

  // Build Pipe
  window.pipeQuality$ = zipSamples(window.source.eegReadings$).pipe(
    bandpassFilter({ 
      cutoffFrequencies: [Settings.cutOffLow, Settings.cutOffHigh], 
      nbChannels: window.nchans }),
    epoch({
      duration: Settings.duration,
      interval: Settings.interval,
      samplingRate: Settings.srate
    }),
    catchError(err => {
      console.log(err);
    })
  );

  // Build Pipe
//  console.log('building PPG Pipe')
//  window.pipePPG$ = zipSamplesPpg(window.source.ppgReadings$).pipe(
//    bandpassFilter({ 
//      cutoffFrequencies: [.5, 20], 
//      nbChannels: 3 }),
//    epoch({
//      duration: Settings.ppgDuration,
//      interval: 32,
//      samplingRate: Settings.ppgSrate
//    }),
//    fft({ bins: 4096})
//  );


  window.multicastQuality$ = window.pipeQuality$.pipe(
    multicast(() => new Subject())
  );
//  window.multicastPPG$ = window.pipePPG$.pipe(
//    multicast(() => new Subject())
//  );

}

export function setup(setData, setDataPpg, Settings) {
  console.log("Subscribing to " + Settings.name);

  if (window.multicastQuality$) {
    window.subscriptionQual = window.multicastQuality$.subscribe(data => {
      setData(qualData => {
        Object.values(qualData).forEach((channel, index) => {
            channel.datasets[0].qual = standardDeviation(data.data[index])
        });

        return {
          ch0: qualData.ch0,
          ch1: qualData.ch1,
          ch2: qualData.ch2,
          ch3: qualData.ch3,
          ch4: qualData.ch4
        };
      });
    });

    window.multicastQuality$.connect();
    console.log("Subscribed to " + Settings.name);

  }



//   //ppg
//  if (window.multicastPPG$) {
//    window.subscriptPPG = window.multicastPPG$.subscribe(data => {
//    setDataPpg(ppgData => {
//      Object.values(ppgData).forEach((channel, index) => {
//        channel.datasets[0].data = data.psd[index];
//        channel.xLabels = data.freqs;
//        channel.datasets[0].qual = channel.datasets[0].data[0]
//        // channel.datasets[0].data = data.data[index];
//        // channel.xLabels = generateXTics(Settings.ppgSrate, Settings.ppgDuration)
//      });
//
//        return{
//          ch0: ppgData.ch0,
//          ch1: ppgData.ch1,
//          ch2: ppgData.ch2
//        };
//      });
//    });
//
//    window.multicastPPG$.connect();
//    console.log("Subscribed to PPG");
// 
//  }
}

export function RenderModule(channels) {
  function RenderQualityStatus() {
      var avgQualVal = (+channels.data['ch0'].datasets[0].qual + +channels.data['ch1'].datasets[0].qual + +channels.data['ch2'].datasets[0].qual + +channels.data['ch3'].datasets[0].qual); //get average qual value //note the + unary plus operator to convert string to number
    if (avgQualVal < 200){
        return (
            <div className="flexyCol">
              <CheckCircleIcon style={{ color: 'green' }}/>
              <h3>Quality check is good, please proceed.</h3>
            </div>
        )
    } else {
        return (
            <div className="flexyCol">
              <HighlightOffIcon style={{ color: 'red' }} fontSize="large"/>
              <h3>Please adjust the headband and ensure sensors are making good contact with skin.</h3>
              <h3>When you are happy with the signal quality, press "Continue" button below.</h3>
            </div>
        )
    }
  }
 
  function RenderCharts() {
  
  if (channels.data['ch0'].datasets[0].qual) {
      const options = {
          ...generalOptions,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  ...generalOptions.scales.xAxes[0].scaleLabel,
                  labelString: "Channel"
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  ...generalOptions.scales.yAxes[0].scaleLabel,
                  labelString: "SD of Voltage"
                },
                ticks: {
                  min: 0,
                  max: 500
                }
              }
            ]
          },
          title: {
            ...generalOptions.title,
            text: 'Channel Quality'
          }
        };

      const data = {
        datasets: [{
          label: 'Data Quality by Channel',
          data: [
            channels.data['ch0'].datasets[0].qual,
            channels.data['ch1'].datasets[0].qual,
            channels.data['ch2'].datasets[0].qual,
            channels.data['ch3'].datasets[0].qual,
//            channels.dataPPG['ch0'].datasets[0].qual,
//            channels.dataPPG['ch1'].datasets[0].qual,
//            channels.dataPPG['ch2'].datasets[0].qual
          ], 
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
//            'rgb(255, 0, 0)',
//            'rgb(0, 255, 0)',
//            'rgb(0, 0, 255)'
          ]
        }],

        labels: [
          channelNames[0], 
          channelNames[1],
          channelNames[2],
          channelNames[3],
//          'ppg0',
//          'ppg1',
//          'ppg2'
        ]
      };  
       
      return (
        <Card title={"Signal Quality"}>
          <Card.Section>
          <div>
              <div className="flexyRow">
                  {RenderQualityStatus()}
              </div>
             <Card.Section key={"Card_" + 1}>
              <Bar key={"Line_" + 1} data={data} options={options} />
            </Card.Section>
          </div>
          </Card.Section>
          <Card.Section>
              <Button
                variant="contained"
                color="primary"
               onClick={channels.acceptQuality}
              >Continue</Button>
          </Card.Section>

        </Card>
      );

    } else {
      return (
        <Card title={"Signal Quality"}>
          <Card.Section>
          <h3>Loading...</h3>
          </Card.Section>
        </Card>
      );
    }
  }

  return RenderCharts();
}

export function renderSliders(setData, setSettings, status, Settings) {

  function resetPipeSetup(value) {
    buildPipe(Settings);
    setup(setData, Settings);
  }

  function handleIntervalRangeSliderChange(value) {
    setSettings(prevState => ({...prevState, interval: value}));
    resetPipeSetup();
  }

  function handleCutoffLowRangeSliderChange(value) {
    setSettings(prevState => ({...prevState, cutOffLow: value}));
    resetPipeSetup();
  }

  function handleCutoffHighRangeSliderChange(value) {
    setSettings(prevState => ({...prevState, cutOffHigh: value}));
    resetPipeSetup();
  }

  function handleDurationRangeSliderChange(value) {
    setSettings(prevState => ({...prevState, duration: value}));
    resetPipeSetup();
  }

  return (
    <Card title={Settings.name + ' Settings'} sectioned>
      <RangeSlider 
        disabled={status === generalTranslations.connect}
        min={128} step={128} max={4096} 
        label={'Epoch duration (Sampling Points): ' + Settings.duration} 
        value={Settings.duration} 
        onChange={handleDurationRangeSliderChange} 
      />
      <RangeSlider 
        disabled={status === generalTranslations.connect}
        min={10} step={5} max={Settings.duration} 
        label={'Sampling points between epochs onsets: ' + Settings.interval} 
        value={Settings.interval} 
        onChange={handleIntervalRangeSliderChange} 
      />
      <RangeSlider 
        disabled={status === generalTranslations.connect}
        min={.01} step={.5} max={Settings.cutOffHigh - .5} 
        label={'Cutoff Frequency Low: ' + Settings.cutOffLow + ' Hz'} 
        value={Settings.cutOffLow} 
        onChange={handleCutoffLowRangeSliderChange} 
      />
      <RangeSlider 
        disabled={status === generalTranslations.connect}
        min={Settings.cutOffLow + .5} step={.5} max={Settings.srate/2} 
        label={'Cutoff Frequency High: ' + Settings.cutOffHigh + ' Hz'} 
        value={Settings.cutOffHigh} 
        onChange={handleCutoffHighRangeSliderChange} 
      />
    </Card>
  )
}


export function RenderRecord(setData, recordPopChange, recordPop, status, Settings, setSettings) {


  // text entry

  const [patientID, setPatientID] = useState('001');
  const handlerPatientIDChange = useCallback((newValue) => setPatientID(newValue), []);

  const [age, setAge] = useState('46');
  const handlerAgeChange = useCallback((newValue) => setAge(newValue), []);

  const [gender, setGender] = useState('Female');
  const handlerGenderChange = useCallback((newValue) => setGender(newValue), []);

  const [weight, setWeight] = useState('195 lbs');
  const handlerWeightChange = useCallback((newValue) => setWeight(newValue), []);

  const [medication, setMedication] = useState('Ketamine');
  const handlerMedicationChange = useCallback((newValue) => setMedication(newValue), []);

  const [dosage, setDosage] = useState('5 mg orally');
  const handlerDosageChange = useCallback((newValue) => setDosage(newValue), []);

  const [dosageTime, setDosageTime] = useState('3:12 pm, August 25, 2022');
  const handlerDosageTimeChange = useCallback((newValue) => setDosageTime(newValue), []);

  const [recordingNotes, setRecordingNotes] = useState('laying down eyes closed');
  const handlerRecordingNotesChange = useCallback((newValue) => setRecordingNotes(newValue), []);



  function handleMinutesToSaveRangeSliderChange(value) {
    setSettings(prevState => ({...prevState, minutesToSave: value}));
  }

  return (
    <Card title={'Session Information'} sectioned>

        <Card.Section>
          <TextField label="Session ID:" value={patientID} onChange={handlerPatientIDChange} />
          <TextField label="Age:" value={age} onChange={handlerAgeChange} />
          <TextField label="Gender (M,F,Other):" value={gender} onChange={handlerGenderChange} />
          <TextField label="Weight (lbs):" value={weight} onChange={handlerWeightChange} />
          <TextField label="Medication Administered:" value={medication} onChange={handlerMedicationChange} />
          <TextField label="Dosage:" value={dosage} onChange={handlerDosageChange} />
          <TextField label="Time and Date of Dosage:" value={dosageTime} onChange={handlerDosageTimeChange} />
          <TextField label="Additional Notes or Considerations:" value={recordingNotes} onChange={handlerRecordingNotesChange} />

        </Card.Section>
        <RangeSlider 
          disabled={status === generalTranslations.connect} 
          min={.1}
          step={.1}
          max={480}
          label={'Session Length: ' + Settings.minutesToSave + ' Minutes'} 
          value={Settings.minutesToSave} 
          onChange={handleMinutesToSaveRangeSliderChange} 
        />  
        <br />      
        <ButtonGroup> 
          <Button 
            onClick={() => {
              window.runningAlpha0 = [];
              window.runningAlpha1 = [];
              window.runningAlpha2 = [];
              window.runningAlpha3 = [];
              window.runningAlphaCount = 0;
              window.xlabels = [];
              console.log(Settings)
              saveToCSV(Settings, 
                        patientID,
                        age,
                        gender,
                        weight,
                        medication,
                        dosage,
                        dosageTime,
                        recordingNotes, 
                        recordPopChange);
              recordPopChange();
            }}
            primary={status !== generalTranslations.connect}
            disabled={status === generalTranslations.connect || recordPop}
          > 
            {'Begin Session'}  
          </Button>
        </ButtonGroup>
       
    </Card>
  )
}


function saveToCSV(Settings, patientID, age, gender, weight, medication, dosage, dosageTime, recordingNotes, recordPopChange) {
  console.log('Saving ' + Settings.minutesToSave + ' minutes...');
  console.log('Recording Notes: ', recordingNotes)
  var localObservable$ = null;
  var firstTime = 0;
  const dataToSave = [];

  console.log('making ' + Settings.name + ' headers')

   dataToSave.push(
      "Timestamp (sec),",
      "deltaTP9,deltaFP1,deltaFP2,deltaTP10,deltaAux,", 
      "thetaTP9,thetaFP1,thetaFP2,thetaTP10,thetaAux,",  
      "alphaTP9,alphaFP1,alphaFP2,alphaTP10,alphaAux,",  
      "betaTP9,betaFP1,betaFP2,betaTP10,betaAux,", 
      "gammaTP9,gammaFP1,gammaFP2,gammaTP10,gammaAux", recordingNotes, "\n"
    ); 

  // Create timer 
  const timer$ = timer(Settings.minutesToSave * 60 * 1000); // convert to msec

 // put selected observable object into local and start taking samples
  localObservable$ = window.multicastBands$.pipe(
    take(1)
  );
  localObservable$.subscribe({
    next(x) {
      firstTime = Date.now();
      // dataToSave.push(0 + "," + Object.values(x).join(",") + "\n");
      // console.log(x)
    }
  })

 // put selected observable object into local and start taking samples
  localObservable$ = window.multicastBands$.pipe(
    takeUntil(timer$)
  );

  // now with header in place subscribe to each epoch and log it
  localObservable$.subscribe({
    next(x) { 
      dataToSave.push((Date.now()-firstTime)/1000 + "," + Object.values(x).join(",") + "\n");
      // logging is useful for debugging -yup
      // console.log(x);
    },
    error(err) { console.log(err); },
    complete() { 
      console.log('Trying to save')
      var blob = new Blob(
        dataToSave, 
        {type: "text/plain;charset=utf-8"}
      );
    saveAs(blob, patientID + '_' +
                        age + '_' +
                        gender + '_' +
                        weight + '_'+ 
                        medication + '_' +
                        dosage + '_' +
                        dosageTime + '_' +
                        recordingNotes  +  '_' + Settings.name + "_Recording_" + Date.now() + ".csv");      
    recordPopChange()
    console.log('Completed');
    }
  });

}
