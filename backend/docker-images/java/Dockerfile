FROM openjdk:17-slim

# Install core utilities (including `time`)
RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*

WORKDIR /app