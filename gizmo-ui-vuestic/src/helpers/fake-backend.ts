export { fakeBackend };

function fakeBackend() {
    let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    // @ts-expect-error TS(2339): Property 'endsWith' does not exist on type 'Reques... Remove this comment to see the full error message
                    case url.endsWith('/users/authenticate') && opts.method === 'POST':
                        return authenticate();
                    // @ts-expect-error TS(2339): Property 'endsWith' does not exist on type 'Reques... Remove this comment to see the full error message
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Username or password is incorrect');

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                });
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users);
            }

            // helper functions

            function ok(body: any) {
                // @ts-expect-error TS(2345): Argument of type '{ ok: true; text: () => Promise<... Remove this comment to see the full error message
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorized() {
                // @ts-expect-error TS(2345): Argument of type '{ status: number; text: () => Pr... Remove this comment to see the full error message
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) })
            }

            function error(message: any) {
                // @ts-expect-error TS(2345): Argument of type '{ status: number; text: () => Pr... Remove this comment to see the full error message
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }

            function isAuthenticated() {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                return opts.headers['Authorization'] === 'Bearer fake-jwt-token';
            }

            function body() {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                return opts.body && JSON.parse(opts.body);
            }
        });
    }
}
