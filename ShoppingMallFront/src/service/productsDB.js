import axios from "axios";


export const getProductsByCategory = async(category1) => {
  const res = await axios({
  method: "get",
  url: `${process.env.REACT_APP_SPRING_IP}/api/products/categories`,
  params: { category: category1 } 
  
  })
  return res.data
}

export const searchProducts = async (keyword) => {
  const res = await axios ({
    method: "get",
    url: `${process.env.REACT_APP_SPRING_IP}/api/products/search`,
    params: { keyword }
  });
  return res.data;
};

