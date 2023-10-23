#!/bin/bash

echo "Starting local deployment of loan app"

docker build -t loan-app .

docker-compose up -d
