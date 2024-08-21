#!/bin/bash

# Start index.js
echo "Starting index.js..."
node index.js &

# Capture the PID of the first process
PID=$!

# Wait for a few seconds
sleep 10

# Start login-server.js
echo "Starting login-server.js..."
node login-server.js

# Optional: Wait for index.js to finish
wait $PID
