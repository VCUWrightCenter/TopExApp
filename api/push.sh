aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 110259620030.dkr.ecr.us-east-1.amazonaws.com
docker build -t topex-api .
docker tag topex-api:latest 110259620030.dkr.ecr.us-east-1.amazonaws.com/topex-api:latest
docker push 110259620030.dkr.ecr.us-east-1.amazonaws.com/topex-api:latest
echo "still need to run eb deploy"
