import styled from "styled-components"
import Navbar from "./components/Navbar";
import { Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import Category from "./pages/Category";
import EditTask from "./pages/EditTask";

const App = () => {
  return (
    <Wrapper>
        <Navbar/>
          <Routes>
            <Route path="/" element={localStorage.getItem("token") ? <Home /> : <Login />} />
            <Route path="/create-task" element={localStorage.getItem("token") ? <CreateTask /> : <Login />} />
            <Route path="/create-category" element={localStorage.getItem("token") ? <Category /> : <Login />} />
            <Route path="/edit-task/:id" element={localStorage.getItem("token") ? <EditTask /> : <Login />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
    </Wrapper>
  )
}
const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`;
export default App
