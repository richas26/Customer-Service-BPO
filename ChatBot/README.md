# Real Time Chat

This folder contain the rudimentary template for the chatbot service with support employee chatting enabled in real time.

Our plans with this are to expand this with the following features:

1. Integrate the RAG Agent so that the customer/client can query here.

2. Bring the AI Screening into the backend, so that based on the query, the AI can discern whether it can continue or does it need to bring a human customer support employee into the chat.

3. Bring in the feature, where if the customer/client are chatting with the support employee, either one of them can access the RAG agent with `@RAG Bot`, and the query will be sent to the RAG agent. It is something similiar to what WhatsApp offers with `@Meta AI` in personal or group chats.

Any further ideas will also be implemented in the future.

### Running the chat system

1. Install the following libraries
```
pip install Django daphne channels channels-redis
```

2. Run the following commands while being in the `manage.py` directory
```
python manage.py makemigrations
python manage.py migrate
```

3. Run the server
```
python manage.py runserver
```

4. Open the given link in two different browser (same browser idea is shot down by Cookies). The login credentials are present in the `ChatApp/settings.py` file.