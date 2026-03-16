/**
 * API service for Ad Measurement Reports page.
 * Contains functions used by AdMeasurementReports.jsx.
 */

const BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches the list of measurement reports from the backend.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of measurement report objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchMeasurementReports = async () => {
    try {
        const response = await fetch(`${BASE_URL}/measurement-reports`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("reports data", data);
        return Array.isArray(data.results) ? data.results : (data.result || data.data || []);
    } catch (error) {
        console.error('Error fetching measurement reports:', error);
        throw error;
    }
};

/**
 * Fetches audiences based on the currency of record year.
 *
 * @param {string} currencyOfRecord - The currency of record (e.g., "24", "25", "26").
 * @returns {Promise<Array>}
 */
export const fetchAudiencesByYear = async (currencyOfRecord) => {
    try {
        const response = await fetch(`${BASE_URL}/get-audiences-by-year?currencyOfRecord=${currencyOfRecord}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching audiences by year:', error);
        throw error;
    }
};

/**
 * Fetches datasource groups based on the currency of record year.
 *
 * @param {string} currencyOfRecord - The currency of record.
 * @returns {Promise<Array>}
 */
export const fetchDatasourceGroupsByYear = async (currencyOfRecord) => {
    try {
        const response = await fetch(`${BASE_URL}/get-datasource-groups-by-year?currencyOfRecord=${currencyOfRecord}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching datasource groups by year:', error);
        throw error;
    }
};

/**
 * Submits a new ad measurement report to the server.
 *
 * @param {Object} payload - The report data payload.
 * @returns {Promise<Object>}
 */
export const submitReport = async (payload) => {
    try {
        const response = await fetch(`${BASE_URL}/submit-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw { status: response.status, data };
        }
        return data;
    } catch (error) {
        console.error('Error submitting report:', error);
        throw error;
    }
};

/**
 * Sends a spot level export via email.
 *
 * @param {Object} payload - Object containing reportId, reportName, toEmail, attachmentUrl.
 * @returns {Promise<Object>}
 */
export const sendSpotExportEmail = async (payload) => {
    try {
        const response = await fetch(`${BASE_URL}/send-spot-export-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                // Ignore json parse error for non-json responses
            }
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        // Sometimes email success endpoints return empty strings or 204 No Content
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

