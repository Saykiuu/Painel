import axios from "axios";
import { reject } from "core-js/fn/promise";


class Client {
    
    async getRequest(url){
        let d = sessionStorage.getItem('token')
        if(!d){
            return { status: 401 }
        }
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        const request = await axios.get(url, config);
        return request;
    }
}

export { Client }