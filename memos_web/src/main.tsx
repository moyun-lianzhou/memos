import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router";
import store from './redux/store';
import '@/assets/styles/base.css'
import '@ant-design/v5-patch-for-react-19'; // 引入兼容包

const root = createRoot(document.getElementById('root')!)
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
