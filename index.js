const { ApolloServer, gql } = require('apollo-server');
// https://www.apollographql.com/docs/apollo-server/getting-started/

const products = require('./products.json')

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Product" type defines the queryable fields for every book in our data source.
  type Product {
    id: ID
    title: String
    type: String
    description: String
    filename: String
    height: Int
    width: Int
    price: Float
    rating: Int
  } 

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    productsByTitle(title: String!): [Product]
    products: [Product]
    expensiveProducts: [Product]
    product(id: ID): Product
  }
`;


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    products(){
      return products
    },
    productsByTitle(parent, args, context, info) {
      return products.filter(product => product.title.includes(args.title))
    },
    product (parent, args, context, info) {
      return  products.find((product) => product.id === Number(args.id));
    },
    expensiveProducts() {
      return products.filter(product => product.price > 20)
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
