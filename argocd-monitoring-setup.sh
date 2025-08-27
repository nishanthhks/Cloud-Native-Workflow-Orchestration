#!/bin/bash
set -euo pipefail

# ==============================
# CONFIG (replace <...> values)
# ==============================
CLUSTER_NAME="<your-eks-cluster-name>"
REGION="<aws-region>"

echo "👉 Step 1: Updating kubeconfig"
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

echo "👉 Step 2: Installing ArgoCD"
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "⏳ Waiting for ArgoCD server pod..."
kubectl rollout status deployment/argocd-server -n argocd

ARGO_PASS=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "✅ ArgoCD installed. Login with:"
echo "   Username: admin"
echo "   Password: $ARGO_PASS"
echo "   Port Forward: kubectl port-forward svc/argocd-server -n argocd 8080:443"

echo "👉 Step 3: Installing Prometheus & Grafana"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --namespace default

echo "⏳ Waiting for Grafana pod..."
kubectl rollout status deployment/prometheus-grafana -n default

GRAFANA_PASS=$(kubectl get secret prometheus-grafana -n default -o jsonpath="{.data.admin-password}" | base64 --decode)
echo "✅ Prometheus & Grafana installed. Login with:"
echo "   URL: http://localhost:3000 (via port-forward)"
echo "   Username: admin"
echo "   Password: $GRAFANA_PASS"
echo "   Port Forward: kubectl port-forward svc/prometheus-grafana 3000:80 -n default"
