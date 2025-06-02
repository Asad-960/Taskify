import styled from "styled-components";

type Props = {
    onClick: () => void,
    children: string
}
const Button = ({onClick, children, ...props}: Props) => {
    return (
        <Wrapper onClick={onClick} {...props}>
            {children}
        </Wrapper>
    )
};
const Wrapper = styled.button`
    background: deeppink;
    border: none;
    height: 70%;
    width: 100px;
    border-radius: 4px;
    color: white;
    font-weight: 700;
    
`;
export default Button;