"""" Defines URL pattern for chess_game."""

from django.urls import path,include

from . import views

app_name='chess_game'
urlpatterns = [
   # Home page
    path('', views.index, name='index'),
]
