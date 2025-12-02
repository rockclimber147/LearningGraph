#!/bin/bash
cd /root/LearningGraph || { echo "root/learninggraph directory not found"; exit 1; }

# Pull latest code
git pull origin main

# Frontend
cd LearningGraphFrontend || { echo "root/LearningGraphFrontend directory not found"; exit 1; }
npm install
pm2 restart learning-graph-frontend
cd ..

# Restart service
cd FilesBackend || { echo "root/FilesBackend directory not found"; exit 1; }
npm install
pm2 restart learning-graph-backend

echo "Deployment complete!"

