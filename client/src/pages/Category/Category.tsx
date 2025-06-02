import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { z } from 'zod';
import { useCategoryMutation } from '../../api/queries';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string({
    required_error: 'Category color is required',
    invalid_type_error: 'Category color is required'
  })
});
const Category = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur"
  });


  const colors = [
    '#f28b82',
    '#fbbc04',
    '#fff7ad',
    '#cbff90',
    '#a7ffeb',
    '#ccf2f4',
    '#aecbfa',
    '#fdcfe8',
    '#e6c9a8',
    '#e8eaed',
  ];
  const [selected, setSelected] = useState<string | null>(null);
  const { mutate} = useCategoryMutation();
  const navigate = useNavigate();
  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log('Form submitted:', data);
    mutate(data, {
      onSuccess: (res: any) => {
        toast.success('Category created successfully');
        navigate('/');
      },
      onError: (error) => {
        console.error('Error creating category:', error);
      }
    });
  }
  return (
    <Wrapper>
      <LayoutContainer>
        <Header>
          <Title>New category</Title>
        </Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>
              <LabelText>Name</LabelText>
              <Input
                placeholder="Category name"
                {...register('name')}
                type='text'
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </Label>
          </InputGroup>
          <Controller 
            control={control} 
            name='color' 
            rules={{ required: 'Category color is required' }}
            render={({ field }) => (
            <ColorPickerWrapper>
              {colors.map((color, idx) => (
                <ColorLabel
                  key={idx}
                  color={color}
                  selected={selected}
                >
                  <HiddenRadio
                    type="radio"
                    {...register('color')}
                    className={errors.color ? 'error' : ''}
                    value={color}
                    name="category-color"
                    checked={selected === color}
                    onChange={() => {
                      setSelected(color)
                      field.onChange(color)
                    }}
                  />
                </ColorLabel>
              ))}
            </ColorPickerWrapper>
            )} 
          />
          {errors.color && <ErrorText>{errors.color.message}</ErrorText>}
          <Footer>
            <CreateButton type='submit'>
              <span>Create</span>
            </CreateButton>
          </Footer>
        </form>
      </LayoutContainer>
    </Wrapper>
  );
};


const Wrapper = styled.div`
  padding: 1.25rem 10rem;
  display: flex;
  justify-content: center;
  flex: 1;
`;

const ErrorText = styled.span`
    color: #e53e3e;
    font-size: 0.875rem;
    padding-top: 0.25rem;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  max-width: 960px;
  flex: 1;
  padding: 1.25rem 0;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
`;

const Title = styled.p`
  color: #0d141c;
  font-size: 32px;
  font-weight: bold;
  line-height: 1.25;
  min-width: 18rem;
`;

const InputGroup = styled.div`
  display: flex;
  max-width: 480px;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  padding: 0.75rem 1rem;
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
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #e7edf4;
  height: 3.5rem;
  padding: 1rem;
  font-size: 1rem;
  color: #0d141c;
  ::placeholder {
    color: #49719c;
  }
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1rem;
`;

const HiddenRadio = styled.input`
  visibility: hidden;
  position: absolute;
`;
const ColorLabel = styled.label<{ color?: string, selected?: string | null }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1px solid #cedbe8;
  background-color: ${props => props.color};
  position: relative;
  cursor: pointer;
  ${props => props.color === props.selected && `
    border-width: 3px;
    border-color: #f8fafc;
    box-shadow: 0 0 0 2px color-mix(in srgb, #0d141c 50%, transparent);
  `}
  
  &:hover , ${HiddenRadio}:checked + & {
    outline: 2px solid black;
    outline-offset: 2px;
  }
`;


const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 1rem;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  max-width: 480px;
  height: 2.5rem;
  padding: 0 1rem;
  border-radius: 9999px;
  background-color: #0b79ee;
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
`;


export default Category;
