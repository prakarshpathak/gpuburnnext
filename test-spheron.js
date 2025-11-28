const axios = require('axios');

const API_KEY = 'sai_pk_3SrlegDhO1b2g9YpV0vqvW4uCF3msGIc';

async function testSpheron() {
    try {
        console.log('Testing Spheron API...');
        const response = await axios.get('https://api.spheron.network/v1/compute/plans', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log('Success:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testSpheron();
