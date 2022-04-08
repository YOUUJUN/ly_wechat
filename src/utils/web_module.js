import axios from 'axios';

const errorCaptured = async (asyncFunc, ...params) =>{
    try{
        console.log('params',params);
        let res = await asyncFunc(...params);
        return [null,res];
    }catch (e) {
        return [e, null];
    }
};

// const baseURL = "http://60.173.9.77:15380/dev/";

// const baseURL = "http://60.173.9.77:15280/";

// const baseURL = "http://112.30.151.101:15280/";

const baseURL = "http://cloud.bfcgj.com:15280/";


const myAxios =  (options = {}) => {

    let $axios = axios.create({
        baseURL,
        withCredentials: true, //CORS
    });

    return $axios(options);
};





export default myAxios;



















