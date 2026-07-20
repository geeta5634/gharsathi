#!/bin/bash
cd backend
npx prisma db push --accept-data-loss 2>/dev/null || true
node src/index.js
