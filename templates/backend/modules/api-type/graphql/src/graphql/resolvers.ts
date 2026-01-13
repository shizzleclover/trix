// Example resolvers - replace with your actual data source
const users: any[] = [];

export const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL!',
        users: () => users,
        user: (_: any, { id }: { id: string }) =>
            users.find(u => u.id === id),
    },
    Mutation: {
        createUser: (_: any, { email, name }: { email: string; name?: string }) => {
            const user = {
                id: String(users.length + 1),
                email,
                name,
                createdAt: new Date().toISOString(),
            };
            users.push(user);
            return user;
        },
        updateUser: (_: any, { id, name }: { id: string; name?: string }) => {
            const user = users.find(u => u.id === id);
            if (user && name) {
                user.name = name;
            }
            return user;
        },
        deleteUser: (_: any, { id }: { id: string }) => {
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users.splice(index, 1);
                return true;
            }
            return false;
        },
    },
};
