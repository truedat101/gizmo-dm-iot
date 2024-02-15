import { defineStore } from 'pinia';

// @ts-expect-error TS(2307): Cannot find module '@/helpers' or its correspondin... Remove this comment to see the full error message
import { fetchWrapper } from '@/helpers';

// @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {}
    }),
    actions: {
        async getAll() {
            this.users = { loading: true };
            fetchWrapper.get(baseUrl)
                .then((users: any) => this.users = users)
                .catch((error: any) => this.users = { error })
        }
    }
});
