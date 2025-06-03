import { Button } from "antd";
import { useNavigate } from "react-router";


const App: React.FC = () => {
    const navigate = useNavigate();
    

    return (
        <div>
            <Button onClick={() => navigate(`/article/addArticle`)}>编辑记忆创作</Button>
        </div>
    )
}

export default App;
