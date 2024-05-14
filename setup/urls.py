from django.contrib import admin
from django.urls import path
from suplency.views import Home, estudo, login, singin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home, name='home'),
    path('estudo', estudo, name='estudo'),
    path('login/', login, name='login'),
    path('singin/', singin, name='singin'),
]
