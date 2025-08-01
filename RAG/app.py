import streamlit as st
import tempfile
from typing import List, Dict
import groq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os
import PyPDF2
import io

GROQ_API_KEY = "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"


class RAGChatbot:
    def __init__(self):
        """Initialize the RAG chatbot with necessary components."""
        self.groq_client = groq.Groq(api_key=GROQ_API_KEY)
        self.embeddings = HuggingFaceEmbeddings()
        self.vector_store = None

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )

    def process_document(self, file_path: str, file_name: str) -> List[str]:
        """Process and store document chunks in the vector database."""
        try:
            # Load document based on file type
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            else:
                loader = TextLoader(file_path)

            documents = loader.load()

            # Split documents into chunks
            chunks = self.text_splitter.split_documents(documents)

            # Create or update vector store
            if self.vector_store is None:
                self.vector_store = FAISS.from_documents(chunks, self.embeddings)
            else:
                self.vector_store.add_documents(chunks)

            # Save the vector store
            self.vector_store.save_local("faiss_index")

            return [f"Successfully processed {file_name} into {len(chunks)} chunks"]

        except Exception as e:
            return [f"Error processing document: {str(e)}"]

    def get_relevant_chunks(self, query: str, n_results: int = 3) -> List[Dict]:
        """Retrieve relevant document chunks for a given query."""
        if self.vector_store is None:
            # Try to load existing vector store
            if os.path.exists("faiss_index"):
                self.vector_store = FAISS.load_local("faiss_index", self.embeddings,
                                                     allow_dangerous_deserialization=True)
            else:
                return []

        results = self.vector_store.similarity_search_with_score(query, k=n_results)

        relevant_chunks = []
        for doc, score in results:
            relevant_chunks.append({
                'content': doc.page_content,
                'metadata': {'source': doc.metadata.get('source', 'Unknown')}
            })

        return relevant_chunks

    def generate_response(self, query: str, chat_history: List[Dict] = None) -> Dict:
        """Generate a response using Groq API with relevant context."""
        # Get relevant chunks
        relevant_chunks = self.get_relevant_chunks(query)

        if not relevant_chunks:
            return {
                "response": "I don't have any documents to search through. Please upload a document first.",
                "sources": []
            }

        # Prepare context
        context = "\n\n".join([f"Content: {chunk['content']}\nSource: {chunk['metadata']['source']}"
                               for chunk in relevant_chunks])

        # Prepare the prompt
        system_prompt = f"""You are a helpful AI assistant. Use the following context to answer the user's question. 
        If you don't find the answer in the context, say so. Always cite your sources.

        Context:
        {context}"""

        messages = [{"role": "system", "content": system_prompt}]

        # Add chat history if provided
        if chat_history:
            messages.extend(chat_history)

        messages.append({"role": "user", "content": query})

        # Generate response using Groq
        try:
            response = self.groq_client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )

            # Prepare response with references
            sources = [f"{chunk['metadata']['source']}" for chunk in relevant_chunks]

            return {
                "response": response.choices[0].message.content,
                "sources": sources
            }
        except Exception as e:
            return {
                "response": f"Error generating response: {str(e)}",
                "sources": []
            }


def extract_text_from_pdf(file):
    """Extract text content from PDF file."""
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n\n"
    return text


def read_text_file(file):
    """Read content from text file."""
    return file.getvalue().decode('utf-8')


def initialize_session_state():
    """Initialize session state variables."""
    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    if 'chatbot' not in st.session_state:
        st.session_state.chatbot = RAGChatbot()
    if 'document_content' not in st.session_state:
        st.session_state.document_content = None
    if 'current_file_name' not in st.session_state:
        st.session_state.current_file_name = None


def main():
    st.set_page_config(page_title="Document Chat Assistant", layout="wide")
    initialize_session_state()

    st.title("📚 Document Chat Assistant")

    # Create two columns for the layout
    col1, col2 = st.columns([2, 3])  # Adjust ratio as needed

    # Document upload and display in left column
    with col1:
        st.header("Document Upload & View")
        uploaded_file = st.file_uploader("Choose a file", type=['txt', 'pdf'])

        if uploaded_file:
            # Store file content when a new file is uploaded
            if (st.session_state.current_file_name != uploaded_file.name):
                file_content = ""
                try:
                    if uploaded_file.type == "application/pdf":
                        file_content = extract_text_from_pdf(uploaded_file)
                    else:
                        file_content = read_text_file(uploaded_file)
                    st.session_state.document_content = file_content
                    st.session_state.current_file_name = uploaded_file.name
                except Exception as e:
                    st.error(f"Error reading file: {str(e)}")

            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.type.split('/')[-1]}") as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_file_path = tmp_file.name

            if st.button("Process Document"):
                with st.spinner("Processing document..."):
                    try:
                        results = st.session_state.chatbot.process_document(
                            tmp_file_path,
                            uploaded_file.name
                        )
                        st.success("Document processed successfully!")
                        for result in results:
                            st.write(result)
                    except Exception as e:
                        st.error(f"Error processing document: {str(e)}")
                    finally:
                        os.unlink(tmp_file_path)

        # Display document content in scrollable container
        if st.session_state.document_content:
            st.subheader("Document Content")
            st.text_area("", st.session_state.document_content, height=400)

    # Chat interface in right column
    with col2:
        st.header("Chat Interface")
        chat_container = st.container()

        # Display chat history
        with chat_container:
            for message in st.session_state.chat_history:
                if message["role"] == "user":
                    st.markdown(f"**You:** {message['content']}")
                else:
                    st.markdown(f"**Assistant:** {message['content']}")
                    if 'sources' in message:
                        with st.expander("View Sources"):
                            for source in message['sources']:
                                st.markdown(f"- {source}")

        # Query input
        query = st.text_input("Ask a question about your documents:", key="query_input")

        if st.button("Send") and query:
            with st.spinner("Generating response..."):
                try:
                    response_data = st.session_state.chatbot.generate_response(
                        query,
                        [msg for msg in st.session_state.chat_history if msg["role"] in ["user", "assistant"]]
                    )

                    # Update chat history
                    st.session_state.chat_history.extend([
                        {"role": "user", "content": query},
                        {
                            "role": "assistant",
                            "content": response_data["response"]
                            # "sources": response_data["sources"]
                        }
                    ])

                    # Rerun to update the display
                    # st.rerun()

                except Exception as e:
                    st.error(f"Error generating response: {str(e)}")


if __name__ == "__main__":
    main()