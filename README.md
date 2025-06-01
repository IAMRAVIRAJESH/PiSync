# PiSync Backend

A Node.js service for syncing devices when online.

## Features included
- Middlewares to check authenticity of incoming API requets
- APIs to handle incoming events
- Rate limiting to control API usage abuse

## Tech Stacks used

- Node.js (>=18)
- JavaScript
- Express.js
- PostgreSQL with Sequelize ORM

### Tools needed

- Node.js 18 or higher
- PostgreSQL

### Installation

1. Clone the repository - git clone https://github.com/IAMRAVIRAJESH/PiSync.git and move to main directory using the command "cd PISYNC".

2. Install dependencies - run "npm install"

3. Set up environment variables - Create and edit .env file with your database configuration at the root (current directory) location.

4. Start the server and sync database - "npm run dev". This command will run the server and synchronize the database with models, associations, relations and anything that is described in the model files.


## API Endpoints

BASE_URL = http://localhost:3000/api/piSync

- POST BASE_URL/sync-event → to receive a sync event.
- GET BASE_URL/device/:id/sync-history → to view sync logs of a device.
- GET BASE_URL/devices/repeated-failures → to list devices with more than 3 failed syncs.


# API testing

- For testing the APIs you can use the postman collection I have added to this project with filename PiSync


- Scaling to 100k Devices

## Current Architecture Overview

The PiSync backend is designed as a lightweight, efficient service for handling offline learning data synchronization from PiBook and PiBox devices. The system processes sync events, tracks device history, and identifies problematic devices.

## Optimization Strategy for 100k Devices

### 1. Database Optimizations

#### Partitioning Strategy

- We can create partitions based on our use cases

#### Index Optimization

- We can create indexes like uinque, composite for efficient query optimization

#### Connection Pooling

- We can set some limit on connection pooling with proper scaling as per our needs for connection pooling. Also we can seprate read and write databases with multiple read replicas

### 2. Application Layer Scaling

# Horizontal Scaling

- By using load balancers, stateless design and container orchestration we can scale our systems horizontally.

# Caching Strategy

- We can use caching techinques like LRU, LFU using redis for efficient querying of expensive opeartions 

#### Async Processing

- We can use message queues like kafka, AWS SQS, batch processing, and background processing for not so important tasks to decrease the load on servers.

### 3. Performance Metrics & Monitoring

- We can employ different monitoring techniques using prometheus, graffana, AWS cloudwatch, and AWS cloudtrail to keep track of health of our servers.

### 4. Infrastructure Scaling

- We can use docker with kubernetes to auto scale the servers according to the traffic.

### 5. Security & Compliance

# Rate Limiting

- We can use rate limiters to control API usage abuse and secure from any kind of Ddos attacks.

# Authentication & Authorization

- **API keys**: Device-specific authentication
- **JWT tokens**: For administrative access
- **Role-based access**: Different permissions for different user types



Apart from all the things mentioned there are still techniques to handle thes ekinds of load, like multiple AZ deployments using AWS for disaster recovery, CDN, caching, and handle traffic spikes.