# Kubernetes Complete Commands Guide

## ✅ Step 1: Create a Cluster
```bash
# Check kubectl installation
kubectl version --client

# Check cluster info
kubectl cluster-info

# View nodes
kubectl get nodes
```

## ✅ Step 2: Deploy an App
```bash
# Deploy all applications
kubectl apply -f k8s-deployment.yaml

# Verify deployments
kubectl get deployments
```

## ✅ Step 3: Explore Your App
```bash
# View all pods
kubectl get pods

# View pods with more details
kubectl get pods -o wide

# Describe a specific pod
kubectl describe pod <pod-name>

# View logs of a pod
kubectl logs <pod-name>

# Execute command inside pod
kubectl exec -it <pod-name> -- /bin/sh
```

## ✅ Step 4: Expose Your App Publicly
```bash
# Create services
kubectl apply -f k8s-service.yaml

# View all services
kubectl get services

# View service details
kubectl describe service backend-service

# Access via Minikube
minikube service backend-service --url
minikube service frontend-service --url
minikube service admin-service --url
```

## ✅ Step 5: Scale Your App
```bash
# Scale backend to 3 replicas
kubectl scale deployment food-delivery-backend --replicas=3

# Scale frontend to 3 replicas
kubectl scale deployment food-delivery-frontend --replicas=3

# Scale admin to 4 replicas
kubectl scale deployment food-delivery-admin --replicas=4

# View scaled deployments
kubectl get deployments

# View all pods after scaling
kubectl get pods

# Auto-scale based on CPU
kubectl autoscale deployment food-delivery-backend --min=2 --max=5 --cpu-percent=80
```

## ✅ Step 6: Update Your App
```bash
# Update backend image (rolling update)
kubectl set image deployment/food-delivery-backend backend=food-delivery-system-backend:v2

# Check rollout status
kubectl rollout status deployment/food-delivery-backend

# View rollout history
kubectl rollout history deployment/food-delivery-backend

# Rollback to previous version
kubectl rollout undo deployment/food-delivery-backend

# Rollback to specific revision
kubectl rollout undo deployment/food-delivery-backend --to-revision=2

# Pause rollout
kubectl rollout pause deployment/food-delivery-backend

# Resume rollout
kubectl rollout resume deployment/food-delivery-backend
```

## 📊 Additional Useful Commands
```bash
# View all resources
kubectl get all

# Delete deployment
kubectl delete deployment food-delivery-backend

# Delete service
kubectl delete service backend-service

# Delete everything from file
kubectl delete -f k8s-deployment.yaml

# View cluster events
kubectl get events

# View resource usage
kubectl top nodes
kubectl top pods

# Port forward to access pod directly
kubectl port-forward pod/<pod-name> 4000:4000

# Create namespace
kubectl create namespace food-delivery

# Switch namespace
kubectl config set-context --current --namespace=food-delivery

# View all namespaces
kubectl get namespaces
```

## 🌐 Access Your Apps

**Using NodePort (Minikube):**
```bash
minikube service backend-service --url
minikube service frontend-service --url
minikube service admin-service --url
```

**Direct URLs:**
- Backend: http://localhost:30000
- Frontend: http://localhost:30001
- Admin: http://localhost:30002

## 🔍 Monitoring & Debugging
```bash
# Watch pods in real-time
kubectl get pods --watch

# Stream logs
kubectl logs -f <pod-name>

# View previous container logs
kubectl logs <pod-name> --previous

# Describe node
kubectl describe node minikube

# Check pod resource usage
kubectl top pod <pod-name>
```

## 🧹 Cleanup
```bash
# Delete all deployments
kubectl delete -f k8s-deployment.yaml

# Delete all services
kubectl delete -f k8s-service.yaml

# Delete everything in namespace
kubectl delete all --all

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete
```
