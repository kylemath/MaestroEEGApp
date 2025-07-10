import React, { useState } from "react";
import { saveAs } from 'file-saver';
import './index.css';
import { useNavigate } from 'react-router-dom';

import { createTheme } from '@material-ui/core';
import { ThemeProvider } from "@material-ui/styles";

import { PageSwitcher } from "../PageSwitcher/PageSwitcher";
import { LoginPage } from "../LoginPage";
import { AdditionalNotesPage } from "../AdditionalNotesPage";
import { SessionCompletePage } from "../SessionCompletePage";
import { PrivateRoute } from '../PrivateRoute'
import { PatientInfoPage } from "../PatientInfoPage";
import { AppProvider, Card, Page, Link } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  Routes,
  Route,
} from "react-router-dom";


import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// Import Bluetooth compatibility layer
import { initializeBluetoothCompat } from '../../utils/bluetoothCompat';

// Configuration: Set to false to disable remote upload temporarily
const ENABLE_REMOTE_UPLOAD = false;

const translations = {
  "title": "",
  "subtitle": [
    "MAESTRO provides you with real time feedback about your patient's brain state and biometrics during psychedelic assisted therapies. "

  ]
}

//material ui theme
const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF3333',
      darker: '#FF0000',
    },
    info: {
      main: '#000000',
      contrastText: '#000',
    },
  },
});

export function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate();

    //recorded data
    const [recordedData, setRecordedData] = useState('');

    //patient info
    const [patientId, setPatientId] = useState('');
    const [patientWeight, setPatientWeight] = useState('');
    const [patientMedication, setPatientMedication] = useState('');
    const [patientDosage, setPatientDosage] = useState('');
    const [patientTimeAdministered, setPatientTimeAdministered] = useState('');
    const [patientAddNotes, setPatientAddNotes] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [patientPostAddNotes, setPatientPostAddNotes] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientGender, setPatientGender] = useState('');

    // Initialize Bluetooth compatibility on app start
    React.useEffect(() => {
        initializeBluetoothCompat();
    }, []);

    function handleLoginSuccess() {
        setLoginStatus(true);
        navigate("/patient_info");
    }
    
    function submitPatientInfo(patiendId, patientWeight, patientMedication, patientDosage, patientTime, patientNotes, patientAge, patientGender) {
      setPatientId(patiendId);
      setPatientWeight(patientWeight);
      setPatientMedication(patientMedication);
      setPatientDosage(patientDosage);
      setPatientTimeAdministered(patientTime);
      setPatientAddNotes(patientNotes);
      setPatientAge(patientAge);
      setPatientGender(patientGender);

      navigate("/session");
    }

    function endSession(data) {
        setRecordedData(data);
        navigate("/additional_notes");
    }

    function addNotesSubmit(note) {
      //save the additional notes from after the recording
      setPatientPostAddNotes(note);

      //save the csv locally
      saveCSV(recordedData, patientId, patientWeight, patientMedication, patientDosage, patientTimeAdministered, patientAddNotes, patientAge, patientGender, note);
      navigate("/session_complete");
    }

    function newSession() {
      navigate("/patient_info");
    }

    //send csv to backend to be saved in the cloud
    function sendCsv(csvBlob, csvFileName) {
        var data = new FormData()
        data.append('file', csvBlob, csvFileName)

        fetch('https://data.entheosense.com/api/singleupload', {
          method: 'POST',
          body: data
        })
    }

    //saves the CSV, csvStringArray is an array of strings, each string is a row of values, comma seperated, the first row is the header. This just handles saving data, not formatting the csv
    function saveCSV(csvStringArray, patientID, weight, medication, dosage, dosageTime, addNotes, age, gender, postNotes){
        console.log('Trying to save CSV data.')

        //put the notes in line in the CSV
        csvStringArray.push("--- PRENOTE: " + addNotes + "\n");
        csvStringArray.push("--- POSTNOTE: " + postNotes + "\n");

          var blob = new Blob(
            csvStringArray, 
            {type: "text/plain;charset=utf-8"}
          );
        var csvFileName = "patientID%" + patientID + "_age%" + age + "_gender%" + gender + "_" +
                            "weight%" + weight + "_"+ 
                            "medication%" + medication + "_" +
                            "dosage%" + dosage + "_" +
                            "dosageTime%" + dosageTime + "_" +
                            "time%" + Date.now() + "_MAESTRORecording.csv";
        saveAs(blob, csvFileName);      
        console.log('Completed saving to CSV');

        if (ENABLE_REMOTE_UPLOAD) {
            sendCsv(blob, csvFileName);
            console.log('Completed sending CSV to cloud');
        } else {
            console.log('Remote upload disabled - CSV saved locally only');
        }
    }

  return (
      <div>
      <NotificationContainer />

  <ThemeProvider theme={theme}>
    <AppProvider i18n={enTranslations}>

      <div>
        <img 
              src={ require("./logo_horizontal.png")} 
              alt="MAESTROLogo"
              className="logo"
        ></img>  
      </div>
      <Page title={translations.title} subtitle={translations.subtitle}>
          <Routes>
              <Route path="/session" element={<PrivateRoute dest={<PageSwitcher endSession={endSession}/>} isLoggedIn={loginStatus}/>}/>
              <Route path="/patient_info" element={<PrivateRoute dest={<PatientInfoPage submitPatientInfo={submitPatientInfo}/>} isLoggedIn={loginStatus}/>}/>
              <Route path="/additional_notes" element={<PrivateRoute dest={<AdditionalNotesPage submit={addNotesSubmit}/>} isLoggedIn={loginStatus}/>}/>
              <Route path="/session_complete" element={<PrivateRoute dest={<SessionCompletePage newSession={newSession}/>} isLoggedIn={loginStatus}/>}/>
              <Route exact path="/" element={<LoginPage handleLoginSuccess={handleLoginSuccess}/>}> 
              </Route>
          </Routes>
        <Card style={{backgroundColor: "black"}} sectioned>
          <p>  
             {"MAESTRO - Real-time EEG Monitoring"}

             <br />
             <br />

            <Link url="#" external={false}> 
              {
                <img 
                    src={ require("./logo_vertical.png")} 
                    alt="MAESTROLogo"
                    width="20%"
                    height="auto">
                </img>  
              } 
            </Link> 
          </p>
        </Card>
      </Page>
    </AppProvider>
  </ThemeProvider>
      </div>
  );
}


