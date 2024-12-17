# Itinero

![](../images/itinero-banner.png)

## Installation

Follow these steps to get a local copy of **Itinero** up and running:

### Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup and Database Setup](#backend-setup-and-database-setup)
- [Frontend Setup](#frontend-setup)
- [Troubleshooting](#troubleshooting)

### Prerequisites

Ensure that you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** (package manager)

### Backend Setup and Database Setup

1. Clone the repository:

    ```
    git clone https://github.com/rieljasperapos/Itinero.git
    ```

2. Navigate to the *backend* directory:

    ```
    cd server
    ```

3. Install the dependencies:

    ```
    npm install
    ```

4. Set up environment variables by copying the `.env.example` file to `.env`:

    ```
    cp .env.example .env
    ```
   Then, open the `.env` file and update the following variables as needed.

5. **Set up the database**:
   - For guidance on setting up PostgreSQL using pgAdmin, refer to the [pgAdmin documentation](https://www.pgadmin.org/docs/).
   - For DBeaver, you can check the [DBeaver documentation](https://dbeaver.com/docs/).

6. Run Prisma migrations to set up the database schema:

    ```
    npx prisma migrate dev
    ```

7. Generate the Prisma Client to ensure it reflects your database schema:

    ```
    npx prisma generate
    ```

8. Start the server:

    ```
    npm run dev
    ```

### Frontend Setup

1. **Navigate to the `client` directory:**

    ```
    cd client
    ```

2. **Install the dependencies:**

    ```
    npm install
    ```

3. **Set up environment variables by copying the `.env.example` file to `.env.local`:**

    ```
    cp .env.example .env.local
    ```
   Then, open the `.env.local` file and update the following variables as needed:

    - **AUTH_SECRET**: Your secret key for authentication.
    
    - **NEXT_PUBLIC_API_BASE_URL**: This is your **server URL** that will be used as the base for all API requests.
    
    - **NEXT_PUBLIC_GEOCODER_KEY**: Your Geocoder API key.

4. **To obtain your Geocoder API key:**
   - Visit [opencagedata.com](https://opencagedata.com) and create an account.
   - After registering, navigate to the dashboard to generate your API key.
   - Copy the generated API key and paste it into the `NEXT_PUBLIC_GEOCODER_KEY` field in your `.env.local` file.

5. **Start the development server:**

    ```
    npm run dev
    ```

### Troubleshooting

- If you encounter issues with database connections, ensure that PostgreSQL is running and that your connection string is correct.
- For any errors related to Prisma migrations, check your schema for any inconsistencies.



