# Readify

**Readify** is a fully functional, responsive, and user-friendly e-library web application.  
It is built with **React & TypeScript** on the frontend and **ASP.NET Core** on the backend, connected through REST APIs.


## Project Features

### Core Features

#### Admin

- Manage books: add, update, delete, and view.  
- Manage authors: add, update, delete, and view.  
- Manage genres: add, delete, and view.  
- View registered users and their borrowing history.  

#### User & Admin

- User authentication: **login, logout, and register**.  
- Browse and view books with detailed info.  
- **Search & filter** books.  
- Borrow and return books.  
- View and update personal profile.  
- Track currently borrowed books.  
- View borrowing history.  



### Extra Features

- Borrowing rate limits.  
- Borrowing due date tracking.  
- Notifications for:  
  - Upcoming due dates.  
  - Overdue books.  
  - Newly added books.  



### Future Features

- AI-powered book recommendations (based on borrowing history).  
- Book reservation system.  
- Real-time notification updates.  


## Development Approach

The development of this project was carried out in **7 key phases**:

1. **Defining Project Features** – identified core and extra functionalities.  
2. **Database Design** – structured entities, relationships, and constraints.  
3. **Project Setup**  
   - **Frontend:** React, TypeScript, TailwindCSS, Axios  
   - **Backend:** ASP.NET Core, Dapper, MySQL ( For Database)
4. **Authentication & State Management** – implemented token-based authentication using **JWTs** and configured global state with **Redux**.  
5. **Feature Development** – built admin functionalities first, followed by user features.  
6. **Testing** – validated APIs and UI with **Postman**, **Swagger**, and **browser developer tools**.  
7. **Documentation** – prepared detailed project documentation.

I’ve shared a detailed breakdown of these phases in a series of LinkedIn posts.  
You can start reading from **[Phase 1 here](https://www.linkedin.com/posts/hadyabdallahsafa_fullstackdevelopment-webdevelopment-reactjs-activity-7371797383292284928-HTZk?utm_source=share&utm_medium=member_desktop&rcm=ACoAADy9VLYB3eC6Id_JgPlGzjgt4k6V8fuMstY)**.  


## Frontend Architecture & Design

- **Responsive Design** – the application is fully responsive and works seamlessly on all screen sizes.  
- **User-Friendly UI** – designed with clarity and an intuitive information architecture.  
- **Component-Based Structure** – React components are modular, reusable, and easy to maintain.  
- **TypeScript** – used throughout the frontend for type safety, scalability, and improved developer experience.  
- **Global State Management** – implemented using **Redux**.  
- **API Calls**  
  - Component-specific API calls are handled within their respective components.  
  - Shared or cross-component API calls are centralized in Redux slices.  

## Note

The backend part of this project is in a separate repository. Make sure to [check it out here](https://github.com/HadySafa/Readify-Backend) for the complete application.

## Screenshots

![](./src/assets/1.png)
![](./src/assets/2.png)
![](./src/assets/3.png)
![](./src/assets/4.png)
![](./src/assets/5.png)
![](./src/assets/6.png)




