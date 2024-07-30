# Use the official Python 3.12 image as a parent image
FROM python:3.12.0-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV PORT=8000

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
