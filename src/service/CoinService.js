
import axios from "axios";



class CoinService{

    static getCoins(){
        return axios.get('https://api.coincap.io/v2/assets'
        )
    }
}

export default CoinService;

