import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  type: string;
  attributes: { [key: string]: string };
}

const API_URL = "http://localhost/scandiweb/api/products";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      await axios.delete(API_URL, {
        data: { ids: selectedProducts },
      });
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getAttributeDisplay = (product: Product) => {
    switch (product.type) {
      case "DVD":
        return `Size: ${product.attributes.size} MB`;
      case "Book":
        return `Weight: ${product.attributes.weight} KG`;
      case "Furniture":
        return `Dimension: ${product.attributes.height}x${product.attributes.width}x${product.attributes.length}`;
      default:
        return "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Product List
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-product")}
            sx={{ mr: 2 }}
          >
            ADD
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={selectedProducts.length === 0}
          >
            MASS DELETE
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <Box flexGrow={1}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="textSecondary">
                      SKU: {product.sku}
                    </Typography>
                    <Typography color="textSecondary">
                      Price: ${product.price}
                    </Typography>
                    <Typography color="textSecondary">
                      {getAttributeDisplay(product)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
