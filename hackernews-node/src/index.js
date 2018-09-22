const { GraphQLServer } = require('graphql-yoga');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (root, args) => {
      const link = links.filter(item => item.id == args.id);
      return link[0];
    },
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (root, args) => {
      links.forEach(item => {
        if (item.id === args.id) {
          console.log('go here');
          item.description = args.description;
          item.url = args.url;
          console.log(args.description)
          console.log(item);
          return item;
        }
      });
      return links[0];
    },
  },
  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url,
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));
