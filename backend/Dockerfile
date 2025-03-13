FROM python:3.12.0
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt 

COPY . .
EXPOSE 5000

ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]