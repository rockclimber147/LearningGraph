#!/bin/bash
cd /root/learninggraph
git pull origin main

# Install dependencies
/root/.bun/bin/bun install

# Restart service
sudo systemctl restart learninggraph

echo "Deployment complete!"