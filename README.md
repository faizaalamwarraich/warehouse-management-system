# 📦 Warehouse Management System (WMS)

A full-featured **Warehouse Management System (WMS)** built with **React, Context API, and Bootstrap 5**, focused on **product inventory, stock management, and salesman assignments**.  
This project demonstrates a professional **UI/UX**, complete **CRUD operations**, and **localStorage-based persistence** with a modular architecture.

---

## 🚀 Features

### 🔐 Authentication
- Basic **login screen** (stub only, no backend).
- **Protected routes** (requires login).

### 📦 Products Module
- **CRUD** (Create, Read, Update, Delete).
- **10 fixed categories** (seeded at startup).
- **Filter by category** (single select).
- **Sorting** (Name, SKU, Price, Stock — Asc/Desc).
- **Search** (by Name or SKU, with debounce).
- **Pagination** (10–20 items per page, user selectable).
- **Low-stock highlighting** (threshold configurable).
- **Stock value shown** in product list + dashboard.

### 👥 Salesmen Module
- **CRUD** for salesmen.
- **Assigned stock view** (read-only list + totals).

### 📊 Stock Management
- **Assign stock** to salesmen (deducts from product stock).
- **Validation**: Prevent over-assignment if requested qty > available stock.
- **Manual stock adjustments** (+/– with note).
- **Transaction log** with product, qty change, reason, date, and user.

### 📑 Stock Transactions
- Tracks all stock movements.
- Reasons: creation, adjustment, assignment.
- **Linked to assignments** (refId).
- **Non-removable logs** (even if product deleted).

### 🖥️ Dashboard
- **KPIs**:
  - Total SKUs
  - Total Stock
  - Low-stock count
  - Assignments this week
- **Recent transactions** (latest 10).

### ⚙️ Tech & Architecture
- **Stack**: React, React Router, Context API, Bootstrap 5.
- **Data**: In-memory with localStorage persistence.
- **Feature-based folder structure**.
- **Reusable components**:
  - DataTable, Pagination, SearchBar, SortControl, CategoryFilter
  - ProductForm, SalesmanForm, AssignmentForm
  - StatsCard, Toast, ConfirmDialog
- **Performance**:
  - Debounced search (300ms).
  - Memoized lists.
- **Accessibility**:
  - Labels, focus states, keyboard navigation.

---

## 📂 Data Models

```js
// Product
{ id, name, sku, categoryId, price, stock, status, createdAt, updatedAt }

// Category
{ id, name }

// Salesman
{ id, name, phone, region, status, createdAt }

// Assignment
{ id, salesmanId, items: [{ productId, qty }], note, createdAt }

// StockTransaction
{ id, productId, delta, reason, refId?, createdAt }
Installation & Setup

Clone the repository

git clone https://github.com/your-username/warehouse-management-system.git
cd warehouse-management-system


Install dependencies

npm install


Run the app

npm start