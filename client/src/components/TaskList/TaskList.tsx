import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";

type Props = {
  title: string;
  tasks: TaskResponse[];
  setActiveTask?: (task: string) => void;
}

const TaskList = ({ title, tasks, setActiveTask } : Props) => {
  if (tasks.length === 0) return null;
  return (
  <>
    <SectionTitle>{title}</SectionTitle>
    {tasks.map((task : TaskResponse) => (
      <TaskCard key={task.id} onClick={() => setActiveTask && setActiveTask(task.id)} color={task.color}>
        <TaskLeft>
          <TaskIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"
                  ></path>
              </svg>
          </TaskIcon>
          <TaskInfo>
            <TaskTitle>{task.title}</TaskTitle>
            <TaskDue>{formatDistanceToNow(new Date(task.dueDate), {addSuffix: true})}</TaskDue>
          </TaskInfo>
        </TaskLeft>
        <TaskRight>
             <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
        </TaskRight>
      </TaskCard>
    ))}
  </>
  );
}


const SectionTitle = styled.h3`
  color: #101418;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: -0.015em;
  padding: 1rem 1rem 0.5rem;
`;

const TaskCard = styled.div<{color: string | null | undefined}>`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.35rem;
  
  background-color: ${props => props.color ? props.color : 'hsl(204, 45%, 98%)'};
  padding: 0.5rem 1rem;
  min-height: 72px;
  justify-content: space-between;
  cursor: pointer;
`;

const TaskLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TaskIcon = styled.div`
  color: #101418;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eaedf1;
  border-radius: 0.5rem;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TaskTitle = styled.p`
  color: #101418;
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
`;

const TaskDue = styled.p`
  color: #5c728a;
  font-size: 0.875rem;
  font-weight: 400;
`;

const TaskRight = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: #101418;
`;

export default TaskList;
