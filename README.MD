# Online Canteen Web Service

This web service provides CRUD operations for an online canteen menu.
The service is deployed on Render and connected to an Aiven MySQL database.

---

## Web Service Primary URL
https://c346-onlinecanteenwebservices.onrender.com

---

## Retrieve all menu items
**Endpoint:**
GET /menu

**Full URL:**
https://c346-onlinecanteenwebservices.onrender.com/menu

---

## Add a new menu item
**Endpoint:**
POST /menu

**Full URL:**
https://c346-onlinecanteenwebservices.onrender.com/menu

**Sample JSON body:**
```json
{
  "item_name": "Iced Lemon Tea",
  "category": "Drink",
  "price": 1.80
}

```

## Update an existing menu item

**Endpoint:**
PUT /menu/:id

**URL:**
https://c346-onlinecanteenwebservices.onrender.com/menu/2

**Sample JSON body:**
```json
{
  "price": 2.00
}

```

## Delete a menu item

**Endpoint:** 
DELETE /menu/:id

**URL:**
https://c346-onlinecanteenwebservices.onrender.com/menu/3