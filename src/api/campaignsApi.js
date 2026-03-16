/**
 * API service for VA Campaign Planning and Plan Submission pages.
 * Contains functions used by VACampaignPlanning.jsx and SubmitPlan.jsx.
 */

const BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches the list of campaigns from the backend.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of campaign objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchCampaigns = async () => {
    try {
        const response = await fetch(`${BASE_URL}/campaigns`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : (data.results || data.data || []);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
};

/**
 * Fetches the plans associated with a specific campaign.
 *
 * @param {string} campaignId - The ID of the campaign.
 * @returns {Promise<Array>} A promise that resolves to an array of plan objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchCampaignPlans = async (campaignId) => {
    try {
        console.log("campaignId", campaignId);
        console.log(`${BASE_URL}/get-campaign-plans?campaignId=${campaignId}`);
        const response = await fetch(`${BASE_URL}/get-campaign-plans?campaignId=${campaignId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);
        return Array.isArray(data.results) ? data.results : (data.result || []);
    } catch (error) {
        console.error(`Error fetching plans for campaign ${campaignId}:`, error);
        throw error;
    }
};

/**
 * Fetches the reach information associated with a specific plan.
 *
 * @param {string} planId - The ID of the campaign plan.
 * @returns {Promise<Array>} A promise that resolves to an array of reach objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchReachInfo = async (planId) => {
    try {
        const response = await fetch(`${BASE_URL}/get-reach?planId=${planId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error(`Error fetching reach info for plan ${planId}:`, error);
        throw error;
    }
};

/**
 * Fetches the list of all available audiences for campaign / plan creation dropdowns.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of audience objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchAudiencesList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get-audiences-list`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching audience list:', error);
        throw error;
    }
};

/**
 * Submits a new campaign to the backend.
 *
 * @param {Object} payload - The campaign data payload.
 * @returns {Promise<Object>} A promise that resolves to the success response.
 * @throws {Error} If the network request fails or returns a validation error.
 */
export const submitCampaign = async (payload) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/submit-campaign`, {
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
        console.log("campaign submitted successfully", data);
        return data;
    } catch (error) {
        console.error('Error submitting campaign:', error);
        throw error;
    }
};

/**
 * Fetches the list of rate cards for a plan.
 *
 * @param {string} inventoryId - The inventory ID for the rate card.
 * @returns {Promise<Array>} A promise that resolves to an array of rate card title objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchRateCardList = async (inventoryId) => {
    try {
        const response = await fetch(`${BASE_URL}/get-rate-card-list?inventoryId=${inventoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.titles || [];
    } catch (error) {
        console.error('Error fetching rate card list:', error);
        throw error;
    }
};

/**
 * Submits a new plan to the backend.
 *
 * @param {FormData} formData - The multipart form data payload for the plan.
 * @returns {Promise<Object>} A promise that resolves on success.
 * @throws {Error} If the network request fails.
 */
export const submitPlan = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/submit-plan`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw { status: response.status, data };
        }

        return data;
    } catch (error) {
        console.error('Error submitting plan:', error);
        throw error;
    }
};
