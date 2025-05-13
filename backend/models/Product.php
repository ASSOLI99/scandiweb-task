<?php

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $sku;
    public $name;
    public $price;
    public $type;
    public $attributes;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (sku, name, price, type)
                VALUES
                (:sku, :name, :price, :type)";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->sku = htmlspecialchars(strip_tags($this->sku));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->type = htmlspecialchars(strip_tags($this->type));

        // Bind values
        $stmt->bindParam(":sku", $this->sku);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":type", $this->type);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return $this->saveAttributes();
        }

        return false;
    }

    private function saveAttributes() {
        if(empty($this->attributes)) {
            return true;
        }

        $query = "INSERT INTO product_attributes
                (product_id, attribute_name, attribute_value)
                VALUES
                (:product_id, :attribute_name, :attribute_value)";

        $stmt = $this->conn->prepare($query);

        foreach($this->attributes as $name => $value) {
            $name = htmlspecialchars(strip_tags($name));
            $value = htmlspecialchars(strip_tags($value));

            $stmt->bindParam(":product_id", $this->id);
            $stmt->bindParam(":attribute_name", $name);
            $stmt->bindParam(":attribute_value", $value);

            if(!$stmt->execute()) {
                return false;
            }
        }

        return true;
    }

    public function read() {
        $query = "SELECT p.*, pa.attribute_name, pa.attribute_value
                FROM " . $this->table_name . " p
                LEFT JOIN product_attributes pa ON p.id = pa.product_id
                ORDER BY p.id DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $products = [];
        $current_product = null;

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if(!isset($products[$row['id']])) {
                $products[$row['id']] = [
                    'id' => $row['id'],
                    'sku' => $row['sku'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'type' => $row['type'],
                    'attributes' => []
                ];
            }

            if($row['attribute_name'] && $row['attribute_value']) {
                $products[$row['id']]['attributes'][$row['attribute_name']] = $row['attribute_value'];
            }
        }

        return array_values($products);
    }

    public function delete($ids) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id IN (" . implode(',', $ids) . ")";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute();
    }
} 