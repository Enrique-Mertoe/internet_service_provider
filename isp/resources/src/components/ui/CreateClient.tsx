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
        if (!newClient.fullName || !newClient.phone || !newClient.package) {
            alert("Full Name, Phone Number, and Package are mandatory fields.");
            return;
        }
        setISLoading(true);

        const clientData = {
            fullName: newClient.fullName,
            phone: newClient.phone,
            address: newClient.address,
            email: newClient.email,
            package: newClient.package,
            packageId: newClient.packageId,
            status: "action",
        };

        try {
            const response = await api.post({route: '/api/clients/create/', data: clientData});
            console.log("Client added successfully:", response.data);

            // if (response.data.client) {
            //     const user = response.data.client
            //     const formattedClient = {
            //         id: user.id,
            //         fullName: user.full_name,
            //         email: user.email || "",
            //         phone: user.phone,
            //         address: user.address || "",
            //         package: user.package,
            //         status: determineStatus(user),
            //         dateJoined: user.created_at,
            //         lastPayment: user.package_start || user.created_at,
            //         avatar: "/api/placeholder/40/40",
            //         dueAmount: calculateDueAmount(user),
            //         router_username: user.router_username,
            //         router_password: user.router_password,
            //         created_at: user.created_at,
            //         due: user.due,
            //         package_start: user.package_start
            //     };
            //     // setClients(formattedClient);
            //     setClients((prev) => [formattedClient, ...prev]);
            // }
            //
            // setShowAddModal(false);
            // setNewClient({
            //     fullName: "",
            //     email: "",
            //     phone: "",
            //     address: "",
            //     package: "",
            //     status: "active",
            //     packageId: null,
            // });
        } catch (error) {
            console.error("Failed to add client:", error);
            alert("Failed to add client. Please try again.");
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
                                        onChange={(e: any) => {
                                            const selectedPackage = clientsPackages.find(
                                                (pkg) => `${pkg.name} ${pkg.speed} ${pkg.duration}` === e.target.value
                                            );
                                            setNewClient({
                                                ...newClient,
                                                package: e.target.value,
                                                packageId: selectedPackage?.id || null,
                                            });
                                        }}
                                        fn={loadPackages}

                                        groupBy={(option:any) => option.package_type}
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