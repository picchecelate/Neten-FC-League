import streamlit as st
from google import genai
from google.genai import types

# 1. Configurazione della pagina
st.set_page_config(page_title="La mia App AI Studio", page_icon="🤖")
st.title("🤖 La mia Applicazione Gemini")

# 2. Legge la API Key in automatico dai Secrets (nascosti agli utenti)
if "GEMINI_API_KEY" not in st.secrets:
    st.error("Chiave API non configurata nei Secrets di Streamlit!")
    st.stop()

client = genai.Client(api_key=st.secrets["GEMINI_API_KEY"])

# 3. INCOLLA QUI LE SYSTEM INSTRUCTIONS DI GOOGLE AI STUDIO
SYSTEM_INSTRUCTION = """
Incolla qui il testo delle tue System Instructions presi da AI Studio.
"""

# 4. Interfaccia utente
user_input = st.text_area("Inserisci il tuo testo:", height=150)

if st.button("Elabora", type="primary"):
    if not user_input.strip():
        st.warning("Per favore inserisci un testo.")
    else:
        with st.spinner("Elaborazione in corso..."):
            try:
                config = types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.7,
                )

                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=user_input,
                    config=config
                )

                st.subheader("Risultato:")
                st.write(response.text)

            except Exception as e:
                st.error(f"Si è verificato un errore: {e}")
