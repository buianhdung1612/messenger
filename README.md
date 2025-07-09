# MESSENGER CLONE 💬

Một ứng dụng nhắn tin thời gian thực được phát triển để clone lại giao diện và tính năng của Facebook Messenger, sử dụng Socket.IO để đảm bảo trải nghiệm chat mượt mà và tức thì.

## 🎯 Mục Tiêu Dự Án

Dự án được phát triển với mục đích học tập và thực hành xây dựng ứng dụng real-time bằng Socket.IO, kết hợp với việc tái hiện lại giao diện và trải nghiệm người dùng của Facebook Messenger.

## ⚙️ Công Nghệ Sử Dụng

- **Frontend**: PUG, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB (Mongoose)
- **Deployment**: Render

## 🔥 DEMO LIVE
🌐 [XEM DEMO TRỰC TIẾP TẠI ĐÂY](https://messenger-d5b3.onrender.com/)

📱 Tài khoản demo:
- **Email:** buianh09dung@gmail.com
- **Password:** 123456

## 🖼️ Giao Diện Ứng Dụng

| Trang chủ | Đăng nhập | Đăng ký |
|----------|-----------|---------|
| ![Home](https://github.com/user-attachments/assets/0ffc55d8-7a24-4ea9-8740-8e47dc8aab0a) | ![Login](https://github.com/user-attachments/assets/54737583-c7b1-428b-a050-c19ccd67d3de) | ![Register](https://github.com/user-attachments/assets/a9c4d6f5-9e39-43cc-98f2-ea91e2e5cb77) |

## ✨ Tính Năng

- Đăng ký / Đăng nhập
- Xác thực người dùng
- Kết bạn, hủy kết bạn theo thời gian thực (Socket.IO)
- Gửi và nhận tin nhắn theo thời gian thực (Socket.IO)
- Hiển thị người đang online
- Tìm kiếm người dùng
- Gửi reaction, emoji
- Quên mật khẩu
- ...

## 💬 Tính Năng Chat Cơ Bản

Tính năng chat là trung tâm của ứng dụng, được thiết kế mượt mà và trực quan như trải nghiệm thật với Facebook Messenger:

- ✏️ **Trạng thái "Đang nhập..."**: Hiển thị theo thời gian thực khi người dùng đang gõ tin nhắn.

    <p align="center">
      <img src="https://github.com/user-attachments/assets/e11090ca-d820-447b-a5bb-a98ceb862a27" width="500" style="margin-top: 10px; border-radius: 8px;">
    </p>

- 😀 **Chèn icon, emoji**: Dễ dàng thêm cảm xúc vào đoạn chat thông qua bộ emoji tích hợp.

    <p align="center">
      <img src="https://github.com/user-attachments/assets/7d2b751f-bc12-45ab-a29c-6edc11ad3c35" width="500" style="margin-top: 10px; border-radius: 8px;">
    </p>
  
- 🖼️ **Gửi nhiều ảnh cùng lúc**: Hỗ trợ kéo/thả hoặc chọn nhiều ảnh để gửi trong một lần.

    <p align="center">
      <img src="https://github.com/user-attachments/assets/b5008542-4b4e-4af6-9a93-5815e64821e1" width="500" style="margin-top: 10px; border-radius: 8px;">
    </p>
  
- 🔍 **Xem ảnh toàn màn hình**: Nhấn vào ảnh trong khung chat để mở trình xem ảnh với giao diện full-screen.

    <p align="center">
      <img src="https://github.com/user-attachments/assets/ac048acd-4917-40d7-bf22-9d3821a0d54c" width="500" style="margin-top: 10px; border-radius: 8px;">
    </p>
  
- 🔄 **Cuộn tin nhắn tự động**: Khung chat luôn cuộn xuống tin nhắn mới nhất, đảm bảo người dùng không bỏ lỡ nội dung.

Các tính năng này đều hoạt động **thời gian thực** thông qua Socket.IO, giúp quá trình trò chuyện liền mạch, nhanh chóng và không cần tải lại trang.

## 👥 Tính Năng Kết Bạn Real-time

Chức năng kết bạn trong ứng dụng được xử lý **theo thời gian thực** bằng Socket.IO, đảm bảo mọi thay đổi đều **đồng bộ ngay lập tức giữa hai phía người dùng**.

Khi một người dùng **ấn "Kết bạn" (Add Friend)**, hệ thống sẽ cập nhật đồng thời ở nhiều khu vực liên quan, cụ thể:

---

### 📸 Giao Diện Trước và Sau Khi Ấn "Kết Bạn"

#### 🧑‍🤝‍🧑 Người gửi lời mời – Giao diện trang danh sách người dùng

| Trước khi ấn "Kết bạn" | Sau khi ấn "Kết bạn" (real-time) |
|------------------------|----------------------------------|
| ![Trước kết bạn](https://github.com/user-attachments/assets/d8f2439b-de41-4d47-8a74-7043b1724c5c) | ![Sau kết bạn](https://github.com/user-attachments/assets/f6544bcc-888d-40dd-877c-5549d7fc6b3a) |

---

#### 📤 Trang "Lời mời đã gửi" của người gửi

| Trước khi gửi lời mời | Sau khi gửi lời mời: xuất hiện người đã gửi |
|------------------------|----------------------|
| ![Trước gửi](https://github.com/user-attachments/assets/77822b4e-0a4e-41e0-8b46-dad06aac3a13) | ![Sau gửi](https://github.com/user-attachments/assets/797adb8e-8dfe-424b-8be4-303a5b118a4f)) |

---

#### 👤 Profile của người nhận

| Trước khi nhận lời mời | Sau khi nhận lời mời |
|-------------------------|------------------------|
| ![Trước profile](https://github.com/user-attachments/assets/2150b045-0126-424a-89d6-0f90486e5461) | ![Sau profile](https://github.com/user-attachments/assets/2392373a-5e5a-427b-90ba-1d35e4502955) |


> Giao diện thay đổi từ nút **"Add Friend"** sang **"Cancel Request"**, phản ánh lời mời đã được gửi real-time.

---

#### 🧑‍🤝‍🧑 Người nhận lời mời – Giao diện trang danh sách người dùng

| Trước khi nhận lời mời "Kết bạn": vẫn tồn tại Bùi Anh Dũng | Sau khi nhận lời mời "Kết bạn" (real-time): biến mất Bùi Anh Dũng |
|------------------------|----------------------------------|
| ![Trước kết bạn](https://github.com/user-attachments/assets/e3470054-e69c-4d3b-8140-b4f4c92c29cd) | ![Sau kết bạn](https://github.com/user-attachments/assets/615a9b9e-489f-46f8-a79b-c78d06845e53) |

---

#### 📤 Trang "Lời mời đã nhận" của người nhận

| Trước khi nhận lời mời: không có Bùi Anh Dũng | Sau khi nhận lời mời: xuất hiện Bùi Anh Dũng |
|------------------------|----------------------|
| ![Trước gửi](https://github.com/user-attachments/assets/85d12a5b-27b7-4ae8-b6c5-1b14b7b64dd9) | ![Sau gửi](https://github.com/user-attachments/assets/e7600163-db68-42f6-a920-0e136d6e1e78) |

---

#### 👤 Profile của người gửi

| Trước khi gửi lời mời | Sau khi gửi lời mời: chuyển thành nút xác nhận và xóa |
|-------------------------|------------------------|
| ![Trước profile](https://github.com/user-attachments/assets/c848f50e-8bd0-42d2-8a79-5743010c0d24) | ![Sau profile](https://github.com/user-attachments/assets/737920bb-bd69-428c-a575-49ad589e85ad) |

> Giao diện thay đổi từ nút **"Add Friend"** sang **"Confirm"** và **"Delete"**, phản ánh lời mời đã được nhận real-time.

---

## 🔄 Các Hành Động Sau Khi Gửi Lời Mời

Các thao tác dưới đây đều được xử lý real-time giữa hai phía người dùng nhờ Socket.IO, đảm bảo trải nghiệm đồng bộ và mượt mà.

---

### ❌ 1. Hủy lời mời đã gửi (Cancel Request)

**Thao tác:** Người gửi chủ động hủy lời mời đã gửi đi.

**Kết quả real-time:**

- Nút trên trang danh sách và profile người nhận chuyển lại thành **"Add Friend"** (phía người gửi).
- Người nhận **không còn thấy lời mời** trong trang **"Lời mời đã nhận"**.
- Người gửi **không còn thấy lời mời** trong trang **"Lời mời đã gửi"**.
- Hai người lại xuất hiện trong danh sách user khả dụng của nhau.

> 🌀 Giao diện trở về như trước khi gửi lời mời.

---

### 🗑️ 2. Xóa lời mời đã nhận (Delete Request)

**Thao tác:** Người nhận từ chối lời mời kết bạn.

**Kết quả real-time:**

- Trang **"Lời mời đã nhận"** (người nhận) và **"Lời mời đã gửi"** (người gửi) đều **biến mất lời mời** đó.
- Trên trang danh sách người dùng, cả hai **lại thấy nhau** và có thể **gửi lời mời lại**.
- Trang profile của cả hai người **trở lại nút "Add Friend"** như ban đầu.

> 🌀 Giao diện trở lại trạng thái chưa gửi lời mời.

---

### ✅ 3. Chấp nhận lời mời (Confirm Friend)

**Thao tác:** Người nhận đồng ý kết bạn.

**Kết quả real-time:**

- Cả hai người được thêm vào danh sách bạn bè (`listFriends` của nhau).
- Lời mời **biến mất khỏi "Đã gửi" và "Đã nhận"**.
- Giao diện nút trên profile đổi thành **"Nhắn tin" (Message)** hoặc tùy chọn tương tác với bạn bè.
- Danh sách người dùng sẽ **không hiển thị nhau** nữa (vì đã là bạn).

> 🥳 Hai người chính thức trở thành bạn bè và có thể chat với nhau.

---

## 👤 Trang Cá Nhân (Profile Page)

Trang cá nhân là nơi mỗi người dùng có thể **quản lý thông tin cá nhân**, bao gồm ảnh đại diện (avatar), ảnh nền (background), tên hiển thị, v.v.

---

### 🖼️ 1. Cập nhật Avatar Realtime

Người dùng có thể **cập nhật ảnh đại diện** chỉ với vài thao tác đơn giản: nhấn vào avatar, chọn ảnh mới, và hệ thống sẽ:

- Tự động cập nhật giao diện **ngay lập tức**.

### 🌅 2. Cập nhật Ảnh Nền (Background)

Tương tự như avatar, người dùng có thể thay ảnh nền dễ dàng để thể hiện cá tính. Sau khi chọn ảnh:

- Ảnh nền mới cập nhật **ngay lập tức** tại trang cá nhân

![image](https://github.com/user-attachments/assets/fe3ebdb0-2198-4d77-82ad-e5f12656e5a8)


> 🖼️ Giao diện mới mẻ giúp cá nhân hóa hồ sơ của bạn.

---

## 🏠 Tính Năng Phòng Chat (Group Chat)

Ngoài chat 1-1, ứng dụng hỗ trợ tạo **phòng chat nhóm** để nhiều người cùng trò chuyện theo thời gian thực.

### ✨ Các chức năng chính:

- ✅ **Tạo phòng chat mới**
  - Chọn tên phòng
  - Mời nhiều thành viên ngay khi tạo
- ✅ **Chat nhóm real-time (Socket.IO)**
  - Tất cả thành viên trong phòng đều nhận tin nhắn tức thì
  - Tin nhắn đồng bộ giữa tất cả thiết bị

![image](https://github.com/user-attachments/assets/f9bb58fd-4d1d-462a-83fc-10fc008a7a24)

### 🔄 Tính năng thời gian thực

- ✏️ Trạng thái "Đang nhập..." áp dụng cho cả nhóm
- 🖼️ Gửi ảnh, emoji, text như chat cá nhân

![image](https://github.com/user-attachments/assets/7b7b5b15-60c3-4cd1-b03f-7b231eec6529)


> 📌 Bạn có thể mở nhiều tab hoặc nhiều tài khoản khác nhau để test việc tạo phòng, mời thành viên và chat nhóm đồng thời.

### ⚠️ Giới hạn hiện tại

- Chưa hỗ trợ xóa thành viên hoặc đổi tên phòng sau khi tạo

> 🎯 Những tính năng này có thể được cập nhật trong tương lai.

---

## 🔍 Tính Năng Tìm Kiếm Người Dùng

Chức năng **tìm kiếm người dùng** giúp bạn dễ dàng kết nối và kết bạn với người khác trong hệ thống.

### 🧠 Tìm kiếm thông minh

- Hỗ trợ **tìm kiếm không phân biệt chữ hoa/thường, thứ tự xuất hiện**
![image](https://github.com/user-attachments/assets/64bef0d7-5da3-4721-853e-3abc608ce1ee)

---

## 🔐 Quên Mật Khẩu / Đặt Lại Mật Khẩu

Ứng dụng hỗ trợ quy trình 3 bước để đặt lại mật khẩu an toàn:

### 1️⃣ Bước 1: Nhập Gmail

- Truy cập trang “Quên mật khẩu”
- Nhập địa chỉ Gmail đã đăng ký
- Nhấn **“Gửi mã OTP”**
- Hệ thống sẽ gửi mã xác nhận qua email

📸 Giao diện nhập Gmail:

| Nhập Gmail | Thông báo gửi OTP |
|------------|--------------------|
| ![Email Input](https://github.com/user-attachments/assets/d840b297-5b36-481e-8f4c-7a08f6883992) | ![OTP Sent](https://github.com/user-attachments/assets/1cd7cea7-95a8-43b9-a22f-3ab3c300fc07) |

---

### 2️⃣ Bước 2: Xác Nhận Mã OTP

- Nhập mã OTP gồm 6 ký tự
- Hệ thống kiểm tra tính hợp lệ và hạn sử dụng

📸 Giao diện nhập OTP:

![image](https://github.com/user-attachments/assets/dcef011e-4f16-47ee-ae2d-78cfa0ce5aa8)

> ⚠️ Mã OTP có hiệu lực trong **5 phút**

---

### 3️⃣ Bước 3: Đặt Mật Khẩu Mới

- Nhập mật khẩu mới & xác nhận lại
- Nhấn **“Đổi mật khẩu”**

📸 Giao diện đổi mật khẩu:

![image](https://github.com/user-attachments/assets/f8cdd06d-82c4-4cd9-afea-d3d3a78bae4f)

> ✅ Mật khẩu đổi thành công → chuyển về trang chủ



📌 Tất cả các hành động trên đều được xử lý **real-time**, không cần reload trang.  
Bạn có thể mở hai trình duyệt khác nhau để kiểm chứng đồng bộ hóa giữa hai tài khoản.

