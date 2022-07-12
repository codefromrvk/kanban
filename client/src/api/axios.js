import axios from "axios";

export default axios.create({
  baseURL: "https://quiet-hollows-05652.herokuapp.com/"||"http://localhost:5000",
});
