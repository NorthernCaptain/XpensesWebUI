import axios from "axios";
import config from '../config'

export const getUserToken = async ({email, password}) => {
    let body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    body.append("client_id", config.auth.client_id);
    body.append("client_secret", config.auth.client_token);
    body.append("grant_type", "password");
    try {
        let result = await axios.post(`${config.api_url}/auth/login`, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: false
        });
        let data = result.data;
        if(result.status === 200) {
            data.expires_time_millis = Date.now() + data.expires_in * 1000;
            data.error = null;
        } else {
            data.error = "Invalid user name or password"
        }
        return data;
    } catch (e) {
        console.log("Error in getUserToken", e)
        return { error: "Invalid user name or password"};
    }
}