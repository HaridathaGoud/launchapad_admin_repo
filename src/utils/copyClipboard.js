import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from 'prop-types';

const UseCopyToClipboard = (props) => {
    const resetInterval = 1000;
    const [isCopied, setCopied] = useState(false);

    useEffect(() => {
        let timeout;
        if (isCopied && resetInterval) {
            timeout = setTimeout(() => setCopied(false), resetInterval);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [isCopied, resetInterval]);

    return (<>
        <div>
            <CopyToClipboard text={props?.address}
                options={{ format: 'text/plain' }}
                onCopy={() => setCopied(true)} >
                <span className={`${isCopied ? 'icon copied-check ms-1' : 'icon copy c-pointer ms-1'}`}></span>
            </CopyToClipboard>
        </div>
    </>)
}
UseCopyToClipboard.propTypes = {
    address: PropTypes.isRequired,
}
export default UseCopyToClipboard;
