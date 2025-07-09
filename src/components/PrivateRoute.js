import React from "react";
import { Navigate, useLocation  } from "react-router-dom";

//this allows us to have a conditional render based on a boolean, in this case whether or not a user is logged in. If they aren't logged in, we render the root. If they are, render the component that was passed in as props
export const PrivateRoute = ({dest, isLoggedIn}) => {
  const location = useLocation()

  return isLoggedIn ? (
    <>{dest}</>
  ) : (
    <Navigate
      replace={true}
      to="/"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}
