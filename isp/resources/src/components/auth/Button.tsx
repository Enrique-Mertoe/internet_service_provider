import React from "react";
import {styled} from "@mui/material/styles";
import {Button as Btn, CircularProgress} from "@mui/material";

const StyledButton = styled(Btn)(({theme}) => ({
    height: 48,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: theme.spacing(1.5),
    background: 'linear-gradient(135deg, #00A76F 0%, #007867 100%)',
    boxShadow: '0 4px 16px rgba(0, 167, 111, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #007867 0%, #005952 100%)',
        boxShadow: '0 6px 20px rgba(0, 167, 111, 0.4)',
        transform: 'translateY(-1px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
}));


const Button: React.FC<{ loading: boolean; label: string }> = ({loading: processing, label}) => {
    const [labelShow, labelLoad] = label.split("|")
    return (
        <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} color="inherit"/> : null}
        >
            {processing ? (labelLoad ?? 'Please wait...') : (labelShow)}
        </StyledButton>
    )
}

export default Button;