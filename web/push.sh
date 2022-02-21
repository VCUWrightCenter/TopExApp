aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 110259620030.dkr.ecr.us-east-1.amazonaws.com
docker build -t topex-app .
docker tag topex-app:latest 110259620030.dkr.ecr.us-east-1.amazonaws.com/topex-app:latest
docker push 110259620030.dkr.ecr.us-east-1.amazonaws.com/topex-app:latest
cd aws_deploy
echo "Need to run eb deploy"
