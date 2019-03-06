const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
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
  }

  input CustomerInput {
    name: String!
    email: String!
    cellphone: String!
  }

  input CategoryInput {
    name: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    code: String!
    imageUrl: String
    highlight: Boolean
    category: String!
  }

  input PurchaseInput {
    value: Float!
    supplier: String!
  }

  input SaleInput {
    value: Float!
    discount: Float!
    online: Boolean!
    disclosure: Boolean!
    customer: String!
  }

  type RootQuery {
    company(id: ID!): Company!
    suppliers: [Supplier!]!
    supplier(id: ID!): Supplier!
    customers: [Customer!]!
    customer(id: ID!): Customer!
    categories: [Category!]!
    category(id: ID!): Category!
    products: [Product!]!
    product(id: ID!): Product!
    purchases: [Purchase!]!
    purchase(id: ID!): Purchase!
    sales: [Sale!]!
    sale(id: ID!): Sale!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User!
    updateUser(userInput: UserInput): User!
    deleteUser: Boolean!
    createCompany(companyInput: CompanyInput): Company!
    updateCompany(id: ID!, companyInput: CompanyInput): Company!
    deleteCompany(id: ID!): Boolean!
    createSupplier(supplierInput: SupplierInput): Supplier!
    updateSupplier(id: ID!, supplierInput: SupplierInput): Supplier!
    deleteSupplier(id: ID!): Boolean!
    createCustomer(customerInput: CustomerInput): Customer!
    updateCustomer(id: ID!, customerInput: CustomerInput): Customer!
    deleteCustomer(id: ID!): Boolean!
    createCategory(categoryInput: CategoryInput): Category!
    updateCategory(id: ID!, categoryInput: CategoryInput): Category!
    deleteCategory(id: ID!): Boolean!
    createProduct(productInput: ProductInput): Product!
    updateProduct(id: ID!, productInput: ProductInput): Product!
    deleteProduct(id: ID!): Boolean!
    createPurchase(purchaseInput: PurchaseInput): Purchase!
    updatePurchase(id: ID!, purchaseInput: PurchaseInput): Purchase!
    deletePurchase(id: ID!): Boolean!
    createSale(saleInput: SaleInput): Sale!
    updateSale(id: ID!, saleInput: SaleInput): Sale!
    deleteSale(id: ID!): Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
