import React, { useState } from "react";
import { Card } from "@shopify/polaris";

import {
  Grid,
  TextField,
  Button
} from '@material-ui/core';

const passwords = ["aaa"];

export function LoginPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
      event.preventDefault();
      console.log(password)
      if (passwords.includes(password)){
        props.handleLoginSuccess(); //tell our parent that we've successfully logged in
      }
    }

  return (
      <Card sectioned>
          <form onSubmit={handleLogin}>
            <Grid
              container
              spacing={3}
              direction={'column'}
              justify={'center'}
              alignItems={'center'}
            >
              <Grid item xs={12}>
                <h1>Login</h1>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Username" name="un" onChange={event => setUsername(event.target.value)} value={username}></TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Password" type={'password'} name="pw" onChange={event => setPassword(event.target.value)} value={password}></TextField>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleLogin} variant="contained" color="primary" type="submit"> Login </Button>
              </Grid>
            </Grid>
          </form>
      </Card>
  );
}

