import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Navbar = () => {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    toggleDropdown();
    window.location.href = '/login';
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Header>
      <LeftSection>
        <Logo>
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </Logo>
        <Title onClick={() => window.location.href = '/'}>TaskMaster</Title>
      </LeftSection>

      {isLoggedIn && (
        <RightSection>
          <ButtonGroup>
            <NewTaskButton onClick={() => window.location.href = '/create-task'}>
              <span>New Task</span>
            </NewTaskButton>
            <BellButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
              </svg>
            </BellButton>
          </ButtonGroup>

          <Container ref={dropdownRef}>
            <AvatarButton onClick={toggleDropdown}>
              <Avatar xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </Avatar>
            </AvatarButton>
            {
              isOpen && (
                <DropdownMenu>
                  <MenuItem onClick={toggleDropdown}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </DropdownMenu>
              )
            }
          </Container>
        </RightSection>
      )}
    </Header>
  );
};


const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  border-bottom: 1px solid #e7edf4;
  padding: 0.75rem 2.5rem;
`;

const Container = styled.div`
  position: relative;
  display: inline-block
`;


const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #0d141c;
`;

const Logo = styled.div`
  width: 1rem;
  height: 1rem;
`;

const Title = styled.a`
  color: #0d141c;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: -0.015em;
  cursor: pointer;
`;

const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  gap: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NewTaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  height: 2.5rem;
  padding: 0 1rem;
  background-color: #0c77f2;
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const BellButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0 0.625rem;
  background-color: #e7edf4;
  color: #0d141c;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const Avatar = styled.svg`
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
`;
const AvatarButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
`;
const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 150px;
`;

const MenuItem = styled.button`
  border: none;
  background: none;
  display: block;
  padding: 10px 15px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

export default Navbar;
