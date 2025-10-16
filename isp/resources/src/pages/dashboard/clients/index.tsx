//@ts-ignore
import DashboardLayout from "@/layouts/Dashboard"
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
    Typography,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputAdornment,
    Drawer,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Avatar,
    Stack,
    Tooltip,
    Fab,
    useTheme,
    alpha
} from '@mui/material'

import {
    Search,
    FilterList,
    GridView,
    ViewList,
    PersonAdd,
    Close,
    Visibility,
    VisibilityOff,
    Delete,
    Edit,
    CreditCard,
    Router,
    CalendarToday,
    Person,
    Key,
    Schedule,
    Warning,
    CheckCircle,
    Error,
    HourglassEmpty
} from '@mui/icons-material';

import React, {useEffect, useState} from "react";
import {api} from "@/utils/api";
import AsyncSelect from "@/components/@extended/AsyncSelect";
import CreatePackage from "@/components/ui/CreatePackage";
import {Modal} from "@/utils/shortcuts";
import CreateClient from "@/components/ui/CreateClient";
import client from "@/api/controllers/client-controller";

type SortType = "newest" | "oldest" | "name";

function compareClients(sortType: SortType, first: any, second: any): number {
    if (sortType === "newest") {
        return new Date(second.dateJoined).getTime() - new Date(first.dateJoined).getTime();
    } else if (sortType === "oldest") {
        return new Date(first.dateJoined).getTime() - new Date(second.dateJoined).getTime();
    } else if (sortType === "name") {
        return first.fullName.localeCompare(second.fullName);
    }
    return 0;
}

interface Package {
    id: number;
    name: string;
    speed: string;
    duration: string;
}

interface Client {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    package: {
        id: number;
        name: string;
        speed: string;
        duration: string;
        type: string;
        price: string;
    };
    status: string;
    dateJoined: string;
    lastPayment: string;
    avatar: string;
    dueAmount: number;
    router_username: string;
    router_password: string;
    created_at: string;
    due: string;
    package_start: string;
}

function ClientsPage() {
    const theme = useTheme();
    const [sort, setSort] = useState("newest");
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [view, setView] = useState("grid");
    const [passwordVisibility, setPasswordVisibility] = useState<{ [key: number]: boolean }>({});
    const [isDeletingClient, setIsDeletingClient] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<{ id: number, phone: string } | null>(null);

    const [filters, setFilters] = useState({
        status: "all",
        package: "all",
        dateJoined: "all"
    });

    const togglePasswordVisibility = (clientId: number) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [clientId]: !prev[clientId]
        }));
    };

    const handleDeleteClient = (client: { id: number, phone: string }) => {
        setClientToDelete(client);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;

        setIsDeletingClient(clientToDelete.id);
        try {
            await api.post({
                route: '/api/clients/delete/',
                data: {
                    id: clientToDelete.id,
                    username: clients.find(c => c.id === clientToDelete.id)?.router_username || ""
                }
            });

            setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Failed to delete client:", error);
            alert("Failed to delete client. Please try again.");
        } finally {
            setIsDeletingClient(null);
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const res = await client.forUser();
                const formattedClients = res.map((user: any) => ({
                    id: user.id,
                    fullName: user.full_name,
                    email: user.primary_email || "",
                    phone: user.primary_phone || "",
                    address: user.address || "",
                    status: determineStatus(user),
                    dateJoined: user.created_at,
                    lastPayment: user.package_start || user.created_at,
                    avatar: "/api/placeholder/40/40",
                    dueAmount: calculateDueAmount(user),
                    created_at: user.created_at,
                    due: user.due,
                    package_start: user.package_start,
                    router_username: user.router_username,
                    router_password: user.router_password,
                    package: user.package
                }));
                setClients(formattedClients);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const determineStatus = (user: any) => {
        const dueDate = new Date(user.due);
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        if (dueDate < now) {
            return "overdue";
        } else if (dueDate < sevenDaysFromNow) {
            return "warning";
        }
        return "active";
    };

    const calculateDueAmount = (user: any) => {
        if (determineStatus(user) === "overdue") {
            return parseFloat(user.package?.price || "0");
        }
        return 0;
    };

    const getStatusChip = (status: string) => {
        const statusConfig = {
            active: {
                color: 'success' as const,
                icon: <CheckCircle sx={{ fontSize: 14 }} />,
                label: 'Active'
            },
            inactive: {
                color: 'default' as const,
                icon: <HourglassEmpty sx={{ fontSize: 14 }} />,
                label: 'Inactive'
            },
            overdue: {
                color: 'error' as const,
                icon: <Error sx={{ fontSize: 14 }} />,
                label: 'Payment Overdue'
            },
            warning: {
                color: 'warning' as const,
                icon: <Warning sx={{ fontSize: 14 }} />,
                label: 'Payment Due Soon'
            }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                size="small"
                variant="filled"
                sx={{
                    fontWeight: 600,
                    minWidth: 120,
                    '& .MuiChip-icon': {
                        fontSize: 14
                    }
                }}
            />
        );
    };

    const filteredClients = clients.filter((client) => {
        const matchesSearch =
            client.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);

        const matchesStatusFilter = filters.status === "all" || client.status === filters.status;
        const matchesPackageFilter = filters.package === "all" || client.package?.name === filters.package;

        return matchesSearch && matchesStatusFilter && matchesPackageFilter;
    });

    const sortedClients = [...filteredClients].sort((a, b) => compareClients(sort as SortType, a, b));
    const uniquePackages = [...new Set(clients.map((c) => c.package?.name))].filter(Boolean);

    const renderGridView = () => (
        <Grid container spacing={2}>
            {sortedClients.map((client) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
                    <Card
                        elevation={2}
                        sx={{
                            height: '100%',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                elevation: 8,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                        }}
                    >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                >
                                    {client.fullName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {client.fullName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: '0.8rem' }}
                                    >
                                        {client.phone}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={1.5} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Router sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        {client.package?.name} - {client.package?.speed}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Schedule sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        {client.package?.duration}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        {client.router_username}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <Key sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                            {passwordVisibility[client.id] ? client.router_password : '••••••••'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => togglePasswordVisibility(client.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        {passwordVisibility[client.id] ?
                                            <VisibilityOff sx={{ fontSize: 16 }} /> :
                                            <Visibility sx={{ fontSize: 16 }} />
                                        }
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        Expires: {new Date(client.due).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                {getStatusChip(client.status)}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {client.dueAmount > 0 && (
                                        <Typography variant="body2" color="error" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                            ${client.dueAmount} due
                                        </Typography>
                                    )}
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClient({id: client.id, phone: client.phone})}
                                        disabled={isDeletingClient === client.id}
                                    >
                                        {isDeletingClient === client.id ?
                                            <CircularProgress size={16} /> :
                                            <Delete sx={{ fontSize: 16 }} />
                                        }
                                    </IconButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderListView = () => (
        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Client</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main', display: { xs: 'none', md: 'table-cell' } }}>Package</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main', display: { xs: 'none', lg: 'table-cell' } }}>Credentials</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedClients.map((client) => (
                        <TableRow
                            key={client.id}
                            hover
                            sx={{
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                                },
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            mr: 2,
                                            bgcolor: 'primary.main',
                                            fontSize: '0.875rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {client.fullName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                            {client.fullName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {client.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                    {client.package?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {client.package?.speed} - {client.package?.duration}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    User: {client.router_username}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Pass: {passwordVisibility[client.id] ? client.router_password : '••••••••'}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => togglePasswordVisibility(client.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        {passwordVisibility[client.id] ?
                                            <VisibilityOff sx={{ fontSize: 14 }} /> :
                                            <Visibility sx={{ fontSize: 14 }} />
                                        }
                                    </IconButton>
                                </Box>
                            </TableCell>

                            <TableCell>
                                {getStatusChip(client.status)}
                                {client.dueAmount > 0 && (
                                    <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5, fontWeight: 600 }}>
                                        ${client.dueAmount} due
                                    </Typography>
                                )}
                            </TableCell>

                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Tooltip title="Edit">
                                        <IconButton size="small" color="primary">
                                            <Edit sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Payment">
                                        <IconButton size="small" color="info">
                                            <CreditCard sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClient({id: client.id, phone: client.phone})}
                                            disabled={isDeletingClient === client.id}
                                        >
                                            {isDeletingClient === client.id ?
                                                <CircularProgress size={16} /> :
                                                <Delete sx={{ fontSize: 16 }} />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderDeleteConfirmModal = () => (
        <Dialog
            open={showDeleteConfirm && !!clientToDelete}
            onClose={() => setShowDeleteConfirm(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                }
            }}
        >
            <DialogTitle sx={{ color: 'error.main', fontWeight: 600, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Error sx={{ mr: 1 }} />
                    Delete Client
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Are you sure you want to delete{' '}
                    <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {clientToDelete?.phone}
                    </Typography>
                    ? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
                <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outlined"
                    disabled={isDeletingClient === clientToDelete?.id}
                    sx={{ minWidth: 100 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={confirmDeleteClient}
                    variant="contained"
                    color="error"
                    disabled={isDeletingClient === clientToDelete?.id}
                    sx={{ minWidth: 120 }}
                >
                    {isDeletingClient === clientToDelete?.id ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }}/>
                            Deleting...
                        </>
                    ) : (
                        'Delete'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderFilterDrawer = () => (
    <Drawer
        anchor="right"
        open={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        PaperProps={{
            sx: {
                width: { xs: '100%', md: 420 },
            }
        }}
    >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
                sx={{
                    px:4,
                    py:2,
                    background: `black`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.1),
                        zIndex: 0
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.05),
                        zIndex: 0
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Filter & Sort
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Refine your client search
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setShowFilterDrawer(false)}
                        sx={{
                            color: 'white',
                            bgcolor: alpha('#fff', 0.2),
                            '&:hover': {
                                bgcolor: alpha('#fff', 0.3),
                                transform: 'rotate(90deg)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <Stack spacing={5}>
                    {/* Status Filter */}
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                                    mr: 2
                                }}
                            >
                                <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Client Status
                            </Typography>
                        </Box>

                        <RadioGroup
                            name="status"
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                            {[
                                { value: 'all', label: 'All Clients', icon: <Person />, color: 'primary' },
                                { value: 'active', label: 'Active', icon: <CheckCircle />, color: 'success' },
                                { value: 'inactive', label: 'Inactive', icon: <HourglassEmpty />, color: 'grey' },
                                { value: 'overdue', label: 'Payment Overdue', icon: <Error />, color: 'error' },
                                { value: 'warning', label: 'Payment Due Soon', icon: <Warning />, color: 'warning' }
                            ].map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={
                                        <Radio
                                            sx={{
                                                color: `${option.color}.main`,
                                                '&.Mui-checked': {
                                                    color: `${option.color}.main`
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                            <Box sx={{ mr: 2, color: `${option.color}.main` }}>
                                                {React.cloneElement(option.icon, { sx: { fontSize: 18 } })}
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {option.label}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        m: 0,
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        },
                                        ...(filters.status === option.value && {
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                        })
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Paper>

                    {/* Package Filter */}
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.secondary.main || theme.palette.primary.main} 30%, ${theme.palette.secondary.dark || theme.palette.primary.dark} 90%)`,
                                    mr: 2
                                }}
                            >
                                <Router sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Package Type
                            </Typography>
                        </Box>

                        <RadioGroup
                            name="package"
                            value={filters.package}
                            onChange={(e) => setFilters({...filters, package: e.target.value})}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                                            <Router sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            All Packages
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    m: 0,
                                    p: 1.5,
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                                    },
                                    ...(filters.package === "all" && {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                    })
                                }}
                            />
                            {uniquePackages.map((pkg, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={pkg}
                                    control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                            <Box sx={{ mr: 2, color: 'primary.main' }}>
                                                <Router sx={{ fontSize: 18 }} />
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {pkg}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        m: 0,
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        },
                                        ...(filters.package === pkg && {
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                        })
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Paper>

                    {/* Date Filter */}
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.info?.main || theme.palette.primary.main} 30%, ${theme.palette.info?.dark || theme.palette.primary.dark} 90%)`,
                                    mr: 2
                                }}
                            >
                                <CalendarToday sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Date Joined
                            </Typography>
                        </Box>

                        <RadioGroup
                            name="dateJoined"
                            value={filters.dateJoined}
                            onChange={(e) => setFilters({...filters, dateJoined: e.target.value})}
                        >
                            {[
                                { value: 'all', label: 'All Time' },
                                { value: 'month', label: 'This Month' },
                                { value: 'quarter', label: 'This Quarter' },
                                { value: 'year', label: 'This Year' }
                            ].map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                            <Box sx={{ mr: 2, color: 'primary.main' }}>
                                                <CalendarToday sx={{ fontSize: 18 }} />
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {option.label}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        m: 0,
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        },
                                        ...(filters.dateJoined === option.value && {
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                        })
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Paper>

                    {/* Sort Options */}
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.warning?.main || theme.palette.primary.main} 30%, ${theme.palette.warning?.dark || theme.palette.primary.dark} 90%)`,
                                    mr: 2
                                }}
                            >
                                <FilterList sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Sort Order
                            </Typography>
                        </Box>

                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    borderWidth: 2
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            <MenuItem value="newest">🕒 Newest First</MenuItem>
                            <MenuItem value="oldest">⏰ Oldest First</MenuItem>
                            <MenuItem value="name">🔤 Name (A-Z)</MenuItem>
                        </Select>
                    </Paper>
                </Stack>
            </Box>

            {/* Footer Actions */}
            <Box
                sx={{
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilters({
                                status: "all",
                                package: "all",
                                dateJoined: "all"
                            });
                            setSort("newest");
                        }}
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            py: 1.5,
                            borderWidth: 2,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: theme.palette.primary.dark,
                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                            }
                        }}
                    >
                        Reset All
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setShowFilterDrawer(false)}
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 600,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Apply Filters
                    </Button>
                </Stack>
            </Box>
        </Box>
    </Drawer>
);

    return (
        <>
            <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    mb: 1,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Clients Management
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                Manage your client accounts and subscriptions
                            </Typography>
                        </Box>

                        <Fab
                            color="primary"
                            onClick={() => Modal.addClient()}
                            className={"!bg-black"}
                        >
                            <PersonAdd />
                        </Fab>
                    </Box>
                </Box>

                {/* Controls */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {[
                                    { key: "all", label: "All", color: "primary" },
                                    { key: "active", label: "Active", color: "success" },
                                    { key: "overdue", label: "Overdue", color: "error" },
                                    { key: "warning", label: "Warning", color: "warning" }
                                ].map((status) => (
                                    <Chip
                                        key={status.key}
                                        label={status.label}
                                        variant={filters.status === status.key ? "filled" : "outlined"}
                                        color={status.color as any}
                                        clickable
                                        onClick={() => setFilters({...filters, status: status.key})}
                                        sx={{
                                            fontWeight: 600,
                                            minWidth: 80,
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() => setShowFilterDrawer(true)}
                                    startIcon={<FilterList />}
                                    sx={{ borderRadius: 6 }}
                                >
                                    More Filters
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <TextField
                                    size="small"
                                    placeholder="Search clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{
                                        minWidth: 250,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 6,
                                            '& fieldset': {
                                                borderColor: alpha(theme.palette.primary.main, 0.3)
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="primary" />
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
                                    <IconButton
                                        onClick={() => setView("grid")}
                                        sx={{
                                            bgcolor: view === "grid" ? 'primary.main' : 'transparent',
                                            color: view === "grid" ? 'white' : 'primary.main',
                                            borderRadius: 0,
                                            '&:hover': {
                                                bgcolor: view === "grid" ? 'primary.dark' : alpha(theme.palette.primary.main, 0.1)
                                            }
                                        }}
                                    >
                                        <GridView />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setView("list")}
                                        sx={{
                                            bgcolor: view === "list" ? 'primary.main' : 'transparent',
                                            color: view === "list" ? 'white' : 'primary.main',
                                            borderRadius: 0,
                                            '&:hover': {
                                                bgcolor: view === "list" ? 'primary.dark' : alpha(theme.palette.primary.main, 0.1)
                                            }
                                        }}
                                    >
                                        <ViewList />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Content */}
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} thickness={4} />
                    </Box>
                ) : sortedClients.length > 0 ? (
                    view === "grid" ? renderGridView() : renderListView()
                ) : (
                    <Paper
                        elevation={2}
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}
                    >
                        <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            No clients found
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {searchTerm
                                ? `No clients matching "${searchTerm}"`
                                : "No clients match the selected filters"}
                        </Typography>
                    </Paper>
                )}

                {renderFilterDrawer()}
                {renderDeleteConfirmModal()}
            </Box>
        </>
    );
}

export default function Page() {
    return (
        <ThemeCustomization>
            <DashboardLayout>
                <ClientsPage/>
            </DashboardLayout>
        </ThemeCustomization>
    )
}