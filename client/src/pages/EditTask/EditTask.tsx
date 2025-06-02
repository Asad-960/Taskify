
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import z from 'zod';
import { useCategoryQuery, useDeleteTaskMutation, useSingleTaskQuery, useUpdateTaskMutation } from '../../api/queries';
import { toast } from 'react-toastify';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string(),
    priority: z.string().min(1, 'Priority is required'),
    categoryName: z.string().optional(),
});
const EditTask = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onBlur',
    })
    const { data, isLoading } = useCategoryQuery();
    const { mutate } = useUpdateTaskMutation();
    const { id } = useParams<'id'>();
    const { data: taskData, isLoading: taskLoading } = useSingleTaskQuery(id);

    const onSubmit = (data: TaskRequest) => {
        console.log(data);
        mutate({ form: data, id: id }, {
            onSuccess: () => {
                navigate('/');
                toast.success('Task updated successfully');
            },
            onError: (error) => {
                console.error('Error updating task:', error);
            },
        })
    }
    const { mutate: deleteTask } = useDeleteTaskMutation();
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(id, {
                onSuccess: () => {
                    navigate('/');
                    toast.success('Task deleted successfully');
                },
                onError: (error) => {
                    console.error('Error deleting task:', error);
                },
            });
        }
    }
    return (
        <Container>
            <LayoutContentContainer>
                {
                    taskLoading && taskData == undefined ?
                        <div>Loading...</div>
                        :

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>
                                    <LabelText>Title</LabelText>
                                    <Input {...register('title')} className={errors.title ? 'error' : ''} defaultValue={taskData?.title}/>
                                </Label>
                                {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    <LabelText>Description</LabelText>
                                    <TextArea
                                        placeholder="Enter task description"
                                        {...register('description')}
                                        defaultValue={taskData?.description}
                                        className={errors.description ? 'error' : ''}
                                    />
                                </Label>
                                {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    <LabelText>Due Date</LabelText>
                                    <InputWithIcon>
                                        <Input
                                            type="datetime-local"
                                            defaultValue={taskData?.dueDate}
                                            {...register('dueDate')}
                                            className={`input ${errors.dueDate ? 'error' : ''}`}
                                        />
                                    </InputWithIcon>
                                </Label>
                                {errors.dueDate && <ErrorText>{errors.dueDate.message}</ErrorText>}
                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    <LabelText>Priority</LabelText>
                                    <Select {...register('priority')} defaultValue={taskData?.priority} className={errors.priority ? 'error' : ''}>
                                        <option value={0}>Select priority</option>
                                        <option value={1}>low</option>
                                        <option value={2}>medium</option>
                                        <option value={3}>high</option>
                                    </Select>
                                </Label>
                                {errors.priority && <ErrorText>{errors.priority.message}</ErrorText>}
                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    <LabelText>Category</LabelText>
                                    <Select {...register('categoryName')} className={errors.categoryName ? 'error' : ''} defaultValue={taskData?.categoryName}>
                                        <option value="">Select category</option>
                                        {!isLoading && data !== undefined &&
                                            <>
                                                {data.map((category: { name: string, color: string }) => (
                                                    <option key={category.name} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                                <option value="two">low</option>
                                                <option value="three">medium</option>
                                                <option value="four">high</option>
                                            </>
                                        }
                                    </Select>
                                </Label>
                                {errors.categoryName && <ErrorText>{errors.categoryName.message}</ErrorText>}
                            </FormGroup>

                            <ButtonRow>
                                <ButtonGroup>
                                    <Button onClick={() => navigate('/')}>Cancel</Button>
                                    <Button onClick={handleDelete}>Delete</Button>
                                    <Button variant="primary" type='submit'>Save</Button>
                                </ButtonGroup>
                            </ButtonRow>
                        </form>
                }
            </LayoutContentContainer>
        </Container>
    )
};


const Container = styled.div`
  padding: 1.25rem 10rem;
  display: flex;
  flex: 1;
  justify-content: center;
`;
const ErrorText = styled.span`
    color: #e53e3e;
    font-size: 0.875rem;
    padding-top: 0.25rem;
`;
const InputWithIcon = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: 0.75rem;
`;

const LayoutContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  max-width: 960px;
  flex: 1;
  padding: 1.25rem 0;
`;

const Title = styled.h2`
  color: #101418;
  font-size: 28px;
  font-weight: bold;
  line-height: 1.25;
  padding: 1.25rem 1rem 0.75rem 1rem;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  padding: 0.75rem 1rem;
  max-width: 480px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  flex: 1;
`;

const LabelText = styled.p`
  color: #101418;
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
  padding-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  flex: 1;
  width: 100%;
  resize: none;
  overflow: hidden;
  border-radius: 0.75rem;
  color: #101418;
  border: 1px solid #d4dbe2;
  background-color: #f8fafc;
  min-height: 9rem;
  padding: 15px;
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
  outline: none;
`;

const Input = styled.input`
  flex: 1;
  width: 100%;
  height: 3.5rem;
  border-radius: 0.75rem;
  color: #101418;
  border: 1px solid #d4dbe2;
  background-color: #f8fafc;
  padding: 15px;
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
  outline: none;
`;

const Select = styled.select`
  flex: 1;
  width: 100%;
  height: 3.5rem;
  border-radius: 0.75rem;
  color: #101418;
  border: 1px solid #d4dbe2;
  background-color: #f8fafc;
  padding: 15px;
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
  outline: none;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: stretch;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' }>`
  display: flex;
  min-width: 84px;
  max-width: 480px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  height: 2.5rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.015em;
  background-color: ${({ variant }) =>
        variant === 'primary' ? '#dce7f3' : '#eaedf1'};
  color: #101418;
`;

export default EditTask;
