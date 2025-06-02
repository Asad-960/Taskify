import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
import { useLoginMutation } from '../../api/queries';
import { toast } from 'react-toastify';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


const Login = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("token"))
  {
    navigate('/');
    navigate(0);
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), mode: "onTouched" });

  const {mutate} = useLoginMutation();
  const onSubmit = (data: Login) => {
    mutate(data, {
        onSuccess: (response) => {
            console.log(response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);    
            localStorage.setItem('name', response.name); 
            navigate('/');
            navigate(0);
            toast.success('Login successful!');      
        },
        onError: (error) => {
            console.error('Login error:', error);
            toast.error('An error occurred while logging in. Please try again.');
        }
    });
  }
  return (
    <Container>
      <ContentWrapper>
        <Heading>Welcome back</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Label>
                <LabelText>Email</LabelText>
                <Input 
                    placeholder="Enter your email" 
                    {...register('email')}
                    type='email'
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
              </Label>
            </InputGroup>

            <InputGroup>
              <Label>
                <LabelText>Password</LabelText>
                <Input 
                    {...register('password')}
                    placeholder="Enter your password"
                    type='password'
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
              </Label>
            </InputGroup>

            <ButtonWrapper>
              <LoginButton type='submit'>
                <LoginText>Login</LoginText>
              </LoginButton>
            </ButtonWrapper>
        </form>
        <BottomText onClick={() => {navigate("/register")}}>Don't have an account? Sign up</BottomText>

      </ContentWrapper>
    </Container>
  );
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  max-width: 960px;
  padding: 1.25rem;
  flex: 1;
`;

const Heading = styled.h2`
  color: #0d141c;
  font-size: 28px;
  font-weight: bold;
  line-height: 1.25;
  text-align: center;
  padding: 1.25rem 1rem 0.75rem;
  letter-spacing: -0.015em;
`;

const InputGroup = styled.div`
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
  line-height: normal;
  padding-bottom: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  resize: none;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid #cedae8;
  background-color: #f8fafc; /* slate-50 */
  color: #0d141c;
  height: 3.5rem;
  padding: 15px;
  font-size: 1rem;
  font-weight: normal;
  line-height: normal;

  ::placeholder {
    color: #49709c;
  }

  &:focus {
    outline: none;
    border-color: #cedae8;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
`;

const LoginButton = styled.button`
  display: flex;
  min-width: 84px;
  max-width: 480px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.5rem;
  height: 2.5rem;
  padding: 0 1rem;
  flex: 1;
  background-color: #0c77f2;
  color: #f8fafc; /* slate-50 */
  font-size: 0.875rem;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.015em;
`;

const LoginText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BottomText = styled.a`
  color: #49709c;
  font-size: 0.875rem;
  font-weight: normal;
  line-height: normal;
  padding: 0.25rem 1rem 0.75rem;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
`;

export default Login;
