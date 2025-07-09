import React, {useState, useCallback} from "react";
import { catchError, multicast } from "rxjs/operators";

import {NotificationManager} from 'react-notifications';

import { TextContainer, Card, RangeSlider, TextField } from "@shopify/polaris";

import { take, takeWhile } from "rxjs/operators";
import { Subject } from "rxjs";

import { zipSamples, zipSamplesPpg, channelNames } from "muse-js";

import { Line, Bar } from "react-chartjs-2";

import {
  Grid,
  Button
} from '@material-ui/core';

import {
  bandpassFilter,
  epoch,
  fft,
} from "@neurosity/pipes";

import { chartStyles, generalOptions } from "../chartOptions";

import * as generalTranslations from "../translations/en";
import * as specificTranslations from "./translations/en";

import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

var eventLog = [];
var eventNoteLog = 0;
var runningHR = [];
var runningAlpha0 = [];
var runningAlpha1 = [];
var runningAlpha2 = [];
var runningAlpha3 = [];
var runningAlphaCount = 0;
var runningHRCount = 0;
var xlabels = [];
var xlabelsHR = [];
var currentHR = 0;
var stopTheRecording = false;

//var firstTime = 0;
//var firstTimeHR = 0;
var eventPress = 0;
var dataToSave = [];

//we need to automate the saving of data into the csv
var eegColStart, gyroColStart, accelColStart, ppgColStart, eventColStart;
var metaColNum = 2;//timestamp and type
var gyroColNum = 3;
var accelColNum = 3;
var ppgColNum = 3;
var eventColNum = 1;
var eegColNum; //depends on number of fft bins, so we put this at the end
var totalColNum;
var eegType = "eeg";
var ppgType = "ppg";
var gyroType = "gyro";
var accelType = "accelerometer";
var eventType = "event";

const PurpleButton = withStyles((theme) => ({
  root: {
    color: '#ffffff',
    backgroundColor: '#aa00ff',
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
}))(Button);


const GreenButton = withStyles((theme) => ({
  root: {
    color: '#ffffff',
    backgroundColor: '#3bb759',
    '&:hover': {
      backgroundColor: '#4bd779',
    },
  },
}))(Button);




export function getSettings () {
  return {
    cutOffLow: .001,
    cutOffHigh: 100,
    interval: 64,
    bins: 64*4,
    duration: 512,
    ppgDuration: 128,
    srate: 256,
    ppgSrate: 64,
    name: 'Bands',
    minutesToSave: 3
  }
};

export function buildPipe(Settings) {
  if (window.subscriptionBands) window.subscriptionQuality.unsubscribe();
  if (window.subscriptionPPG) window.subscriptionPPG.unsubscribe();

  window.pipeBands$ = null;
  window.multicastBands$ = null;
  window.subscriptBands = null;
  window.pipePPG$ = null;
  window.multicastPPG$ = null;
  window.multicastGyro$ = null;
  window.multicastTelemtry$ = null;
  window.subscriptPPG = null;
  window.subscriptGyro = null;

  console.log('building Bands Pipe')

  // Build Pipe
  window.pipeBands$ = zipSamples(window.source.eegReadings$).pipe(
    bandpassFilter({ 
      cutoffFrequencies: [Settings.cutOffLow, Settings.cutOffHigh], 
      nbChannels: window.nchans }),
    epoch({
      duration: Settings.duration,
      interval: Settings.interval,
      samplingRate: Settings.srate
    }),
    fft({ bins: Settings.bins }),
    catchError(err => {
      console.log(err);
    })
  );

  // Build Pipe
  console.log('building PPG Pipe')
  window.pipePPG$ = zipSamplesPpg(window.source.ppgReadings$).pipe(
//    bandpassFilter({ 
//      cutoffFrequencies: [.1, 24], 
//      nbChannels: 3 }),
    epoch({
      duration: Settings.ppgDuration,
      interval: 16,
      samplingRate: Settings.ppgSrate
    })
  );


  window.multicastBands$ = window.pipeBands$.pipe(
    multicast(() => new Subject())
  );
  window.multicastPPG$ = window.pipePPG$.pipe(
    multicast(() => new Subject())
  );

  window.multicastGyro$ = window.source.gyroscopeData$.pipe(
    multicast(() => new Subject())
  );

  window.multicastAccelerometer$ = window.source.accelerometerData$.pipe(
    multicast(() => new Subject())
  );

}

export function setup(setDataBands, setDataPpg, Settings) {
  console.log("Subscribing to " + Settings.name);

    dataToSave = [];

  if (window.multicastBands$) {
//    window.subscriptBands = window.multicastBands$.subscribe(data => {
//      setDataBands(bandsData => {
//        Object.values(bandsData).forEach((channel, index) => {
//            channel.datasets[0].data = [
//              data.delta[index],
//              data.theta[index],
//              data.alpha[index],
//              data.beta[index],
//              data.gamma[index]
//            ];
//            channel.xLabels = bandLabels;
//        });
//
//        return {
//          ch0: bandsData.ch0,
//          ch1: bandsData.ch1,
//          ch2: bandsData.ch2,
//          ch3: bandsData.ch3,
//          ch4: bandsData.ch4
//        };
//      });
//    });

    window.multicastBands$.connect();
    console.log("Subscribed to " + Settings.name);
  }


  //ppg
  console.log("Subscribing to PPG");
  if (window.multicastPPG$) {
    window.subscriptPPG = window.multicastPPG$.subscribe(data => {
//        setDataPpg(ppgData => {
//          Object.values(ppgData).forEach((channel, index) => {
//              channel.datasets[0].data = data.psd[index];
//              channel.xLabels = data.freqs;
//          });
//            console.log("GOT PPG");
//
//          return{
//            ch0: ppgData.ch0,
//            ch1: ppgData.ch1,
//            ch2: ppgData.ch2
//          };
//        });
      });

      window.multicastPPG$.connect();
      console.log("Subscribed to PPG");
  }

  //gyro
  if (window.multicastGyro$) {
      console.log("Subscribing to gyro");
        window.subscriptGyro = window.multicastGyro$.subscribe(data => {
      });

      window.multicastGyro$.connect();
      console.log("Subscribed to Gyro");
  }


  //accelerometer
  if (window.multicastAccelerometer$) {
      console.log("Subscribing to accelerometer");
        window.subscriptAccelerometer = window.multicastAccelerometer$.subscribe(data => {
      });

      window.multicastAccelerometer$.connect();
      console.log("Subscribed to Accelerometer");
  }

}

    //reset log after 1000 msec so events only in event file for 1 second
    if ((Date.now() - eventPress) > 1000) {
      eventNoteLog = 0;
    }


export function RenderModule(channels) {
  function RenderCharts() {
     const options = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.xAxes[0].scaleLabel,
              labelString: specificTranslations.xlabel
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.yAxes[0].scaleLabel,
              labelString: specificTranslations.ylabel
            },
            ticks: {
              min: 0,
              max: Math.max.apply(null, runningAlpha1) //max of alpha array to stay relatively stable
            }
          }
        ]
      },
      title: {
        ...generalOptions.title,
        text: 'Live Frontal Power by Frequency Band'
      },
      legend: {
        display: false
      }
    };
      
const options2 = {
      ...generalOptions,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.xAxes[0].scaleLabel,
              labelString: specificTranslations.xlabel
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              ...generalOptions.scales.yAxes[0].scaleLabel,
              labelString: specificTranslations.ylabel
            }
          }
        ]
      },
      animation: {
        duration: 0
      },
      title: {
        ...generalOptions.title,
        text: 'Running Alpha Power'
      },
      legend: {
        display: true
      }
    };  

  const options3 = {
        ...generalOptions,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                ...generalOptions.scales.xAxes[0].scaleLabel,
                labelString: 'Time (Seconds)'
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                ...generalOptions.scales.yAxes[0].scaleLabel,
                labelString: "Heart Rate (Beats Per Minute)"
              }
            }
          ]
        },
        animation: {
          duration: 0
        },
        title: {
          ...generalOptions.title,
          text: 'Heart Rate'
        },
        legend: {
          display: false
        }
      };     

    if (channels.dataBands.ch0.datasets[0].data ) {

        //reset log after 1000 msec so events only in event file for 1 second
        if ((Date.now() - eventPress) > 1000) {
          eventNoteLog = 0;
        }

        runningAlphaCount = runningAlphaCount + 1;
        //reset xlabels of graph
        if (runningAlphaCount === 1) {
          //firstTime = Date.now();
          xlabels.push(0);

        } else {

          xlabels.push((Date.now())/1000);

        }
        let runningLabels = JSON.parse(JSON.stringify(xlabels));

        runningAlpha0.push(channels.dataBands.ch0.datasets[0].data[2]);
        runningAlpha1.push(channels.dataBands.ch1.datasets[0].data[2]);
        runningAlpha2.push(channels.dataBands.ch2.datasets[0].data[2]);
        runningAlpha3.push(channels.dataBands.ch3.datasets[0].data[2]);


       let runningBandsOut = {
            datasets: [{
              label: channelNames[0],
              borderColor: 'rgba(217,95,2)',
              data: runningAlpha0,
              fill: false  
            }, {
              label: channelNames[1],
              borderColor: 'rgba(27,158,119)',
              data: runningAlpha1,
              fill: false              
            }, {
              label: channelNames[2],
              borderColor: 'rgba(117,112,179)',
              data: runningAlpha2,
              fill: false      
            }, {
              label: channelNames[3],
              borderColor: 'rgba(231,41,138)',
              data: runningAlpha3,
              fill: false      
            }],
            xLabels: runningLabels
          } 

        // -- bands chart

        let bandsData = JSON.parse(JSON.stringify(channels.dataBands.ch1.datasets[0].data))      
        let bandsLabel = JSON.parse(JSON.stringify(channels.dataBands.ch1.xLabels))    
          
        let bandsOut = {
          datasets: [{
            label: "Brain Waves",
            backgroundColor: 'rgba(3,152,158)',
            data: bandsData,
            fill: false  
          }],
          xLabels: bandsLabel            
        }

        // - PPG chart

        if (channels.dataPPG.ch0.datasets[0].data) {

          const thisData = JSON.parse(JSON.stringify(channels.dataPPG.ch0.datasets[0].data));
          const max = thisData.reduce(
                                    function(a, b) { 
                                      return Math.max(a, b)
                                    }, 
                                    -Infinity);
          const idx = thisData.indexOf(max);
          const maxfreq = channels.dataPPG.ch0.xLabels[idx];
          currentHR = maxfreq * 60;
          runningHR.push(currentHR);

          runningHRCount = runningHRCount + 1;
          //reset xlabels of graph
          if (runningHRCount === 1) {
            //firstTimeHR = Date.now();
            xlabelsHR.push(0);

          } else {

            xlabelsHR.push((Date.now())/1000);

          }
          let runningLabelsHR = JSON.parse(JSON.stringify(xlabelsHR));

          let ppgOut = {
              datasets: [{
                label: 'ch0',
                borderColor: 'rgba(217,95,2)',
                data: runningHR,
                fill: false  
              }],
              xLabels: runningLabelsHR
            } 

          return (
            <React.Fragment>

              <Card.Section key={"Card_" + 4}>
                <Line key={"Line_" + 1} data={runningBandsOut} options={options2} />
              </Card.Section>        
              <Card.Section key={"Card_" + 3}>
                <Bar key={"Bar_" + 3} data={bandsOut} options={options} />
              </Card.Section>
              <Card.Section key={"Card_" + 1}>
                <Line key={"Bar_" + 1} data={ppgOut} options={options3} />
              </Card.Section>
             </React.Fragment>


          );


        } else {
                    return (
            <React.Fragment>
                  <Card.Section key={"Card_" + 4}>
                    <Line key={"Line_" + 1} data={runningBandsOut} options={options2} />
                  </Card.Section>        
                  <Card.Section key={"Card_" + 3}>
                    <Bar key={"Bar_" + 3} data={bandsOut} options={options} />
                  </Card.Section>
             </React.Fragment>
          );

        }
    } else {
      return( 
        <Card.Section>
            <TextContainer>
                <p> {[
                "Loading..."  
                ]} 
                </p>
            </TextContainer>   
        </Card.Section>  
      )
    }
  }

  return (
    <Card>
      <Card.Section>
        <div style={chartStyles.wrapperStyle.style}>{RenderCharts()}</div>
      </Card.Section>
    </Card>
  );
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


export function RenderRecord(render, setData, recordPopChange, recordPop, status, Settings, setSettings, endRecording, dataCallback) {
  const [eventNotes, setEventNotes] = useState('e.g. Clenching hands');
  const [customLogLive, setCustomLogLive] = useState(false);
  const [endingSessionPrompt, setEndingSessionPrompt] = useState(false);
  const [threeMinuteRecording, setThreeMinuteRecording] = useState(false);
  const [threeMinuteTimer, setThreeMinuteTimer] = useState(180); // 3 minutes = 180 seconds
  const [threeMinuteInterval, setThreeMinuteInterval] = useState(null);
  const handlerEventNotesChange = useCallback((newValue) => setEventNotes(newValue), []);

  // Function to start 3-minute recording
  const startThreeMinuteRecording = () => {
    setThreeMinuteRecording(true);
    setThreeMinuteTimer(180);
    
    // Log start flag
    var thisEventTime = xlabels[xlabels.length - 1];
    eventLog.push(thisEventTime);
    saveDataToCsv(['3MIN_RECORDING_START'], eventType, eventColStart, eventColNum);
    createNotification("info", "3-Minute Recording Started", "Timer started");
    
    // Start interval for timer countdown and second ticks
    const interval = setInterval(() => {
      setThreeMinuteTimer((prevTimer) => {
        const newTimer = prevTimer - 1;
        
        // Log tick every second
        var currentEventTime = xlabels[xlabels.length - 1];
        eventLog.push(currentEventTime);
        saveDataToCsv([`3MIN_TICK_${180 - newTimer}`], eventType, eventColStart, eventColNum);
        
        // Check if timer reached 0
        if (newTimer <= 0) {
          // Log end flag
          var endEventTime = xlabels[xlabels.length - 1];
          eventLog.push(endEventTime);
          saveDataToCsv(['3MIN_RECORDING_END'], eventType, eventColStart, eventColNum);
          
          setThreeMinuteRecording(false);
          createNotification("success", "3-Minute Recording Completed", "Recording finished");
          clearInterval(interval);
          setThreeMinuteInterval(null);
          return 180; // Reset timer
        }
        
        return newTimer;
      });
    }, 1000);
    
    setThreeMinuteInterval(interval);
  };

  // Function to stop 3-minute recording
  const stopThreeMinuteRecording = () => {
    if (threeMinuteInterval) {
      clearInterval(threeMinuteInterval);
      setThreeMinuteInterval(null);
    }
    
    // Log end flag
    var thisEventTime = xlabels[xlabels.length - 1];
    eventLog.push(thisEventTime);
    saveDataToCsv(['3MIN_RECORDING_END_MANUAL'], eventType, eventColStart, eventColNum);
    
    setThreeMinuteRecording(false);
    setThreeMinuteTimer(180);
    createNotification("warning", "3-Minute Recording Stopped", "Recording stopped manually");
  };

  // Format timer display (MM:SS)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  var recordingText = 'Start Session'

  function createNotification(type, title, message){
      switch (type) {
        case 'info':
          NotificationManager.info(title, message);
          break;
        case 'success':
          NotificationManager.success(title, message);
          break;
        case 'warning':
          NotificationManager.warning(title, message);
          break;
        case 'error':
          NotificationManager.error(title, message);
          break;
         default:
            break
      }
  };

    function renderGridPrompt(){
        return (
        <Grid
          container
          spacing={2}
          direction={'row'}
          justify={'center'}
          alignItems={'center'}
          visible={endingSessionPrompt}
        >
          <h4>Are you sure you want to end the session?</h4>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEndingSessionPrompt(false);
                }}
                primary={recordPop}
              >
                {'No, Continue Session'}
              </Button>
              </Grid>

          <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  createNotification("warning", "Ending Session", null)
                  stopTheRecording = true;
                  recordPopChange();
                  endRecording(dataToSave);
                }}
                primary={recordPop}
              >
                {'Yes, End Session'}
              </Button>
              </Grid>
          </Grid>
        )
    }

 if (render === true){
  return (
    <Card title={'Session Interface'} sectioned>
        <Grid
          container
          spacing={1}
          direction={'row'}
          justify={'left'}
          alignItems={'center'}
        >
          <Grid item>
              <GreenButton
                variant="contained"
                color="primary"
                onClick={() => {
                  createNotification("success", "Pressed Start Session", null);
                  runningAlpha0 = [];
                  runningAlpha1 = [];
                  runningAlpha2 = [];
                  runningAlpha3 = [];
                  runningAlphaCount = 0;
                  runningHRCount = 0;
                  runningHR = [];
                  xlabels = [];
                  xlabelsHR = [];
                  stopTheRecording = false;
                  recordPopChange();
                  buildCSV(Settings);
                }}
                primary={status !== generalTranslations.connect}
                disabled={endingSessionPrompt || status !== generalTranslations.connected || recordPop || customLogLive || threeMinuteRecording}
              > 
                {recordingText}  
              </GreenButton>
          </Grid>
          <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  createNotification("warning", "Pressed End Session", null)
                    setEndingSessionPrompt(true);
                }}
                primary={recordPop}
                disabled={endingSessionPrompt || status !== generalTranslations.connected || !recordPop || customLogLive || threeMinuteRecording}
              >
                {'End Session'}
              </Button>
              </Grid>
          </Grid>


      {endingSessionPrompt ? renderGridPrompt() : null}

            <br />

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
                onClick={() => {
                  var thisEventTime = xlabels[xlabels.length - 1];
                  eventLog.push(thisEventTime)
                  eventNoteLog = 'LOSS OF CONSCIOUSNESS';
                  createNotification("info", "Pressed Button...", eventNoteLog);
                  eventPress = Date.now();
                  saveDataToCsv([eventNoteLog], eventType, eventColStart, eventColNum)
        
                }}
                primary={status !== generalTranslations.connect}
                disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
              > 
                {'LOSS OF CONSCIOUSNESS'}  
              </Button>
          </Grid>
          <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  var thisEventTime = xlabels[xlabels.length - 1];
                  eventLog.push(thisEventTime)
                  eventNoteLog = 'RE-GAIN CONSCIOUSNESS';
                  createNotification("info", "Pressed Button...", eventNoteLog);
                  eventPress = Date.now();
                  saveDataToCsv([eventNoteLog], eventType, eventColStart, eventColNum)
        
                }}
                primary={status !== generalTranslations.connect}
                disabled={endingSessionPrompt || endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
              > 
                {'RE-GAIN CONSCIOUSNESS'}  
              </Button>
          </Grid>
          <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  var thisEventTime = xlabels[xlabels.length - 1];
                  eventLog.push(thisEventTime)
                  eventNoteLog = 'EYES OPEN';
                  createNotification("info", "Pressed Button...", eventNoteLog);
                  eventPress = Date.now();
                  saveDataToCsv([eventNoteLog], eventType, eventColStart, eventColNum)
        
                }}
                primary={status !== generalTranslations.connect}
                disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
              > 
                {'EYES OPEN'}  
              </Button>
          </Grid>
          <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  var thisEventTime = xlabels[xlabels.length - 1];
                  eventLog.push(thisEventTime)
                  eventNoteLog = 'EYES CLOSED';
                  createNotification("info", "Pressed Button...", eventNoteLog);
                  eventPress = Date.now();
                  saveDataToCsv([eventNoteLog], eventType, eventColStart, eventColNum)
        
                }}
                primary={status !== generalTranslations.connect}
                disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
              > 
                {'EYES CLOSED'}  
              </Button>
          </Grid>

   

          </Grid>

          <br />

          
        <Button
            color="primary"
            variant="contained"
            onClick={() => {
              var thisEventTime = xlabels[xlabels.length - 1];
              eventLog.push(thisEventTime)
              createNotification("info", "Pressed Button...", eventNoteLog);
              eventPress = Date.now();
              setCustomLogLive(true);
            }}
            primary={status !== generalTranslations.connect}
            disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
          > 
            {'Log Custom Event'}  
          </Button>
          
      <br />
      <h4>Custom Event Note:</h4>
      <Grid
              container
              spacing={1}
              direction={'row'}
              justify={'left'}
              alignItems={'center'}
            >

          <Grid item>
            <TextField value={eventNotes} onChange={handlerEventNotesChange} disabled={!customLogLive}/>
          </Grid>
          <Grid item alignItems={'center'}>
            <GreenButton
                color="primary"
                variant="contained"
                disabled={!customLogLive}
                onClick={() => {
                  eventNoteLog = eventNotes;
                  createNotification("info", "Submitted Custom Log...", eventNoteLog);
                  saveDataToCsv([eventNoteLog], eventType, eventColStart, eventColNum)
                  setCustomLogLive(false);
                }}
                primary={status !== generalTranslations.connect}
              > 
                {'Submit Custom Log'}  
              </GreenButton>
          </Grid>
      </Grid>

      <br />
      <br />

      {/* 3-Minute Recording Section */}
      <h4>3-Minute Data Recording:</h4>
      <Grid
        container
        spacing={1}
        direction={'row'}
        justify={'left'}
        alignItems={'center'}
      >
        <Grid item>
          <PurpleButton
            color="primary"
            variant="contained"
            onClick={startThreeMinuteRecording}
            disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive || threeMinuteRecording}
          > 
            {'Start 3-Minute Recording'}  
          </PurpleButton>
        </Grid>
        
        {threeMinuteRecording && (
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={stopThreeMinuteRecording}
              disabled={endingSessionPrompt || status === generalTranslations.connect || !recordPop || customLogLive}
            > 
              {'Stop 3-Minute Recording'}  
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Timer Display */}
      {threeMinuteRecording && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h2 style={{ 
            color: '#aa00ff', 
            margin: '0', 
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            {formatTimer(threeMinuteTimer)}
          </h2>
          <p style={{ 
            margin: '5px 0 0 0', 
            color: '#666',
            fontSize: '1.1rem'
          }}>
            3-Minute Recording in Progress
          </p>
        </div>
      )}

    </Card>
  );
 } else{
     return null;
 }
}

function buildCSVHeader(Settings){
    eegColNum = ((Settings.srate / 2) / (Settings.srate / Settings.bins)) * 5; //*5 for 5 electrodes
    gyroColStart = 2;
    accelColStart = 5;
    ppgColStart = 8;
    eventColStart = 11;
    eegColStart = 12;
    totalColNum = gyroColNum + accelColNum + ppgColNum + eventColNum + eegColNum + metaColNum;
    dataToSave.push( //if you change this, you must change constants in this function and constants at top of file
      "type,", //specify the type of the row
      "timestamp,",
      "gyroX,gyroY,gyroZ,", 
      "accelerometerX,accelerometerY,accelerometerZ,", 
      "ppg1_ambient,ppg2_infrared,ppg3_red,", 
      "event,",
       ); 

    //get the frequency bin centers
    var fftResolution = (Settings.srate / Settings.bins)
    var fftFreqs = [];

    //note - these variables needs to match the n and chunk variables below. This should be cleaned up to use a single function in the future
    var n = 30;
    var chunk = 4;
    var nl = (Settings.srate/2);
    for (var i = 0; (fftResolution * i) < nl; i++) { //keep going until hit Nyquist limit - there are others ways to get this number too
       var freq = fftResolution * i;
       console.log("Freq now is: " + freq);
       if (freq <= n){
           fftFreqs.push(freq);
       } else {
           var avgFreq = 0;
           var chunkSize;
           for (chunkSize = 0; chunkSize < chunk; chunkSize++){ //find the average frequency of this bin
               var thisFreq = fftResolution * (i+chunkSize);
               if (thisFreq < nl){
                   avgFreq = avgFreq + thisFreq;
               } else {
                   break;
               }
           }
           avgFreq = avgFreq / (chunkSize);
           fftFreqs.push(avgFreq + "_" + chunkSize + "bins");
           i = i + (chunk - 1); //increase i to skip the next `chunk` items
       }
    }

    //go through all electrodes and all frequency bins and save them to the header
    var eegOrder = ["e1", "e2", "e3", "e4", "e5_aux"];
    eegOrder.forEach((electrode, idx) => {
        fftFreqs.forEach((freq, freqIdx) => {
            dataToSave.push(electrode + "_" + freq + ",");
        });
    });
   
    //remove last "," that should not be there
    dataToSave[dataToSave.length - 1] = dataToSave[dataToSave.length - 1].slice(0,-1)

    //end header
    dataToSave.push("\n");
}

function makeMetaCol(type){
    var metaRow = type + "," + Date.now()/1000 + ",";
    return metaRow;
}

function saveDataToCsv(data, dataType, dataColStart, dataColNum){
    var dataRow = makeMetaCol(dataType);
    dataRow = dataRow + ",".repeat(totalColNum - metaColNum - (totalColNum - dataColStart)); // add commas for empty columns before our data starts
    dataRow = dataRow + Object.values(data).join(","); //push the data
    dataRow = dataRow + ",".repeat(totalColNum - dataColStart - dataColNum); // add commas for empty columns after our data
    dataRow = dataRow + "\n"; //add new line to end to start next row of CSV
    dataToSave.push(dataRow);
}

function buildCSV(Settings) {
  console.log('Saving ' + Settings.minutesToSave + ' minutes...');
  var localEegObservable$ = null;
  var localPpgObservable$ = null;
  var localGyroObservable$ = null;
  var localAccelerometerObservable$ = null;

  //var firstTime = 0;

  console.log('making ' + Settings.name + ' headers')

  buildCSVHeader(Settings);

  // put selected eeg observable object into local and start taking samples
  localEegObservable$ = window.multicastBands$.pipe(
    take(1)
  );

  // put selected ppg observable object into local and start taking samples
  localPpgObservable$ = window.multicastPPG$.pipe(
    take(1)
  );

  // put selected gyroscope observable object into local and start taking samples
  localGyroObservable$ = window.multicastGyro$.pipe(
    take(1)
  );

  // put selected accelerometer observable object into local and start taking samples
  localAccelerometerObservable$ = window.multicastAccelerometer$.pipe(
    take(1)
  );

  localEegObservable$.subscribe({
    next(x) {
      //firstTime = Date.now();
    }
  })

  // put selected observable object into local and start taking samples
  localEegObservable$ = window.multicastBands$.pipe(
    takeWhile(() => !stopTheRecording)
  );

  // put selected observable object into local and start taking samples
  localPpgObservable$ = window.multicastPPG$.pipe(
    takeWhile(() => !stopTheRecording)
  );

  // put selected observable object into local and start taking samples
  localGyroObservable$ = window.multicastGyro$.pipe(
    takeWhile(() => !stopTheRecording)
  );

  // put selected observable object into local and start taking samples
  localAccelerometerObservable$ = window.multicastAccelerometer$.pipe(
    takeWhile(() => !stopTheRecording)
  );

  // now with header in place subscribe to each epoch and log it
  localEegObservable$.subscribe({
    next(x) { 
       var data = x.psd;
        //now, we group together all of the bins above nHz
        var n = 30; //30 Hz cutoff for binning
        var chunk = 4; //how many bins to chunk together
        
        //get the frequency bin centers
        var fftResolution = (Settings.srate / Settings.bins)
        var dataChunked = [];
        for (var electrode = 0; electrode < data.length; electrode++){
            for (var i = 0; (fftResolution * i) < (Settings.srate/2); i++) { //keep going until hit Nyquist limit - there are others ways to get this number too
               var freq = fftResolution * i;
               console.log("Freq now is: " + freq);
               if (freq <= n){
                   console.log("No chunk, saving this: " + data[electrode][i]);
                   dataChunked.push(data[electrode][i]);
               } else {
                   console.log("Chunking this: " + data[electrode].slice(i, i+(chunk)));
                   var avgFreq = 0;
                   for (var j = 0; j < chunk; j++){ //find the average frequency of this bin
                       avgFreq = avgFreq + fftResolution * (i+j);
                   }
                   avgFreq = avgFreq / chunk;
                   console.log("Average frequency of this bin: " + avgFreq);
                   var powerSum = data[electrode].slice(i, i+(chunk)).reduce((partialSum, a) => partialSum + a, 0);
                   console.log("Power sum of this bin: " + powerSum);
                   i = i + (chunk - 1); //increase i to skip the next `chunk` items
                   dataChunked.push(powerSum);
               }
            }
        }
        console.log("DATA CHUNKED:");
        console.log(dataChunked);

       saveDataToCsv(dataChunked, eegType, eegColStart, eegColNum);
       eventNoteLog = 0;
    },
    error(err) { console.log(err); },
    complete() { 
        console.log("Stream ended, done building CSV.");
            }
  });

  // now with header in place subscribe to each ppg sample and log it
  var ppg1, ppg2, ppg3;
  localPpgObservable$.subscribe({
    next(x) { 
        for (var i = 0; i < x.data[0].length; i++){
            ppg1 = x.data[0][i];
            ppg2 = x.data[1][i];
            ppg3 = x.data[2][i];
            saveDataToCsv([ppg1, ppg2, ppg3], ppgType, ppgColStart, ppgColNum);
        }

    },
    error(err) { console.log(err); },
    complete() { 
        console.log("Stream ended, done building CSV.");
            }
  });

  // now with header in place subscribe to each gyro sample and log it
  var gyroX, gyroY, gyroZ;
  localGyroObservable$.subscribe({
    next(x) { 
        for (var i = 0; i < 3; i++){
            gyroX = x["samples"][i]['x']
            gyroY = x["samples"][i]['y']
            gyroZ = x["samples"][i]['z']
            saveDataToCsv([gyroX, gyroY, gyroZ], gyroType, gyroColStart, gyroColNum);
        }
    },
    error(err) { console.log(err); },
    complete() { 
        console.log("Stream ended, done building CSV.");
            }
  });

  // now with header in place subscribe to each gyro sample and log it
  var accelX, accelY, accelZ;
  localAccelerometerObservable$.subscribe({
    next(x) { 
        for (var i = 0; i < 3; i++){
            accelX = x["samples"][i]['x']
            accelY = x["samples"][i]['y']
            accelZ = x["samples"][i]['z']
            saveDataToCsv([accelX, accelY, accelZ], accelType, accelColStart, accelColNum);
        }
    },
    error(err) { console.log(err); },
    complete() { 
        console.log("Stream ended, done building CSV.");
            }
  });



}


