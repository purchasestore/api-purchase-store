const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    lastname: String!
    email: String!
    password: String
    createdAt: String!
    updatedAt: String!
  }

  type Company {
    id: ID!
    name: String!
    trade: String!
    cnpj: String!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type Supplier {
    id: ID!
    name: String!
    cnpj: String!
    email: String!
    cellphone: String!
    address: String!
    city: String!
    state: String!
    landmark: String!
    note: String!
    createdAt: String!
    updatedAt: String!
    company: Company!
  }

  type Customer {
    id: ID!
    name: String!
    email: String!
    cellphone: String!
    createdAt: String!
    updatedAt: String!
    company: Company!
  }

  type Category {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    company: Company!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    code: String!
    imageUrl: String!
    highlight: Boolean!
    createdAt: String!
    updatedAt: String!
    category: Category!
    company: Company!
  }

  type PurchaseItem {
    id: ID!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
    product: Product!
  }

  type Purchase {
    id: ID!
    value: Float!
    createdAt: String!
    updatedAt: String!
    supplier: Supplier!
    company: Company!
    items: [PurchaseItem!]!
  }

  type SaleItem {
    id: ID!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
    product: Product!
  }

  type Sale {
    id: ID!
    value: Float!
    discount: Float!
    percentage: Float!
    online: Boolean!
    disclosure: Boolean!
    createdAt: String!
    updatedAt: String!
    customer: Customer!
    company: Company!
    items: [SaleItem!]!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input CompanyInput {
    name: String!
    trade: String!
    cnpj: String!
  }

  input SupplierInput {
    name: String!
    cnpj: String
    email: String!
    cellphone: String!
    address: String!
    city: String!
    state: String!
    landmark: String
    note: String
    company: ID!
  }

  input CustomerInput {
    name: String!
    email: String!
    cellphone: String!
    company: ID!
  }

  input CategoryInput {
    name: String!
    company: ID!
  }

  input ProductInput {
    name: String!
    price: Float!
    code: String!
    imageUrl: String
    highlight: Boolean
    category: ID!
    company: ID!
  }

  input PurchaseInput {
    items: [PurchaseItemInput!]!
    supplier: ID!
    company: ID!
  }

  input PurchaseItemInput {
    quantity: Int!
    product: ID!
  }

  input SaleInput {
    items: [SaleItemInput!]!
    discount: Float!
    percentage: Float!
    online: Boolean!
    disclosure: Boolean!
    customer: ID!
    company: ID!
  }

  input SaleItemInput {
    quantity: Int!
    product: ID!
  }

  type RootQuery {
    company(id: ID!): Company!
    suppliers(companyId: ID!): [Supplier!]!
    supplier(id: ID!, companyId: ID!): Supplier!
    customers(companyId: ID!): [Customer!]!
    customer(id: ID!, companyId: ID!): Customer!
    categories(companyId: ID!): [Category!]!
    category(id: ID!, companyId: ID!): Category!
    products(companyId: ID!): [Product!]!
    product(id: ID!, companyId: ID!): Product!
    purchases(companyId: ID!): [Purchase!]!
    purchase(id: ID!, companyId: ID!): Purchase!
    sales(companyId: ID!): [Sale!]!
    sale(id: ID!, companyId: ID!): Sale!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User!
    updateUser(name: String!, lastname: String!): User!
    updateEmail(email: String!): User!
    updatePassword(password: String!): User!
    deleteUser: Boolean!
    createCompany(companyInput: CompanyInput): Company!
    updateCompany(id: ID!, companyInput: CompanyInput): Company!
    deleteCompany(id: ID!): Boolean!
    createSupplier(supplierInput: SupplierInput): Supplier!
    updateSupplier(id: ID!, supplierInput: SupplierInput): Supplier!
    deleteSupplier(id: ID!, companyId: ID!): Boolean!
    createCustomer(customerInput: CustomerInput): Customer!
    updateCustomer(id: ID!, customerInput: CustomerInput): Customer!
    deleteCustomer(id: ID!, companyId: ID!): Boolean!
    createCategory(categoryInput: CategoryInput): Category!
    updateCategory(id: ID!, categoryInput: CategoryInput): Category!
    deleteCategory(id: ID!, companyId: ID!): Boolean!
    createProduct(productInput: ProductInput): Product!
    updateProduct(id: ID!, productInput: ProductInput): Product!
    deleteProduct(id: ID!, companyId: ID!): Boolean!
    createPurchase(purchaseInput: PurchaseInput): Purchase!
    updatePurchase(id: ID!, purchaseInput: PurchaseInput): Purchase!
    deletePurchase(id: ID!, companyId: ID!): Boolean!
    createSale(saleInput: SaleInput): Sale!
    updateSale(id: ID!, saleInput: SaleInput): Sale!
    deleteSale(id: ID!, companyId: ID!): Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
