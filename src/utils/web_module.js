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


const baseURL = "http://112.30.151.101:15280/";

const myAxios =  (options = {}) => {

    let $axios = axios.create({
        baseURL,
        withCredentials: false, //CORS
    });

    return $axios(options);


    // let [error,res] = await errorCaptured($axios, options);
    //
    // if(error){
    //     if (error.response) {
    //         // The request was made and the server responded with a status code
    //         // that falls out of the range of 2xx
    //         console.log(error.response.data);
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //
    //     } else if (error.request) {
    //         // The request was made but no response was received
    //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //         // http.ClientRequest in node.js
    //         console.log(error.request);
    //     } else {
    //         // Something happened in setting up the request that triggered an Error
    //         console.log('Error', error.message);
    //     }
    //     console.log(error.config);
    //
    //
    //     return Promise.reject(error);
    // }
    //
    // if(res){
    //     return res;
    // }
};


export default myAxios;



















