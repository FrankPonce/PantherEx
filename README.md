# Panther Exchange 🐾

Panther Exchange is a dynamic web application designed to facilitate seamless transactions between users. Whether you're looking to buy, sell, or trade items, Panther Exchange provides a secure and user-friendly platform to meet your needs.

🔗 **Live App**: [Panther Exchange on Render](https://pantherex.onrender.com/)
**The backend is yet to be deployed**
---

## 📜 Table of Contents

- [About the Project](#about-the-project)
- [Showcase](#showcase)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 About the Project

Panther Exchange aims to connect individuals in a vibrant marketplace where they can effortlessly buy, sell, or trade a wide range of items. Leveraging modern web technologies, Panther Exchange ensures a smooth and secure experience for all users, fostering a community of trust and reliability.

## 🎬 Showcase

![Panther Exchange Showcase](./showcase.gif)
*An overview of Panther Exchange's user interface and key functionalities.*

---

## ✨ Features

- **User Authentication**: Secure sign-up and login systems to protect user data.
- **Item Listings**: Create, view, and manage item listings with detailed descriptions and images.
- **Categories Management**: Organize items into various categories for easy navigation.
- **Transaction Handling**: Facilitate smooth transactions between buyers and sellers.
- **Responsive Design**: Optimized for all devices, ensuring accessibility on desktops, tablets, and mobile phones.
- **Search and Filter**: Advanced search and filtering options to help users find exactly what they're looking for.
- **User Profiles**: Personalized profiles showcasing user activity, ratings, and listed items.
- **Real-Time Notifications**: Stay updated with real-time alerts for transactions and interactions.
- **Secure Payments**: Integrated payment gateways ensuring safe and reliable financial transactions.

---

## 💻 Tech Stack

- **Frontend**: React, Redux, Axios, Bootstrap
- **Backend**: Node.js, Express.js, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Deployment**: Render.com
- **Other Libraries**: `cors`, `dotenv`, `pg`, `sequelize`

---

## 🚀 Installation

### Prerequisites

- **Node.js** and **npm** for frontend and backend setup.
- **PostgreSQL** for the database.
- **Git** for version control.

### Clone the Repository

```bash
git clone https://github.com/your-username/panther-exchange.git
cd panther-exchange
 ```

### Backend Setup

1. Navigate to the Backend Folder:
 ```bash
cd backend
 ```
2. Install the Required Dependencies:
 ```bash
npm install
 ```
3. Configure Environment Variables:

Create a .env file in the backend directory with the following variables:
 ```bash
    PORT=5000
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=panther_exchange
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
 ```

4. Start the Backend Server:
 ```bash
npm start
 ```

###Frontend Setup

1. Navigate to the Frontend Folder:
    ```bash
   cd ../frontend
    ```

2. Install the Required Dependencies:
```bash
npm install
```

3. Configure Environment Variables:

    Create a .env file in the frontend directory with the following variable:
   ```bash

    REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React App:
   
```bash
npm start
```

---

##🕹️ Usage

- **Register an Account:** Sign up using your email and create a secure password.
- **Log In:** Access your account with your credentials.
- **Browse Items:** Explore various categories to find items of interest.
- **List an Item:** Create a new listing by providing item details and uploading images.
- **Manage Listings:** Edit or delete your listings as needed.
- **Initiate Transactions:** Engage in buying or selling items securely through the platform.
- **View Profile:** Check your transaction history, ratings, and listed items in your user profile.
- **Receive Notifications:** Stay informed with real-time updates on your transactions and interactions.

---
##🌐 Deployment

The app will soon be deployed on Render

---
##🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Repository.
2. Create Your Feature Branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit Your Changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the Branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request.


---
## 📄 License

This project is licensed under the MIT License.
