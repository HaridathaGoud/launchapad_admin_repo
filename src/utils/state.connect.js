const { connect } = require("react-redux")

    const mapStateToProps = ({ walletAddress, projectDetailsReducer,oidc }) => {
    return { walletAddress,projectDetailsReducer,oidc }
}
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
const ConnectStateProps = connect(mapStateToProps, mapDispatchToProps);


export default ConnectStateProps;