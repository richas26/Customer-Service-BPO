import streamlit as st
import speech_recognition as sr
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
import pyaudio

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize base LLM
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="mixtral-8x7b-32768",
    temperature=0.7,
)


# Initialize specialized agents
class TaskClassificationAgent:
    def __init__(self, llm):
        self.template = """
        Analyze the following user query and classify it based on:
        1. Complexity (1-5)
        2. Urgency (1-5)
        3. Required expertise (AI/Human/Both)
        4. Emotional sensitivity needed (1-5)

        User Query: {query}
        Previous Context: {context}

        Provide classification in the following format:
        Complexity: [score]
        Urgency: [score]
        Handler: [AI/Human/Both]
        Emotional Sensitivity: [score]
        Reasoning: [brief explanation]
        """

        self.prompt = PromptTemplate(
            template=self.template,
            input_variables=["query", "context"]
        )

        self.chain = LLMChain(llm=llm, prompt=self.prompt)

    def analyze(self, query, context=""):
        return self.chain.run(query=query, context=context)


class SentimentAnalysisAgent:
    def __init__(self, llm):
        self.template = """
        Analyze the emotional tone and sentiment of the following user query:
        User Query: {query}

        Provide analysis in the following format:
        Primary Emotion: [emotion]
        Sentiment Score: [positive/negative/neutral]
        Urgency Level: [low/medium/high]
        Distress Signals: [yes/no]
        """

        self.prompt = PromptTemplate(
            template=self.template,
            input_variables=["query"]
        )

        self.chain = LLMChain(llm=llm, prompt=self.prompt)

    def analyze(self, query):
        return self.chain.run(query=query)


# Initialize session state
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'task_classifications' not in st.session_state:
    st.session_state.task_classifications = []

# Initialize agents
task_classifier = TaskClassificationAgent(llm)
sentiment_analyzer = SentimentAnalysisAgent(llm)


def listen_to_speech():
    """Speech recognition function"""
    try:
        with sr.Microphone() as source:
            st.write("Listening... Please speak now.")
            recognizer = sr.Recognizer()
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.listen(source, timeout=5)
            st.write("Processing speech...")

            try:
                return recognizer.recognize_google(audio)
            except sr.UnknownValueError:
                return "Sorry, I couldn't understand that."
            except sr.RequestError:
                return "Sorry, there was an error with the speech recognition service."
    except Exception as e:
        return f"Error: {str(e)}"


def process_query(query):
    # Get sentiment analysis
    sentiment_result = sentiment_analyzer.analyze(query)

    # Get task classification
    context = "\n".join(st.session_state.conversation_history[-4:]) if st.session_state.conversation_history else ""
    classification_result = task_classifier.analyze(query, context)

    # Store results
    st.session_state.task_classifications.append({
        'query': query,
        'sentiment': sentiment_result,
        'classification': classification_result
    })

    # Determine response handler
    if "Handler: Human" in classification_result:
        response = "I'll need to transfer this to a human agent. Let me do that for you."
    elif "Handler: AI" in classification_result:
        # Generate an AI response for automatable tasks
        response = llm.predict(
            f"""Based on the user query: {query}
            And considering the analysis:
            {sentiment_result}
            {classification_result}

            Provide a helpful response that addresses the user's needs:"""
        )
    else:
        response = "I'm sorry, I couldn't classify the task. Please try rephrasing."

    return response



def main():
    st.title("AI Screening and Task Classification System")
    st.write("I can help determine the best way to handle your query.")

    # Voice input
    if st.button("Start Voice Input"):
        user_input = listen_to_speech()
        if user_input and not user_input.startswith("Sorry") and not user_input.startswith("Error"):
            st.write(f"You said: {user_input}")
            process_and_display_response(user_input)

    # Text input
    text_input = st.text_input("Or type your message here:")
    if text_input:
        process_and_display_response(text_input)

    # Display task classifications if any exist
    if st.session_state.task_classifications:
        st.subheader("Recent Query Analysis")
        latest = st.session_state.task_classifications[-1]
        st.write("Query:", latest['query'])
        st.write("Sentiment Analysis:", latest['sentiment'])
        st.write("Task Classification:", latest['classification'])


def process_and_display_response(user_input):
    response = process_query(user_input)
    st.session_state.conversation_history.extend([user_input, response])
    st.write(f"AI: {response}")


if __name__ == "__main__":
    main()
