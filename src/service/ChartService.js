import axios from "axios";
import API_KEY from "./key";



class ChartService {
  static getChart(coin, period) {
    let periodId;
    let startDate;

    // Set the period_id and calculate the start date based on the selected period
    switch (period) {
      case "1DAY":
        periodId = "1HRS"; 
        startDate = new Date(new Date().setDate(new Date().getDate() - 1)); // 24 hours
        break;
      case "7DAY":
        periodId = "12HRS"; 
        startDate = new Date(new Date().setDate(new Date().getDate() - 7)); // 7 days
        break;
      case "1MTH":
        periodId = "1HRS"; 
        startDate = new Date(new Date().setDate(new Date().getDate() - 30)); // 7 days
        break;
      default:
        periodId = "1DAY";
        startDate = new Date(new Date().setDate(new Date().getDate() - 1)); // Default to 1DAY
    }

    return axios.get(`https://rest.coinapi.io/v1/exchangerate/${coin}/USD/history`, {
      params: {
        period_id: periodId,
        time_start: startDate.toISOString(),
        time_end: new Date().toISOString(),
      },
      headers: {
        "X-CoinAPI-Key": API_KEY,
      },
    });
  }
}

export default ChartService;
