// import the required libraries
var graphql = require('graphql');

var graphqlHTTP = require('express-graphql');
var express = require('express');


// Import the data
var data = require('./data.json');

function getPersonById(id) {
    return data[id];
}


// Define the persontype with some fields: 'id', 'name', 'favorite_movie' and 'friends'
var PersonType = new graphql.GraphQLObjectType({
    name: 'Person',
    description: '...',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        "favorite_movie": { type: graphql.GraphQLString },
        "friends": {
            type: new graphql.GraphQLList(PersonType),
            resolve: function(person){
              return person.friends.map(getPersonById)
            }
        }
    })
});

// Define the querytype
var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            person: {
                type: PersonType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                //PROMISE<persontype>
                resolve: (_, args) => getPersonById(args.id)
            }
        }
    })
});


express()
    .use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }))
    .listen(3000);

console.log('GraphQL server running on localhost:3000')
