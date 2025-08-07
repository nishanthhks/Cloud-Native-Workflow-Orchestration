# -----------------------------------------------
# Fetch list of available availability zones (AZs)
# -----------------------------------------------
# The block queries AWS to fetch the list of availability zones in the selected region.
# These AZs are used to distribute resources for high availability.
data "aws_availability_zones" "available" {
  state = "available" # Only fetch AZs that are currently available
}

  # -----------------------------------------------
  # Create a VPC using vpc module
  # -----------------------------------------------
module "eks-vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.17.0"

  name = var.vpc_name
  cidr = var.cidr_block

  # -----------------------------------------------
  # Subnet availability zones
  # -----------------------------------------------
  # Select first two AZs from the available list to place subnets across two zones for high availability
  azs = [
    data.aws_availability_zones.available.names[0], # us-east-1a
    data.aws_availability_zones.available.names[1]  # us-east-1b
  ]

  #   cidrsubnet(
  #     iprange,          # (string) The base CIDR block
  #     newbits,          # (number) Number of additional bits to add
  #     netnum            # (number) Index of the subnet
  #   )

  # -----------------------------------------------
  # Private Subnets
  # -----------------------------------------------
  # Private subnets are used for resources that do not need direct internet access, such as worker nodes.
  # They can access the internet via a NAT Gateway.
  #    
  private_subnets = [
    cidrsubnet(var.cidr_block, 8, 110), # Private subnet 1 in AZ 1: 10.110.0.0/24
    cidrsubnet(var.cidr_block, 8, 120)  # Private subnet 2 in AZ 2: 10.120.0.0/24
  ]

  # -----------------------------------------------
  # Public Subnets
  # -----------------------------------------------
  # Public subnets are used for resources like NAT Gateways or Load Balancers that need internet access.
  public_subnets = [
    cidrsubnet(var.cidr_block, 8, 10),  # Public subnet 1 in AZ 1: 10.10.0.0/24
    cidrsubnet(var.cidr_block, 8, 20)   # Public subnet 2 in AZ 2: 10.20.0.0/24
  ]

  # -----------------------------------------------
  # Internet Gateway Configuration
  # -----------------------------------------------
  create_igw = true # Create an Internet Gateway to allow public subnets to access the internet

  enable_dns_hostnames = true # Enable DNS hostnames inside the VPC (important for EKS or EC2 name resolution)

  # -----------------------------------------------
  # NAT Gateway Configuration
  # -----------------------------------------------
  enable_nat_gateway = true       # Create NAT Gateway(s) for private subnet internet access
  single_nat_gateway = true       # Use a single NAT Gateway for cost savings (not highly available)
  one_nat_gateway_per_az = false    # Don't create one NAT per AZ (saves cost but may risk high availability)
  create_private_nat_gateway_route = true # Automatically adds route for private subnets' traffic via NAT

  tags = var.tags
}