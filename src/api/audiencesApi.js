/**
 * API service for Audiences pages.
 * Contains functions used by Audiences.jsx and DemographicAudiences.jsx.
 */

const BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches the list of audiences from the backend.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of audience objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchAudiences = async () => {
    try {
        const response = await fetch(`${BASE_URL}/audiences`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching audiences:', error);
        throw error;
    }
};

/**
 * Fetches the list of demographic audiences from the backend.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of demographic audience objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchDemographicAudiences = async () => {
    try {
        const response = await fetch(`${BASE_URL}/demographic-audiences`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching demographic audiences:', error);
        throw error;
    }
};
