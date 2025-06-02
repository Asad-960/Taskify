import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import API from "../api"




export const useTaskQuery = (filter?: string | null, category?: string | null) => {
    return useQuery({
        queryKey: ['tasks', filter, category],
        queryFn: async () => {
            const url = filter ? `/api/task/filter/${filter}`
                        : category ? `/api/category/tasks/${category}`
                        : '/api/task';
            const { data } = await API.get(url);
            return data;
        },
    });
}
export const useCategoryQuery = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await API.get('/api/category');
            return data;
        },
    });
}
export const useSingleTaskQuery = (id: string | undefined) => {
    return useQuery({
        queryKey: ['task', id],
        queryFn: async () => {
            const { data } = await API.get(`/api/task/${id}`);
            return data;
        },
    });
}


export const useRegisterMutation = () =>
{
    return useMutation({
        mutationFn: async (form: Register) => {
            const { data } = await API.post('account/register', form)
            console.log(data);
            return data
        }
    })
}

export const useLoginMutation = () =>
{
    return useMutation({
        mutationFn: async (form: Login) => {
            const { data } = await API.post('account/login', form)
            return data
        }
    })
}

export const useCategoryMutation = () =>
{
    return useMutation({
        mutationFn: async (form: Category) => {
            const { data } = await API.post('api/category', form)
            return data
        }
    })
}

export const useCreateTaskMutation = () =>
{
    return useMutation({
        mutationFn: async (form: TaskRequest) => {
            const { data } = await API.post('api/task', form)
            return data
        }
    })
}

export const useUpdateTaskMutation = () =>
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({form, id}: {form: TaskRequest, id: string | undefined}) => {
            const { data } = await API.put(`api/task/${id}`, form)
            return data
        },
        onSuccess(_, variables) {
            queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },

    })
}

export const useDeleteTaskMutation = () =>
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | undefined) => {
            const { data } = await API.delete(`api/task/${id}`)
            return data
        },
        onSuccess(_, variables) {
            queryClient.invalidateQueries({ queryKey: ['task', variables] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    })
}