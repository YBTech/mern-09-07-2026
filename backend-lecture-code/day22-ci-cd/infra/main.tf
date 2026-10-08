# Two small servers on AWS, one for dev and one for prod, each ready to run Docker.
# Created before the lecture (./up.sh) and deleted after it (./down.sh).
#
# There's no database, load balancer or S3 bucket: the app keeps its data in memory, and its
# Docker image serves both the API and the React files.

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
    tls = { source = "hashicorp/tls", version = "~> 4.0" }
  }
}

variable "region" {
  type    = string
  default = "us-east-1"
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "day22-ci-cd" } # makes everything easy to find in the AWS console
  }
}

# An SSH key pair. GitHub Actions uses the private half to log in and deploy.
resource "tls_private_key" "deploy" {
  algorithm = "ED25519"
}

resource "aws_key_pair" "deploy" {
  key_name   = "day22-deploy"
  public_key = tls_private_key.deploy.public_key_openssh
}

# The latest Amazon Linux 2023 image.
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Firewall: allow the website (80) and SSH (22) in, anything out.
# SSH is open to the internet because GitHub's runners don't have fixed IP addresses; only
# someone holding the private key can log in. Fine for a one-day demo, not for real servers.
resource "aws_security_group" "web" {
  name        = "day22-web"
  description = "Day 22 demo: HTTP + SSH"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# One identical server per environment. Same machine, same setup: environments differ only in
# which image version they run and the APP_ENV setting.
resource "aws_instance" "server" {
  for_each = toset(["dev", "prod"])

  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.deploy.key_name
  vpc_security_group_ids = [aws_security_group.web.id]

  # Runs once at first boot: install Docker and let the login user run it.
  user_data = <<-EOF
    #!/bin/bash
    dnf install -y docker
    systemctl enable --now docker
    usermod -aG docker ec2-user
  EOF

  tags = { Name = "day22-${each.key}" }
}

output "dev_host" {
  value = aws_instance.server["dev"].public_ip
}

output "prod_host" {
  value = aws_instance.server["prod"].public_ip
}

output "ssh_private_key" {
  value     = tls_private_key.deploy.private_key_openssh
  sensitive = true
}
