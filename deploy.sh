#!/bin/bash

# Coxy Deployment Script for Render
# This script helps you deploy all services to Render

set -e

echo "🚀 Coxy Render Deployment Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Make sure to install Node.js 18+ for local development."
    fi
    
    print_status "Requirements check completed"
}

# Check if environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ ! -f "env.production.template" ]; then
        print_error "env.production.template not found. Please run this script from the project root."
        exit 1
    fi
    
    print_warning "Please make sure you have set up all required environment variables in Render:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - DOMA_API_KEY"
    echo "  - TWITTER_API_KEY (for Twitter bot)"
    echo "  - TWITTER_API_SECRET (for Twitter bot)"
    echo "  - TWITTER_ACCESS_TOKEN (for Twitter bot)"
    echo "  - TWITTER_ACCESS_TOKEN_SECRET (for Twitter bot)"
    echo "  - TWITTER_BEARER_TOKEN (for Twitter bot)"
}

# Build Docker images locally (optional)
build_docker_images() {
    print_status "Building Docker images locally..."
    
    # Build frontend
    print_status "Building frontend Docker image..."
    cd frontend
    docker build -t coxy-frontend .
    cd ..
    
    # Build domain monitor
    print_status "Building domain monitor Docker image..."
    cd domain-monitor
    docker build -t coxy-domain-monitor .
    cd ..
    
    # Build Twitter bot
    print_status "Building Twitter bot Docker image..."
    cd domain-monitor/twitter-bot
    docker build -t coxy-twitter-bot .
    cd ../..
    
    print_status "Docker images built successfully"
}

# Test Docker containers locally
test_docker_containers() {
    print_status "Testing Docker containers locally..."
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating from template..."
        cp env.production.template .env.production
        print_warning "Please edit .env.production with your actual values before testing"
        return
    fi
    
    # Start containers
    print_status "Starting Docker containers..."
    docker-compose up -d
    
    # Wait a bit for services to start
    sleep 10
    
    # Check if services are running
    print_status "Checking service health..."
    
    # Check frontend
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
    fi
    
    # Check domain monitor logs
    print_status "Checking domain monitor logs..."
    docker-compose logs domain-monitor | tail -10
    
    # Check Twitter bot logs
    print_status "Checking Twitter bot logs..."
    docker-compose logs twitter-bot | tail -10
    
    print_status "Docker test completed"
}

# Deploy to Render
deploy_to_render() {
    print_status "Preparing for Render deployment..."
    
    # Check if git is clean
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes. Please commit them first."
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Push to git
    print_status "Pushing to Git repository..."
    git add .
    git commit -m "Deploy to Render - $(date)"
    git push origin main
    
    print_status "Code pushed to Git repository"
    print_warning "Now go to Render dashboard and deploy your services:"
    echo "  1. Frontend: Create Web Service from frontend/ directory"
    echo "  2. Domain Monitor: Create Background Worker from domain-monitor/ directory"
    echo "  3. Twitter Bot: Create Background Worker from domain-monitor/twitter-bot/ directory"
    echo ""
    echo "Use the provided render.yaml files for configuration."
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1. Check requirements"
    echo "2. Check environment variables"
    echo "3. Build Docker images locally"
    echo "4. Test Docker containers locally"
    echo "5. Deploy to Render"
    echo "6. Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_requirements
            show_menu
            ;;
        2)
            check_env_vars
            show_menu
            ;;
        3)
            build_docker_images
            show_menu
            ;;
        4)
            test_docker_containers
            show_menu
            ;;
        5)
            deploy_to_render
            ;;
        6)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Main execution
main() {
    echo "Welcome to Coxy deployment!"
    echo ""
    check_requirements
    show_menu
}

# Run main function
main "$@"
