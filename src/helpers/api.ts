import axios, { AxiosResponse } from 'axios';

export async function convert(from: string, to: string, amount: number, callback: (res: AxiosResponse) => void) {
    try {
        const res = await axios({
            method: 'GET',
            url: 'https://api.exchangerate.host/convert',
            params: {
                from: from,
                to: to,
                amount: amount,
                places: 2
            }
        });
        callback(res);
    } catch (error) {
        console.log(error);
    }
}

export async function getSupportedSymbols(callback: (res: AxiosResponse) => void) {
    try {
        const res = await axios({
            method: 'GET',
            url: 'https://api.exchangerate.host/symbols'
        });
        callback(res);
    } catch (error) {
        console.log(error);
    }
}