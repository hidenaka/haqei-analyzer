#!/bin/bash

# Docker development helper script

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Determine docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Parse command
COMMAND=${1:-help}

case $COMMAND in
    start)
        print_success "Starting development environment..."
        $DOCKER_COMPOSE up -d
        print_success "Development environment started!"
        print_success "Access the application at http://localhost:3000"
        print_success "Mock API available at http://localhost:3001"
        ;;
    
    stop)
        print_success "Stopping development environment..."
        $DOCKER_COMPOSE down
        print_success "Development environment stopped!"
        ;;
    
    restart)
        print_success "Restarting development environment..."
        $DOCKER_COMPOSE restart
        print_success "Development environment restarted!"
        ;;
    
    logs)
        SERVICE=${2:-}
        if [ -z "$SERVICE" ]; then
            $DOCKER_COMPOSE logs -f
        else
            $DOCKER_COMPOSE logs -f $SERVICE
        fi
        ;;
    
    build)
        print_success "Building Docker images..."
        $DOCKER_COMPOSE build --no-cache
        print_success "Docker images built successfully!"
        ;;
    
    shell)
        SERVICE=${2:-haqei-dev}
        print_success "Opening shell in $SERVICE container..."
        $DOCKER_COMPOSE exec $SERVICE sh
        ;;
    
    clean)
        print_warning "This will remove all containers, images, and volumes!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            $DOCKER_COMPOSE down -v --rmi all
            print_success "Cleanup completed!"
        else
            print_warning "Cleanup cancelled."
        fi
        ;;
    
    prod)
        print_success "Building production image..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml build
        print_success "Starting production environment..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml up -d
        print_success "Production environment started!"
        print_success "Access the application at http://localhost"
        ;;
    
    prod-stop)
        print_success "Stopping production environment..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml down
        print_success "Production environment stopped!"
        ;;
    
    help|*)
        echo "HAQEI Analyzer Docker Helper"
        echo
        echo "Usage: $0 [command] [options]"
        echo
        echo "Commands:"
        echo "  start       Start development environment"
        echo "  stop        Stop development environment"
        echo "  restart     Restart development environment"
        echo "  logs        Show logs (optionally specify service)"
        echo "  build       Build Docker images"
        echo "  shell       Open shell in container"
        echo "  clean       Remove all containers, images, and volumes"
        echo "  prod        Build and start production environment"
        echo "  prod-stop   Stop production environment"
        echo "  help        Show this help message"
        echo
        echo "Examples:"
        echo "  $0 start              # Start development environment"
        echo "  $0 logs haqei-dev     # Show logs for specific service"
        echo "  $0 shell mock-api     # Open shell in mock-api container"
        ;;
esac