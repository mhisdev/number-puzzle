# Number puzzle
A simple number puzzle game using TypeScript.

## Initial setup with Docker
- Clone the repository
- Run `docker compose up -d --build` to build and bring up the 'web' Docker container.
- Run `docker exec -it web npm install` to install dependencies.

### Local development
- Run `docker exec -it web npm run dev` to start development server.
- The site should now be available here: [http://localhost:8080](http://localhost:8080).

### Build for production
- Run `docker exec -it web npm run build`
- Production ready files should now we within the `/app/dist/` directory and the site should be available here: [http://localhost:80](http://localhost:80).