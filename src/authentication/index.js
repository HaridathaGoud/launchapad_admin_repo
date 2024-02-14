import { WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc'
const config = {
    authority: process.env.REACT_APP_AUTHORITY,
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: "id_token token",
    scope: "openid profile",
    silent_redirect_uri:process.env.REACT_APP_SILENT_REDIRECT_URI,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    silentRequestTimeout :30000,
}
const userManager = createUserManager(config);

export { userManager }