import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProductForm from "@/components/productForm";

const editProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => setProductInfo(res.data));
  }, []);

  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
};

export default editProduct;
