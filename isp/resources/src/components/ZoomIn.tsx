import React, {useRef} from 'react';
import {Transition} from 'react-transition-group';
import {Dialog, DialogContent, useTheme} from "@mui/material";

// Mimic MUI's transition styles
const styles = {
    entering: {
        transform: 'none',
    },
    entered: {
        transform: 'none',
    }
};

// Utility function to create transitions (simplified MUI version)
//@ts-ignore
const createTransition = (theme, props, timeout, easing) => {
    const duration = typeof timeout === 'object' ? timeout.enter : timeout;
    const easingValue = easing || theme.transitions.easing.easeInOut;
    return `transform ${duration}ms ${easingValue}`;
};

// Utility function to force reflow
const reflow = (node: any) => node.scrollTop;

const ZoomIn = React.forwardRef(function ZoomTransition(props, ref) {
    const theme = useTheme();
    const defaultTimeout = {
        enter: theme.transitions.duration.enteringScreen, // typically 225ms
        exit: theme.transitions.duration.leavingScreen,   // typically 195ms
    };

    const {
        appear = true,
        children,
        easing,
        in: inProp,
        onEnter,
        onEntered,
        onEntering,
        onExit,
        onExited,
        onExiting,
        style,
        timeout = defaultTimeout,
        ...other
    } = props as any;

    const nodeRef = useRef(null);

    // Combine refs - handle both nodeRef and child ref
    const handleRef = (node: any) => {
        nodeRef.current = node;

        // Handle child ref
        if (children.ref) {
            if (typeof children.ref === 'function') {
                children.ref(node);
            } else {
                children.ref.current = node;
            }
        }

        // Handle forwarded ref
        if (ref) {
            if (typeof ref === 'function') {
                ref(node);
            } else {
                ref.current = node;
            }
        }
    };

    //@ts-ignore
    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
        if (callback) {
            const node = nodeRef.current;
            if (maybeIsAppearing === undefined) {
                callback(node);
            } else {
                callback(node, maybeIsAppearing);
            }
        }
    };

    const handleEntering = normalizedTransitionCallback(onEntering);
//@ts-ignore
    const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
        reflow(node); // Force reflow to ensure animation starts from beginning

        const transitionValue = createTransition(theme, {}, timeout, easing);
        node.style.webkitTransition = transitionValue;
        node.style.transition = transitionValue;

        if (onEnter) {
            onEnter(node, isAppearing);
        }
    });

    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);

    const handleExit = normalizedTransitionCallback((node: any) => {
        const exitTimeout = typeof timeout === 'object' ? timeout.exit : timeout;
        const transitionValue = createTransition(theme, {}, exitTimeout, easing);
        node.style.webkitTransition = transitionValue;
        node.style.transition = transitionValue;

        if (onExit) {
            onExit(node);
        }
    });

    const handleExited = normalizedTransitionCallback(onExited);

    return (
        <Transition
            appear={appear}
            in={inProp}
            nodeRef={nodeRef}
            onEnter={handleEnter}
            onEntered={handleEntered}
            onEntering={handleEntering}
            onExit={handleExit}
            onExited={handleExited}
            onExiting={handleExiting}
            timeout={timeout}
            {...other}
        >
            {(state) => {

                return React.cloneElement(children, {
                    style: {
                        transform: 'scale(1.1)',
                        visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
                        //@ts-ignore
                        ...styles[state], // Apply entering/entered styles (transform: 'none')
                        ...style, // Apply any custom styles
                        ...children.props.style // Preserve child's original styles
                    },
                    ref: handleRef
                });
            }}
        </Transition>
    );
});

export default ZoomIn;