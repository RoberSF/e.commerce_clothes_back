import GMR from 'graphql-merge-resolvers';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';
import resolversMailMutation from './email';
import stripeResolvers from './stripe';
import resolversProductMutation from './product';
import resolversAllMutation from './all';
import paypalResolvers from './paypal';
import resolversPostMutation from './post';
import resolversSizeMutation from './size';
import resolversColorMutation from './color';
import resolversProductSizeMutation from './product_size';
import resolversProductColorMutation from './product_color';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversTagMutation,
    resolversMailMutation,
    stripeResolvers,
    resolversProductMutation,
    resolversAllMutation,
    paypalResolvers,
    resolversPostMutation,
    resolversSizeMutation,
    resolversColorMutation,
    resolversProductSizeMutation,
    resolversProductColorMutation
]);

export default mutationResolvers