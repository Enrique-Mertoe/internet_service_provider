//@ts-ignore
//@ts-ignore
import ThemeCustomization from "@/themes"
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material'


import React, {useEffect, useState} from "react";
import {api} from "@/utils/api";
import AsyncSelect from "@/components/@extended/AsyncSelect";
import {Add} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import CreatePackage from "@/components/ui/CreatePackage";
import {Modal} from "@/utils/shortcuts";
import {Client, Package} from "@/types/global";
import pkgController from "@/api/controllers/package-controller";
import client from "@/api/controllers/client-controller";
import { Alert, AlertTitle } from '@mui/material';


export default function CreateClient({onClose}: any) {
    const [newClient, setNewClient] = useState<{ package: string } & Partial<Client>>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        package: "",
        packageId: null,
        status: "active",
    });
    const [loading, setISLoading] = useState(false);
    const [clientsPackages, sCP] = useState<Package[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const loadPackages = async () => {
        const pkgs = () => pkgController.forUser()

        if (clientsPackages.length > 0) {
            pkgs().then(sCP)
            return clientsPackages.map(s => {
                //@ts-ignore
                s.title = s.name + " " + s.download_speed + "/" + s.upload_speed
                //@ts-ignore
                s.package_type = s.package_type?.toUpperCase()
                return s
            });
        }
        return (await pkgs()).map(s => {
            //@ts-ignore
            s.title = s.name + " " + s.download_speed + "/" + s.upload_speed;
            //@ts-ignore
            s.package_type = s.package_type?.toUpperCase()
            return s
        });

    }
    const handleAddClient = async () => {
        // Reset previous messages
        setError(null);
        setSuccess(null);

        // Validate required fields
        const validationErrors = [];
        if (!newClient.fullName) validationErrors.push("Full Name is required");
        if (!newClient.phone) validationErrors.push("Phone Number is required");
        if (!newClient.package) validationErrors.push("Package is required");

        // Email validation
        if (newClient.email && !/\S+@\S+\.\S+/.test(newClient.email)) {
            validationErrors.push("Email address is invalid");
        }

        if (validationErrors.length > 0) {
            setError(validationErrors.join(". "));
            return;
        }

        setISLoading(true);

        const clientData = {
            fullName: newClient.fullName,
            phone: newClient.phone,
            address: newClient.address,
            email: newClient.email,
            package: newClient.package, // Using package instead of packageId to match client-controller
            status: "active",
        };

        try {
            const {data, error} = await client.add(clientData);

            if (error) {
                console.error("Failed to add client:", error);

                // Display error message with proper formatting
                const errorMessage = error.message || "Failed to add client. Please try again.";
                setError(errorMessage.replace(/\n/g, ". "));
                return;
            }

            if (data) {
                console.log("Client added successfully:", data);
                setSuccess("Client added successfully!");

                // Reset form after successful submission
                setNewClient({
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    package: "",
                    status: "active",
                    packageId: null,
                });

                // Close modal after a short delay to show success message
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to add client:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setISLoading(false);
        }
    };
    return (
        <>
            <DialogTitle sx={{color: 'primary.main', fontWeight: 600}}>
                Add New Client
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error.includes(". ") ? (
                            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                {error.split(". ").filter(Boolean).map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        ) : (
                            error
                        )}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <AlertTitle>Success</AlertTitle>
                        {success}
                    </Alert>
                )}
                <Box component="form" sx={{mt: 2}}>
                    <Grid container spacing={2}>
                        <Grid size={"grow"}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={newClient.fullName}
                                onChange={(e) => setNewClient({...newClient, fullName: e.target.value})}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={newClient.email}
                                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Phone"
                                type="tel"
                                value={newClient.phone}
                                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={"grow"}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={newClient.address}
                                onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                                required
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid size={{xs: 12}}>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <AsyncSelect
                                        label="Package"
                                        onChange={(e: any, val: any) => {
                                            setNewClient({
                                                ...newClient,
                                                package: val?.id,
                                            });
                                        }}
                                        fn={loadPackages}
                                        groupBy={(option: any) => option.package_type}
                                    />
                                </div>
                                <Tooltip title="Click to add new package">
                                    <IconButton
                                        onClick={() => Modal.addPackage()}
                                        color={"primary"} size={"large"} aria-label="delete">
                                        <Add/>
                                    </IconButton>
                                </Tooltip>

                            </div>
                            {/*<FormControl className={"hidden"} fullWidth required>*/}
                            {/*    <InputLabel>Package</InputLabel>*/}

                            {/*    <Select*/}
                            {/*        className={"!hidden"}*/}
                            {/*        value={newClient.package}*/}
                            {/*        label="Package"*/}
                            {/*        onChange={(e) => {*/}
                            {/*            const selectedPackage = clientsPackages.find(*/}
                            {/*                (pkg) => `${pkg.name} ${pkg.speed} ${pkg.duration}` === e.target.value*/}
                            {/*            );*/}
                            {/*            setNewClient({*/}
                            {/*                ...newClient,*/}
                            {/*                package: e.target.value,*/}
                            {/*                packageId: selectedPackage?.id || null,*/}
                            {/*            });*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        {clientsPackages.length === 0 ? (*/}
                            {/*            <MenuItem value="" disabled>*/}
                            {/*                Loading packages...*/}
                            {/*            </MenuItem>*/}
                            {/*        ) : (*/}
                            {/*            clientsPackages.map((pkg, index) => (*/}
                            {/*                <MenuItem key={index}*/}
                            {/*                          value={`${pkg.name} ${pkg.speed} ${pkg.duration}`}>*/}
                            {/*                    {pkg.name} {pkg.speed} {pkg.duration}*/}
                            {/*                </MenuItem>*/}
                            {/*            ))*/}
                            {/*        )}*/}
                            {/*    </Select>*/}
                            {/*</FormControl>*/}
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 3}}>
                <Button
                    onClick={() => onClose()}
                    variant="outlined"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAddClient}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        minWidth: 120,
                        bgcolor: 'success.main',
                        '&:hover': {
                            bgcolor: 'success.dark'
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{mr: 1, color: 'white'}}/>
                            Saving...
                        </>
                    ) : (
                        'Add Client'
                    )}
                </Button>
            </DialogActions>
        </>
    )
}
