import {api} from "@/utils/api";
import axios from 'axios';

const client = {
    async forUser() {
        const {data} =
            await api.get({
                route: "API_CUSTOMER_DEFAULT",
                params: {format: 'json'}
            })
        console.log(data)
        return data ?? []
    },
    async forPackage() {

    },
    async add(data: any) {
        try {
            const {data: res, error} =
                await api.post({
                    route: "API_CUSTOMER_LIST",
                    data: {
                        full_name:data.fullName,
                        primary_phone: data.phone,
                        primary_email: data.email,
                        installation_address: data.address,
                        customer_type: 'individual',
                        status: data.status || 'active',
                        // Add package relation if provided
                        ...(data.package ? {package_id: data.package} : {})
                    },
                    params: {format: 'json'}
                });
            return {data: res, error};
        } catch (err) {
            // Handle axios error
            if (axios.isAxiosError(err) && err.response) {
                // Extract detailed error information from the response
                const errorData = err.response.data;
                let errorMessage = "Failed to add client.";

                // Check if the error is a validation error with field details
                if (typeof errorData === 'object' && errorData !== null) {
                    const fieldErrors = Object.entries(errorData)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');

                    if (fieldErrors) {
                        errorMessage = `Validation errors:\n${fieldErrors}`;
                    } else if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                }

                return {data: null, error: new Error(errorMessage)};
            }

            // Generic error handling
            return {data: null, error: new Error("An unexpected error occurred. Please try again.")};
        }
    },
}

export default client;
