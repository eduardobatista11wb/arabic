# Aprenda Árabe

## Overview
"Aprenda Árabe" is an interactive web application designed to help users learn the Arabic alphabet effectively. The application features audio pronunciations, interactive exercises, and a virtual Arabic keyboard.

## Project Structure
```
arab
├── src
│   ├── server.js          # Entry point of the Express application
│   └── routes
│       └── index.js       # Route definitions for the application
├── public
│   ├── index.html         # Main HTML structure of the web application
│   └── style
│       ├── style.css      # CSS styles for the web application
│       └── layout.css     # Additional CSS styles for layout
├── package.json           # npm configuration file
└── README.md              # Documentation for the project
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd arab
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the Express server, run the following command:
```
node src/server.js
```
The application will be available at `http://localhost:3000`.

### Features
- Interactive learning of the Arabic alphabet
- Audio pronunciation for each letter
- Exercises to test knowledge
- Responsive design for various devices

### Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

### License
This project is licensed under the MIT License.