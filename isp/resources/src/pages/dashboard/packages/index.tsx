import DashboardLayout from "@/layouts/Dashboard"
import ThemeCustomization from "@/themes"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Box,
    CircularProgress,
    Chip,
    Card,
    CardContent,
    CardActions,
    InputAdornment
} from '@mui/material'

import {useState, useEffect, useRef} from "react";
import {api} from "@/utils/api";
import CreatePackage from "@/components/ui/CreatePackage";
import {Modal} from "@/utils/shortcuts";


function PackagesPage() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [_totalCount, setTotalCount] = useState({
        all: 0,
        pppoe: 0,
        hotspot: 0
    });


    const [packages, setPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [packageToDelete, setPackageToDelete] = useState<any | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<any | null>(null);

    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

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


    // Fetch packages on component mount
    useEffect(() => {
        fetchPackages();
    }, []);

    // Add this function to handle scroll events
    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        // If we're near the bottom (within 200px) and not already loading
        if (scrollHeight - scrollTop - clientHeight < 200 && !isLoading && !isLoadingMore && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };


    // Add this effect to handle the scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, isLoadingMore, hasMore]);

    // Add this effect to load more when page changes
    useEffect(() => {
        if (page > 1) {
            fetchPackages(page, searchTerm, activeFilter);
        }
    }, [page]);
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        // Reset pagination when searching
        setPage(1);

        // Debounce search to avoid too many requests
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchPackages(1, value, activeFilter, true);
        }, 500); // Wait 500ms after typing stops
    };

    const filteredPackages = packages.filter((pkg: any) => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "all" || pkg.package_type === activeFilter;
        return matchesSearch && matchesFilter;
    });
    // Update your filter change handler
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setPage(1); // Reset pagination when changing filters
        // fetchPackages will be called via the useEffect that watches activeFilter
    };
    // Replace your existing useEffect for fetching packages
    useEffect(() => {
        fetchPackages(1, searchTerm, activeFilter, true);
    }, [activeFilter]); // Only re-run when filter changes

    // Fetch packages using the proper API endpoint
    const fetchPackages = async (
        pageNum: number = 1,
        search: string = "",
        filter: string = "all",
        isInitial: boolean = false
    ) => {
        try {
            setIsLoading(isInitial);
            setIsLoadingMore(!isInitial);

            // Use the proper API endpoint from our routes
            const params: any = {};
            if (filter !== 'all') {
                params.type = filter;
            }
            if (search) {
                params.search = search;
            }

            const res = await api.get({
                route: 'API_PACKAGE_LIST',
                params: {
                    format: 'json',
                },
                data: params
            });

            console.log('Packages data:', res.data);

            if (res.data) {
                if (isInitial || pageNum === 1) {
                    setPackages(res.data.results || res.data);
                } else {
                    setPackages((prevPackages) => [...prevPackages, ...(res.data.results || res.data)]);
                }

                setTotalCount({
                    all: res.data.count || res.data.length || 0,
                    pppoe: res.data.results?.filter((p: any) => p.package_type === 'pppoe').length || 0,
                    hotspot: res.data.results?.filter((p: any) => p.package_type === 'hotspot').length || 0,
                });

                setHasMore((res.data.results || res.data).length > 0);
            }
        } catch (error) {
            console.error("Failed to fetch packages:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Handle editing a package
    const handleEditPackage = async () => {
        if (!editingPackage || !editingPackage.name || !editingPackage.package_type || !editingPackage.price) {
            alert("Name, Package Type, and Price are required fields.");
            return;
        }

        setIsLoadingEdit(true);
        try {
            const packageData = {
                ...editingPackage,
                download_speed: parseInt(editingPackage.download_speed) || 0,
                upload_speed: parseInt(editingPackage.upload_speed) || 0,
                data_limit: editingPackage.data_limit ? parseInt(editingPackage.data_limit) : null,
                time_limit: editingPackage.time_limit ? parseInt(editingPackage.time_limit) : null,
                price: parseFloat(editingPackage.price),
                setup_fee: parseFloat(editingPackage.setup_fee) || 0
            };

            const response = await api.put({
                route: 'API_PACKAGE_DETAIL',
                params: {pk: editingPackage.id, format: 'json'},
                data: packageData
            });

            if (response.data) {
                setPackages(prev => prev.map(p => p.id === editingPackage.id ? response.data : p));
                setShowEditModal(false);
                setEditingPackage(null);
            }
        } catch (error) {
            console.error("Failed to edit package:", error);
            alert("Failed to edit package. Please try again.");
        } finally {
            setIsLoadingEdit(false);
        }
    };

    // Handle deleting a package
    const handleDeletePackage = async () => {
        if (!packageToDelete) return;

        setIsLoadingDelete(true);
        try {
            await api.delete({
                route: 'API_PACKAGE_DETAIL',
                params: {pk: packageToDelete.id, format: 'json'}
            });

            setPackages(prev => prev.filter(p => p.id !== packageToDelete.id));
            setPackageToDelete(null);
        } catch (error) {
            console.error("Failed to delete package:", error);
            alert("Failed to delete package. Please try again.");
        } finally {
            setIsLoadingDelete(false);
        }
    };

    // Handle opening edit modal
    const openEditModal = (pkg: any) => {
        setEditingPackage({...pkg});
        setShowEditModal(true);
    };


    return (
        <>
            <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Packages</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage your internet service packages and pricing
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Button
                                variant="contained"
                                onClick={() => Modal.addPackage(ok => {
                                    if (ok)
                                        fetchPackages()
                                })}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    },
                                    px: 3,
                                    py: 1
                                }}
                                startIcon={<i className="bi bi-plus-circle"></i>}
                            >
                                Add Package
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleFilterChange("all")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                    activeFilter === "all"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleFilterChange("pppoe")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                    activeFilter === "pppoe"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                            >
                                PPPoE
                            </button>
                            <button
                                onClick={() => handleFilterChange("hotspot")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                    activeFilter === "hotspot"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                            >
                                Hotspot
                            </button>
                        </div>
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="bi bi-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="w-full p-2 pl-10 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Search packages..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Package Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                                <div className="flex justify-between items-center mt-6">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPackages.map((pkg: any) => (
                            <Card key={pkg.id} sx={{
                                borderTop: 4,
                                borderColor: 'primary.main',
                                '&:hover': {
                                    boxShadow: 6
                                },
                                transition: 'box-shadow 0.3s'
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Typography variant="h6" component="h3" sx={{fontWeight: 600}}>
                                            {pkg.name}
                                        </Typography>
                                        <Chip
                                            label={pkg.package_type?.toUpperCase() || 'Unknown'}
                                            color={pkg.package_type === 'pppoe' ? 'primary' : 'secondary'}
                                            size="small"
                                        />
                                    </Box>

                                    {pkg.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                            {pkg.description}
                                        </Typography>
                                    )}

                                    <Box sx={{mt: 2, '& > div': {mb: 1}}}>
                                        <Box display="flex" alignItems="center">
                                            <i className="bi bi-cash-coin" style={{marginRight: 8, color: '#666'}}></i>
                                            <Typography variant="body1" sx={{fontWeight: 600}}>
                                                ${pkg.price}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ml: 0.5}}>
                                                / month
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <i className="bi bi-speedometer2"
                                               style={{marginRight: 8, color: '#666'}}></i>
                                            <Typography variant="body2">
                                                {pkg.download_speed}Mbps ↓ / {pkg.upload_speed}Mbps ↑
                                            </Typography>
                                        </Box>
                                        {pkg.data_limit && (
                                            <Box display="flex" alignItems="center">
                                                <i className="bi bi-hdd" style={{marginRight: 8, color: '#666'}}></i>
                                                <Typography variant="body2">
                                                    {pkg.data_limit}GB limit
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box display="flex" alignItems="center">
                                            <i className="bi bi-people" style={{marginRight: 8, color: '#666'}}></i>
                                            <Typography variant="body2">
                                                {pkg.current_subscribers || 0} subscribers
                                            </Typography>
                                        </Box>
                                        {pkg.setup_fee > 0 && (
                                            <Box display="flex" alignItems="center">
                                                <i className="bi bi-gear" style={{marginRight: 8, color: '#666'}}></i>
                                                <Typography variant="body2">
                                                    ${pkg.setup_fee} setup fee
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions sx={{justifyContent: 'space-between', px: 2, pb: 2}}>
                                    <Button
                                        size="small"
                                        startIcon={<i className="bi bi-pencil-square"></i>}
                                        onClick={() => openEditModal(pkg)}
                                        sx={{color: 'primary.main'}}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<i className="bi bi-trash"></i>}
                                        onClick={() => setPackageToDelete(pkg)}
                                        sx={{color: 'error.main'}}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>


                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                            <i className="bi bi-search text-gray-500 dark:text-gray-400 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No packages found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm
                                ? `No packages matching "${searchTerm}"`
                                : "No packages match the selected filters"}
                        </p>
                    </div>
                )}

                {isLoadingMore && (
                    <div className="col-span-full my-6 flex justify-center">
                        <div
                            className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-blue-500 bg-white dark:bg-gray-800 transition ease-in-out duration-150">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading more...
                        </div>
                    </div>
                )}

                {!isLoading && !isLoadingMore && !hasMore && packages.length > 0 && (
                    <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                        You've reached the end of the list
                    </div>
                )}
            </div>
            {/* Edit Package Modal */}
            <Dialog
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{color: 'primary.main', fontWeight: 600}}>
                    Edit Package
                </DialogTitle>
                <DialogContent>
                    {editingPackage && (
                        <Box component="form" sx={{mt: 2}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <TextField
                                        fullWidth
                                        label="Package Name"
                                        value={editingPackage.name}
                                        onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                                        required
                                    />
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Package Type</InputLabel>
                                        <Select
                                            value={editingPackage.package_type}
                                            label="Package Type"
                                            onChange={(e) => setEditingPackage({
                                                ...editingPackage,
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
                                        value={editingPackage.description}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
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
                                            value={editingPackage.billing_type}
                                            label="Billing Type"
                                            onChange={(e) => setEditingPackage({
                                                ...editingPackage,
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
                                        label="Price"
                                        type="number"
                                        value={editingPackage.price}
                                        onChange={(e) => setEditingPackage({...editingPackage, price: e.target.value})}
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
                                        value={editingPackage.download_speed}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
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
                                        value={editingPackage.upload_speed}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
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
                                        value={editingPackage.data_limit || ''}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
                                            data_limit: e.target.value
                                        })}
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
                                        value={editingPackage.setup_fee}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
                                            setup_fee: e.target.value
                                        })}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 3}}>
                    <Button
                        onClick={() => setShowEditModal(false)}
                        variant="outlined"
                        disabled={isLoadingEdit}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditPackage}
                        variant="contained"
                        disabled={isLoadingEdit}
                        sx={{minWidth: 120}}
                    >
                        {isLoadingEdit ? (
                            <>
                                <CircularProgress size={20} sx={{mr: 1, color: 'white'}}/>
                                Updating...
                            </>
                        ) : (
                            'Update Package'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{color: 'error.main', fontWeight: 600}}>
                    Delete Package
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{mt: 1}}>
                        Are you sure you want to delete{' '}
                        <Typography component="span" sx={{fontWeight: 600}}>
                            {packageToDelete?.name}
                        </Typography>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 3}}>
                    <Button
                        onClick={() => setPackageToDelete(null)}
                        variant="outlined"
                        disabled={isLoadingDelete}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeletePackage}
                        variant="contained"
                        color="error"
                        disabled={isLoadingDelete}
                        sx={{minWidth: 120}}
                    >
                        {isLoadingDelete ? (
                            <>
                                <CircularProgress size={20} sx={{mr: 1, color: 'white'}}/>
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function Page() {
    return (
        <ThemeCustomization>
            <DashboardLayout>
                <PackagesPage/>
            </DashboardLayout>
        </ThemeCustomization>
    )
}