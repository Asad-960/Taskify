import styled from 'styled-components';
import TaskList from '../../components/TaskList';
import { useNavigate } from 'react-router-dom';
import { useCategoryQuery, useTaskQuery } from '../../api/queries';
import { useEffect, useState } from 'react';


const Home = () => {
  const navigate = useNavigate();
  const handleNewTask = () => {
    navigate('/create-task');
  }
  const taskMap: TaskMap = {};
  const [activeTask, setActiveTask] = useState<string | null>(null);
  
  const days = ['Today', 'Tomorrow', 'Upcoming', 'Past'];
  
  
  const [filter, setFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilterDropDown = () => {setIsFilterOpen(prev => !prev);};
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { data: categoryData, isLoading: isCategoryLoading } = useCategoryQuery();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const toggleCategoryDropDown = () => {setIsCategoryOpen(prev => !prev);};
  
  const { data, isLoading } = useTaskQuery(filter, categoryFilter);

  useEffect(() => {
    if (activeTask) {
      navigate(`/edit-task/${activeTask}`);
    }
  }, [activeTask, navigate]);
  if (!isLoading && data) {
    data.map((task: any) => {
      const due = new Date(task.dueDate);
      const now = new Date();
      const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
      const Title = diffDays < 0 ? "Past" : diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : "Upcoming";        
      
      if (!taskMap[Title]) {
        taskMap[Title] = [];
      }
      taskMap[Title].push(task);
    });
  }

  return (
    <Wrapper>
      <LayoutContent>
        <Header>
          <Title>My Tasks</Title>
          <Button onClick={handleNewTask}><span>New Task</span></Button>
        </Header>

        <Filters>
          <DropDownContainer>
            <FilterButton onClick={toggleFilterDropDown} >
              <FilterText>Filter</FilterText>
              <IconContainer isOpen={isFilterOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </IconContainer>
            </FilterButton>
            {
              isFilterOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={() => 
                    {
                      toggleFilterDropDown()
                      setCategoryFilter(null)
                      setFilter('dueDate')
                    }
                  }
                  >
                      By Date
                    </DropdownItem>
                  <DropdownItem onClick={() => 
                    {
                      toggleFilterDropDown()
                      setCategoryFilter(null)
                      setFilter('priority')
                    }
                  }
                  >
                    By Priority
                  </DropdownItem>
                </DropdownMenu>
              )
            }

          </DropDownContainer>
          
          <DropDownContainer>
            <FilterButton onClick={toggleCategoryDropDown} >
              <FilterText>Categorise</FilterText>
              <IconContainer isOpen={isCategoryOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </IconContainer>
            </FilterButton>
            {
              isCategoryOpen && !isCategoryLoading && (
                <DropdownMenu>
                  {
                    categoryData.map((category : CategoryData) => (
                        <DropdownItem 
                          key={category.name}
                          onClick={() => {
                            setFilter(null)
                            setCategoryFilter(category.name)
                            toggleCategoryDropDown()
                          }}
                          
                        >
                          {category.name}
                        </DropdownItem>
                    ))
                  }
                </DropdownMenu>
              )
            }

          </DropDownContainer>
          
          <FilterButton onClick={() => navigate('/create-category')}>
            <FilterText>Add Category</FilterText>
            
          </FilterButton>
          </Filters>


        <TabContainer>
          <Tabs>
            <Tab href="#" active="true"><TabText>All</TabText></Tab>
            {/* <Tab href="#"><TabText>In Progress</TabText></Tab>
            <Tab href="#"><TabText>Completed</TabText></Tab> */}
          </Tabs>
        </TabContainer>
        {
          isLoading || data == undefined ? <p>Loading tasks...</p> : taskMap && data.length > 0 ? (
            days.map((day) => (
              <TaskList
                key={day}
                title={day}
                tasks={taskMap[day] || []}
                setActiveTask={setActiveTask}
              />
            ))
            
          ) : (
            <p>No tasks available</p>
          )
        }
       
      </LayoutContent>
    </Wrapper>
  );
};

// Main Container
const Wrapper = styled.div`
  padding: 1.25rem 10rem;
  display: flex;
  flex: 1;
  justify-content: center;
`;

// Layout container
const LayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 960px;
  flex: 1;
`;

// Header area
const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
`;

// Title
const Title = styled.p`
  color: #101418;
  font-size: 32px;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: 0.01em;
  min-width: 18rem;
`;

// Button
const Button = styled.button`
  display: flex;
  min-width: 84px;
  max-width: 480px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.75rem;
  height: 2rem;
  padding: 0 1rem;
  background-color: #eaedf1;
  color: #101418;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: normal;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  flex-wrap: wrap;
  padding-right: 1rem;
`;
const DropDownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 140px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const FilterButton = styled(Button)`
  height: 2rem;
  gap: 0.5rem;
  padding-left: 1rem;
  padding-right: 0.5rem;
`;

const FilterText = styled.p`
  color: #101418;
  font-size: 0.875rem;
  font-weight: 500;
`;

const IconContainer = styled.div<{ isOpen?: boolean }>`
  color: #101418;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const TabContainer = styled.div`
  padding-bottom: 0.75rem;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #d4dbe2;
  padding: 0 1rem;
  gap: 2rem;
`;

const Tab = styled.a<TabProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 0.8125rem;
  border-bottom: 3px solid ${props => props.active ? '#dce7f3' : 'transparent'};
  color: ${props => props.active ? '#101418' : '#5c728a'};
  text-decoration: none;
`;

const TabText = styled.p`
  font-size: 0.875rem;
  font-weight: bold;
  letter-spacing: 0.015em;
`;

export default Home;
