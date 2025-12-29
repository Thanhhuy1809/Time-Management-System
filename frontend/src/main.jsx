//công tắc bật ứng dụng 
// Gắn React vào HTML
// Gọi App.jsx
// KHÔNG viết giao diện ở đây
// + Kiến thức :
//  React là thư viện của JavaScript dùng để xây dựng giao diện Ui cho website. ( giúp tạo giao diện web động , thay đổi theo dữ liệu mà không cần tải lại trang)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)