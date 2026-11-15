pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO = '542202863403.dkr.ecr.us-east-1.amazonaws.com/demo-project'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Image') {
            steps {
                script {
                    dockerImage = docker.build("${ECR_REPO}:${IMAGE_TAG}")
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} |
                    docker login --username AWS --password-stdin ${ECR_REPO}

                    docker push ${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Docker Swarm') {
            steps {
                echo "Swarm deployment will be configured next"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
