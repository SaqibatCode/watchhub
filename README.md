# WatchHub API Documentation

E-commerce platform API for premium watches.  Includes user authentication, product browsing, shopping cart, orders, reviews, and more.

## API Overview

Endpoints for managing users, products, shopping carts, orders, and reviews.

## Authentication

### Register User

*   **Method:** `POST`
*   **URL:** `/api/auth/register`
*   **Description:** Create a new user.

    **Request Body:**

    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

    **Response:**

    ```json
    {
      "message": "User created successfully",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    }
    ```

### Login User

*   **Method:** `POST`
*   **URL:** `/api/auth/login`
*   **Description:** Log in and receive a JWT token.

    **Request Body:**

    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

    **Response:**

    ```json
    {
      "message": "Login successful",
      "token": "JWT_TOKEN"
    }
    ```

### Password Reset Request

*   **Method:** `POST`
*   **URL:** `/api/auth/password-reset-request`
*   **Description:** Send password reset link.

    **Request Body:**

    ```json
    {
      "email": "john.doe@example.com"
    }
    ```

    **Response:**

    ```json
    {
      "message": "Password reset link sent to email"
    }
    ```

### Password Reset

*   **Method:** `POST`
*   **URL:** `/api/auth/password-reset/:token`
*   **Description:** Reset password using token.

    **Request Body:**

    ```json
    {
      "newPassword": "newpassword123"
    }
    ```

    **Response:**

    ```json
    {
      "message": "Password successfully updated"
    }
    ```

## User Profile

### Get User Profile

*   **Method:** `GET`
*   **URL:** `/api/user/profile`
*   **Description:** Get user profile.
*   **Headers:** `Authorization: Bearer JWT_TOKEN`

    **Response:**

    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

### Update User Profile

*   **Method:** `PUT`
*   **URL:** `/api/user/profile`
*   **Description:** Update user profile.
*   **Headers:** `Authorization: Bearer JWT_TOKEN`

    **Request Body:**

    ```json
    {
      "name": "Johnathan Doe",
      "email": "johnathan.doe@example.com"
    }
    ```

    **Response:**

    ```json
    {
      "message": "Profile updated successfully"
    }
    ```

## Product Management

### List Products

*   **Method:** `GET`
*   **URL:** `/api/products`
*   **Description:** Get a list of products.
*   **Query Parameters:**
    *   `category`: Filter by category (e.g., "watches")
    *   `minPrice`: Minimum price
    *   `maxPrice`: Maximum price

    **Response:**

    ```json
    [
      {
        "id": 1,
        "name": "Luxury Watch",
        "description": "A premium luxury watch.",
        "price": 999.99,
        "stock": 50,
        "image": "url_to_image",
        "category": "watches"
      }
    ]
    ```

### Get Product Details

*   **Method:** `GET`
*   **URL:** `/api/products/:id`
*   **Description:** Get details for a single product.

    **Response:**

    ```json
    {
      "id": 1,
      "name": "Luxury Watch",
      "description": "A premium luxury watch.",
      "price": 999.99,
      "stock": 50,
      "image": "url_to_image",
      "category": "watches"
    }
    ```

## Flutter Integration Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> loginUser(String email, String password) async {
  final url = Uri.parse('http://localhost:3000/api/auth/login');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'email': email,
      'password': password,
    }),
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    String token = data['token'];
    print('Login successful. Token: $token');
  } else {
    print('Login failed: ${response.body}');
  }
}

// Example usage (requires http package: `flutter pub add http`)
// loginUser('john.doe@example.com', 'password123');
