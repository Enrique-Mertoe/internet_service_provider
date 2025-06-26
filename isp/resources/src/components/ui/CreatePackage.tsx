import {
    Box, Button, CircularProgress,
    Collapse,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid, InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {api} from "@/utils/api";
import {useEffect, useState} from "react";
import {GradientCircularProgress} from "@/components/@extended/GradientCircularProgress";
import {TransitionGroup} from 'react-transition-group';
import pkgController from "@/api/controllers/package-controller";

export default function CreatePackage({onClose}: any) {
    const [user, setUser] = useState(null)
    const [newPackage, setNewPackage] = useState({
        name: '',
        description: '',
        package_type: '',
        billing_type: '',
        download_speed: '',
        upload_speed: '',
        data_limit: '',
        time_limit: '',
        price: '',
        setup_fee: '0',
        is_active: true,
        is_featured: false
    });
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);

    useEffect(() => {
        api.get({
            route: "API_USERS_ME",
            params: {format: "json"}
        }).then(({data, error}) => {
            if (error) {
                console.error("Failed to fetch user:", error);
                return;
            }
            console.log("user", data)
            if (data) {
                setUser(data)

            }
        });
    }, []);
    // Handle adding a new package
    const handleAddPackage = async () => {
        if (!newPackage.name || !newPackage.package_type || !newPackage.price) {
            alert("Name, Package Type, and Price are required fields.");
            return;
        }

        setIsLoadingAdd(true);
        try {
            const packageData = {
                ...newPackage,
                download_speed: parseInt(newPackage.download_speed) || 0,
                upload_speed: parseInt(newPackage.upload_speed) || 0,
                data_limit: newPackage.data_limit ? parseInt(newPackage.data_limit) : null,
                time_limit: newPackage.time_limit ? parseInt(newPackage.time_limit) : null,
                price: parseFloat(newPackage.price),
                setup_fee: parseFloat(newPackage.setup_fee) || 0
            };

            const response = await api.post({
                route: 'API_PACKAGE_LIST',
                params: {format: 'json'},
                data: packageData
            });

            if (response.data) {
                // setPackages(prev => [response.data, ...prev]);
                setNewPackage({
                    name: '',
                    description: '',
                    package_type: '',
                    billing_type: '',
                    download_speed: '',
                    upload_speed: '',
                    data_limit: '',
                    time_limit: '',
                    price: '',
                    setup_fee: '0',
                    is_active: true,
                    is_featured: false
                });
            }
        } catch (error) {
            console.error("Failed to add package:", error);
            alert("Failed to add package. Please try again.");
        } finally {
            setIsLoadingAdd(false);
            onClose(true)
        }
    };

    return (
        <TransitionGroup>
            {
                !user ?
                    <div className={"min-h-[200px] flex items-center justify-center"}>
                        <GradientCircularProgress/>
                    </div> :

                    <Collapse className={"min-h-[200px]"}>
                        <DialogTitle sx={{color: 'primary.main', fontWeight: 600}}>
                            Add New Package
                        </DialogTitle>


                        <DialogContent>
                            <Box component="form" sx={{mt: 2}}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Package Name"
                                            value={newPackage.name}
                                            onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Package Type</InputLabel>
                                            <Select
                                                value={newPackage.package_type}
                                                label="Package Type"
                                                onChange={(e) => setNewPackage({
                                                    ...newPackage,
                                                    package_type: e.target.value
                                                })}
                                            >
                                                <MenuItem value="hotspot">Hotspot</MenuItem>
                                                <MenuItem value="pppoe">PPPoE</MenuItem>
                                                <MenuItem value="fiber">Fiber</MenuItem>
                                                <MenuItem value="wireless">Wireless</MenuItem>
                                                <MenuItem value="corporate">Corporate</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={"grow"}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={newPackage.description}
                                            onChange={(e) => setNewPackage({
                                                ...newPackage,
                                                description: e.target.value
                                            })}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <FormControl fullWidth>
                                            <InputLabel>Billing Type</InputLabel>
                                            <Select
                                                value={newPackage.billing_type}
                                                label="Billing Type"
                                                onChange={(e) => setNewPackage({
                                                    ...newPackage,
                                                    billing_type: e.target.value
                                                })}
                                            >
                                                <MenuItem value="time_based">Time Based</MenuItem>
                                                <MenuItem value="data_based">Data Based</MenuItem>
                                                <MenuItem value="unlimited">Unlimited</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Price (KES)"
                                            type="number"
                                            value={newPackage.price}
                                            onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Download Speed"
                                            type="number"
                                            value={newPackage.download_speed}
                                            onChange={(e) => setNewPackage({
                                                ...newPackage,
                                                download_speed: e.target.value
                                            })}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">Mbps</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Upload Speed"
                                            type="number"
                                            value={newPackage.upload_speed}
                                            onChange={(e) => setNewPackage({
                                                ...newPackage,
                                                upload_speed: e.target.value
                                            })}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">Mbps</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Data Limit (Optional)"
                                            type="number"
                                            value={newPackage.data_limit}
                                            onChange={(e) => setNewPackage({...newPackage, data_limit: e.target.value})}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">GB</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Setup Fee"
                                            type="number"
                                            value={newPackage.setup_fee}
                                            onChange={(e) => setNewPackage({...newPackage, setup_fee: e.target.value})}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 3}}>
                            <Button
                                onClick={() => onClose()}
                                variant="outlined"
                                disabled={isLoadingAdd}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddPackage}
                                variant="contained"
                                disabled={isLoadingAdd}
                                sx={{minWidth: 120}}
                            >
                                {isLoadingAdd ? (
                                    <>
                                        <CircularProgress size={20} sx={{mr: 1, color: 'white'}}/>
                                        Saving...
                                    </>
                                ) : (
                                    'Add Package'
                                )}
                            </Button>
                        </DialogActions>
                    </Collapse>
            }
        </TransitionGroup>
    )
}
