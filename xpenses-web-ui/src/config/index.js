
const config = {
    api_url: process.env.REACT_APP_BASE_API_URL || 'http://localhost:10080',
    auth: {
        client_id: 'xpenses_web_ui',
        client_token: process.env.REACT_APP_AUTH_CLIENT_TOKEN
    }
}

export default config;