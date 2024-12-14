# Itinero

![](../images/itinero2.png)

## Installation

Follow these steps to get a local copy of **Itinero** up and running:

### Prerequisites

Ensure that you have the following installed:

- **Node.js** (version 14 or higher)
- **PostgreSQL**
- **npm** or **yarn** (package manager)

### Backend Setup

1. Clone the repository:

    ```bash
   git clone https://github.com/rieljasperapos/travel-itinerary-app.git
   ```
2. Navigate to the *backend* directory:

    ```bash
    cd server
    ```
3. Install the dependencies:

    ```bash
    npm install
    ```
4. Set up environment variables by copying the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and update the following variables

5. Run Prisma migrations to set up the database schema:

    ```bash
    npx prisma migrate dev
    ```

6. Start the server:

    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```
2. Install the dependencies:

    ```bash
    npm install
    ```
3. Set up environment variables by copying the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and update the following variables
4. Start the development server:

    ```bash
    npm run dev
    ```



