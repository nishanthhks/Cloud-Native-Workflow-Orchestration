#!/bin/bash
set -euo pipefail

# ==============================
# CONFIG (replace <...> values)
# ==============================
CLUSTER_NAME="<your-eks-cluster-name>"
REGION="<aws-region>"
ACCOUNT_ID="<your-aws-account-id>"
POLICY_NAME="AWSLoadBalancerIAMPolicy"
ROLE_NAME="AmazonEKSALBControllerRole"
VPC_ID="<your-vpc-id>"

echo "👉 Step 1: Updating kubeconfig"
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

kubectl get nodes || { echo "❌ Failed to connect to cluster"; exit 1; }

echo "👉 Step 2: Associate OIDC Provider"
eksctl utils associate-iam-oidc-provider \
  --cluster $CLUSTER_NAME \
  --region $REGION \
  --approve || true

echo "👉 Step 3: Create IAM Policy (if not exists)"
if ! aws iam get-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME >/dev/null 2>&1; then
  curl -o alb-iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
  aws iam create-policy --policy-name $POLICY_NAME --policy-document file://alb-iam-policy.json
else
  echo "✅ IAM Policy $POLICY_NAME already exists, skipping"
fi

echo "👉 Step 4: Create IAM Role for ALB Controller (IRSA)"
eksctl create iamserviceaccount \
  --cluster $CLUSTER_NAME \
  --namespace kube-system \
  --name alb-controller \
  --role-name $ROLE_NAME \
  --attach-policy-arn arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME \
  --approve \
  --region $REGION \
  --override-existing-serviceaccounts || true

echo "👉 Step 5: Install AWS Load Balancer Controller"
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm upgrade --install alb-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=alb-controller \
  --set region=$REGION \
  --set vpcId=$VPC_ID

kubectl rollout status deployment/alb-controller-aws-load-balancer-controller -n kube-system

echo "✅ ALB setup completed!"
