from django.contrib import admin
from django.urls import path, include
from suplency.views import Home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home, name='home'),
    path('accounts/', include('allauth.urls')),
]
