#!/bin/bash

export $(grep -v '^#' .env | xargs)


# Start the backend server
echo "Starting backend server..."
node backend/index.js &

wait

echo "Starting login server..."
node backend/login-server.js

wait

# Start the frontend server
echo "Starting frontend server..."
cd client
npm run start

# Wait for both processes to finish
wait
