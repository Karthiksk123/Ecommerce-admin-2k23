import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState([]);
  function goBack() {
    router.push("/products");
  }
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => setProductInfo(res.data));
  }, [id]);
  async function deleteProd() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }
  return (
    <Layout>
      <h1>Do you really want to delete product &nbsp;"{productInfo?.title}"</h1>
      <button className="btn-red" onClick={deleteProd}>
        Yes
      </button>
      <button className="btn-primary ml-5" onClick={goBack}>
        No
      </button>
    </Layout>
  );
}
