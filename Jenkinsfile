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
                sh '''
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                '''
            }
        }

        

        stage('Push Image to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} |
                        docker login --username AWS --password-stdin ${ECR_REPO}

                        docker push ${ECR_REPO}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Test SSH to Swarm Manager') {
    steps {
        sshagent(['swarm-manager-ssh']) {
            sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@54.83.114.40 "docker node ls"
            '''
        }
    }
}
    }

    post {
        always {
            cleanWs()
        }
    }
}
