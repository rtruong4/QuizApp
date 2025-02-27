FROM python:3.12.0
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt 
EXPOSE 5000
ENTRYPOINT [ "python" ] 
CMD [ "main.py" ] 