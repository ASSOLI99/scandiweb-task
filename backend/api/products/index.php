<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Product.php';

$database = new Database();
$db = $database->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $result = $product->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->sku) &&
            !empty($data->name) &&
            !empty($data->price) &&
            !empty($data->type)
        ) {
            $product->sku = $data->sku;
            $product->name = $data->name;
            $product->price = $data->price;
            $product->type = $data->type;
            $product->attributes = $data->attributes ?? [];

            if($product->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Product was created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create product."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to create product. Data is incomplete."]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->ids)) {
            if($product->delete($data->ids)) {
                http_response_code(200);
                echo json_encode(["message" => "Products were deleted."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete products."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to delete products. No IDs provided."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
} 