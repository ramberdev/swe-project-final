# Database Schema Reference

This document provides a reference for the database schema used in the SCP platform.

## Tables

### 1. users
- **UserID** (PK, Integer): Primary key
- **Name** (String): User's full name
- **Email** (String, Unique): User's email address
- **Password** (String): Hashed password
- **Phone** (String, Optional): Phone number
- **Role** (Enum): Admin or Regular
- **CreatedAt** (DateTime): Account creation timestamp

### 2. suppliers
- **SupplierID** (PK, Integer): Primary key
- **CompanyName** (String): Company name
- **Address** (String, Optional): Business address
- **Phone** (String, Optional): Contact phone
- **Email** (String, Optional): Contact email
- **VerificationStatus** (Boolean): KYB verification status
- **CreatedAt** (DateTime): Account creation timestamp

### 3. consumers
- **ConsumerID** (PK, Integer): Primary key
- **CompanyName** (String): Company name
- **Address** (String, Optional): Business address
- **Phone** (String, Optional): Contact phone
- **Email** (String, Optional): Contact email
- **Type** (Enum): Restaurant, Hotel, or Other
- **CreatedAt** (DateTime): Account creation timestamp

### 4. supplier_staff
- **StaffID** (PK, Integer): Primary key
- **UserID** (FK → users.UserID): Reference to user
- **SupplierID** (FK → suppliers.SupplierID): Reference to supplier
- **Role** (Enum): Owner, Manager, or Sales Representative
- **JoinedAt** (DateTime): Join timestamp

### 5. consumer_staff
- **StaffID** (PK, Integer): Primary key
- **UserID** (FK → users.UserID): Reference to user
- **ConsumerID** (FK → consumers.ConsumerID): Reference to consumer
- **Role** (Enum): Owner, Manager, or Staff
- **JoinedAt** (DateTime): Join timestamp

### 6. links
- **LinkID** (PK, Integer): Primary key
- **SupplierID** (FK → suppliers.SupplierID): Reference to supplier
- **ConsumerID** (FK → consumers.ConsumerID): Reference to consumer
- **Status** (Enum): Pending, Approved, Rejected, Removed, or Blocked
- **RequestedAt** (DateTime): Request timestamp
- **ApprovedAt** (DateTime, Optional): Approval timestamp

### 7. products
- **ProductID** (PK, Integer): Primary key
- **SupplierID** (FK → suppliers.SupplierID): Reference to supplier
- **Name** (String): Product name
- **Description** (Text, Optional): Product description
- **Price** (Decimal): Product price
- **Unit** (String, Optional): Unit of measurement
- **Stock** (Integer): Available stock
- **IsActive** (Boolean): Active status
- **MinimumOrderQuantity** (Integer): Minimum order quantity
- **ImageURL** (String, Optional): Product image URL
- **DeliveryAvailable** (Boolean): Delivery option available
- **PickupAvailable** (Boolean): Pickup option available
- **LeadTime** (String, Optional): Delivery lead time
- **DeliveryZones** (Text, Optional): Delivery zones description
- **CreatedAt** (DateTime): Creation timestamp

### 8. orders
- **OrderID** (PK, Integer): Primary key
- **SupplierID** (FK → suppliers.SupplierID): Reference to supplier
- **ConsumerID** (FK → consumers.ConsumerID): Reference to consumer
- **ConsumerStaffID** (FK → consumer_staff.StaffID): Reference to consumer staff
- **OrderDate** (DateTime): Order creation timestamp
- **Status** (Enum): Pending, Accepted, Rejected, In Progress, Completed, or Cancelled
- **TotalAmount** (Decimal): Total order amount
- **DeliveryDate** (DateTime, Optional): Expected delivery date
- **RejectionReason** (String, Optional): Reason for rejection

### 9. order_items
- **OrderItemID** (PK, Integer): Primary key
- **OrderID** (FK → orders.OrderID): Reference to order
- **ProductID** (FK → products.ProductID): Reference to product
- **Quantity** (Integer): Item quantity
- **UnitPrice** (Decimal): Price at time of order
- **Subtotal** (Decimal): Quantity × UnitPrice

### 10. chats
- **ChatID** (PK, Integer): Primary key
- **LinkID** (FK → links.LinkID, Unique): Reference to link (1:1 relationship)
- **CreatedAt** (DateTime): Creation timestamp

### 11. messages
- **MessageID** (PK, Integer): Primary key
- **ChatID** (FK → chats.ChatID): Reference to chat
- **UserID** (FK → users.UserID): Reference to sender
- **Content** (Text, Optional): Message content
- **SentAt** (DateTime): Send timestamp
- **IsRead** (Boolean): Read status
- **MessageType** (String): text, file, or audio
- **FileURL** (String, Optional): File attachment URL
- **ProductLinkID** (Integer, Optional): Reference to product if message contains product link

### 12. complaints
- **ComplaintID** (PK, Integer): Primary key
- **OrderID** (FK → orders.OrderID): Reference to order
- **ConsumerStaffID** (FK → consumer_staff.StaffID): Reference to reporter
- **SupplierStaffID** (FK → supplier_staff.StaffID, Optional): Reference to resolver
- **Title** (String): Complaint title
- **Description** (Text): Complaint description
- **Status** (Enum): Open, In Progress, Resolved, or Escalated
- **Priority** (Enum): Low, Medium, High, or Critical
- **CreatedAt** (DateTime): Creation timestamp
- **ResolvedAt** (DateTime, Optional): Resolution timestamp

### 13. complaint_logs
- **LogID** (PK, Integer): Primary key
- **ComplaintID** (FK → complaints.ComplaintID): Reference to complaint
- **UserID** (FK → users.UserID): Reference to user who performed action
- **Action** (String): Action performed (Created, Escalated, Resolved, etc.)
- **Notes** (Text, Optional): Additional notes
- **Timestamp** (DateTime): Action timestamp

## Relationships

- **User** → SupplierStaff (1:N)
- **User** → ConsumerStaff (1:N)
- **User** → Message (1:N)
- **User** → ComplaintLog (1:N)
- **Supplier** → SupplierStaff (1:N)
- **Supplier** → Product (1:N)
- **Supplier** → Link (1:N)
- **Supplier** → Order (1:N)
- **Consumer** → ConsumerStaff (1:N)
- **Consumer** → Link (1:N)
- **Consumer** → Order (1:N)
- **Order** → OrderItem (1:N)
- **Product** → OrderItem (1:N)
- **ConsumerStaff** → Order (1:N)
- **Order** → Complaint (1:N)
- **Link** → Chat (1:1)
- **Chat** → Message (1:N)
- **ConsumerStaff** → Complaint (1:N) [reporter]
- **SupplierStaff** → Complaint (1:N) [resolver]
- **Complaint** → ComplaintLog (1:N)

## Indexes

- Primary keys are automatically indexed
- Foreign keys should be indexed for performance
- Email fields are indexed for fast lookups

## Notes

- All timestamps use timezone-aware datetime
- Passwords are stored as hashed values (bcrypt)
- The schema follows 1NF and 2NF normalization standards
- Cascade deletes are configured for related records

