##  Docker Instructions

###  Build Docker Image (locally or on server)

```bash
docker build -t coin-change-ui .
```

### ▶ Run Docker Container

```bash
docker run -d -p 80:80 coin-change-ui
```

The application will be accessible at:

```
http://<your-public-ip>/
```
##  Technologies Used

* React 18
* Ant Design (UI library)
* Nginx (Docker production)
* Docker (multi-platform support)

---
##  Deployment Checklist

* [x] `npm run build`
* [x] `docker build -t coin-change-ui .`
* [x] `docker run -d -p 80:80 coin-change-ui`
* [x] Make sure backend IP is correct in `App.js`

---
