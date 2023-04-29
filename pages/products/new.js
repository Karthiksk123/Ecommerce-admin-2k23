import Layout from "@/components/Layout";
import ProductForm from "@/components/productForm";

const newProduct = () => {
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  );
};

export default newProduct;
