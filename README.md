# 🚀 Custom Clipboard & Productivity App  

A powerful **Electron + React** desktop application that extends the default **Windows Clipboard History** with advanced features like **note-taking, clipboard management, theme customization, and more!**  

## ✨ Features  

- 📝 **Create, update, delete, and read notes**  
- 🌗 **Light & dark mode support**  
- 📋 **Clipboard history manager** (persistent storage)  
- 🚀 **Built with modern web technologies**  

## 🛠 Tech Stack  

- **React + Electron-Vite** ⚡  
- **Zustand** for state management  
- **TanStack Query** for data fetching  
- **TanStack Router** for type-safe routing  
- **Drizzle ORM + better-sqlite3** for database management  

## 🚀 Getting Started  

### **Prerequisites**  
Ensure you have **pnpm** installed. If not, install it globally:  

```sh
npm install -g pnpm
```

### **Installation & Setup**  

Clone the repository and install dependencies:  

```sh
pnpm i
```

### **Database Setup**  

Run the following command to generate the database schema:  

```sh
pnpm db:generate
```

### **Run the Application in Development Mode**  

```sh
pnpm dev
```

### **Build for Windows**  

To create a Windows executable:  

```sh
pnpm build:win
```
