const axios = require('axios');

const TENSORDOCK_API_KEY = 'xMkzH8n45Rk8hinfdgxAkoKVeK1Y0gv5';
const PRIME_INTELLECT_API_KEY = process.env.PRIME_INTELLECT_API_KEY || 'PI_API_KEY_HERE'; // I will need to manually set this or read from env

async function testTensorDock() {
    console.log('Testing TensorDock...');
    try {
        // Try stock/list first
        const listUrl = 'https://console.tensordock.com/api/stock/list';
        const listResp = await axios.get(listUrl);
        console.log('TensorDock Stock List Keys:', Object.keys(listResp.data));
        if (listResp.data.gpu_models) {
            console.log('Sample TensorDock Model:', Object.keys(listResp.data.gpu_models)[0]);
        }

        // Try host_nodes without gpu_model
        const hostNodesUrl = 'https://marketplace.tensordock.com/api/v0/client/deploy/host_nodes';
        const params = new URLSearchParams();
        params.append('api_key', TENSORDOCK_API_KEY);

        const hostResp = await axios.post(hostNodesUrl, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log('TensorDock Host Nodes (no filter) Count:', Object.keys(hostResp.data).length);
        // console.log('Sample Host Node:', JSON.stringify(hostResp.data[Object.keys(hostResp.data)[0]], null, 2));

    } catch (e) {
        console.error('TensorDock Error:', e.message);
        if (e.response) console.error('Data:', e.response.data);
    }
}

async function testPrimeIntellect() {
    console.log('\nTesting Prime Intellect...');
    // Need to read key from .env.local manually for this script or assume it's set
    // For now I'll just skip if I don't have it easily, but I can try to read the file.
}

testTensorDock();
