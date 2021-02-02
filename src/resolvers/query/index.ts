import GMR from 'graphql-merge-resolvers';
import resolversUsersQuery from './user';
import resolversProductsQuery from './product';
import resolversTagQuery from './tag';
import queryStripeResolvers from './stripe';
import resolversDashboardQuery from './dashboard';
import resolversPostQuery from './post';
import resolversSizeQuery from './size';
import resolversColorQuery from './color';
import resolversCategoriaQuery from './categoria';

const queryResolvers = GMR.merge([
    resolversUsersQuery,
    resolversProductsQuery,
    resolversTagQuery,
    queryStripeResolvers,
    resolversDashboardQuery,
    resolversPostQuery,
    resolversSizeQuery,
    resolversColorQuery,
    resolversCategoriaQuery
]);

export default queryResolvers