import React, { Component } from 'react';

class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus: false,
  };

  render() {
    
    return <>
    <div className="loader">Loading .....</div>
    </>
  }
}
const connectStateToProps = ({ userConfig, oidc }) => {
  return { userConfig: userConfig.userProfileInfo, user: oidc.user }
}

export default (connectStateToProps)(OnBoarding);