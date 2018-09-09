import Web3 from 'web3';
import { resolve } from 'path';

const getWeb3 = () => {
    return new Promise( (resolve, reject) => {        
        if (typeof window.web3 !== 'undefined') {        
            let web3 = new Web3(window.web3.currentProvider);
            resolve(web3);
        } else {
            // No web 3 provider
            console.log("Please install Metamask");
            reject();
        }    
    });
}
     
export default getWeb3;
