import os
import json
import random
from openai import OpenAI
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PLACEHOLDER_CHALLENGES = [
    {
        "title": "Basic Python List Operation",
        "options": [
            "my_list.append(5)",
            "my_list.add(5)",
            "my_list.push(5)",
            "my_list.insert(5)",
        ],
        "correct_answer_id": 0,
        "explanation": "In Python, append() is the correct method to add an element to the end of a list."
    },
    {
        "title": "What is the output of print(2 ** 3)?",
        "options": [
            "6",
            "8",
            "9",
            "12",
        ],
        "correct_answer_id": 1,
        "explanation": "2 ** 3 is 2 raised to the power of 3, which equals 8."
    },
    {
        "title": "Which keyword is used to define a function in Python?",
        "options": [
            "func",
            "def",
            "function",
            "define",
        ],
        "correct_answer_id": 1,
        "explanation": "The keyword def is used to define a function in Python."
    },
    {
        "title": "Which of these data types is immutable in Python?",
        "options": [
            "List",
            "Dictionary",
            "Tuple",
            "Set",
        ],
        "correct_answer_id": 2,
        "explanation": "Tuples are immutable, meaning their contents cannot be changed after creation."
    },
]


def generate_challenge_with_ai(difficulty: str) -> Dict[str, Any]:
    system_prompt = """You are an expert coding challenge creator. 
    Your task is to generate a coding question with multiple choice answers.
    The question should be appropriate for the specified difficulty level.

    For easy questions: Focus on basic syntax, simple operations, or common programming concepts.
    For medium questions: Cover intermediate concepts like data structures, algorithms, or language features.
    For hard questions: Include advanced topics, design patterns, optimization techniques, or complex algorithms.

    Return the challenge in the following JSON structure:
    {
        "title": "The question title",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer_id": 0, // Index of the correct answer (0-3)
        "explanation": "Detailed explanation of why the correct answer is right"
    }

    Make sure the options are plausible but with only one clearly correct answer.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate a {difficulty} difficulty coding challenge."}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )

        content = response.choices[0].message.content
        challenge_data = json.loads(content)

        required_fields = ["title", "options",
                           "correct_answer_id", "explanation"]
        for field in required_fields:
            if field not in challenge_data:
                raise ValueError(f"Missing required field: {field}")

        return challenge_data

    except Exception as e:
        print(f"Error generating challenge with AI: {e}")
        return random.choice(PLACEHOLDER_CHALLENGES)


def improve_text_with_ai(text: str, rewrite_type: str) -> str:
    """
    Uses OpenAI to rewrite text based on the type.
    """
    if rewrite_type == "Email":
        system_prompt = """You are a professional email writer.
        Rewrite the user's text as a clear, concise, professional business email.
        Keep the meaning, but improve tone and structure."""
    else:
        system_prompt = """You are a professional editor.
        Rewrite the text to be clearer, more fluent, and professional.
        Do not change its meaning.
        Return only the improved text."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.4
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error improving text with AI: {e}")
        return "Could not improve text."
