# AI-Enabled Support System

A sophisticated support system that uses AI to classify and route user queries between automated AI responses and human support agents. The system combines a Streamlit-based AI screening interface with a Django-powered human chat platform.

## Features

- **AI Query Screening**: Initial interaction through an AI interface that classifies user queries
- **Smart Task Classification**: Automated decision-making to route tasks to AI or human agents
- **Real-time Chat**: WebSocket-powered real-time chat functionality for human support
- **Authentication System**: Secure login/logout functionality for support agents
- **Dual Interface**: 
  - Streamlit frontend for AI interaction
  - Django-based chat interface for human support

## Technology Stack

- **Frontend**:
  - Streamlit for AI interface
  - HTML/CSS for chat interface
  - WebSocket for real-time communication

- **Backend**:
  - Django 5.1.4
  - Channels for WebSocket support
  - SQLite3 for database
  - Custom AI classification system

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install required packages:
```bash
pip install django channels streamlit daphne
```

3. Set up the Django application:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

4. Start the Django server:
```bash
python manage.py runserver
```

5. In a separate terminal, run the Streamlit app:
```bash
streamlit run ai_screening.py
```

## Project Structure

```
ChatApp/
├── ChatApp/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── ChitChat/
│   ├── classifier.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
│       └── chat/
│           ├── chatPage.html
│           └── loginPage.html
├── ai_screening.py
└── manage.py
```

## How It Works

1. Users first interact with the AI screening interface
2. The system analyzes queries using the TaskClassifier
3. Based on classification:
   - Simple queries are handled by AI
   - Complex queries are redirected to human support
4. Human support agents can log in to handle redirected queries
5. Real-time chat enables smooth communication between users and agents

## Classification System

The TaskClassifier uses a weighted pattern matching system to determine if a query needs human attention. Factors considered include:
- Message complexity
- Emotional content
- Technical requirements
- Urgency
- Query type

## Authentication

- Support agents can log in through `/auth/login/`
- Session management handled by Django
- Secure logout through `/auth/logout/`

## Future Enhancements

- Integration with advanced AI models
- Enhanced classification algorithms
- Mobile application support
- Analytics dashboard
- Multi-language support

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django framework
- Streamlit community

## Contact

VIIT 

