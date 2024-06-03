import requests
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def display(request):
    return render(request, 'display.html')

def add(request):
    return render(request, 'demo.html')