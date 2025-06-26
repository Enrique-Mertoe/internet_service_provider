import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export function GradientCircularProgress() {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00c853"/>
                        {/* Light/bright green */}
                        <stop offset="100%" stopColor="#1b5e20"/>
                        {/* Deep forest green */}
                    </linearGradient>
                </defs>
            </svg>

            <CircularProgress sx={{'svg circle': {stroke: 'url(#my_gradient)'}}}/>
        </React.Fragment>
    );
}