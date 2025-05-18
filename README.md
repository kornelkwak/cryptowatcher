# 🪙 CryptoW
atcher (In Progress)

CryptoWatcher is a full-stack web application for monitoring cryptocurrency data. This project is currently under development and is not yet production-ready.

## 🚀 Technologies Used

### Backend
- **NestJS** – Scalable Node.js framework for building efficient server-side applications
- **PostgreSQL** – Relational database used for storing cryptocurrency data
- **TypeORM** – ORM for TypeScript and JavaScript
- **Docker** – Containerization for consistent development and deployment

### Frontend
- **React** – JavaScript library for building user interfaces
- **Webpack** – Module bundler for modern JavaScript applications
- **TypeScript** – Strongly typed programming language for better code quality

### Dev Tools
- **Docker Compose** – Tool for running multi-container Docker applications
- **Node.js** – Runtime for backend and frontend builds
- **npm** – Package manager for dependencies and scripts

## 📁 Project Structure

cryptowatcher/
├── backend/ # NestJS backend service
├── frontend/ # React + Webpack frontend
├── docker-compose.yml
└── README.md


## 🧰 Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🛠️ Setup & Run Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cryptowatcher.git
   cd cryptowatcher

2. Start the full stack with Docker Compose:

   ```bash
    docker-compose up --build

3. The services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

4. To stop the application:

   ```bash
    docker-compose down

 If you make changes to the frontend code and don’t see updates, try restarting the frontend container or re-running docker-compose up --build.

 📌 Current Status
🚧 This project is actively being developed
Expect incomplete features, missing UI, and unpolished functionality.