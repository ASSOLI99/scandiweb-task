import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost/scandiweb/api/products";

interface ProductForm {
  sku: string;
  name: string;
  price: string;
  type: string;
  size?: string;
  weight?: string;
  height?: string;
  width?: string;
  length?: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    sku: "",
    name: "",
    price: "",
    type: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const attributes: { [key: string]: string } = {};
    switch (formData.type) {
      case "DVD":
        attributes.size = formData.size || "";
        break;
      case "Book":
        attributes.weight = formData.weight || "";
        break;
      case "Furniture":
        attributes.height = formData.height || "";
        attributes.width = formData.width || "";
        attributes.length = formData.length || "";
        break;
    }

    try {
      await axios.post(API_URL, {
        sku: formData.sku,
        name: formData.name,
        price: parseFloat(formData.price),
        type: formData.type,
        attributes,
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "DVD":
        return (
          <TextField
            fullWidth
            label="Size (MB)"
            name="size"
            type="number"
            value={formData.size}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        );
      case "Book":
        return (
          <TextField
            fullWidth
            label="Weight (KG)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        );
      case "Furniture":
        return (
          <>
            <TextField
              fullWidth
              label="Height (CM)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Width (CM)"
              name="width"
              type="number"
              value={formData.width}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Length (CM)"
              name="length"
              type="number"
              value={formData.length}
              onChange={handleInputChange}
              required
              margin="normal"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Product Add
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type Switcher</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              required
            >
              <MenuItem value="DVD">DVD</MenuItem>
              <MenuItem value="Book">Book</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
            </Select>
          </FormControl>

          {renderTypeSpecificFields()}
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;
