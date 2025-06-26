import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {darken, lighten, styled} from '@mui/material';

interface Film {
    title: string;
    year: number;
}

const GroupHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
        backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
}));
const GroupItems = styled('ul')({
    padding: 0,
});
export default function AsyncSelect({onChange, sx, groupBy, label, fn}: any) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly Film[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        (async () => {
            setLoading(true);
            const data = await fn();
            setLoading(false);

            setOptions([...(data || [])]);
        })();
    };

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };
    // const optionsl = options.map((option) => {
    //     const firstLetter = option.title[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });

    return (
        <Autocomplete
            sx={sx}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            groupBy={groupBy}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            options={options}
            loading={loading}
            onChange={onChange}
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
