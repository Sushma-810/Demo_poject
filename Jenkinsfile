pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository
                 git 'https://github.com/Sushma-810/Demo_poject.git'
            }
        }
        stage('Build Image') {
            steps {
                // Build the Docker image
                script {
                    dockerImage = docker.build("my-react-app:${env.BUILD_ID}")
                }
            }
        }
        stage('Run Unit Tests') {
            steps {
                // Running basic React tests
                sh 'npm test'
            }
        }
        stage('Deploy Image') {
            steps {
                // Running the container locally
                script {
                    dockerImage.run('-p 8080:80')
                }
            }
        }
    }
    post {
        always {
            // Cleanup
            cleanWs()
        }
    }
}
