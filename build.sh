#!/bin/bash
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Setting up backend..."
cd backend
npm install
npx prisma generate
npx prisma db push --accept-data-loss
echo "Build complete!"
