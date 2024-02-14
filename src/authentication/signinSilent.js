import { useEffect } from "react"
import { processSilentRenew } from "redux-oidc";
const SignInSilent = () => {
    useEffect(() => {
       processSilentRenew();
    }, []);
    return <div>Loading...</div>;
}

export default SignInSilent;