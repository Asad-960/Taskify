import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCategoryQuery, useCreateTaskMutation } from '../../api/queries';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string(),
  priority: z.string().min(1, 'Priority is required'),
  categoryName: z.string().optional(),
});

const CreateTask = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })
  const { mutate } = useCreateTaskMutation();
  const { data, isLoading } = useCategoryQuery();
  const onSubmit = (data: TaskRequest) => {
    mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
    });
    console.log(data);
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>Create New Task</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>
              <LabelText>Task Title</LabelText>
              <Input 
                placeholder="Enter task title" 
                {...register('title')}
                className={errors.title ? 'error' : ''}
              />
            </Label>
            {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>
              <LabelText>Description</LabelText>
              <TextArea 
                placeholder="Enter task description" 
                {...register('description')}
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
                    defaultValue={new Date().toISOString().slice(0, 16)}
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
              <Select {...register('priority')} className={errors.priority ? 'error' : ''}>
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
              <Select {...register('categoryName')} className={errors.categoryName ? 'error' : ''}>
                <option value="">Select category</option>
                { !isLoading && 
                <>
                  {data.map((category: { name: string, color: string }) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}             
                </>
                }
              </Select>
            </Label>
            {errors.categoryName && <ErrorText>{errors.categoryName.message}</ErrorText>}
          </FormGroup>

          <Footer>
            <ButtonGroup>
              <Button onClick={() => {navigate("/")}}>Cancel</Button>
              <Button variant="primary" type='submit'>Create Task</Button>
            </ButtonGroup>
          </Footer>
        </form>
      </ContentWrapper>
    </Container>
  );
}


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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  max-width: 960px;
  flex: 1;
  padding: 1.25rem 0;
`;

const Title = styled.h2`
  color: #0d141c;
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
  padding: 1.25rem 1rem 0.75rem;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  max-width: 480px;
  align-items: flex-end;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  flex: 1;
`;

const LabelText = styled.p`
  color: #0d141c;
  font-size: 1rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  flex: 1;
  resize: none;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #cedbe8;
  padding: 0.9375rem;
  height: 3.5rem;
  font-size: 1rem;
  color: #0d141c;
  outline: none;

  &::placeholder {
    color: #49719c;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  resize: none;
  overflow: hidden;
  min-height: 9rem;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #cedbe8;
  padding: 0.9375rem;
  font-size: 1rem;
  color: #0d141c;
  outline: none;

  &::placeholder {
    color: #49719c;
  }
`;

const InputWithIcon = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: 0.75rem;
`;

const Select = styled.select`
  width: 100%;
  flex: 1;
  resize: none;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #cedbe8;
  padding: 0.9375rem;
  height: 3.5rem;
  font-size: 1rem;
  color: #0d141c;
  outline: none;

  &::placeholder {
    color: #49719c;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: stretch;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: string }>`
  min-width: 84px;
  height: 2.5rem;
  padding: 0 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 480px;
  color: ${props => (props.variant === 'primary' ? '#f8fafc' : '#0d141c')};
  background: ${props => (props.variant === 'primary' ? '#0b79ee' : '#e7edf4')};
`;

export default CreateTask;